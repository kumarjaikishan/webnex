import {
  Globe,
  Building2,
  GraduationCap,
  HeartPulse,
  Boxes,
  Users,
  LayoutDashboard,
  CalendarCheck,
  UtensilsCrossed,
  Home,
  MousePointerClick,
  Layers,
  Newspaper,
  Code2,
  RefreshCcw,
  ShieldCheck,
  Gauge,
  Search,
  Link2,
  Server,
  type LucideIcon,
} from "lucide-react";

// Explicit named imports (rather than `import * as Icons`) so bundlers can
// tree-shake unused icons out of the production build.
export const iconMap: Record<string, LucideIcon> = {
  Globe,
  Building2,
  GraduationCap,
  HeartPulse,
  Boxes,
  Users,
  LayoutDashboard,
  CalendarCheck,
  UtensilsCrossed,
  Home,
  MousePointerClick,
  Layers,
  Newspaper,
  Code2,
  RefreshCcw,
  ShieldCheck,
  Gauge,
  Search,
  Link2,
  Server,
};

export function getServiceIcon(name: string): LucideIcon {
  return iconMap[name] ?? Globe;
}
