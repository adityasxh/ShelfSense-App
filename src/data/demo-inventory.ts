import type { Product } from "@/types/inventory";
import { dateOffsetISO } from "@/lib/date";

export function makeDemoInventory(): Product[] {
  return [
    { id: "demo-milk", name: "Fresh milk (500 ml)", category: "Dairy", quantity: 28, unitCost: 26, sellingPrice: 30, expiryDate: dateOffsetISO(1), dailySales: 5, extraUnitCost: 0.5 },
    { id: "demo-bread", name: "Whole wheat bread", category: "Bakery", quantity: 12, unitCost: 32, sellingPrice: 42, expiryDate: dateOffsetISO(3), dailySales: 6, extraUnitCost: 0 },
    { id: "demo-biscuits", name: "Butter biscuits", category: "Snacks", quantity: 24, unitCost: 8, sellingPrice: 12, expiryDate: dateOffsetISO(45), dailySales: 2, extraUnitCost: 0 },
    { id: "demo-yogurt", name: "Fruit yogurt cup", category: "Dairy", quantity: 18, unitCost: 21, sellingPrice: 24, expiryDate: dateOffsetISO(2), dailySales: 2, extraUnitCost: 1 },
    { id: "demo-noodles", name: "Instant noodles", category: "Packaged food", quantity: 30, unitCost: 11, sellingPrice: 16, expiryDate: dateOffsetISO(-2), dailySales: 4, extraUnitCost: 0 },
    { id: "demo-juice", name: "Orange juice (1 L)", category: "Beverages", quantity: 20, unitCost: 70, sellingPrice: 75, expiryDate: dateOffsetISO(5), dailySales: 1, extraUnitCost: 2 },
    { id: "demo-rice", name: "Premium rice (1 kg)", category: "Staples", quantity: 15, unitCost: 54, sellingPrice: 72, expiryDate: dateOffsetISO(120), dailySales: 1.5, extraUnitCost: 0 },
  ];
}
