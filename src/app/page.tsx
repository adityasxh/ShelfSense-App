"use client";

import { useState } from "react";
import { restoreSession } from "@/lib/supabase-rest";

export default function Home() {
  const [opening, setOpening] = useState(false);
  async function openShelfSense() {
    if (opening) return;
    setOpening(true);
    try {
      const session = await restoreSession();
      window.location.href = session ? "/dashboard" : "/auth?next=%2Fdashboard";
    } catch {
      window.location.href = "/auth?next=%2Fdashboard";
    }
  }

  return (
    <main className="landing-page">
      <header className="landing-nav">
        <a className="landing-brand" href="#" aria-label="ShelfSense home">
          <img className="brand-icon" src="/shelfsense-icon.svg" alt="" />
          <span>ShelfSense</span>
        </a>
        <nav className="landing-nav-links" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#features">Features</a>
          <button className="nav-cta" onClick={openShelfSense} disabled={opening}>{opening ? "Checking session…" : "Sign in"} <span aria-hidden="true">↗</span></button>
        </nav>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <div className="landing-eyebrow"><span /> SMARTER INVENTORY FOR LOCAL SHOPS</div>
          <h1>Rescue stock.<br /><em>Reduce waste.</em></h1>
          <p className="landing-lede">ShelfSense helps grocery shops spot products at risk of expiry, explore practical stock-rescue options, and make clearer decisions before good stock goes to waste.</p>
          <div className="landing-actions">
            <button className="landing-button-primary" onClick={openShelfSense}>Explore ShelfSense <span aria-hidden="true">→</span></button>
            <a className="landing-button-secondary" href="#how-it-works">See how it works <span aria-hidden="true">↓</span></a>
          </div>
          <div className="landing-proof">
            <div className="landing-proof-icons" aria-hidden="true"><svg className="lucide-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg><svg className="lucide-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg><svg className="lucide-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><circle cx="12" cy="12" r="3"/></svg></div>
            <p><strong>Clearer decisions, one shelf at a time.</strong><br /><span>Designed for independent grocery shops</span></p>
          </div>
        </div>

        <div className="landing-visual" aria-label="Illustrative preview of the ShelfSense inventory dashboard">
          <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
          <div className="dashboard-preview">
            <div className="preview-top"><div className="preview-logo"><img className="brand-icon preview-brand-icon" src="/shelfsense-icon.svg" alt="" /><b>ShelfSense</b></div><span className="preview-status"><span /> Sample view</span></div>
            <div className="preview-heading"><div><span className="preview-label">INVENTORY OVERVIEW</span><h3>Your stock, at a glance.</h3><p>Know what needs your attention.</p></div><div className="preview-calendar"><svg className="lucide-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg> <span>Today</span></div></div>
            <div className="preview-metrics">
              <div><span>Inventory value</span><strong>₹24,850</strong><small>Illustrative sample</small></div>
              <div className="metric-highlight"><span>Priority items</span><strong>04 <i>items</i></strong><small>Review these first</small></div>
            </div>
            <div className="preview-list-head"><b>Priority queue</b><span>Example products</span></div>
            <div className="preview-product"><span className="product-icon produce"><svg className="lucide-icon" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 4c-8 0-14 3-14 10a6 6 0 0 0 6 6c7 0 8-8 8-16Z"/><path d="M4 21c2-5 6-9 12-12"/></svg></span><div className="product-info"><b>Fresh greens</b><small>Produce · 1 day to expiry</small></div><span className="risk-pill urgent">Urgent</span><span className="product-arrow"><svg className="lucide-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg></span></div>
            <div className="preview-product"><span className="product-icon dairy"><svg className="lucide-icon" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/><path d="m7.5 5.5 9 5"/></svg></span><div className="product-info"><b>Milk cartons</b><small>Dairy · 3 days to expiry</small></div><span className="risk-pill high">High</span><span className="product-arrow">↗</span></div>
            <div className="preview-product"><span className="product-icon bakery"><svg className="lucide-icon" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/><path d="m7.5 5.5 9 5"/></svg></span><div className="product-info"><b>Whole wheat bread</b><small>Bakery · 5 days to expiry</small></div><span className="risk-pill medium">Review</span><span className="product-arrow">↗</span></div>
            <div className="preview-bottom"><span className="preview-check"><svg className="lucide-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg></span><span>Spot risk early. Choose your next step.</span></div>
          </div>
          <div className="cashier-art-wrap" aria-hidden="true"><span className="cashier-glow" /><img className="cashier-illustration" src="/cashier-cutout.webp" alt="" /></div>
          <div className="floating-note note-top"><span className="float-icon"><svg className="lucide-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z"/><path d="m19 14 1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14Z"/></svg></span><div><b>Know what’s at risk</b><small>Priorities at a glance</small></div></div>
          <div className="floating-note note-bottom"><span className="float-icon leaf-icon"><svg className="lucide-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><path d="M8 15v-4"/><path d="M13 15V6"/><path d="M18 15V9"/></svg></span><div><b>Compare rescue options</b><small>Before changing a price</small></div></div>
          <span className="hero-spark spark-one"><svg className="lucide-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z"/><path d="m19 14 1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14Z"/></svg></span><span className="hero-spark spark-two"><svg className="lucide-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z"/><path d="m19 14 1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14Z"/></svg></span>
        </div>
        <div className="landing-hero-bottomline"><span>LESS GUESSWORK</span><i /><span>MORE VISIBLE PRIORITIES</span><i /><span>BETTER-INFORMED ACTIONS</span></div>
      </section>

      <section className="landing-benefits" aria-label="ShelfSense benefits">
        <article className="benefit-card"><span className="benefit-icon"><svg className="lucide-icon" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><circle cx="12" cy="12" r="3"/></svg></span><span className="benefit-index">01 / VISIBILITY</span><h3>Spot at-risk products</h3><p>See which items may be left unsold before expiry.</p><span className="benefit-link">Review priority stock <svg className="lucide-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg></span></article>
        <article className="benefit-card"><span className="benefit-icon"><svg className="lucide-icon" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><path d="M8 15v-4"/><path d="M13 15V6"/><path d="M18 15V9"/></svg></span><span className="benefit-index">02 / SCENARIOS</span><h3>Compare your options</h3><p>Explore price and demand scenarios with clear assumptions.</p><span className="benefit-link">Compare outcomes <svg className="lucide-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg></span></article>
        <article className="benefit-card"><span className="benefit-icon"><svg className="lucide-icon" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></svg></span><span className="benefit-index">03 / DECISION SUPPORT</span><h3>Choose with context</h3><p>Use evidence-led guidance to support everyday decisions.</p><span className="benefit-link">Understand the trade-offs <svg className="lucide-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg></span></article>
      </section>

      <section className="landing-features" id="features">
        <div className="landing-section-kicker">YOUR EVERYDAY STOCK SIDEKICK</div>
        <div className="landing-section-heading"><h2>Small shop decisions.<br /><em>A little more clarity.</em></h2><p>Keep inventory visible, understand potential expiry risk, and compare possible actions from one simple workspace.</p></div>
        <div className="landing-feature-grid">
          <article className="landing-feature-card feature-cream"><div className="feature-icon icon-radar"><svg className="lucide-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><circle cx="12" cy="12" r="3"/></svg></div><span className="feature-number">01 / VISIBILITY</span><h3>See the risk before it becomes waste.</h3><p>A priority queue uses stock quantity, expiry dates, and estimated daily sales to help surface items for review.</p><div className="feature-art radar-art"><div className="radar-ring ring-a" /><div className="radar-ring ring-b" /><div className="radar-ring ring-c" /><div className="radar-center"><img src="/shelfsense-icon.svg" alt="" /></div><span className="radar-dot dot-a" /><span className="radar-dot dot-b" /></div></article>
          <article className="landing-feature-card feature-green"><div className="feature-icon icon-sim"><svg className="lucide-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><path d="M8 15v-4"/><path d="M13 15V6"/><path d="M18 15V9"/></svg></div><span className="feature-number">02 / SCENARIOS</span><h3>Try a plan before you try it on the shelf.</h3><p>Compare current pricing and possible discounts. Review estimated revenue, costs, contribution, and leftovers.</p><div className="feature-art mini-chart"><div className="chart-top"><span>WHAT-IF COMPARISON</span><span>₹</span></div><div className="chart-bars"><div style={{height:"45%"}}><span>Keep</span></div><div style={{height:"73%"}}><span>Discount</span></div><div style={{height:"58%"}}><span>Bundle</span></div></div><div className="chart-caption"><span>Illustrative only</span><span>Assumptions matter ↗</span></div></div></article>
          <article className="landing-feature-card feature-lilac"><div className="feature-icon icon-ai"><svg className="lucide-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z"/><path d="m19 14 1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14Z"/></svg></div><span className="feature-number">03 / DECISION SUPPORT</span><h3>Understand the “why,” not just the number.</h3><p>Get concise recommendations grounded in inventory inputs, with trade-offs and uncertainty made visible.</p><div className="feature-art insight-art"><div className="insight-header"><svg className="lucide-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z"/><path d="m19 14 1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14Z"/></svg><b>Decision explainer</b><span className="insight-tag">EXAMPLE</span></div><div className="insight-line strong-line" /><div className="insight-line" /><div className="insight-line short-line" /><div className="insight-note"><svg className="lucide-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg><p><b>Check the assumptions</b><br />Estimated outcomes, not guarantees.</p></div></div></article>
        </div>
      </section>

      <section className="landing-how" id="how-it-works">
        <div className="how-copy"><div className="landing-section-kicker">A SIMPLE, PRACTICAL FLOW</div><h2>From “what might go off?”<br /><em>to “what can I do?”</em></h2><p>No complicated forecasting setup. Start with your stock list, make assumptions explicit, and use the results to guide your next review.</p><button className="landing-button-primary" onClick={openShelfSense}>Explore ShelfSense <span aria-hidden="true">→</span></button></div>
        <div className="landing-steps">
          <article className="landing-step step-card"><span className="step-count">01</span><div><span className="step-kicker"><svg className="lucide-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/><path d="m7.5 5.5 9 5"/></svg> INVENTORY</span><h3>Add your inventory</h3><p>Enter product quantity, purchase cost, selling price, expiry date, and estimated daily sales.</p><span className="step-more">Start with the stock you have <svg className="lucide-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg></span></div></article>
          <article className="landing-step step-card"><span className="step-count">02</span><div><span className="step-kicker"><svg className="lucide-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><circle cx="12" cy="12" r="3"/></svg> PRIORITIES</span><h3>Review your priority queue</h3><p>See transparent risk labels and estimated leftovers based on the inputs you provide.</p><span className="step-more">Find what needs attention <svg className="lucide-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg></span></div></article>
          <article className="landing-step step-card"><span className="step-count">03</span><div><span className="step-kicker"><svg className="lucide-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><path d="M8 15v-4"/><path d="M13 15V6"/><path d="M18 15V9"/></svg> ACTIONS</span><h3>Compare possible rescue actions</h3><p>Use what-if scenarios and decision-support guidance before deciding what to do.</p><span className="step-more">Compare with context <svg className="lucide-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg></span></div></article>
        </div>
      </section>

      <section className="landing-closing-cta"><div className="cta-decoration cta-one" /><div className="cta-decoration cta-two" /><span className="cta-kicker">MAKE THE NEXT STOCK DECISION COUNT</span><h2>Less waste starts with<br /><em>better visibility.</em></h2><p>Sign in to access your private inventory dashboard and stock-rescue tools.</p><button className="landing-button-light" onClick={openShelfSense}>Explore ShelfSense <span aria-hidden="true">→</span></button><span className="cta-footnote">Sign in or register to continue.</span></section>

      <footer className="landing-footer"><a className="landing-brand" href="#"><img className="brand-icon" src="/shelfsense-icon.svg" alt="" /><span>ShelfSense</span></a><p>Rescue Stock Before It Becomes Waste.</p><div><a href="#features">Features</a><a href="#how-it-works">How it works</a><button onClick={openShelfSense}>Sign in ↗</button></div><small>Prototype · Estimates are illustrative, not guaranteed results. Follow applicable food-safety rules; expired products must not be resold.</small></footer>
    </main>
  );
}
