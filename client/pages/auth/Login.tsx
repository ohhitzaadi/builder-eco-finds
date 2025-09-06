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
  const { login, socialLogin } = useAuth();
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

  const handleSocial = async (provider: "google" | "facebook") => {
    try {
      await socialLogin(provider);
      const to = location.state?.from?.pathname || "/";
      navigate(to, { replace: true });
    } catch (e: any) {
      alert(e.message || "Social login failed");
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
            <div className="flex flex-col gap-3">
              <Button className="w-full flex items-center justify-center gap-2" variant="outline" onClick={() => handleSocial("google")}>
                <img src="https://cdn.builder.io/api/v1/image/assets%2F06962a51b996448bbf203913336a012c%2F3fbe9c5eab2c4202aa97eb9ea78384bd?format=webp&width=80" alt="Google" className="h-5 w-5" />
                <span>Sign in with Google</span>
              </Button>

              <Button className="w-full flex items-center justify-center gap-2" variant="outline" onClick={() => handleSocial("facebook")}>
                <img src="https://cdn.builder.io/api/v1/image/assets%2F06962a51b996448bbf203913336a012c%2Fb873904f92a94d6fb86d7815fa78d6b3?format=webp&width=80" alt="Facebook" className="h-5 w-5" />
                <span>Sign in with Facebook</span>
              </Button>
            </div>

            <div className="my-4 border-t" />

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
