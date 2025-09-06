import React, { useEffect, useRef, useState } from "react";

type Message = { id: string; from: "user" | "bot"; text: string; time: number };

const DEFAULT_TIPS: string[] = [
  "Repair or repurpose items before replacing them to extend their life.",
  "Donate or sell items you no longer need instead of throwing them away.",
  "Choose products with minimal or recyclable packaging.",
  "Wash clothes in cold water and air dry when possible to save energy.",
  "Unplug chargers and electronics when not in use to avoid phantom energy draw.",
  "Use a reusable water bottle and shopping bag to reduce single-use waste.",
  "Buy second-hand or refurbished electronics and furniture.",
  "Combine errands to reduce driving and consider public transport or biking.",
  "Compost food scraps to reduce landfill waste and create nutrient-rich soil.",
];

function uid() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 9);
}

function now() {
  return Date.now();
}

function defaultReply(userText: string) {
  const txt = userText.toLowerCase();
  if (/water/.test(txt))
    return "To save water: fix leaks, take shorter showers, and reuse greywater for plants.";
  if (/energy|power|electric|electricity/.test(txt))
    return "To save energy: switch to LED bulbs, unplug unused devices, and use energy-efficient appliances.";
  if (/recycl|recycle/.test(txt))
    return "Recycle properly: clean containers, separate materials, and check local recycling rules.";
  if (/donat|sell|second|pre-?loved|used/.test(txt))
    return "Consider donating or listing items on EcoFinds — it extends product life and reduces waste.";
  if (/repair|fix|mend/.test(txt))
    return "Repairing items often saves resources — look for local repair cafes or tutorial guides online.";
  if (/packag|plastic|single-?use/.test(txt))
    return "Avoid single-use plastics: choose refillable, bulk, or unpackaged options when possible.";
  if (/tree|plant/.test(txt))
    return "Planting trees helps capture carbon and support biodiversity — consider community tree-planting initiatives.";
  if (/sustain|sustan|sustai/.test(txt))
    return "Small everyday choices add up: buy less, choose durable goods, and support circular economy practices.";
  // fallback: provide a random tip
  return DEFAULT_TIPS[Math.floor(Math.random() * DEFAULT_TIPS.length)];
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const raw = localStorage.getItem("ecofinds:chatbot:messages");
      return raw
        ? (JSON.parse(raw) as Message[])
        : [
            {
              id: uid(),
              from: "bot",
              text: "Hi! I'm EcoGuide — I can share tips to save resources and promote sustainable living. Ask me anything or type 'tip' for a suggestion.",
              time: now(),
            },
          ];
    } catch {
      return [
        {
          id: uid(),
          from: "bot",
          text: "Hi! I'm EcoGuide ��� I can share tips to save resources and promote sustainable living. Ask me anything or type 'tip' for a suggestion.",
          time: now(),
        },
      ];
    }
  });
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        "ecofinds:chatbot:messages",
        JSON.stringify(messages),
      );
    } catch {}
    // scroll to bottom
    if (listRef.current)
      listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Message = {
      id: uid(),
      from: "user",
      text: trimmed,
      time: now(),
    };
    setMessages((m) => [...m, userMsg]);

    // compute bot reply
    setTimeout(() => {
      let reply = "";
      if (/^tip$/.test(trimmed.toLowerCase())) {
        reply = DEFAULT_TIPS[Math.floor(Math.random() * DEFAULT_TIPS.length)];
      } else if (/^help$/.test(trimmed.toLowerCase())) {
        reply =
          "Ask me about saving water, energy, recycling, donating, repairing, or general sustainable habits.";
      } else {
        reply = defaultReply(trimmed);
      }
      const botMsg: Message = {
        id: uid(),
        from: "bot",
        text: reply,
        time: now(),
      };
      setMessages((m) => [...m, botMsg]);
    }, 400);
  }

  return (
    <div>
      <div className={`fixed bottom-6 right-6 z-50`}>
        <div className="flex items-end">
          {open && (
            <div className="w-80 md:w-96 rounded-lg shadow-xl bg-card border overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-3 py-2 border-b">
                <div className="font-semibold">EcoGuide</div>
                <div className="text-xs text-muted-foreground">
                  friendly tips
                </div>
              </div>
              <div
                ref={listRef}
                className="p-3 flex-1 overflow-auto h-56 space-y-3"
              >
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`${m.from === "user" ? "bg-primary text-primary-foreground" : "bg-muted/50 text-foreground"} px-3 py-2 rounded-md max-w-[80%] text-sm`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      send(input);
                      setInput("");
                    }
                  }}
                  placeholder="Ask EcoGuide (type 'tip')"
                  className="flex-1 rounded-md border px-2 py-1 text-sm"
                />
                <button
                  onClick={() => {
                    send(input);
                    setInput("");
                  }}
                  className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground"
                >
                  Send
                </button>
              </div>
            </div>
          )}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Open EcoGuide chat"
            className="ml-3 rounded-full bg-primary p-3 shadow-lg text-primary-foreground"
          >
            💬
          </button>
        </div>
      </div>
    </div>
  );
}
