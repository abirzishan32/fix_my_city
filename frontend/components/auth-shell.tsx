import Link from "next/link";
import { ArrowLeft, CircleCheck } from "lucide-react";
import { Wordmark } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";

const POINTS = [
  "Report issues with a photo and precise map location",
  "Track every report from submitted to resolved",
  "Transparent status the whole community can see",
];

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative">
          <Wordmark href="/" tone="inverted" />
        </div>
        <div className="relative space-y-6">
          <h2 className="font-heading text-3xl font-semibold leading-tight">
            Cleaner streets start with a single report.
          </h2>
          <ul className="space-y-3">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3 text-primary-foreground/90">
                <CircleCheck className="mt-0.5 size-5 shrink-0" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-primary-foreground/70">
          Built for citizens and city administrators alike.
        </p>
      </aside>

      {/* Form column */}
      <div className="flex flex-col">
        <header className="flex items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Home
          </Link>
          <ThemeToggle />
        </header>
        <main className="flex flex-1 items-center justify-center px-4 pb-16 pt-4">
          <div className="w-full max-w-sm">
            <div className="mb-6 lg:hidden">
              <Wordmark href="/" />
            </div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              {title}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
