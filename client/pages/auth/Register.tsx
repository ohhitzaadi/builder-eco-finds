import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/state/auth";
import { Link, useNavigate } from "react-router-dom";

const schema = z.object({ email: z.string().email(), password: z.string().min(6), username: z.string().min(2) });

type FormValues = z.infer<typeof schema>;

export default function Register() {
  const { register: signUp } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      await signUp(values.email, values.password, values.username);
      navigate("/dashboard");
    } catch (e: any) {
      alert(e.message || "Registration failed");
    }
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>Join EcoFinds and start buying & selling sustainably.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Input placeholder="Username" {...register("username" as const)} />
                {errors.username && <p className="mt-1 text-xs text-destructive">{errors.username.message}</p>}
              </div>
              <div>
                <Input placeholder="Email" type="email" {...register("email" as const)} />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div>
                <Input placeholder="Password" type="password" {...register("password" as const)} />
                {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
              </div>
              <Button className="w-full" disabled={isSubmitting}>Sign up</Button>
            </form>
            <p className="mt-4 text-sm text-muted-foreground">Already have an account? <Link to="/auth/login" className="text-primary underline">Log in</Link></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
