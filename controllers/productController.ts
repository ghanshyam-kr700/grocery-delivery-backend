import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

// GET /api/product/flash-deals
export const getFlashDeals = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: { stock: { gt: 0 } },
    orderBy: { originalPrice: "desc" },
  });

  const productsWithDiscount = products.map((p: any) => {
    const discount =
      p.originalPrice && p.price
        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
        : 0;

    return { ...p, discount };
  });

  res.json({ products: productsWithDiscount.slice(0, 8) });
};

// GET /api/products
export const getProducts = async (req: Request, res: Response) => {
  const { category, search, minPrice, maxPrice, sort } = req.query;

  const where: any = {};

  if (category && category !== "all") where.category = category;

  if (search) {
    where.name = {
      contains: search as string,
      mode: "insensitive",
    };
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }

  const orderBy: any = {};

  if (sort === "price-low") orderBy.price = "asc";
  else if (sort === "price-high") orderBy.price = "desc";
  else orderBy.createdAt = "desc";

  const products = await prisma.product.findMany({ where, orderBy });

  const productsWithDiscount = products.map((p: any) => {
    const discount =
      p.originalPrice && p.price
        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
        : 0;

    return { ...p, discount };
  });

  res.json({ products: productsWithDiscount });
};

// GET /api/products/:id
export const getProductById = async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id as string },
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const discount =
    product.originalPrice && product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  res.json({ product: { ...product, discount } });
};

// POST /api/products
export const createProducts = async (req: Request, res: Response) => {
  const product = await prisma.product.create({ data: req.body });
  res.status(201).json({ product });
};

// PUT /api/products/:id
export const updateProducts = async (req: Request, res: Response) => {
  const product = await prisma.product.update({
    where: { id: req.params.id as string },
    data: req.body,
  });

  res.json({ product });
};

// DELETE /api/products/:id
export const deleteProducts = async (req: Request, res: Response) => {
  await prisma.product.delete({
    where: { id: req.params.id as string },
  });

  res.json({ message: "Deleted successfully" });
};