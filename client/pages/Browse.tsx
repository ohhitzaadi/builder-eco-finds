import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProducts } from "@/state/products";
import ProductCard from "@/components/ProductCard";

export default function Browse() {
  const { products, categories } = useProducts();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");

  const groupedCategories = [
    {
      title: "Fashion & Lifestyle",
      subs: ["Fashion", "Beauty", "Accessories"],
    },
    {
      title: "Electronics & Gadgets",
      subs: ["Electronics", "Smart Devices", "Accessories"],
    },
    {
      title: "Home & Living",
      subs: ["Home", "Furniture", "Decor", "Kitchen"],
    },
    {
      title: "Books, Media & Toys",
      subs: ["Books", "Media", "Educational", "Toys"],
    },
    {
      title: "Sports & Outdoor",
      subs: ["Sports", "Sports Gear", "Outdoor", "Outdoor Equipment", "Fitness"],
    },
  ];

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter((p) => {
      const matchCat = cat === "All" || p.category === cat;
      const matchTerm = term === "" || p.title.toLowerCase().includes(term);
      return matchCat && matchTerm;
    });
  }, [products, q, cat]);

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Browse Listings</h1>
        <div className="flex gap-2">
          <div className="w-56"><Input placeholder="Search by title" value={q} onChange={(e)=>setQ(e.target.value)} /></div>
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map((c)=> <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groupedCategories.map((g) => (
          <div key={g.title} className="rounded-lg border p-4">
            <div className="font-semibold">{g.title}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {g.subs.map((s) => (
                <button key={s} onClick={() => setCat(s)} className={"rounded-md border px-3 py-1 text-sm transition-transform duration-150 hover:scale-105 " + (cat === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-6 text-muted-foreground">No products match your search.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p)=> (<ProductCard key={p.id} product={p} />))}
        </div>
      )}
    </div>
  );
}
