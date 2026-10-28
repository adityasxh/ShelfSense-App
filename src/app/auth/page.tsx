"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authenticate, getOrCreateShop, type CloudSession } from "@/lib/supabase-rest";

type Mode = "signin" | "signup";
export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [nextPath, setNextPath] = useState("/dashboard");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [shopName, setShopName] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (next && next.startsWith("/") && !next.startsWith("//")) setNextPath(next);
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setError(""); setMessage("");
    try {
      const details = { fullName: fullName.trim(), phone: phone.trim(), shopName: shopName.trim() };
      const session: CloudSession = await authenticate(email.trim(), password, mode, details);
      if (!session.access_token) {
        setMessage("Account created. Check your email to confirm your account, then return here and sign in.");
        setMode("signin");
        return;
      }
      await getOrCreateShop(session);
      router.replace(nextPath);
    } catch (err) {
      const text = err instanceof Error ? err.message : "Authentication failed.";
      if (mode === "signup" && /confirm your email|email confirmation|did not return a session/i.test(text)) {
        setMessage("Your account was created. Confirm your email, then sign in to continue.");
        setMode("signin");
      } else setError(text);
    } finally { setBusy(false); }
  }

  return (
    <main className="auth-page">
      <header className="auth-nav">
        <a className="landing-brand" href="/"><span className="brand-mark">S</span><span>ShelfSense</span></a>
        <a className="auth-back" href="/">← Back to home</a>
      </header>
      <section className="auth-layout">
        <div className="auth-intro">
          <div className="landing-eyebrow"><span /> YOUR SHOP, YOUR INVENTORY</div>
          <h1>{mode === "signin" ? "Welcome back." : "Let’s set up your shop."}</h1>
          <p>{mode === "signin" ? "Sign in to open your private ShelfSense dashboard and continue managing your inventory." : "Create your account to keep your shop profile and inventory securely connected to Supabase."}</p>
          <div className="auth-points"><div><b>01</b><span>Private shop inventory</span></div><div><b>02</b><span>Expiry-risk visibility</span></div><div><b>03</b><span>Stock-rescue scenarios</span></div></div>
        </div>
        <div className="auth-card">
          <div className="auth-tabs"><button type="button" className={mode === "signin" ? "selected" : ""} onClick={() => {setMode("signin");setError("");setMessage("");}}>Sign in</button><button type="button" className={mode === "signup" ? "selected" : ""} onClick={() => {setMode("signup");setError("");setMessage("");}}>Register</button></div>
          <h2>{mode === "signin" ? "Sign in to ShelfSense" : "Create your account"}</h2>
          <p className="muted small">{mode === "signin" ? "Use your registered email and password." : "All fields are required to create your shop profile."}</p>
          {message && <div className="notice success" role="status">{message}</div>}
          {error && <div className="notice error" role="alert">{error}</div>}
          <form onSubmit={submit}>
            {mode === "signup" && <>
              <div className="field"><label htmlFor="fullName">Full name</label><input id="fullName" autoComplete="name" value={fullName} onChange={e=>setFullName(e.target.value)} required minLength={2}/></div>
              <div className="field"><label htmlFor="phone">Phone number</label><input id="phone" type="tel" autoComplete="tel" value={phone} onChange={e=>setPhone(e.target.value)} required pattern="[+0-9 ()-]{8,20}" title="Enter a valid phone number"/></div>
              <div className="field"><label htmlFor="shopName">Shop name</label><input id="shopName" value={shopName} onChange={e=>setShopName(e.target.value)} required minLength={2}/></div>
            </>}
            <div className="field"><label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
            <div className="field"><label htmlFor="password">Password</label><input id="password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} value={password} onChange={e=>setPassword(e.target.value)} required minLength={6}/></div>
            <button className="auth-submit" type="submit" disabled={busy}>{busy ? "Please wait…" : mode === "signin" ? "Sign in and continue →" : "Create account →"}</button>
          </form>
          <p className="auth-switch">{mode === "signin" ? "New to ShelfSense?" : "Already registered?"} <button type="button" onClick={()=>{setMode(mode === "signin" ? "signup" : "signin");setError("");setMessage("");}}>{mode === "signin" ? "Create an account" : "Sign in instead"}</button></p>
          <p className="auth-privacy">Your inventory is stored in your Supabase database. Never share your password.</p>
        </div>
      </section>
    </main>
  );
}
