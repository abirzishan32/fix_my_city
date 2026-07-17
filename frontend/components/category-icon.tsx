import {
  Construction,
  Droplets,
  Lightbulb,
  Megaphone,
  TrafficCone,
  Trash2,
} from "lucide-react";
import type { Category } from "@/types";

const ICONS: Record<Category, React.ComponentType<{ className?: string }>> = {
  POTHOLE: Construction,
  GARBAGE: Trash2,
  WATER_LEAKAGE: Droplets,
  BROKEN_LIGHT: Lightbulb,
  TRAFFIC: TrafficCone,
  OTHER: Megaphone,
};

export function CategoryIcon({
  category,
  className,
}: {
  category: Category;
  className?: string;
}) {
  const Icon = ICONS[category];
  return <Icon className={className} />;
}
