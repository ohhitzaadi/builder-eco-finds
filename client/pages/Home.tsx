import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sprout, ShieldCheck, Leaf, Recycle, Search } from "lucide-react";
import { useProducts } from "@/state/products";
import ProductCard from "@/components/ProductCard";
import TreesSaved from "@/components/TreesSaved";
import AIAdvice from "@/components/AIAdvice";
import { useAuth } from "@/state/auth";

const HERO_IMAGES = [
  "https://cdn.builder.io/api/v1/image/assets%2F06962a51b996448bbf203913336a012c%2Fe63e9355c70e47f2ab3cf68f30ab5b04?format=webp&width=1600",
  "https://cdn.builder.io/api/v1/image/assets%2F06962a51b996448bbf203913336a012c%2Fa74ee7b9de8f4b22ac46861ff79e672d?format=webp&width=1600",
  "https://cdn.builder.io/api/v1/image/assets%2F06962a51b996448bbf203913336a012c%2Ff9760c37b84049c6b9e7c0c0237b9b1f?format=webp&width=1600",
];

function HeroSlideshow({ interval = 8000 }: { interval?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % HERO_IMAGES.length),
      interval,
    );
    return () => clearInterval(id);
  }, [interval]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {HERO_IMAGES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`hero-${i}`}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1500 ease-in-out transform-gpu will-change-transform will-change-opacity pointer-events-none ${i === index ? "opacity-100" : "opacity-0"}`}
          style={{
            transformOrigin: "center",
            filter: "var(--hero-image-filter)",
            transition:
              "opacity 1400ms ease-in-out, transform 1600ms ease-in-out, filter 500ms ease",
            transform: i === index ? "scale(1.03)" : "scale(1)",
          }}
        />
      ))}
      {/* Dark overlay to ensure foreground text always reads clearly */}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/55 transition-colors duration-300" />
    </div>
  );
}

export default function Home() {
  const { products } = useProducts();
  const featured = products.slice(0, 8);
  const { currentUser } = useAuth();

  return (
    <div>
      <section className="relative overflow-hidden">
        <HeroSlideshow />
        <div className="relative z-10 container py-16 md:py-24 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <Badge className="mb-4" variant="secondary">
              Sustainable Second-Hand Marketplace
            </Badge>
            <h1
              style={{
                fontSize: "36px",
                fontWeight: 700,
                letterSpacing: "-0.5px",
                lineHeight: "42px",
              }}
              className="tracking-tight"
            >
              <span
                style={{
                  color: "#22c35d",
                  fontWeight: 700,
                  fontStyle: "italic",
                }}
              >
                EcoFinds
              </span>{" "}
              – Empowering Sustainable Consumption
            </h1>
            <p
              style={{
                color: "rgb(148,163,184)",
                fontSize: "14px",
                lineHeight: "20px",
                marginTop: "12px",
              }}
            >
              Buy and sell pre-loved goods, extend product lifecycles, and join
              a community that rewards conscious choices.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/browse">Browse Finds</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/sell">Start Selling</Link>
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Trusted sellers
              </div>
              <div className="flex items-center gap-2">
                <Recycle className="h-4 w-4" /> Circular economy
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4" /> Eco-rewards
              </div>
            </div>
          </div>
          <div className="relative">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-primary text-primary-foreground grid place-items-center">
                  <Sprout className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Your Eco-Impact</div>
                  <div className="text-sm text-muted-foreground">
                    Track your eco-score as you buy & sell
                  </div>
                </div>
              </div>
              <CardContent className="pt-6">
                {currentUser ? (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="rounded-lg border p-4">
                      <div className="text-2xl font-extrabold">
                        {currentUser.ecoScore}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Eco-score
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="text-2xl font-extrabold">A+</div>
                      <div className="text-xs text-muted-foreground">
                        Trust grade
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="text-2xl font-extrabold">0.0kg</div>
                      <div className="text-xs text-muted-foreground">
                        CO₂ saved (beta)
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Create an account to earn eco-scores, trust badges, and
                    track your impact.
                  </div>
                )}
              </CardContent>
            </Card>
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-12">
        <div className="container">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Featured Finds</h2>
          </div>
          {featured.length === 0 ? (
            <p className="mt-4 text-muted-foreground">
              No listings yet. Be the first to{" "}
              <Link className="text-primary underline" to="/sell">
                create a listing
              </Link>
              .
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* AI Advice section */}
      <AIAdvice />

      <section className="py-16">
        <div className="container grid gap-6 md:grid-cols-3">
          <Value
            icon={<Leaf className="h-6 w-6" />}
            title="Sustainability First"
            text="Every purchase extends a product's life and reduces waste."
          />
          <Value
            icon={<ShieldCheck className="h-6 w-6" />}
            title="Trust & Safety"
            text="Verified sellers and community badges build confidence."
          />
          <Value
            icon={<Recycle className="h-6 w-6" />}
            title="Community Impact"
            text="Gamified eco-scores and impact metrics keep you motivated."
          />
        </div>
      </section>

      {/* Trees saved section at bottom */}
      <TreesSaved />
    </div>
  );
}

function Value({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>
        <div className="font-semibold">{title}</div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
