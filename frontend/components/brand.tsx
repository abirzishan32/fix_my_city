import Link from "next/link";
import { cn } from "@/lib/utils";

type Tone = "brand" | "inverted";

export function Logo({
  className,
  tone = "brand",
}: {
  className?: string;
  tone?: Tone;
}) {
  return (
    <span
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-xl shadow-sm",
        tone === "inverted"
          ? "bg-white/15 text-white ring-1 ring-white/25"
          : "bg-primary text-primary-foreground",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-5">
        <path
          d="M12 2c-3.87 0-7 3.13-7 7 0 4.76 6.1 12.16 6.36 12.47a.83.83 0 0 0 1.28 0C12.9 21.16 19 13.76 19 9c0-3.87-3.13-7-7-7Z"
          fill="currentColor"
          opacity="0.22"
        />
        <path
          d="M8.6 9.4 11 11.8l4.4-4.4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function Wordmark({
  className,
  href = "/",
  tone = "brand",
}: {
  className?: string;
  href?: string;
  tone?: Tone;
}) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <Logo tone={tone} />
      <span
        className={cn(
          "font-heading text-lg font-semibold tracking-tight",
          tone === "inverted" && "text-white",
        )}
      >
        Fix
        <span className={tone === "inverted" ? undefined : "text-primary"}>
          My
        </span>
        City
      </span>
    </Link>
  );
}
