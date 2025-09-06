import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/state/types";

export default function ProductCard({ product }: { product: Product }) {
  const price = formatPrice(product.price);
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square bg-muted">
          {product.imageDataUrl ? (
            <img src={product.imageDataUrl} alt={product.title} className="h-full w-full object-cover"/>
          ) : (
            <img src="/placeholder.svg" alt="placeholder" className="h-full w-full object-cover opacity-80"/>
          )}
        </div>
      </Link>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold line-clamp-1">{product.title}</h3>
          <Badge variant="secondary">{product.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="font-semibold">{price}</div>
        <Link className="text-sm text-primary hover:underline" to={`/product/${product.id}`}>View</Link>
      </CardFooter>
    </Card>
  );
}
