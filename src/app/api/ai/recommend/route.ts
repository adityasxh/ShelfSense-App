import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import type { Product } from "@/types/inventory";
import { isValidStoredProduct } from "@/lib/validation";
import { assessInventory } from "@/lib/calculations/inventory-risk";
import { simulateStock } from "@/lib/calculations/simulator";
import { fallbackRecommendations } from "@/lib/ai";

export const runtime = "nodejs";
const RequestSchema = z.object({
  products: z.array(z.unknown()).max(300),
  discountPercent: z.number().finite().min(0).max(90),
  demandMultiplier: z.number().finite().min(0).max(5),
}).strict();
const ItemSchema = z.object({
  title: z.string().min(1).max(160),
  priority: z.enum(["Urgent", "High", "Medium", "Low"]),
  evidence: z.string().min(1).max(800),
  action: z.string().min(1).max(800),
  tradeoff: z.string().min(1).max(800),
  uncertainty: z.string().min(1).max(800),
  nextStep: z.string().min(1).max(800),
});
const ResponseSchema = z.object({ recommendations: z.array(ItemSchema).max(3) });

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 }); }
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request. Check products and scenario assumptions." }, { status: 400 });
  if (!parsed.data.products.every(isValidStoredProduct)) return NextResponse.json({ error: "One or more product records are invalid." }, { status: 400 });
  const products = parsed.data.products as Product[];
  const assessments = assessInventory(products);
  const scenarioMap: Record<string, ReturnType<typeof simulateStock>["scenarios"]> = {};
  for (const product of products) scenarioMap[product.id] = simulateStock(product, {
    discountPercent: parsed.data.discountPercent,
    demandMultiplier: parsed.data.demandMultiplier,
  }).scenarios;
  const fallback = fallbackRecommendations(assessments, scenarioMap);
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ mode: "fallback", recommendations: fallback });

  try {
    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
    });
    const evidence = assessments.map(a => ({
      id: a.product.id, name: a.product.name, category: a.product.category,
      quantity: a.product.quantity, unitPurchaseCost: a.product.unitCost,
      sellingPrice: a.product.sellingPrice, expiryDate: a.product.expiryDate,
      dailySalesEstimate: a.product.dailySales, daysToExpiry: a.daysToExpiry,
      risk: a.risk, expectedSales: a.expectedSales, estimatedLeftoverUnits: a.leftoverUnits,
      leftoverPurchaseValue: Number(a.leftoverValue.toFixed(2)), scenarios: scenarioMap[a.product.id],
    }));
    const prompt = `You are ShelfSense, a cautious decision-support assistant for small grocery shops. Return JSON exactly as {"recommendations":[{"title":"...","priority":"Urgent|High|Medium|Low","evidence":"...","action":"...","tradeoff":"...","uncertainty":"...","nextStep":"..."}]}. Return up to 3 concise recommendations. Use only supplied facts and calculations. Do not invent sales history, totals, guaranteed savings, or forecasts. Explain that estimates are assumptions, not realized profit. NEVER recommend selling or discounting expired products; mention applicable handling/disposal requirements instead. State uncertainty and missing information. Data: ${JSON.stringify({ discountPercent: parsed.data.discountPercent, demandMultiplier: parsed.data.demandMultiplier, products: evidence })}`;
    const response = await Promise.race([
      model.generateContent(prompt),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Gemini request timed out.")), 18000)),
    ]);
    const output = ResponseSchema.safeParse(JSON.parse(response.response.text()) as unknown);
    if (!output.success) throw new Error("Model response did not match the required structure.");
    const expiredProducts = assessments
      .filter(a => a.risk === "Expired")
      .map(a => a.product.name.trim())
      .filter(Boolean);
    // Enforce the expiry safety rule after generation. A model may ignore prompt
    // instructions or mention an expired product in a field other than its title.
    const recommendations = output.data.recommendations.map(r => {
      const mentionsExpiredProduct = expiredProducts.some(name =>
        [r.title, r.evidence, r.action, r.tradeoff, r.uncertainty, r.nextStep]
          .some(value => value.toLocaleLowerCase().includes(name.toLocaleLowerCase()))
      );
      return mentionsExpiredProduct
        ? {
            ...r,
            action: "Do not resell or discount expired stock. Follow applicable food-safety handling and disposal requirements.",
            tradeoff: "Expired stock must not be resold. Any purchase value shown is an inventory estimate, not a measured actual loss.",
            nextStep: "Verify the item and follow applicable local food-safety and disposal requirements.",
          }
        : r;
    });
    return NextResponse.json({ mode: "gemini", recommendations });
  } catch {
    return NextResponse.json({ mode: "fallback", recommendations: fallback, error: "Gemini is unavailable or returned an invalid response; rule-based recommendations were used." });
  }
}
