"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      // Label is theme-dependent, so it must also wait for mount to avoid a
      // server/client hydration mismatch (server can't know the resolved theme).
      aria-label={
        mounted
          ? isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
          : "Toggle theme"
      }
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {/* Render a stable placeholder until mounted to avoid hydration mismatch */}
      {mounted ? (
        isDark ? <Sun /> : <Moon />
      ) : (
        <Sun className="opacity-0" />
      )}
    </Button>
  );
}
