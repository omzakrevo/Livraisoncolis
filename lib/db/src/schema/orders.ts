import { pgTable, serial, integer, text, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { driversTable } from "./drivers";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => usersTable.id),
  driverId: integer("driver_id").references(() => driversTable.id),
  orderType: text("order_type", { enum: ["delivery", "errand"] }).notNull(),
  pickupAddress: text("pickup_address"),
  pickupLatitude: real("pickup_latitude"),
  pickupLongitude: real("pickup_longitude"),
  deliveryAddress: text("delivery_address").notNull(),
  deliveryLatitude: real("delivery_latitude"),
  deliveryLongitude: real("delivery_longitude"),
  itemDescription: text("item_description"),
  recipientPhone: text("recipient_phone"),
  specialInstructions: text("special_instructions"),
  estimatedPurchaseBudget: real("estimated_purchase_budget"),
  totalPrice: real("total_price"),
  driverAmount: real("driver_amount"),
  platformCommission: real("platform_commission"),
  paymentMethod: text("payment_method", { enum: ["cash", "mobile_money"] }).notNull().default("cash"),
  paymentStatus: text("payment_status", { enum: ["pending", "paid"] }).notNull().default("pending"),
  status: text("status", {
    enum: ["pending", "assigned", "accepted", "pickup_en_route", "picked_up", "delivery_en_route", "delivered", "cancelled"],
  }).notNull().default("pending"),
  otpCode: text("otp_code"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({
  id: true,
  createdAt: true,
});
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
