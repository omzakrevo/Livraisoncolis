import { Router } from "express";
import { db, ordersTable, usersTable, driversTable, pricingTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import {
  ListOrdersQueryParams,
  CreateOrderBody,
  GetOrderParams,
  UpdateOrderParams,
  UpdateOrderBody,
  UpdateOrderStatusParams,
  UpdateOrderStatusBody,
  AcceptOrderParams,
  RejectOrderParams,
  CancelOrderParams,
  ConfirmDeliveryParams,
  ConfirmDeliveryBody,
} from "@workspace/api-zod";
import { requireAuth, requireRole } from "../lib/auth";
import { createNotification } from "../lib/notifications";
import { assignOrderToNearestDriver } from "../lib/orderAssignment";

const router = Router();

function generateOtp(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

async function enrichOrder(order: typeof ordersTable.$inferSelect) {
  const [customer] = await db.select().from(usersTable).where(eq(usersTable.id, order.customerId));
  let driver = null;
  if (order.driverId) {
    const rows = await db
      .select()
      .from(driversTable)
      .leftJoin(usersTable, eq(driversTable.userId, usersTable.id))
      .where(eq(driversTable.id, order.driverId));
    if (rows[0]) {
      const { drivers, users } = rows[0];
      const { passwordHash: _, ...safeUser } = users!;
      driver = { ...drivers, user: safeUser };
    }
  }
  const { passwordHash: _, ...safeCustomer } = customer;
  return { ...order, customer: safeCustomer, driver };
}

router.get("/orders", requireAuth, async (req, res): Promise<void> => {
  const query = ListOrdersQueryParams.safeParse(req.query);
  const { role, userId } = req.session!;

  let allOrders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));

  if (role === "client") {
    allOrders = allOrders.filter((o) => o.customerId === userId);
  } else if (role === "driver") {
    const [driverRow] = await db.select().from(driversTable).where(eq(driversTable.userId, userId!));
    if (driverRow) {
      allOrders = allOrders.filter((o) => o.driverId === driverRow.id);
    } else {
      allOrders = [];
    }
  }

  if (query.success) {
    if (query.data.status) allOrders = allOrders.filter((o) => o.status === query.data.status);
    if (query.data.customerId) allOrders = allOrders.filter((o) => o.customerId === query.data.customerId);
    if (query.data.driverId) allOrders = allOrders.filter((o) => o.driverId === query.data.driverId);
  }

  const enriched = await Promise.all(allOrders.map(enrichOrder));
  res.json({ orders: enriched, total: enriched.length });
});

router.post("/orders", requireRole("client"), async (req, res): Promise<void> => {
  const body = CreateOrderBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [pricingRow] = await db.select().from(pricingTable);
  const basePrice = pricingRow?.baseDeliveryFee ?? 2000;
  const rate = pricingRow?.commissionRate ?? 0.25;
  const totalPrice = basePrice;
  const commission = Math.round(totalPrice * rate);
  const driverAmount = totalPrice - commission;
  const otpCode = generateOtp();

  const [order] = await db
    .insert(ordersTable)
    .values({
      customerId: req.session!.userId!,
      ...body.data,
      totalPrice,
      platformCommission: commission,
      driverAmount,
      otpCode,
      status: "pending",
    })
    .returning();

  await createNotification(
    req.session!.userId!,
    "Commande créée",
    `Votre commande #${order.id} a été enregistrée. Nous recherchons un livreur.`
  );

  // Assign driver asynchronously
  assignOrderToNearestDriver(order.id).catch(() => {});

  const enriched = await enrichOrder(order);
  res.status(201).json(enriched);
});

router.get("/orders/:id", requireAuth, async (req, res): Promise<void> => {
  const params = GetOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, params.data.id));
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  const enriched = await enrichOrder(order);
  res.json(enriched);
});

router.patch("/orders/:id", requireRole("admin"), async (req, res): Promise<void> => {
  const params = UpdateOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdateOrderBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [order] = await db
    .update(ordersTable)
    .set(body.data)
    .where(eq(ordersTable.id, params.data.id))
    .returning();
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  const enriched = await enrichOrder(order);
  res.json(enriched);
});

