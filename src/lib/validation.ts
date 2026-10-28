import { z } from "zod";
import type { Product } from "@/types/inventory";
import { parseLocalISO } from "@/lib/date";

const validISODate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => !!parseLocalISO(value), "Expiry date must be a valid date.");
export const productInputSchema = z.object({
  id: z.string().max(128).optional(),
  name: z.string().trim().min(1, "Product name is required.").max(100, "Product name must be 100 characters or fewer.").regex(/^[\p{L}\p{N}][\p{L}\p{N} .,'()&/+\-]*$/u, "Product name contains unsupported characters."),
  category: z.string().trim().max(60, "Category must be 60 characters or fewer."),
  quantity: z.number().int().min(0).max(1_000_000),
  unitCost: z.number().finite().min(0).max(1_000_000_000),
  sellingPrice: z.number().finite().min(0).max(1_000_000_000),
  expiryDate: validISODate,
  dailySales: z.number().finite().min(0).max(1_000_000),
  extraUnitCost: z.number().finite().min(0).max(1_000_000_000),
});

export type ProductInput = Omit<Product, "id"> & { id?: string };
export function validateProduct(input: ProductInput, products: Product[], editingId?: string): string[] {
  const result = productInputSchema.safeParse(input);
  const errors = result.success ? [] : result.error.issues.map((issue) => issue.message);
  if (input.id && products.some(p => p.id === input.id && p.id !== editingId)) errors.push("Product ID must be unique.");
  return [...new Set(errors)];
}

export function isValidStoredProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") return false;
  const p = value as Partial<Product>;
  return productInputSchema.safeParse({
    id: p.id, name: p.name, category: p.category, quantity: p.quantity, unitCost: p.unitCost,
    sellingPrice: p.sellingPrice, expiryDate: p.expiryDate, dailySales: p.dailySales, extraUnitCost: p.extraUnitCost,
  }).success;
}
