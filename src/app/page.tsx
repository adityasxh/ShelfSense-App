"use client";

import { useState } from "react";
import Dashboard from "./dashboard";

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) return <Dashboard />;

  return (
    <main className="landing-page">
      <header className="landing-nav">
        <a className="landing-brand" href="#" aria-label="ShelfSense home">
          <span className="brand-mark">S</span>
          <span>ShelfSense</span>
        </a>
        <nav className="landing-nav-links" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#features">Features</a>
          <button className="nav-cta" onClick={() => setShowDashboard(true)}>Open dashboard <span aria-hidden="true">↗</span></button>
        </nav>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <div className="landing-eyebrow"><span /> SMARTER INVENTORY FOR LOCAL SHOPS</div>
          <h1>Rescue stock.<br /><em>Reduce waste.</em></h1>
          <p className="landing-lede">ShelfSense helps grocery shops spot products at risk of expiry, explore practical stock-rescue options, and make clearer decisions before good stock goes to waste.</p>
          <div className="landing-actions">
            <button className="landing-button-primary" onClick={() => setShowDashboard(true)}>Explore ShelfSense <span aria-hidden="true">→</span></button>
            <a className="landing-button-secondary" href="#how-it-works">See how it works <span aria-hidden="true">↓</span></a>
          </div>
          <div className="landing-proof">
            <div className="landing-proof-icons" aria-hidden="true"><span>↗</span><span>✓</span><span>◎</span></div>
            <p><strong>Clearer decisions, one shelf at a time.</strong><br /><span>Designed for independent grocery shops</span></p>
          </div>
        </div>

        <div className="landing-visual" aria-label="Illustrative preview of the ShelfSense inventory dashboard">
          <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
          <div className="dashboard-preview">
            <div className="preview-top"><div className="preview-logo"><span className="brand-mark mini">S</span><b>ShelfSense</b></div><span className="preview-status"><span /> Sample view</span></div>
            <div className="preview-heading"><div><span className="preview-label">INVENTORY OVERVIEW</span><h3>Your stock, at a glance.</h3><p>Know what needs your attention.</p></div><div className="preview-calendar">▦ <span>Today</span></div></div>
            <div className="preview-metrics">
              <div><span>Inventory value</span><strong>₹24,850</strong><small>Illustrative sample</small></div>
              <div className="metric-highlight"><span>Priority items</span><strong>04 <i>items</i></strong><small>Review these first</small></div>
            </div>
            <div className="preview-list-head"><b>Priority queue</b><span>Example products</span></div>
            <div className="preview-product"><span className="product-icon produce">🥬</span><div className="product-info"><b>Fresh greens</b><small>Produce · 1 day to expiry</small></div><span className="risk-pill urgent">Urgent</span><span className="product-arrow">↗</span></div>
            <div className="preview-product"><span className="product-icon dairy">🥛</span><div className="product-info"><b>Milk cartons</b><small>Dairy · 3 days to expiry</small></div><span className="risk-pill high">High</span><span className="product-arrow">↗</span></div>
            <div className="preview-product"><span className="product-icon bakery">🍞</span><div className="product-info"><b>Whole wheat bread</b><small>Bakery · 5 days to expiry</small></div><span className="risk-pill medium">Review</span><span className="product-arrow">↗</span></div>
            <div className="preview-bottom"><span className="preview-check">✓</span><span>Spot risk early. Choose your next step.</span></div>
          </div>
          <div className="floating-note note-top"><span className="float-icon">✳</span><div><b>Know what’s at risk</b><small>Priorities at a glance</small></div></div>
          <div className="floating-note note-bottom"><span className="float-icon leaf-icon">↗</span><div><b>Compare rescue options</b><small>Before changing a price</small></div></div>
          <span className="hero-spark spark-one">✳</span><span className="hero-spark spark-two">✦</span>
        </div>
        <div className="landing-hero-bottomline"><span>LESS GUESSWORK</span><i /><span>MORE VISIBLE PRIORITIES</span><i /><span>BETTER-INFORMED ACTIONS</span></div>
      </section>

      <section className="landing-benefits">
        <div><span className="strip-number">01</span><p><b>Spot at-risk products</b><br />See which items may be left unsold before expiry.</p></div>
        <div><span className="strip-number">02</span><p><b>Compare your options</b><br />Explore price and demand scenarios with clear assumptions.</p></div>
        <div><span className="strip-number">03</span><p><b>Choose with context</b><br />Use evidence-led guidance to support everyday decisions.</p></div>
      </section>

      <section className="landing-features" id="features">
        <div className="landing-section-kicker">YOUR EVERYDAY STOCK SIDEKICK</div>
        <div className="landing-section-heading"><h2>Small shop decisions.<br /><em>A little more clarity.</em></h2><p>Keep inventory visible, understand potential expiry risk, and compare possible actions from one simple workspace.</p></div>
        <div className="landing-feature-grid">
          <article className="landing-feature-card feature-cream"><div className="feature-icon icon-radar">◎</div><span className="feature-number">01 / VISIBILITY</span><h3>See the risk before it becomes waste.</h3><p>A priority queue uses stock quantity, expiry dates, and estimated daily sales to help surface items for review.</p><div className="feature-art radar-art"><div className="radar-ring ring-a" /><div className="radar-ring ring-b" /><div className="radar-ring ring-c" /><div className="radar-center">S</div><span className="radar-dot dot-a" /><span className="radar-dot dot-b" /></div></article>
          <article className="landing-feature-card feature-green"><div className="feature-icon icon-sim">↗</div><span className="feature-number">02 / SCENARIOS</span><h3>Try a plan before you try it on the shelf.</h3><p>Compare current pricing and possible discounts. Review estimated revenue, costs, contribution, and leftovers.</p><div className="feature-art mini-chart"><div className="chart-top"><span>WHAT-IF COMPARISON</span><span>₹</span></div><div className="chart-bars"><div style={{height:"45%"}}><span>Keep</span></div><div style={{height:"73%"}}><span>Discount</span></div><div style={{height:"58%"}}><span>Bundle</span></div></div><div className="chart-caption"><span>Illustrative only</span><span>Assumptions matter ↗</span></div></div></article>
          <article className="landing-feature-card feature-lilac"><div className="feature-icon icon-ai">✳</div><span className="feature-number">03 / DECISION SUPPORT</span><h3>Understand the “why,” not just the number.</h3><p>Get concise recommendations grounded in inventory inputs, with trade-offs and uncertainty made visible.</p><div className="feature-art insight-art"><div className="insight-header"><span>✳</span><b>Decision explainer</b><span className="insight-tag">EXAMPLE</span></div><div className="insight-line strong-line" /><div className="insight-line" /><div className="insight-line short-line" /><div className="insight-note"><span>↗</span><p><b>Check the assumptions</b><br />Estimated outcomes, not guarantees.</p></div></div></article>
        </div>
      </section>

      <section className="landing-how" id="how-it-works">
        <div className="how-copy"><div className="landing-section-kicker">A SIMPLE, PRACTICAL FLOW</div><h2>From “what might go off?”<br /><em>to “what can I do?”</em></h2><p>No complicated forecasting setup. Start with your stock list, make assumptions explicit, and use the results to guide your next review.</p><button className="landing-button-primary" onClick={() => setShowDashboard(true)}>Open the demo <span aria-hidden="true">→</span></button></div>
        <div className="landing-steps">
          <div className="landing-step"><span className="step-count">1</span><div><h3>Add your inventory</h3><p>Enter product quantity, purchase cost, selling price, expiry date, and estimated daily sales.</p></div><span className="step-symbol">＋</span></div>
          <div className="landing-step"><span className="step-count">2</span><div><h3>Review your priority queue</h3><p>See transparent risk labels and estimated leftovers based on the inputs you provide.</p></div><span className="step-symbol">◎</span></div>
          <div className="landing-step"><span className="step-count">3</span><div><h3>Compare possible rescue actions</h3><p>Use what-if scenarios and decision-support guidance before deciding what to do.</p></div><span className="step-symbol">↗</span></div>
        </div>
      </section>

      <section className="landing-closing-cta"><div className="cta-decoration cta-one" /><div className="cta-decoration cta-two" /><span className="cta-kicker">MAKE THE NEXT STOCK DECISION COUNT</span><h2>Less waste starts with<br /><em>better visibility.</em></h2><p>Explore ShelfSense using sample inventory, then tailor it to your own shop.</p><button className="landing-button-light" onClick={() => setShowDashboard(true)}>Enter ShelfSense <span aria-hidden="true">→</span></button><span className="cta-footnote">No external account needed for the local demo.</span></section>

      <footer className="landing-footer"><a className="landing-brand" href="#"><span className="brand-mark">S</span><span>ShelfSense</span></a><p>Rescue Stock Before It Becomes Waste.</p><div><a href="#features">Features</a><a href="#how-it-works">How it works</a><button onClick={() => setShowDashboard(true)}>Open dashboard ↗</button></div><small>Prototype · Estimates are illustrative, not guaranteed results. Follow applicable food-safety rules; expired products must not be resold.</small></footer>
    </main>
  );
}
