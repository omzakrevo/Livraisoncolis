import { pgTable, serial, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const pricingTable = pgTable("pricing", {
  id: serial("id").primaryKey(),
  baseDeliveryFee: real("base_delivery_fee").notNull().default(2000),
  commissionRate: real("commission_rate").notNull().default(0.25),
  minDeliveryFee: real("min_delivery_fee").notNull().default(1000),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertPricingSchema = createInsertSchema(pricingTable).omit({
  id: true,
});
export type InsertPricing = z.infer<typeof insertPricingSchema>;
export type Pricing = typeof pricingTable.$inferSelect;
