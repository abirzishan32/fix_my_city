"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CircleCheck, MapPin, MousePointerClick, Send } from "lucide-react";
import { issueService } from "@/services/issueService";
import { apiErrorMessage } from "@/lib/api";
import { CATEGORIES, SEVERITIES } from "@/types";
import { CATEGORY_LABELS, SEVERITY_LABELS } from "@/lib/constants";
import { PageHeader } from "@/components/page-header";
import { ErrorBanner, Field } from "@/components/form-field";
import { ImageUploader } from "@/components/ImageUploader";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const MapPicker = dynamic(() => import("@/components/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-72 w-full animate-pulse rounded-xl bg-muted" />
  ),
});

const schema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(120, "Keep the title under 120 characters"),
  description: z
    .string()
    .min(10, "Please describe the issue in a bit more detail"),
  category: z.enum([
    "POTHOLE",
    "GARBAGE",
    "WATER_LEAKAGE",
    "BROKEN_LIGHT",
    "TRAFFIC",
    "OTHER",
  ]),
  severity: z.enum(["LOW", "MEDIUM", "HIGH"]),
  address: z.string().max(200).optional(),
});
type FormValues = z.infer<typeof schema>;

export default function ReportIssuePage() {
  const router = useRouter();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [locationError, setLocationError] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { category: "POTHOLE", severity: "MEDIUM", address: "" },
  });

  function useCurrentLocation() {
    if (!("geolocation" in navigator)) {
      setLocationError("Geolocation isn't available in this browser.");
      return;
    }
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocationError("Couldn't get your location. Pick it on the map instead.");
        setLocating(false);
      },
    );
  }

  async function onSubmit(values: FormValues) {
    setFormError(null);
    if (!location) {
      setLocationError("Please select the issue location on the map.");
      return;
    }
    try {
      await issueService.create({
        title: values.title,
        description: values.description,
        category: values.category,
        severity: values.severity,
        latitude: location.lat,
        longitude: location.lng,
        address: values.address || undefined,
        image,
      });
      router.push("/citizen/issues");
    } catch (err) {
      setFormError(apiErrorMessage(err, "Could not submit your report."));
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title="Report an issue"
        description="Tell us what's wrong and where. Adding a photo helps administrators act faster."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {formError ? <ErrorBanner message={formError} /> : null}

        <section className="space-y-4 rounded-xl bg-card p-5 ring-1 ring-foreground/10">
          <Field label="Title" error={errors.title?.message}>
            <Input
              placeholder="e.g. Large pothole near the bus stop"
              {...register("title")}
            />
          </Field>
          <Field label="Description" error={errors.description?.message}>
            <Textarea
              rows={4}
              placeholder="Describe the problem, how long it's been there, and any safety concerns…"
              {...register("description")}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select {...register("category")}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Severity</Label>
              <Select {...register("severity")}>
                {SEVERITIES.map((s) => (
                  <option key={s} value={s}>
                    {SEVERITY_LABELS[s]}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </section>

        <section className="space-y-3 rounded-xl bg-card p-5 ring-1 ring-foreground/10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-heading text-base font-semibold">Location</h3>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MousePointerClick className="size-3.5" />
                Click the map to drop a pin
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={useCurrentLocation}
              disabled={locating}
            >
              {locating ? (
                <>
                  <Spinner /> Locating…
                </>
              ) : (
                <>
                  <MapPin className="size-4" /> Use my location
                </>
              )}
            </Button>
          </div>

          <MapPicker
            value={location}
            onChange={(lat, lng) => {
              setLocation({ lat, lng });
              setLocationError(null);
            }}
          />

          <div className="text-xs">
            {location ? (
              <span className="inline-flex items-center gap-1.5 text-foreground">
                <CircleCheck className="size-3.5 text-success" />
                Selected: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
              </span>
            ) : (
              <span className="text-muted-foreground">
                No location selected yet
              </span>
            )}
          </div>
          {locationError ? (
            <p className="text-xs text-destructive">{locationError}</p>
          ) : null}

          <Field
            label="Address / landmark (optional)"
            hint="Reverse geocoding is coming soon — add a nearby landmark to help."
          >
            <Input
              placeholder="e.g. Near City Hall, Main Street"
              {...register("address")}
            />
          </Field>
        </section>

        <section className="space-y-3 rounded-xl bg-card p-5 ring-1 ring-foreground/10">
          <div>
            <h3 className="font-heading text-base font-semibold">Photo</h3>
            <p className="text-sm text-muted-foreground">
              A picture helps administrators understand the issue.
            </p>
          </div>
          <ImageUploader value={image} onChange={setImage} />
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/citizen/dashboard")}
          >
            Cancel
          </Button>
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner /> Submitting…
              </>
            ) : (
              <>
                <Send className="size-4" /> Submit report
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
