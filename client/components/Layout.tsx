import React from "react";
import Header from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-muted/20 py-10">
        <div className="container grid gap-6 md:grid-cols-3">
          <div>
            <div className="font-extrabold text-lg"><span className="text-primary">EcoFinds</span></div>
            <p className="mt-2 text-sm text-muted-foreground">Buy and sell pre-loved goods. Reduce waste. Join the movement.</p>
          </div>
          <div>
            <div className="font-semibold">Explore</div>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li><a href="/browse" className="hover:text-foreground transition-transform duration-150 hover:scale-105">Browse</a></li>
              <li><a href="/sell" className="hover:text-foreground transition-transform duration-150 hover:scale-105">Sell</a></li>
              <li><a href="/purchases" className="hover:text-foreground transition-transform duration-150 hover:scale-105">Purchases</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold">About</div>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li className="transition-transform duration-150 hover:scale-105">Eco-scores & trust badges</li>
              <li className="transition-transform duration-150 hover:scale-105">Carbon impact roadmap</li>
              <li className="transition-transform duration-150 hover:scale-105">Community-driven sustainability</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
