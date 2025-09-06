import React, { useMemo, useState } from "react";
import { useProducts } from "@/state/products";
import { formatPrice } from "@/lib/utils";
import type { Category } from "@/state/types";

function analyzeTitle(title: string) {
  const t = title.toLowerCase();
  const keywords: string[] = [];
  if (/vintage|retro/.test(t)) keywords.push("vintage items often fetch collectors' prices — highlight provenance and condition.");
  if (/brand|nike|adidas|apple|samsung/.test(t)) keywords.push("branded items can command higher prices — include model and year.");
  if (/handmade|artisan/.test(t)) keywords.push("handmade items sell better with origin story and materials.");
  if (/damaged|repair|not working/.test(t)) keywords.push("be transparent about defects; consider lowering price or offering repair notes.");
  return keywords;
}

function categoryHint(cat: Category | string) {
  switch (cat) {
    case "Electronics":
    case "Smart Devices":
      return "Include model, year, battery/condition details, and whether accessories/chargers are included.";
    case "Furniture":
      return "Provide dimensions, clear photos, and mention wear/repairs. Delivery/pickup options help buyers.";
    case "Fashion":
    case "Accessories":
      return "List brand, size, measurements, and any stains/repairs. Good photos from multiple angles help.";
    case "Books":
      return "Note edition, condition, and whether it's signed or a first edition.";
    default:
      return "Clear photos and honest condition details increase buyer trust.";
  }
}

