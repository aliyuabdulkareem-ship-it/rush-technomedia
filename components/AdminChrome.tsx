"use client";

import { useEffect } from "react";

export default function AdminChrome() {
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "admin-chrome-hide";
    style.textContent = "header, footer, nav { display: none !important; }";
    document.head.appendChild(style);
    return () => {
      const s = document.getElementById("admin-chrome-hide");
      if (s) s.remove();
    };
  }, []);
  return null;
}
