import { db, driversTable, ordersTable, usersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { createNotification } from "./notifications";
import { logger } from "./logger";

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function assignOrderToNearestDriver(orderId: number): Promise<void> {
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));
  if (!order) return;

  const targetLat = order.orderType === "delivery"
    ? (order.pickupLatitude ?? order.deliveryLatitude)
    : order.deliveryLatitude;
  const targetLon = order.orderType === "delivery"
    ? (order.pickupLongitude ?? order.deliveryLongitude)
    : order.deliveryLongitude;

  const availableDrivers = await db
    .select()
    .from(driversTable)
    .where(and(eq(driversTable.isAvailable, true), eq(driversTable.isVerified, true)));

  if (availableDrivers.length === 0) {
    logger.info({ orderId }, "No available drivers for order");
    await createNotification(
      order.customerId,
      "Aucun livreur disponible",
      "Nous recherchons un livreur pour votre commande. Veuillez patienter."
    );
    return;
  }

  let sorted = availableDrivers;
  if (targetLat != null && targetLon != null) {
    sorted = [...availableDrivers].sort((a, b) => {
      const da = a.currentLatitude != null && a.currentLongitude != null
        ? haversineDistance(a.currentLatitude, a.currentLongitude, targetLat, targetLon)
        : Infinity;
      const db2 = b.currentLatitude != null && b.currentLongitude != null
        ? haversineDistance(b.currentLatitude, b.currentLongitude, targetLat, targetLon)
        : Infinity;
      return da - db2;
    });
  }

  const driver = sorted[0];

  await db
    .update(ordersTable)
    .set({ driverId: driver.id, status: "assigned" })
    .where(eq(ordersTable.id, orderId));

  const [driverUser] = await db.select().from(usersTable).where(eq(usersTable.id, driver.userId));

  await createNotification(
    driver.userId,
    "Nouvelle commande",
    `Commande #${orderId} vous a été assignée. Acceptez ou refusez dans les 30 secondes.`
  );
  await createNotification(
    order.customerId,
    "Livreur trouvé",
    `Un livreur a été assigné à votre commande #${orderId}.`
  );

  logger.info({ orderId, driverId: driver.id }, "Order assigned to driver");

  // Auto-reject after 30 seconds if not accepted
  setTimeout(async () => {
    const [currentOrder] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));
    if (currentOrder && currentOrder.status === "assigned") {
      // Mark driver as unavailable temporarily, find next
      logger.info({ orderId, driverId: driver.id }, "Driver did not respond, reassigning");
      await db
        .update(ordersTable)
        .set({ driverId: null, status: "pending" })
        .where(eq(ordersTable.id, orderId));
      // Try next available driver (simple: just retry)
      await assignOrderToNearestDriver(orderId);
    }
  }, 30000);
}
