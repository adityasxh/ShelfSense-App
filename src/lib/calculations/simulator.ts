import type { Product, RiskAssessment } from "@/types/inventory";
import { assessProduct } from "@/lib/calculations/inventory-risk";
import { localISODate } from "@/lib/date";

export type ScenarioResult = {
  key: "keep" | "discount" | "bundle";
  label: string;
  valid: boolean;
  price: number;
  unitsSold: number;
  revenue: number;
  variableCosts: number;
  contribution: number;
  leftoverUnits: number;
  leftoverValue: number;
  marginPercent: number | null;
  warning?: string;
};
export type SimulatorOptions = { discountPercent: number; demandMultiplier: number; bundleProduct?: Product | null; bundlePrice?: number; bundleQuantity?: number };
const roundMoney = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

function singleScenario(product: Product, assessment: RiskAssessment, key: "keep" | "discount", label: string, price: number, multiplier: number): ScenarioResult {
  const unitsSold = Math.min(product.quantity, Math.max(0, Math.floor(product.dailySales * assessment.eligibleDays * multiplier)));
  const revenue = unitsSold * price;
  const variableCosts = unitsSold * (product.unitCost + product.extraUnitCost);
  const contribution = revenue - variableCosts;
  const leftoverUnits = product.quantity - unitsSold;
  return { key, label, valid: true, price: roundMoney(price), unitsSold, revenue: roundMoney(revenue), variableCosts: roundMoney(variableCosts), contribution: roundMoney(contribution), leftoverUnits, leftoverValue: roundMoney(leftoverUnits * product.unitCost), marginPercent: revenue > 0 ? roundMoney((contribution / revenue) * 100) : null,
    warning: price < product.unitCost + product.extraUnitCost ? "Selling price is below purchase cost plus additional variable cost." : undefined };
}

export function simulateStock(product: Product, options: SimulatorOptions, today = localISODate()): { expired: boolean; assessment: RiskAssessment; scenarios: ScenarioResult[]; bestKey: ScenarioResult["key"] | null; notes: string[] } {
  const assessment = assessProduct(product, today);
  const expired = assessment.risk === "Expired";
  const notes: string[] = ["Demand-response multiplier is a hypothetical scenario assumption, not a forecast.", "Contribution includes purchase cost and additional variable costs for units sold; overheads are excluded.", "Projections are estimates, not actual profit or guaranteed savings."];
  if (expired) return { expired: true, assessment, scenarios: [], bestKey: null, notes: ["This product is past expiry. Sales-oriented scenarios are disabled; do not recommend resale."] };
  const multiplier = Number.isFinite(options.demandMultiplier) ? clamp(options.demandMultiplier, 0, 5) : 1;
  const discount = Number.isFinite(options.discountPercent) ? clamp(options.discountPercent, 0, 90) : 0;
  const keep = singleScenario(product, assessment, "keep", "Keep current price", product.sellingPrice, 1);
  const discountedPrice = Math.max(0, roundMoney(product.sellingPrice * (1 - discount / 100)));
  const discounted = singleScenario(product, assessment, "discount", `Discount ${discount}%`, discountedPrice, multiplier);
  const scenarios: ScenarioResult[] = [keep, discounted];
  const second = options.bundleProduct;
  const bundlePrice = options.bundlePrice;
  const bundleQuantity = options.bundleQuantity;
  if (second && Number.isFinite(bundlePrice) && (bundlePrice as number) >= 0 && Number.isInteger(bundleQuantity) && (bundleQuantity as number) >= 0) {
    const secondAssessment = assessProduct(second, today);
    let warning: string | undefined;
    if (secondAssessment.risk === "Expired") warning = "The selected second product is expired; bundle sales are not allowed.";
    else if (second.id === product.id) warning = "Choose a different product to avoid counting the same stock twice.";
    else if ((bundleQuantity as number) > Math.min(product.quantity, second.quantity)) warning = "Bundle quantity exceeds available stock for at least one product.";
    else if (product.quantity === 0 || second.quantity === 0) warning = "Both products need available stock.";
    else if (bundleQuantity === 0) warning = "Enter a bundle quantity greater than zero.";
    if (!warning) {
      const units = Math.min(bundleQuantity as number, Math.floor(product.dailySales * assessment.eligibleDays * multiplier), Math.floor(second.dailySales * secondAssessment.eligibleDays * multiplier));
      const revenue = units * (bundlePrice as number);
      const variableCosts = units * (product.unitCost + product.extraUnitCost + second.unitCost + second.extraUnitCost);
      const contribution = revenue - variableCosts;
      const left = product.quantity - units;
      const leftSecond = second.quantity - units;
      scenarios.push({ key: "bundle", label: `Bundle with ${second.name}`, valid: true, price: roundMoney(bundlePrice as number), unitsSold: units, revenue: roundMoney(revenue), variableCosts: roundMoney(variableCosts), contribution: roundMoney(contribution), leftoverUnits: left + leftSecond, leftoverValue: roundMoney(left * product.unitCost + leftSecond * second.unitCost), marginPercent: revenue > 0 ? roundMoney(contribution / revenue * 100) : null,
        warning: (bundlePrice as number) < product.unitCost + product.extraUnitCost + second.unitCost + second.extraUnitCost ? "Bundle price is below the combined purchase and additional variable costs." : undefined });
    } else scenarios.push({ key: "bundle", label: `Bundle with ${second.name}`, valid: false, price: Math.max(0, bundlePrice as number), unitsSold: 0, revenue: 0, variableCosts: 0, contribution: 0, leftoverUnits: product.quantity + second.quantity, leftoverValue: roundMoney(product.quantity * product.unitCost + second.quantity * second.unitCost), marginPercent: null, warning });
  } else {
    scenarios.push({ key: "bundle", label: "Bundle proposal", valid: false, price: Math.max(0, Number.isFinite(bundlePrice) ? bundlePrice as number : 0), unitsSold: 0, revenue: 0, variableCosts: 0, contribution: 0, leftoverUnits: product.quantity, leftoverValue: assessment.leftoverValue, marginPercent: null, warning: "Select a second product and enter a non-negative bundle price and whole-number bundle quantity to calculate this scenario." });
  }
  const validScenarios = scenarios.filter(s => s.valid);
  const best = validScenarios.length ? validScenarios.reduce((a, b) => b.contribution > a.contribution ? b : a) : null;
  return { expired: false, assessment, scenarios, bestKey: best?.key ?? null, notes };
}
