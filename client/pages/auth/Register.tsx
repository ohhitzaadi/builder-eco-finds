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
            <div className="flex flex-col gap-3 mb-3">
              <Button className="w-full flex items-center justify-center gap-2" variant="outline" onClick={() => signUpSocial('google')}>
                <img src="https://cdn.builder.io/api/v1/image/assets%2F06962a51b996448bbf203913336a012c%2F3fbe9c5eab2c4202aa97eb9ea78384bd?format=webp&width=80" alt="Google" className="h-5 w-5" />
                <span>Sign up with Google</span>
              </Button>
              <Button className="w-full flex items-center justify-center gap-2" variant="outline" onClick={() => signUpSocial('facebook')}>
                <img src="https://cdn.builder.io/api/v1/image/assets%2F06962a51b996448bbf203913336a012c%2Fb873904f92a94d6fb86d7815fa78d6b3?format=webp&width=80" alt="Facebook" className="h-5 w-5" />
                <span>Sign up with Facebook</span>
              </Button>
            </div>

            <div className="my-4 border-t" />

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
