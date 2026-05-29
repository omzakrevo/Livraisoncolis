import { pgTable, serial, integer, text, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const driversTable = pgTable("drivers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  vehicleType: text("vehicle_type").notNull().default("motorcycle"),
  isAvailable: boolean("is_available").notNull().default(false),
  isVerified: boolean("is_verified").notNull().default(false),
  currentLatitude: real("current_latitude"),
  currentLongitude: real("current_longitude"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertDriverSchema = createInsertSchema(driversTable).omit({
  id: true,
  createdAt: true,
});
export type InsertDriver = z.infer<typeof insertDriverSchema>;
export type Driver = typeof driversTable.$inferSelect;
