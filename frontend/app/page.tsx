import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { Wordmark } from "@/components/brand";
import { PublicHeader } from "@/components/public-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Report",
    body: "Snap a photo, drop a pin on the map, and describe the problem in under a minute.",
  },
  {
    icon: TrendingUp,
    title: "Track",
    body: "Follow each report as it moves from submitted, to in progress, to resolved.",
  },
  {
    icon: ShieldCheck,
    title: "Resolve",
    body: "City administrators review, prioritize, and close issues out in the open.",
  },
];

const VALUES = [
  { icon: ShieldCheck, label: "Trust", body: "Accountable, verifiable records." },
  { icon: MapPin, label: "Transparency", body: "Open status on every report." },
  { icon: Users, label: "Community", body: "Built around neighborhoods." },
  { icon: TrendingUp, label: "Reliability", body: "Dependable and always on." },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
              backgroundSize: "26px 26px",
            }}
          />
          <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-success" />
              Civic issue reporting, made simple
            </span>
            <h1 className="mx-auto mt-6 max-w-3xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Report city problems.{" "}
              <span className="text-primary">Watch them get fixed.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              FixMyCity connects residents and administrators so potholes, broken
              lights, and garbage get resolved — transparently, and on the record.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
              >
                Report an issue
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full sm:w-auto",
                )}
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-border/60 bg-muted/20">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
                How it works
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Three simple steps from problem to resolution.
              </p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="rounded-xl bg-card p-6 ring-1 ring-foreground/10"
                  >
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <div className="mt-4 text-xs font-medium text-muted-foreground">
                      Step {i + 1}
                    </div>
                    <h3 className="mt-1 font-heading text-lg font-semibold">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="border-t border-border/60">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((value) => {
                const Icon = value.icon;
                return (
                  <div key={value.label} className="flex gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-heading text-sm font-semibold">
                        {value.label}
                      </h3>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {value.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border/60 bg-muted/20">
          <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
            <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
              Ready to improve your neighborhood?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Create a free account and file your first report in under a minute.
            </p>
            <div className="mt-6">
              <Link href="/register" className={cn(buttonVariants({ size: "lg" }))}>
                Get started
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <Wordmark />
          <p>© 2026 FixMyCity — a civic technology platform.</p>
        </div>
      </footer>
    </div>
  );
}
