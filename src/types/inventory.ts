export type RiskLevel = "Low" | "Medium" | "High" | "Urgent" | "Expired";
export type Product = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unitCost: number;
  sellingPrice: number;
  expiryDate: string;
  dailySales: number;
  extraUnitCost: number;
};
export type RiskAssessment = {
  product: Product;
  risk: RiskLevel;
  daysToExpiry: number;
  eligibleDays: number;
  expectedSales: number;
  leftoverUnits: number;
  stockValue: number;
  leftoverValue: number;
  explanation: string;
};
