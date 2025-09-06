import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/state/auth";
import { Link, useNavigate } from "react-router-dom";

const passwordRules = z.string().min(12, { message: "Password must be at least 12 characters" }).refine((val) => /[a-z]/.test(val), { message: "Password must contain a lowercase letter" }).refine((val) => /[A-Z]/.test(val), { message: "Password must contain an uppercase letter" }).refine((val) => /[0-9]/.test(val), { message: "Password must contain a number" }).refine((val) => /[^A-Za-z0-9]/.test(val), { message: "Password must contain a symbol" });

const schema = z
  .object({
    username: z.string().min(2),
    email: z.string().email(),
    password: passwordRules,
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

type FormValues = z.infer<typeof schema>;

export default function Register() {
  const { register: signUp, socialLogin } = useAuth();
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

  const signUpSocial = async (provider: "google" | "facebook") => {
    try {
      await socialLogin(provider);
      navigate("/dashboard");
    } catch (e: any) {
      alert(e.message || "Social signup failed");
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
                <p className="mt-2 text-xs text-muted-foreground">A good password is long (at least 12-14 characters), a mix of uppercase and lowercase letters, numbers, and symbols, and doesn't contain dictionary words, personal information, or easily guessable patterns.</p>
                {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
              </div>
              <div>
                <Input placeholder="Confirm password" type="password" {...register("passwordConfirm" as const)} />
                {errors.passwordConfirm && <p className="mt-1 text-xs text-destructive">{errors.passwordConfirm.message}</p>}
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
