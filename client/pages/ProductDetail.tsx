import { useParams } from "react-router-dom";
import { useProducts } from "@/state/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/state/cart";

export default function ProductDetail() {
  const { id } = useParams();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const product = products.find((p)=> p.id === id);

  if (!product) return <div className="container py-10"><p className="text-muted-foreground">Product not found.</p></div>;

  return (
    <div className="container py-8 grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border overflow-hidden">
        {product.imageDataUrl ? (
          <img src={product.imageDataUrl} alt={product.title} className="h-full w-full object-cover"/>
        ) : (
          <img src="/placeholder.svg" alt="placeholder" className="h-full w-full object-cover opacity-80"/>
        )}
      </div>
      <div>
        <div className="flex items-center gap-2"><Badge variant="secondary">{product.category}</Badge></div>
        <h1 className="mt-3 text-3xl font-extrabold">{product.title}</h1>
        <div className="mt-2 text-2xl font-semibold">${(product.price/100).toFixed(2)}</div>
        <p className="mt-4 text-muted-foreground">{product.description}</p>
        <div className="mt-6 flex gap-3">
          <Button onClick={()=> addToCart(product.id)}>Add to cart</Button>
        </div>
      </div>
    </div>
  );
}
