"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { trackPageView } from "@/app/actions";

/** Logs each screen Zahra opens to her journal. Invisible. */
export function PageTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.startsWith("/admin")) return; // Jacqueline's visits stay out of the journal
    void trackPageView(pathname).catch(() => {});
  }, [pathname]);
  return null;
}
