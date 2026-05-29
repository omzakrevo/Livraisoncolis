import { Router } from "express";
import { db, driversTable, usersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  ListDriversQueryParams,
  GetDriverParams,
  UpdateMyDriverBody,
  SetDriverAvailabilityBody,
  UpdateDriverLocationBody,
  VerifyDriverParams,
  VerifyDriverBody,
} from "@workspace/api-zod";
import { requireAuth, requireRole } from "../lib/auth";

const router = Router();

async function driverWithUser(driverId: number) {
  const rows = await db
    .select()
    .from(driversTable)
    .leftJoin(usersTable, eq(driversTable.userId, usersTable.id))
    .where(eq(driversTable.id, driverId));
  if (!rows[0]) return null;
  const { drivers, users } = rows[0];
  const { passwordHash: _, ...safeUser } = users!;
  return { ...drivers, user: safeUser };
}

router.get("/drivers", requireAuth, async (req, res): Promise<void> => {
  const query = ListDriversQueryParams.safeParse(req.query);
  const rows = await db
    .select()
    .from(driversTable)
    .leftJoin(usersTable, eq(driversTable.userId, usersTable.id));

  let result = rows.map(({ drivers, users }) => {
    const { passwordHash: _, ...safeUser } = users!;
    return { ...drivers, user: safeUser };
  });

  if (query.success) {
    if (query.data.available !== undefined) {
      result = result.filter((d) => d.isAvailable === query.data.available);
    }
    if (query.data.verified !== undefined) {
      result = result.filter((d) => d.isVerified === query.data.verified);
    }
  }

  res.json(result);
});

router.get("/drivers/me", requireRole("driver"), async (req, res): Promise<void> => {
  const [driver] = await db
    .select()
    .from(driversTable)
    .where(eq(driversTable.userId, req.session.userId!));
  if (!driver) {
    res.status(404).json({ error: "Driver profile not found" });
    return;
  }
  const result = await driverWithUser(driver.id);
  res.json(result);
});

router.patch("/drivers/me", requireRole("driver"), async (req, res): Promise<void> => {
  const body = UpdateMyDriverBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [existing] = await db
    .select()
    .from(driversTable)
    .where(eq(driversTable.userId, req.session.userId!));
  if (!existing) {
    res.status(404).json({ error: "Driver not found" });
    return;
  }
  await db.update(driversTable).set(body.data).where(eq(driversTable.id, existing.id));
  const result = await driverWithUser(existing.id);
  res.json(result);
});

router.patch("/drivers/me/availability", requireRole("driver"), async (req, res): Promise<void> => {
  const body = SetDriverAvailabilityBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [existing] = await db
    .select()
    .from(driversTable)
    .where(eq(driversTable.userId, req.session.userId!));
  if (!existing) {
    res.status(404).json({ error: "Driver not found" });
    return;
  }
  await db.update(driversTable).set({ isAvailable: body.data.isAvailable }).where(eq(driversTable.id, existing.id));
  const result = await driverWithUser(existing.id);
  res.json(result);
});

router.patch("/drivers/me/location", requireRole("driver"), async (req, res): Promise<void> => {
  const body = UpdateDriverLocationBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [existing] = await db
    .select()
    .from(driversTable)
    .where(eq(driversTable.userId, req.session.userId!));
  if (!existing) {
    res.status(404).json({ error: "Driver not found" });
    return;
  }
  await db
    .update(driversTable)
    .set({ currentLatitude: body.data.latitude, currentLongitude: body.data.longitude })
    .where(eq(driversTable.id, existing.id));
  const result = await driverWithUser(existing.id);
  res.json(result);
});

router.get("/drivers/:id", requireAuth, async (req, res): Promise<void> => {
  const params = GetDriverParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const result = await driverWithUser(params.data.id);
  if (!result) {
    res.status(404).json({ error: "Driver not found" });
    return;
  }
  res.json(result);
});

router.patch("/drivers/:id/verify", requireRole("admin"), async (req, res): Promise<void> => {
  const params = VerifyDriverParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = VerifyDriverBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  await db.update(driversTable).set({ isVerified: body.data.isVerified }).where(eq(driversTable.id, params.data.id));
  const result = await driverWithUser(params.data.id);
  if (!result) {
    res.status(404).json({ error: "Driver not found" });
    return;
  }
  res.json(result);
});

export default router;
