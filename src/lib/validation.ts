import type { Product } from "@/types/inventory";
import { parseLocalISO } from "@/lib/date";

export type ProductInput = Omit<Product, "id"> & { id?: string };
export function validateProduct(input: ProductInput, products: Product[], editingId?: string): string[] {
  const errors: string[] = [];
  if (!input.name.trim()) errors.push("Product name is required.");
  if (!Number.isFinite(input.quantity) || input.quantity < 0 || !Number.isInteger(input.quantity)) errors.push("Quantity must be a whole number greater than or equal to zero.");
  for (const [label, value] of [["Unit purchase cost", input.unitCost], ["Selling price", input.sellingPrice], ["Daily sales estimate", input.dailySales], ["Additional variable cost", input.extraUnitCost]] as const) {
    if (!Number.isFinite(value) || value < 0) errors.push(`${label} must be a valid number greater than or equal to zero.`);
  }
  if (!parseLocalISO(input.expiryDate)) errors.push("Expiry date must be a valid date.");
  if (input.id && products.some(p => p.id === input.id && p.id !== editingId)) errors.push("Product ID must be unique.");
  return errors;
}

export function isValidStoredProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") return false;
  const p = value as Partial<Product>;
  return typeof p.id === "string" && typeof p.name === "string" && typeof p.category === "string" &&
    Number.isInteger(p.quantity) && (p.quantity as number) >= 0 &&
    [p.unitCost, p.sellingPrice, p.dailySales, p.extraUnitCost].every(n => typeof n === "number" && Number.isFinite(n) && n >= 0) &&
    typeof p.expiryDate === "string" && !!parseLocalISO(p.expiryDate);
}
