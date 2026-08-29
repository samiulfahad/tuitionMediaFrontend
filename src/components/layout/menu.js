import { Home, FilePlus2, FileCog } from "lucide-react";

// Single source of truth for nav items — consumed by DesktopMenu (top bar)
// and MobileMenu (bottom bar + drawer). Order matters: MobileMenu shows the
// first 3 in its bottom bar and puts the rest behind the hamburger drawer.
export const menu = [
  { path: "/", label: "Home", icon: Home },
  { path: "/create-cv", label: "Create CV", icon: FilePlus2 },
  { path: "/manage-cv", label: "Manage CV", icon: FileCog },
];
