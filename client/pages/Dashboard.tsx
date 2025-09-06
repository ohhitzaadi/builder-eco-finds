import { useAuth } from "@/state/auth";
import { useProducts } from "@/state/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Link } from "react-router-dom";

function DashboardInner() {
  const { currentUser, updateProfile } = useAuth();
  const { products, remove } = useProducts();
  const myListings = products.filter((p)=> p.sellerId === currentUser!.id);

  const { register, handleSubmit } = useForm({ defaultValues: { username: currentUser!.username, bio: currentUser!.bio || "" } });

  const onSubmit = (v: any) => { updateProfile({ username: v.username, bio: v.bio }); alert("Profile updated"); };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button asChild><Link to="/sell">Create Listing</Link></Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
              <Input placeholder="Username" {...register("username" as const)} />
              <Textarea placeholder="Bio" rows={4} {...register("bio" as const)} />
              <Button type="submit">Save</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Eco & Trust</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border p-4">
                <div className="text-3xl font-extrabold">{currentUser!.ecoScore}</div>
                <div className="text-xs text-muted-foreground">Eco-score</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-3xl font-extrabold">A+</div>
                <div className="text-xs text-muted-foreground">Trust grade</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-3xl font-extrabold">0.0kg</div>
                <div className="text-xs text-muted-foreground">CO₂ saved</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">My Listings</h2>
        </div>
        {myListings.length === 0 ? (
          <p className="mt-2 text-muted-foreground">No listings yet. <Link className="text-primary underline" to="/sell">Create your first listing</Link>.</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {myListings.map((p)=> (
              <div key={p.id} className="rounded-lg border p-3">
                <Link to={`/product/${p.id}`} className="font-semibold line-clamp-1 hover:underline">{p.title}</Link>
                <div className="text-sm text-muted-foreground">${(p.price/100).toFixed(2)}</div>
                <div className="mt-2 flex gap-2">
                  <Button asChild variant="secondary" size="sm"><Link to={`/product/${p.id}`}>View</Link></Button>
                  <Button variant="destructive" size="sm" onClick={()=> remove(p.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardInner />
    </ProtectedRoute>
  );
}