router.patch("/orders/:id/status", requireAuth, async (req, res): Promise<void> => {
  const params = UpdateOrderStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdateOrderStatusBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [order] = await db
    .update(ordersTable)
    .set({ status: body.data.status })
    .where(eq(ordersTable.id, params.data.id))
    .returning();
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const statusMessages: Record<string, string> = {
    pickup_en_route: "Le livreur est en route vers le point de récupération.",
    picked_up: "Le colis a été récupéré. Livraison en cours.",
    delivery_en_route: "Le livreur est en route vers l'adresse de livraison.",
    delivered: "Votre commande a été livrée.",
    cancelled: "Votre commande a été annulée.",
  };

  if (statusMessages[body.data.status]) {
    await createNotification(order.customerId, "Mise à jour de commande", statusMessages[body.data.status]);
  }

  const enriched = await enrichOrder(order);
  res.json(enriched);
});

router.patch("/orders/:id/accept", requireRole("driver"), async (req, res): Promise<void> => {
  const params = AcceptOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [driverRow] = await db.select().from(driversTable).where(eq(driversTable.userId, req.session!.userId!));
  if (!driverRow) {
    res.status(404).json({ error: "Driver not found" });
    return;
  }

  const [order] = await db
    .update(ordersTable)
    .set({ status: "accepted" })
    .where(and(eq(ordersTable.id, params.data.id), eq(ordersTable.driverId, driverRow.id)))
    .returning();
  if (!order) {
    res.status(404).json({ error: "Order not found or not assigned to you" });
    return;
  }

  await createNotification(order.customerId, "Livreur en route", "Votre livreur a accepté la commande et est en route.");

  const enriched = await enrichOrder(order);
  res.json(enriched);
});

router.patch("/orders/:id/reject", requireRole("driver"), async (req, res): Promise<void> => {
  const params = RejectOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [driverRow] = await db.select().from(driversTable).where(eq(driversTable.userId, req.session!.userId!));
  if (!driverRow) {
    res.status(404).json({ error: "Driver not found" });
    return;
  }

  const [order] = await db
    .update(ordersTable)
    .set({ driverId: null, status: "pending" })
    .where(and(eq(ordersTable.id, params.data.id), eq(ordersTable.driverId, driverRow.id)))
    .returning();
  if (!order) {
    res.status(404).json({ error: "Order not found or not assigned to you" });
    return;
  }

  // Try to find next driver
  assignOrderToNearestDriver(order.id).catch(() => {});

  const enriched = await enrichOrder(order);
  res.json(enriched);
});

router.patch("/orders/:id/cancel", requireAuth, async (req, res): Promise<void> => {
  const params = CancelOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [existing] = await db.select().from(ordersTable).where(eq(ordersTable.id, params.data.id));
  if (!existing) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  if (existing.driverId) {
    const [driverRow] = await db.select().from(driversTable).where(eq(driversTable.id, existing.driverId));
    if (driverRow) {
      await createNotification(driverRow.userId, "Commande annulée", `La commande #${existing.id} a été annulée.`);
    }
  }

  const [order] = await db
    .update(ordersTable)
    .set({ status: "cancelled" })
    .where(eq(ordersTable.id, params.data.id))
    .returning();

  await createNotification(existing.customerId, "Commande annulée", `Votre commande #${existing.id} a été annulée.`);

  const enriched = await enrichOrder(order);
  res.json(enriched);
});

router.patch("/orders/:id/confirm-delivery", requireRole("driver"), async (req, res): Promise<void> => {
  const params = ConfirmDeliveryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = ConfirmDeliveryBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, params.data.id));
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  if (order.otpCode !== body.data.otpCode) {
    res.status(400).json({ error: "Code OTP invalide" });
    return;
  }

  const [updated] = await db
    .update(ordersTable)
    .set({ status: "delivered", paymentStatus: "paid" })
    .where(eq(ordersTable.id, params.data.id))
    .returning();

  await createNotification(order.customerId, "Commande livrée", `Votre commande #${order.id} a été livrée avec succès.`);

  const enriched = await enrichOrder(updated);
  res.json(enriched);
});

export default router;
