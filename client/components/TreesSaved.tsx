import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { loadJSON } from "@/state/storage";

function format(n: number) {
  return new Intl.NumberFormat().format(n);
}

const PRODUCTS_PER_TREE = 100; // one product = 1%

export default function TreesSaved() {
  const [productsCount, setProductsCount] = useState<number>(0);

  useEffect(() => {
    function compute() {
      try {
        const products = loadJSON<any[]>("products", []);
        setProductsCount(Array.isArray(products) ? products.length : 0);
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

  const treesSaved = Math.floor(productsCount / PRODUCTS_PER_TREE);
  const progressTowardNext = PRODUCTS_PER_TREE === 0 ? 0 : Math.min(100, Math.round(((productsCount % PRODUCTS_PER_TREE) / PRODUCTS_PER_TREE) * 100));

  return (
    <section className="border-t py-12">
      <div className="container grid gap-6 md:grid-cols-2 items-center">
        <div>
          <h2 className="text-2xl font-semibold">Trees Saved</h2>
          <p className="mt-2 text-muted-foreground">Every product uploaded moves the community closer to saving a tree — one product = 1%.</p>
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
