"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_MB = 10;

export function ImageUploader({
  value,
  onChange,
  className,
}: {
  value: File | null;
  onChange: (file: File | null) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep an object-URL preview in sync with the selected file; revoke on cleanup.
  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  function accept(file: File | null) {
    setError(null);
    if (!file) {
      onChange(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_MB} MB.`);
      return;
    }
    onChange(file);
  }

  function clear() {
    accept(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => accept(e.target.files?.[0] ?? null)}
      />

      {preview ? (
        <div className="group relative overflow-hidden rounded-xl ring-1 ring-foreground/10">
          {/* preview of the user's not-yet-uploaded file */}
          <img
            src={preview}
            alt="Selected preview"
            className="max-h-64 w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/60 to-transparent p-3">
            <span className="truncate text-xs text-white/90">
              {value?.name}
            </span>
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur transition-colors hover:bg-white/25"
            >
              <Trash2 className="size-3.5" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            accept(e.dataTransfer.files?.[0] ?? null);
          }}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-10 text-center transition-colors",
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border bg-muted/30 hover:bg-muted/50",
          )}
        >
          <span className="flex size-11 items-center justify-center rounded-full bg-background ring-1 ring-border">
            <ImagePlus className="size-5 text-muted-foreground" />
          </span>
          <span className="text-sm font-medium">
            Drop a photo here, or{" "}
            <span className="text-primary">browse</span>
          </span>
          <span className="text-xs text-muted-foreground">
            PNG or JPG, up to {MAX_MB} MB (optional)
          </span>
        </button>
      )}

      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
