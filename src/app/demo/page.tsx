import { makeDemoInventory } from "@/data/demo-inventory";
import { assessInventory, inventoryMetrics } from "@/lib/calculations/inventory-risk";
import { money } from "@/lib/demo-format";

export const metadata = { title: "Try the ShelfSense Demo", description: "Explore a read-only ShelfSense dashboard with sample grocery inventory." };

export default function DemoPage() {
  const products = makeDemoInventory();
  const assessments = assessInventory(products);
  const metrics = inventoryMetrics(products);
  return <main className="app">
    <header className="topbar"><a className="workspace-brand" href="/"><img src="/shelfsense-icon.svg" alt="" width="42" height="42"/><span><strong>ShelfSense Demo</strong><small>Read-only sample data · No sign-in required</small></span></a><div className="actions"><a className="landing-button-secondary" href="/">Home</a><a className="landing-button-primary" href="/auth">Create account</a></div></header>
    <div className="notice" role="note">Demo mode: these are sample products only. Nothing here is connected to or saved in a real shop account.</div>
    <div className="spread"><div><h1>Loss Radar</h1><p className="muted">Calculated from sample stock, expiry dates and entered daily-sales estimates.</p></div></div>
    <div className="grid"><div className="metric"><div className="muted small">Inventory purchase value</div><div className="value">{money(metrics.totalStockValue)}</div></div><div className="metric"><div className="muted small">At-risk stock purchase value</div><div className="value">{money(metrics.atRiskValue)}</div></div><div className="metric"><div className="muted small">High or urgent products</div><div className="value">{metrics.highOrUrgentCount}</div></div><div className="metric"><div className="muted small">Products</div><div className="value">{products.length}</div></div></div>
    <section className="panel"><h2>Priority queue</h2><div className="table-wrap"><table><thead><tr><th>Product</th><th>Risk / status</th><th>Expiry</th><th>Quantity</th><th>Estimated leftover</th><th>Explanation</th></tr></thead><tbody>{assessments.map(a=><tr key={a.product.id}><td><strong>{a.product.name}</strong><div className="small muted">{a.product.category}</div></td><td><span className={`badge risk-${a.risk}`}>{a.risk}{a.risk==="Expired"?" · DO NOT SELL":""}</span></td><td>{a.daysToExpiry<0? `${-a.daysToExpiry} day(s) past expiry`:a.daysToExpiry===0?"Today":`${a.daysToExpiry} day(s)`}</td><td>{a.product.quantity}</td><td>{a.leftoverUnits}</td><td>{a.explanation}</td></tr>)}</tbody></table></div></section>
    <section className="panel"><h2>What the numbers mean</h2><p>Risk is calculated from expiry timing, quantity on hand and the daily-sales estimate. Leftover values are estimates, not guaranteed outcomes. Expired products are marked do not sell.</p><p><a href="/auth">Sign in or register</a> to manage your own inventory and compare scenarios.</p></section>
    <footer className="footer"><a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · Sample data only</footer>
  </main>;
}
