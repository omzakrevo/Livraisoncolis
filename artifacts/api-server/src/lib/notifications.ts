import { db, notificationsTable } from "@workspace/db";

export async function createNotification(userId: number, title: string, message: string) {
  await db.insert(notificationsTable).values({ userId, title, message });
}
