"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AtSign, KeyRound, LockKeyhole, Phone, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiErrorMessage } from "@/lib/api";
import { AuthShell } from "@/components/auth-shell";
import { ErrorBanner, Field } from "@/components/form-field";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z
  .object({
    name: z.string().min(2, "Please enter your name"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    phone: z.string().min(6, "Enter a valid phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: signup, user, loading } = useAuth();
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
      await signup({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });
      router.replace("/citizen/dashboard");
    } catch (err) {
      setFormError(apiErrorMessage(err, "Could not create your account."));
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join FixMyCity to report and follow local issues."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {formError ? <ErrorBanner message={formError} /> : null}
        <Field label="Full name" error={errors.name?.message} icon={User}>
          <Input
            placeholder="Jane Doe"
            autoComplete="name"
            className="pl-9"
            {...register("name")}
          />
        </Field>
        <Field label="Email" error={errors.email?.message} icon={AtSign}>
          <Input
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className="pl-9"
            {...register("email")}
          />
        </Field>
        <Field label="Phone" error={errors.phone?.message} icon={Phone}>
          <Input
            type="tel"
            placeholder="01700000000"
            autoComplete="tel"
            className="pl-9"
            {...register("phone")}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Password" error={errors.password?.message} icon={LockKeyhole}>
            <Input
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              className="pl-9"
              {...register("password")}
            />
          </Field>
          <Field
            label="Confirm"
            error={errors.confirmPassword?.message}
            icon={KeyRound}
          >
            <Input
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              className="pl-9"
              {...register("confirmPassword")}
            />
          </Field>
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner /> Creating account…
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
