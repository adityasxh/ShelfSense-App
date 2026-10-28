const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SESSION_KEY = "shelfsense.supabase.session.v1";

export type CloudSession = { access_token: string; refresh_token: string; user: { id: string; email?: string } };
export const cloudConfigured = Boolean(URL && KEY);

function config() {
  if (!URL || !KEY) throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.");
  return { url: URL.replace(/\/$/, ""), key: KEY };
}
function saveSession(session: CloudSession | null) {
  if (typeof window === "undefined") return;
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
}
export function getSavedSession(): CloudSession | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(SESSION_KEY);
    if (!value) return null;
    const session = JSON.parse(value) as CloudSession;
    return session.access_token && session.refresh_token && session.user?.id ? session : null;
  } catch { return null; }
}
async function request(path: string, init: RequestInit = {}, token?: string) {
  const { url, key } = config();
  const response = await fetch(url + path, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${token ?? key}`, "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
  const raw = await response.text();
  const body = raw ? JSON.parse(raw) : null;
  if (!response.ok) throw new Error(String(body?.msg ?? body?.message ?? body?.error_description ?? body?.error ?? `Supabase request failed (${response.status})`));
  return body;
}
export async function authenticate(email: string, password: string, mode: "signin" | "signup") {
  const session = await request(mode === "signup" ? "/auth/v1/signup" : "/auth/v1/token?grant_type=password", {
    method: "POST", body: JSON.stringify({ email, password }),
  }) as CloudSession;
  if (!session.access_token || !session.user?.id) {
    if (mode === "signup") throw new Error("Account created. If email confirmation is enabled, confirm your email, then sign in.");
    throw new Error("Supabase did not return a session. Check your email/password and Auth settings.");
  }
  saveSession(session);
  return session;
}
export async function restoreSession() {
  const session = getSavedSession();
  if (!session) return null;
  try {
    const user = await request("/auth/v1/user", { method: "GET" }, session.access_token);
    session.user = user;
    saveSession(session);
    return session;
  } catch {
    try {
      const refreshed = await request("/auth/v1/token?grant_type=refresh_token", { method: "POST", body: JSON.stringify({ refresh_token: session.refresh_token }) }) as CloudSession;
      if (!refreshed.access_token || !refreshed.refresh_token) throw new Error("Refresh failed");
      saveSession(refreshed);
      return refreshed;
    } catch { saveSession(null); return null; }
  }
}
export function signOut() { saveSession(null); }
export async function rest<T>(table: string, query: string, method: string, token: string, body?: unknown, prefer = "return=representation"): Promise<T> {
  return request(`/rest/v1/${table}${query}`, {
    method, headers: { Prefer: prefer }, ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  }, token) as Promise<T>;
}
export async function getOrCreateShop(session: CloudSession) {
  const shops = await rest<Array<{id:string}>>("shops", "?select=id&order=created_at.asc&limit=1", "GET", session.access_token);
  if (shops[0]) return shops[0].id;
  const created = await rest<Array<{id:string}>>("shops", "", "POST", session.access_token, {
    owner_id: session.user.id, name: "My Grocery Shop", currency_code: "INR", timezone: "Asia/Kolkata",
  });
  if (!created[0]?.id) throw new Error("Shop could not be created. Please retry.");
  return created[0].id;
}
type DbProduct = {id:string;name:string;category_name:string;cost_price:number;selling_price:number;daily_sales_estimate:number;extra_unit_cost:number};
type DbBatch = {id:string;product_id:string;quantity_on_hand:number;unit_cost:number;expiry_date:string|null};
export async function loadInventory(session: CloudSession, shopId: string) {
  const [rows, batches] = await Promise.all([
    rest<DbProduct[]>("products", `?select=*&shop_id=eq.${shopId}&is_active=eq.true&order=created_at.desc`, "GET", session.access_token),
    rest<DbBatch[]>("inventory_batches", `?select=id,product_id,quantity_on_hand,unit_cost,expiry_date&shop_id=eq.${shopId}&order=expiry_date.asc.nullslast`, "GET", session.access_token),
  ]);
  return rows.map(row => {
    const productBatches = batches.filter(batch => batch.product_id === row.id);
    const quantity = productBatches.reduce((sum, batch) => sum + Number(batch.quantity_on_hand || 0), 0);
    const expiryDate = productBatches.find(batch => Number(batch.quantity_on_hand) > 0 && batch.expiry_date)?.expiry_date ?? new Date().toISOString().slice(0,10);
    return { id:row.id, name:row.name, category:row.category_name||"Uncategorized", quantity,
      unitCost:Number(productBatches[0]?.unit_cost ?? row.cost_price ?? 0), sellingPrice:Number(row.selling_price??0),
      expiryDate, dailySales:Number(row.daily_sales_estimate??0), extraUnitCost:Number(row.extra_unit_cost??0) };
  });
}
export async function saveInventoryProduct(session: CloudSession, shopId: string, product: {id:string;name:string;category:string;quantity:number;unitCost:number;sellingPrice:number;expiryDate:string;dailySales:number;extraUnitCost:number}) {
  await rest<Array<{id:string}>>("products", "?on_conflict=id", "POST", session.access_token, {
    id:product.id, shop_id:shopId, name:product.name, category_name:product.category||"Uncategorized",
    cost_price:product.unitCost, selling_price:product.sellingPrice, daily_sales_estimate:product.dailySales,
    extra_unit_cost:product.extraUnitCost, is_active:true, updated_at:new Date().toISOString(),
  }, "resolution=merge-duplicates,return=representation");
  const batches = await rest<Array<{id:string}>>("inventory_batches", `?select=id&shop_id=eq.${shopId}&product_id=eq.${product.id}&order=created_at.asc`, "GET", session.access_token);
  const batch = {shop_id:shopId,product_id:product.id,quantity_received:product.quantity,quantity_on_hand:product.quantity,unit_cost:product.unitCost,expiry_date:product.expiryDate};
  if (batches[0]) {
    await rest("inventory_batches", `?id=eq.${batches[0].id}&shop_id=eq.${shopId}`, "PATCH", session.access_token, batch, "return=minimal");
    if (batches.length > 1) await rest("inventory_batches", `?id=in.(${batches.slice(1).map(x=>x.id).join(",")})&shop_id=eq.${shopId}`, "DELETE", session.access_token, undefined, "return=minimal");
  } else await rest("inventory_batches", "", "POST", session.access_token, batch, "return=minimal");
}
export async function deleteInventoryProduct(session: CloudSession, shopId: string, productId: string) {
  await rest("products", `?id=eq.${productId}&shop_id=eq.${shopId}`, "DELETE", session.access_token, undefined, "return=minimal");
}
export async function clearInventory(session: CloudSession, shopId: string) {
  await rest("products", `?shop_id=eq.${shopId}`, "DELETE", session.access_token, undefined, "return=minimal");
}
