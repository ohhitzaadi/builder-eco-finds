import { useCart } from "@/state/cart";
import { useProducts } from "@/state/products";

export default function Purchases() {
  const { purchases } = useCart();
  const { products } = useProducts();

  const items = purchases.map((p)=> ({ purchase: p, product: products.find((x)=> x.id === p.productId) })).filter((i)=> i.product);

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold">Previous Purchases</h1>
      {items.length === 0 ? (
        <p className="mt-4 text-muted-foreground">No purchases yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-3">
          {items.map(({ purchase, product })=> (
            <div key={purchase.id} className="flex items-center gap-3 rounded-lg border p-3">
              <div className="h-16 w-16 overflow-hidden rounded bg-muted">
                {product!.imageDataUrl ? (
                  <img src={product!.imageDataUrl} alt={product!.title} className="h-full w-full object-cover" />
                ) : (
                  <img src="/placeholder.svg" alt="placeholder" className="h-full w-full object-cover opacity-80" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{product!.title}</div>
                <div className="text-sm text-muted-foreground">Purchased on {new Date(purchase.purchasedAt).toLocaleString()}</div>
              </div>
              <div className="font-semibold">${(purchase.priceAtPurchase/100).toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