export default function AIAdvice() {
  const { products, categories } = useProducts();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category | "Other">("Other");
  const [condition, setCondition] = useState<"new" | "good" | "fair">("good");
  const [desiredPrice, setDesiredPrice] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [suggested, setSuggested] = useState<number | null>(null);

  // chat box state
  type Msg = { id: string; from: "user" | "bot"; text: string; time: number };
  const [messages, setMessages] = useState<Msg[]>(() => {
    try {
      const raw = localStorage.getItem("ecofinds:aiadvice:messages");
      return raw ? JSON.parse(raw) : [{ id: "welcome", from: "bot", text: "Hi — ask me for selling tips or price suggestions. Try: 'how to list', 'how to price', or type 'tip'", time: Date.now() }];
    } catch { return [{ id: "welcome", from: "bot", text: "Hi — ask me for selling tips or price suggestions. Try: 'how to list', 'how to price', or type 'tip'", time: Date.now() }]; }
  });
  const [chatInput, setChatInput] = useState("");

  const categoryOptions = useMemo(() => categories, [categories]);

  function replyToChat(text: string) {
    const t = text.trim().toLowerCase();
    if (t === "") return "I'm here to help — ask about pricing, listing tips, or sustainability.";
    if (t === "tip") return "Try clear photos, honest descriptions, and competitive pricing.";
    if (t.includes("price")) return "Use the Suggest Price box — choose category and condition, then compare the suggestion to your desired price.";
    if (t.includes("list") || t.includes("how to")) return "Write a clear title, include measurements/photos, be honest about condition, and offer pickup/delivery options.";
    if (t.includes("recycl") || t.includes("sustain")) return "Promote reuse: highlight durability, repair options, and how selling prevents waste.";
    return "Good question — include clear photos, model/year, condition, and any accessories or defects to help buyers decide.";
  }

  function sendChat() {
    const text = chatInput.trim();
    if (!text) return;
    const userMsg = { id: Math.random().toString(36).slice(2,9), from: "user" as const, text, time: Date.now() };
    setMessages((m) => { const next = [...m, userMsg]; try { localStorage.setItem("ecofinds:aiadvice:messages", JSON.stringify(next)); } catch {} return next; });
    setChatInput("");
    setTimeout(() => {
      const botReply = replyToChat(text);
      const botMsg = { id: Math.random().toString(36).slice(2,9), from: "bot" as const, text: botReply, time: Date.now() };
      setMessages((m) => { const next = [...m, botMsg]; try { localStorage.setItem("ecofinds:aiadvice:messages", JSON.stringify(next)); } catch {} return next; });
    }, 300);
  }

  function computeSuggestion() {
    // compute average price for category
    const cat = category as string;
    const same = products.filter((p) => p.category === cat);
    let avg = 0;
    if (same.length > 0) {
      avg = Math.round(same.reduce((s, p) => s + p.price, 0) / same.length) / 100; // rupees
    } else {
      // fallback: sample average across all products or a default
      const all = products;
      if (all.length > 0) avg = Math.round(all.reduce((s, p) => s + p.price, 0) / all.length) / 100;
      else avg = 500; // default rupees
    }

    const conditionMultiplier = condition === "new" ? 1.2 : condition === "good" ? 1 : 0.8;
    const suggestedPrice = Math.max(10, Math.round(avg * conditionMultiplier));
    setSuggested(suggestedPrice);

    // build advice
    const parts: string[] = [];
    parts.push(`Suggested price: ${formatPrice(suggestedPrice * 100)} (based on ${same.length} similar listings).`);

    if (desiredPrice) {
      const desired = parseFloat(desiredPrice);
      if (!Number.isNaN(desired)) {
        const diff = Math.round(((desired - suggestedPrice) / suggestedPrice) * 100);
        if (Math.abs(diff) < 10) parts.push("Your price is in line with the suggestion.");
        else if (diff > 0) parts.push(`Your price is ${diff}% higher than the suggestion — consider adding extra details or guaranteeing condition to justify it.`);
        else parts.push(`Your price is ${Math.abs(diff)}% lower than the suggestion — you might sell faster at this price.`);
      }
    }

    const titleHints = analyzeTitle(title);
    if (titleHints.length) parts.push(...titleHints);

    parts.push(categoryHint(category));

    parts.push("Quick selling tips: good photos, honest description, promote on social channels, and offer clear pickup/delivery options.");

    setResult(parts.join(" "));
  }

  return (
    <section className="border-t py-12">
      <div className="container">
        <h2 className="text-2xl font-semibold">AI Selling Coach</h2>
        <p className="mt-2 text-muted-foreground">Get instant price suggestions and actionable advice for new sellers.</p>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <label className="text-sm">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2 w-full rounded-md border px-2 py-1" placeholder="e.g. Vintage Nike Air Max" />

            <label className="text-sm mt-3">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="mt-2 w-full rounded-md border px-2 py-1">
              <option value="Other">Other</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <label className="text-sm mt-3">Condition</label>
            <select value={condition} onChange={(e) => setCondition(e.target.value as any)} className="mt-2 w-full rounded-md border px-2 py-1">
              <option value="new">New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </select>

            <label className="text-sm mt-3">Your anticipated price (₹)</label>
            <input value={desiredPrice} onChange={(e) => setDesiredPrice(e.target.value)} type="number" min={0} step="1" className="mt-2 w-full rounded-md border px-2 py-1" placeholder="e.g. 1200" />

            <div className="mt-4 flex gap-2">
              <button onClick={computeSuggestion} className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">Suggest Price</button>
              <button onClick={() => {
                // simulate a more "AI" answer by reusing compute and adding friendly tone
                computeSuggestion();
                setResult((r) => (r ? r + " \n\nAI note: Make sure to use high-quality photos and respond quickly to inquiries to improve conversion." : null));
              }} className="rounded-md border px-3 py-2 text-sm">More AI Advice</button>
            </div>
          </div>

          <div className="md:col-span-2 rounded-lg border bg-card p-6">
            <div className="text-sm text-muted-foreground">Recommendation</div>
            <div className="mt-2">
              <div className="text-2xl font-extrabold">{suggested !== null ? formatPrice(suggested * 100) : "—"}</div>
              <div className="text-sm text-muted-foreground">recommended price</div>
            </div>

            <div className="mt-4">
              <div className="text-sm text-muted-foreground">Advice</div>
              <div className="mt-2 whitespace-pre-wrap">{result || "Enter some details and click Suggest Price to get tailored advice."}</div>
            </div>

            <div className="mt-6 border-t pt-4">
              <div className="text-sm text-muted-foreground">Ask AI Coach</div>
              <div className="mt-2 rounded-md border bg-card p-3">
                <div className="max-h-40 overflow-auto space-y-2" id="ai-chat-list">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`${m.from === "user" ? "bg-primary text-primary-foreground" : "bg-muted/50 text-foreground"} px-3 py-2 rounded-md max-w-[80%] text-sm`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); sendChat(); } }} placeholder="Ask about pricing, listing tips, or sustainability" className="flex-1 rounded-md border px-2 py-1 text-sm" />
                  <button onClick={sendChat} className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground">Send</button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
