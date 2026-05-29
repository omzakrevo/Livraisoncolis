import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const partnersTable = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category", {
    enum: ["restaurant", "pharmacy", "boutique", "supermarket", "bakery", "other"],
  }).notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  logo: text("logo"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPartnerSchema = createInsertSchema(partnersTable).omit({
  id: true,
  createdAt: true,
});
export type InsertPartner = z.infer<typeof insertPartnerSchema>;
export type Partner = typeof partnersTable.$inferSelect;
