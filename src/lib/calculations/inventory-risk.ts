import type { Product, RiskAssessment, RiskLevel } from "@/types/inventory";
import { daysBetweenLocalDates, localISODate, parseLocalISO } from "@/lib/date";

export function assessProduct(product: Product, today = localISODate()): RiskAssessment {
  const daysToExpiry = daysBetweenLocalDates(today, product.expiryDate);
  const validExpiry = !!parseLocalISO(product.expiryDate);
  const expired = validExpiry && daysToExpiry < 0;
  // Expiry day is eligible for selling, subject to applicable food-safety requirements.
  const eligibleDays = expired ? 0 : Math.max(0, daysToExpiry + 1);
  const expectedSales = expired ? 0 : Math.min(product.quantity, Math.max(0, Math.floor(product.dailySales * eligibleDays)));
  const leftoverUnits = expired ? product.quantity : Math.max(0, product.quantity - expectedSales);
  const leftoverValue = leftoverUnits * product.unitCost;
  let risk: RiskLevel;
  let explanation: string;
  const leftoverRatio = product.quantity > 0 ? leftoverUnits / product.quantity : 0;
  if (expired) {
    risk = "Expired";
    explanation = "Past its expiry date. Do not recommend resale; follow applicable handling and disposal requirements.";
  } else if (product.quantity === 0) {
    risk = "Low";
    explanation = "No stock is currently on hand.";
  } else if (daysToExpiry <= 1 && leftoverUnits > 0) {
    risk = "Urgent";
    explanation = `${leftoverUnits} unit(s) may remain with ${eligibleDays} eligible selling day(s) under the entered sales-rate assumption.`;
  } else if (daysToExpiry <= 3 && leftoverRatio >= 0.25) {
    risk = "High";
    explanation = `${Math.round(leftoverRatio * 100)}% of current stock may remain before expiry under the entered assumption.`;
  } else if (daysToExpiry <= 7 && leftoverUnits > 0) {
    risk = "High";
    explanation = `Expiry is ${daysToExpiry} day(s) away and estimated leftover stock is ${leftoverUnits} unit(s).`;
  } else if (leftoverRatio >= 0.5 && leftoverUnits > 0 && daysToExpiry <= 14) {
    risk = "Medium";
    explanation = `Estimated leftover stock is ${leftoverUnits} unit(s); review demand and pricing.`;
  } else if (leftoverUnits > 0 && daysToExpiry <= 30) {
    risk = "Medium";
    explanation = `${leftoverUnits} unit(s) may remain, so monitor sales before expiry.`;
  } else {
    risk = "Low";
    explanation = leftoverUnits === 0 ? "Entered daily sales estimate suggests stock may sell by expiry." : "No immediate expiry-driven action is indicated by these assumptions.";
  }
  return { product, risk, daysToExpiry, eligibleDays, expectedSales, leftoverUnits, stockValue: product.quantity * product.unitCost, leftoverValue, explanation };
}

export function assessInventory(products: Product[], today = localISODate()): RiskAssessment[] {
  const rank: Record<RiskLevel, number> = { Expired: 0, Urgent: 1, High: 2, Medium: 3, Low: 4 };
  return products.map(p => assessProduct(p, today)).sort((a, b) => rank[a.risk] - rank[b.risk] || a.daysToExpiry - b.daysToExpiry);
}

export function inventoryMetrics(products: Product[], today = localISODate()) {
  const assessments = assessInventory(products, today);
  const atRisk = assessments.filter(a => ["Urgent", "High", "Medium", "Expired"].includes(a.risk));
  return {
    assessments,
    productCount: products.length,
    totalStockValue: products.reduce((s, p) => s + p.quantity * p.unitCost, 0),
    atRiskValue: atRisk.reduce((s, a) => s + a.stockValue, 0),
    highOrUrgentCount: assessments.filter(a => a.risk === "High" || a.risk === "Urgent").length,
    estimatedLeftoverUnits: assessments.reduce((s, a) => s + a.leftoverUnits, 0),
    potentialLeftoverValue: assessments.reduce((s, a) => s + a.leftoverValue, 0),
  };
}
