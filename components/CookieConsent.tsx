"use client";

import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";
import Link from "next/link";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setTimeout(() => setShow(true), 1000);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-[400px] z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="bg-surface-container/95 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-5 shadow-2xl relative">
        <button onClick={decline} className="absolute top-3 right-3 text-outline hover:text-on-surface transition-colors">
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary-container/20 text-primary mt-1">
            <Cookie className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-label-md text-on-surface font-bold mb-1">We value your privacy</h4>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              We use cookies to enhance your browsing experience and analyze site traffic. 
              <Link href="/legal/cookies" className="text-primary hover:underline ml-1">Learn more</Link>.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={decline} className="flex-1 py-2.5 rounded-lg border border-outline-variant/40 text-body-sm font-semibold text-on-surface hover:bg-surface-container-high transition-colors">
            Decline
          </button>
          <button onClick={accept} className="flex-1 py-2.5 rounded-lg bg-primary-container text-white text-body-sm font-bold hover:brightness-110 transition-colors shadow-lg shadow-primary-container/20">
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
