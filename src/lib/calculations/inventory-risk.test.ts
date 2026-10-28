import { describe, expect, it } from "vitest";
import { assessProduct, inventoryMetrics } from "@/lib/calculations/inventory-risk";
import { simulateStock } from "@/lib/calculations/simulator";
import { validateProduct } from "@/lib/validation";
import type { Product } from "@/types/inventory";
const base:Product={id:"p1",name:"Milk",category:"Dairy",quantity:10,unitCost:20,sellingPrice:30,expiryDate:"2026-10-30",dailySales:2,extraUnitCost:1};
const TODAY="2026-10-28";
describe("inventory risk",()=>{
 it("estimates eligible sales including expiry day",()=>{const a=assessProduct(base,TODAY);expect(a.eligibleDays).toBe(3);expect(a.expectedSales).toBe(6);expect(a.leftoverUnits).toBe(4);});
 it("flags products past expiry separately",()=>{const a=assessProduct({...base,expiryDate:"2026-10-27"},TODAY);expect(a.risk).toBe("Expired");expect(a.leftoverUnits).toBe(10);});
 it("expects enough stock to sell when daily sales exceed stock",()=>{const a=assessProduct({...base,quantity:3,dailySales:8},TODAY);expect(a.expectedSales).toBe(3);expect(a.leftoverUnits).toBe(0);});
 it("handles zero daily sales",()=>{const a=assessProduct({...base,dailySales:0},TODAY);expect(a.expectedSales).toBe(0);expect(a.leftoverUnits).toBe(10);});
 it("handles zero quantity metrics",()=>{const m=inventoryMetrics([]);expect(m.totalStockValue).toBe(0);expect(m.productCount).toBe(0);});
 it("rejects invalid calendar dates",()=>{expect(assessProduct({...base,expiryDate:"2026-02-30"},TODAY).eligibleDays).toBe(0);});
});
describe("simulator",()=>{
 it("accounts for purchase cost exactly once in contribution",()=>{const r=simulateStock(base,{discountPercent:0,demandMultiplier:2},TODAY);const keep=r.scenarios[0];expect(keep.unitsSold).toBe(6);expect(keep.revenue).toBe(180);expect(keep.variableCosts).toBe(126);expect(keep.contribution).toBe(54);});
 it("keeps discount price non-negative and warns below variable cost",()=>{const r=simulateStock({...base,sellingPrice:10},{discountPercent:90,demandMultiplier:2},TODAY);expect(r.scenarios[1].price).toBe(1);expect(r.scenarios[1].warning).toContain("below purchase cost");});
 it("prevents simulation of expired stock",()=>{const r=simulateStock({...base,expiryDate:"2026-10-27"},{discountPercent:20,demandMultiplier:2},TODAY);expect(r.expired).toBe(true);expect(r.scenarios).toHaveLength(0);});
 it("rejects invalid product values",()=>{const invalid={...base,quantity:-1};expect(validateProduct(invalid,[]).some(e=>e.includes("Quantity"))).toBe(true);});
 it("does not allow bundle scenario to count a product twice",()=>{const r=simulateStock(base,{discountPercent:10,demandMultiplier:1,bundleProduct:base,bundlePrice:50,bundleQuantity:2},TODAY);expect(r.scenarios.find(s=>s.key==="bundle")?.valid).toBe(false);});
});
