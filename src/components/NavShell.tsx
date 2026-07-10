"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";

export function NavShell() {
  const pathname = usePathname();
  const variant = pathname === "/" ? "dark" : "light";
  return <Navbar variant={variant} />;
}
