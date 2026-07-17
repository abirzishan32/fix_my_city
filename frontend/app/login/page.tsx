"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AtSign, LockKeyhole } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiErrorMessage } from "@/lib/api";
import { AuthShell } from "@/components/auth-shell";
import { ErrorBanner, Field } from "@/components/form-field";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!loading && user) {
      router.replace(
        user.role === "ADMIN" ? "/admin/dashboard" : "/citizen/dashboard",
      );
    }
  }, [loading, user, router]);

  async function onSubmit(values: FormValues) {
    setFormError(null);
    try {
      const u = await login(values);
      router.replace(
        u.role === "ADMIN" ? "/admin/dashboard" : "/citizen/dashboard",
      );
    } catch (err) {
      setFormError(apiErrorMessage(err, "Invalid email or password."));
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to report and track civic issues."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {formError ? <ErrorBanner message={formError} /> : null}
        <Field label="Email" error={errors.email?.message} icon={AtSign}>
          <Input
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className="pl-9"
            {...register("email")}
          />
        </Field>
        <Field label="Password" error={errors.password?.message} icon={LockKeyhole}>
          <Input
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            className="pl-9"
            {...register("password")}
          />
        </Field>
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner /> Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to FixMyCity?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
