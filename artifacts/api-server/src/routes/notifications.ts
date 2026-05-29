import { Router } from "express";
import { db, notificationsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import {
  ListNotificationsQueryParams,
  MarkNotificationReadParams,
} from "@workspace/api-zod";
import { requireAuth } from "../lib/auth";

const router = Router();

router.get("/notifications", requireAuth, async (req, res): Promise<void> => {
  const query = ListNotificationsQueryParams.safeParse(req.query);

  let notifs = await db
    .select()
    .from(notificationsTable)
    .where(eq(notificationsTable.userId, req.session!.userId!))
    .orderBy(desc(notificationsTable.createdAt));

  if (query.success && query.data.unreadOnly) {
    notifs = notifs.filter((n) => !n.isRead);
  }

  res.json(notifs);
});

router.patch("/notifications/:id/read", requireAuth, async (req, res): Promise<void> => {
  const params = MarkNotificationReadParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [notif] = await db
    .update(notificationsTable)
    .set({ isRead: true })
    .where(
      and(
        eq(notificationsTable.id, params.data.id),
        eq(notificationsTable.userId, req.session!.userId!)
      )
    )
    .returning();
  if (!notif) {
    res.status(404).json({ error: "Notification not found" });
    return;
  }
  res.json(notif);
});

router.patch("/notifications/read-all", requireAuth, async (req, res): Promise<void> => {
  await db
    .update(notificationsTable)
    .set({ isRead: true })
    .where(eq(notificationsTable.userId, req.session!.userId!));
  res.json({ ok: true });
});

export default router;
