import { Router } from "express";
import { db, usersTable, driversTable, ordersTable, pricingTable } from "@workspace/db";
import { eq, and, gte } from "drizzle-orm";
import { GetRevenueStatsQueryParams, UpdatePricingBody } from "@workspace/api-zod";
import { requireRole } from "../lib/auth";

const router = Router();

router.get("/admin/stats", requireRole("admin"), async (req, res): Promise<void> => {
  const allOrders = await db.select().from(ordersTable);
  const allUsers = await db.select().from(usersTable);
  const allDrivers = await db.select().from(driversTable);

  const totalRevenue = allOrders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + (o.totalPrice ?? 0), 0);
  const totalCommission = allOrders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + (o.platformCommission ?? 0), 0);

  res.json({
    totalOrders: allOrders.length,
    pendingOrders: allOrders.filter((o) => o.status === "pending").length,
    activeOrders: allOrders.filter((o) =>
      ["assigned", "accepted", "pickup_en_route", "picked_up", "delivery_en_route"].includes(o.status)
    ).length,
    deliveredOrders: allOrders.filter((o) => o.status === "delivered").length,
    cancelledOrders: allOrders.filter((o) => o.status === "cancelled").length,
    totalClients: allUsers.filter((u) => u.role === "client").length,
    totalDrivers: allUsers.filter((u) => u.role === "driver").length,
    availableDrivers: allDrivers.filter((d) => d.isAvailable).length,
    totalRevenue,
    totalCommission,
  });
});

router.get("/admin/revenue", requireRole("admin"), async (req, res): Promise<void> => {
  const query = GetRevenueStatsQueryParams.safeParse(req.query);
  const period = query.success ? (query.data.period ?? "all") : "all";

  let orders = await db.select().from(ordersTable);

  const now = new Date();
  if (period === "today") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    orders = orders.filter((o) => new Date(o.createdAt) >= start);
  } else if (period === "week") {
    const start = new Date(now);
    start.setDate(start.getDate() - 7);
    orders = orders.filter((o) => new Date(o.createdAt) >= start);
  } else if (period === "month") {
    const start = new Date(now);
    start.setDate(start.getDate() - 30);
    orders = orders.filter((o) => new Date(o.createdAt) >= start);
  }

  const delivered = orders.filter((o) => o.status === "delivered");
  const totalRevenue = delivered.reduce((s, o) => s + (o.totalPrice ?? 0), 0);
  const totalCommission = delivered.reduce((s, o) => s + (o.platformCommission ?? 0), 0);
  const totalDriverEarnings = delivered.reduce((s, o) => s + (o.driverAmount ?? 0), 0);

  res.json({
    totalRevenue,
    totalCommission,
    totalDriverEarnings,
    orderCount: delivered.length,
    period,
  });
});

router.get("/pricing", requireRole("admin"), async (req, res): Promise<void> => {
  const [pricing] = await db.select().from(pricingTable);
  if (!pricing) {
    const [created] = await db.insert(pricingTable).values({}).returning();
    res.json(created);
    return;
  }
  res.json(pricing);
});

router.patch("/pricing", requireRole("admin"), async (req, res): Promise<void> => {
  const body = UpdatePricingBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  let [pricing] = await db.select().from(pricingTable);
  if (!pricing) {
    const [created] = await db.insert(pricingTable).values({}).returning();
    pricing = created;
  }

  const [updated] = await db
    .update(pricingTable)
    .set(body.data)
    .where(eq(pricingTable.id, pricing.id))
    .returning();

  res.json(updated);
});

export default router;
