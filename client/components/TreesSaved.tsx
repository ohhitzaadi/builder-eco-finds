import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

function format(n: number) {
  return new Intl.NumberFormat().format(n);
}

const AVERAGE_KG_PER_ITEM = 0.26; // kg per rehomed item
const KG_PER_TREE: number = 20; // kg equivalent per tree

export default function TreesSaved() {
  const [kgDiverted, setKgDiverted] = useState<number>(0);

  useEffect(() => {
    function compute() {
      try {
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

  const treesSaved = Math.floor(kgDiverted / KG_PER_TREE);
  const progressTowardNext = KG_PER_TREE === 0 ? 0 : Math.min(100, Math.round(((kgDiverted % KG_PER_TREE) / KG_PER_TREE) * 100));

  return (
    <section className="border-t py-12">
      <div className="container grid gap-6 md:grid-cols-2 items-center">
        <div>
          <h2 className="text-2xl font-semibold">Trees Saved</h2>
          <p className="mt-2 text-muted-foreground">Recycling and rehoming reduce waste — here's how many trees the community has helped save so far.</p>
        </div>
        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-between gap-6">
            <div>
              <div className="text-3xl font-extrabold">{format(treesSaved)}</div>
              <div className="text-sm text-muted-foreground">trees saved</div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <Progress value={progressTowardNext} />
                <div
                  aria-hidden
                  className="absolute top-1/2 transform -translate-y-1/2"
                  style={{ left: `${progressTowardNext}%`, transform: `translate(-50%, -50%)` }}
                >
                  <span className="text-sm">🌳</span>
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{progressTowardNext}% to next tree</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
