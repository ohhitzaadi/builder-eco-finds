import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/state/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });

type FormValues = z.infer<typeof schema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      await login(values.email, values.password);
      const to = location.state?.from?.pathname || "/";
      navigate(to, { replace: true });
    } catch (e: any) {
      alert(e.message || "Login failed");
    }
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Log in to continue your sustainable journey.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Input placeholder="Email" type="email" {...register("email" as const)} />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div>
                <Input placeholder="Password" type="password" {...register("password" as const)} />
                {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
              </div>
              <Button className="w-full" disabled={isSubmitting}>Log in</Button>
            </form>
            <p className="mt-4 text-sm text-muted-foreground">No account? <Link to="/auth/register" className="text-primary underline">Sign up</Link></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
