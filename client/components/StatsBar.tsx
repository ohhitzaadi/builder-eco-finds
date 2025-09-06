import React, { useEffect, useState } from "react";
import { loadJSON } from "@/state/storage";

function format(n: number) {
  return new Intl.NumberFormat().format(n);
}

const AVERAGE_KG_PER_ITEM = 0.26; // estimated average weight saved per rehomed item
const KG_PER_TREE = 20; // approximate kilograms diverted equivalent to one tree saved

export default function StatsBar() {
  const [itemsRehomed, setItemsRehomed] = useState<number>(0);
  const [kgDiverted, setKgDiverted] = useState<number>(0);
  const [usersCount, setUsersCount] = useState<number>(0);

  useEffect(() => {
    function compute() {
      try {
        // users stored under 'ecofinds:users'
        const users = loadJSON<any>("users", []);
        setUsersCount(Array.isArray(users) ? users.length : 0);

        // purchases are stored under keys prefixed with 'ecofinds:purchases:'
        let purchasesTotal = 0;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)!;
          if (key.startsWith("ecofinds:purchases:")) {
            try {
              const raw = JSON.parse(localStorage.getItem(key) || "[]");
              if (Array.isArray(raw)) purchasesTotal += raw.length;
            } catch {
              // ignore malformed
            }
          }
        }

        setItemsRehomed(purchasesTotal);
        setKgDiverted(Math.round(purchasesTotal * AVERAGE_KG_PER_ITEM));
      } catch (e) {
        console.error(e);
      }
    }

    compute();
    const id = setInterval(compute, 2000);
    window.addEventListener("storage", compute);
    window.addEventListener("focus", compute);
    return () => {
      clearInterval(id);
      window.removeEventListener("storage", compute);
      window.removeEventListener("focus", compute);
    };
  }, []);

  return (
    <div className="border-t bg-background/50">
      <div className="container py-2 flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 group transition-transform duration-200 ease-out hover:scale-110 hover:-translate-y-1">
          <img src="https://cdn.builder.io/o/assets%2F06962a51b996448bbf203913336a012c%2F5e4857b116754c3889a5afd168163fe2?alt=media&token=6ec53cd1-f75c-4f10-99b9-0b10bd0d1df0&apiKey=06962a51b996448bbf203913336a012c" alt="Earth" className="rounded-full object-cover transition-transform duration-200 ease-out transform group-hover:scale-110 group-hover:-translate-y-1" style={{ height: 34, width: 34 }} />
          <div>
            <div className="font-semibold">{format(itemsRehomed)}</div>
            <div className="text-xs">items rehomed</div>
          </div>
        </div>

        <div className="flex items-center gap-2 transition-transform duration-200 ease-out hover:scale-110 hover:-translate-y-1">
          <span className="text-2xl">♻️</span>
          <div>
            <div className="font-semibold">{format(kgDiverted)} kg</div>
            <div className="text-xs">waste diverted</div>
          </div>
        </div>

        <div className="flex items-center gap-2 transition-transform duration-200 ease-out hover:scale-110 hover:-translate-y-1">
          <span className="text-2xl">👥</span>
          <div>
            <div className="font-semibold">{format(usersCount)}</div>
            <div className="text-xs">conscious buyers & sellers</div>
          </div>
        </div>
      </div>
    </div>
  );
}
