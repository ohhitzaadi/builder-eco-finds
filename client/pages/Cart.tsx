import { useCart } from "@/state/cart";
import { useProducts } from "@/state/products";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, checkout } = useCart();
  const { products } = useProducts();

  const items = cart.map((c) => ({ cartId: c.id, product: products.find((p)=> p.id === c.productId) }));
  const validItems = items.filter((i)=> i.product);
  const total = validItems.reduce((sum, i)=> sum + (i.product!.price), 0);

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold">Your Cart</h1>
      {validItems.length === 0 ? (
        <p className="mt-4 text-muted-foreground">Your cart is empty. <Link className="text-primary underline" to="/browse">Browse listings</Link>.</p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 space-y-3">
            {validItems.map(({ cartId, product })=> (
              <div key={cartId} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="h-16 w-16 overflow-hidden rounded bg-muted">
                  {product!.imageDataUrl ? (
                    <img src={product!.imageDataUrl} alt={product!.title} className="h-full w-full object-cover" />
                  ) : (
                    <img src="/placeholder.svg" alt="placeholder" className="h-full w-full object-cover opacity-80" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{product!.title}</div>
                  <div className="text-sm text-muted-foreground">{formatPrice(product!.price)}</div>
                </div>
                <Button variant="secondary" onClick={()=> removeFromCart(cartId)}>Remove</Button>
              </div>
            ))}
          </div>
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between font-semibold">
              <div>Total</div>
              <div>{formatPrice(total)}</div>
            </div>
            <Button className="mt-4 w-full" onClick={()=> checkout((id)=> products.find((p)=> p.id===id)?.price ?? 0)}>Checkout</Button>
            <p className="mt-2 text-xs text-muted-foreground">Checkout is a placeholder for now.</p>
          </div>
        </div>
      )}
    </div>
  );
}
