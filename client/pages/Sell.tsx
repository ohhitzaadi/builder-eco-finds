import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProducts } from "@/state/products";
import { useAuth } from "@/state/auth";
import ProtectedRoute from "@/components/ProtectedRoute";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  category: z.string(),
  price: z.preprocess((v)=> Number(v), z.number().min(0).max(1_000_000)),
  image: z.any().optional(),
});

type FormValues = z.infer<typeof schema>;

function SellForm() {
  const { categories, create } = useProducts();
  const { currentUser } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { category: categories[0] } });

  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => { setValue("image", reader.result as string); };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (values: FormValues) => {
    if (!currentUser) return;
    create({ title: values.title, description: values.description, category: values.category as any, price: Math.round(values.price * 100), imageDataUrl: typeof values.image === "string" ? values.image : undefined }, currentUser.id);
    window.location.href = "/browse";
  };

  const imageData = watch("image");

  return (
    <div className="container py-8 max-w-2xl">
      <h1 className="text-2xl font-bold">Create Listing</h1>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Input placeholder="Title" {...register("title" as const)} />
          {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message as any}</p>}
        </div>
        <div>
          <Textarea placeholder="Description" rows={5} {...register("description" as const)} />
          {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description.message as any}</p>}
        </div>
        <div className="flex gap-2">
          <Select onValueChange={(v)=> setValue("category", v)} defaultValue={categories[0]}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              {categories.map((c)=> <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input type="number" step="0.01" min="0" placeholder="Price" {...register("price" as const)} />
        </div>
        <div>
          <input type="file" accept="image/*" onChange={(e)=> { const f = e.target.files?.[0]; if (f) onFile(f); }} />
          {imageData ? (
            <div className="mt-2 h-48 w-48 overflow-hidden rounded-md border"><img src={typeof imageData === "string" ? imageData : ""} alt="preview" className="h-full w-full object-cover"/></div>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">Optional: upload an image. A placeholder will be used if omitted.</p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting}>Publish</Button>
      </form>
    </div>
  );
}

export default function Sell() {
  return (
    <ProtectedRoute>
      <SellForm />
    </ProtectedRoute>
  );
}
