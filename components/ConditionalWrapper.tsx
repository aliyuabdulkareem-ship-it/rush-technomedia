"use client";

import { usePathname } from "next/navigation";
import SiteWrapper from "./SiteWrapper";

export default function ConditionalWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // On any /admin route, we skip the SiteWrapper entirely (hides header, footer, and WhatsApp button)
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }
  return <SiteWrapper>{children}</SiteWrapper>;
}
