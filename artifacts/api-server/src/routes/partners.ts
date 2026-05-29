import { Router } from "express";
import { db, partnersTable, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListPartnersQueryParams,
  CreatePartnerBody,
  GetPartnerParams,
  UpdatePartnerParams,
  UpdatePartnerBody,
  ListProductsQueryParams,
  CreateProductBody,
  UpdateProductParams,
  UpdateProductBody,
} from "@workspace/api-zod";
import { requireAuth, requireRole } from "../lib/auth";

const router = Router();

router.get("/partners", requireAuth, async (req, res): Promise<void> => {
  const query = ListPartnersQueryParams.safeParse(req.query);
  let partners = await db.select().from(partnersTable);
  if (query.success) {
    if (query.data.category) partners = partners.filter((p) => p.category === query.data.category);
    if (query.data.active !== undefined) partners = partners.filter((p) => p.isActive === query.data.active);
  }
  res.json(partners);
});

router.post("/partners", requireRole("admin"), async (req, res): Promise<void> => {
  const body = CreatePartnerBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [partner] = await db.insert(partnersTable).values(body.data).returning();
  res.status(201).json(partner);
});

router.get("/partners/:id", requireAuth, async (req, res): Promise<void> => {
  const params = GetPartnerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [partner] = await db.select().from(partnersTable).where(eq(partnersTable.id, params.data.id));
  if (!partner) {
    res.status(404).json({ error: "Partner not found" });
    return;
  }
  res.json(partner);
});

router.patch("/partners/:id", requireRole("admin"), async (req, res): Promise<void> => {
  const params = UpdatePartnerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdatePartnerBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [partner] = await db
    .update(partnersTable)
    .set(body.data)
    .where(eq(partnersTable.id, params.data.id))
    .returning();
  if (!partner) {
    res.status(404).json({ error: "Partner not found" });
    return;
  }
  res.json(partner);
});

// Products
router.get("/products", requireAuth, async (req, res): Promise<void> => {
  const query = ListProductsQueryParams.safeParse(req.query);
  let products = await db.select().from(productsTable);
  if (query.success) {
    if (query.data.partnerId) products = products.filter((p) => p.partnerId === query.data.partnerId);
    if (query.data.available !== undefined) products = products.filter((p) => p.isAvailable === query.data.available);
  }
  res.json(products);
});

router.post("/products", requireRole("admin"), async (req, res): Promise<void> => {
  const body = CreateProductBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [product] = await db.insert(productsTable).values(body.data).returning();
  res.status(201).json(product);
});

router.patch("/products/:id", requireRole("admin"), async (req, res): Promise<void> => {
  const params = UpdateProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdateProductBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [product] = await db
    .update(productsTable)
    .set(body.data)
    .where(eq(productsTable.id, params.data.id))
    .returning();
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
});

export default router;
