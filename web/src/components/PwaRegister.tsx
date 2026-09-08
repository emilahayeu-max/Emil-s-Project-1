"use client";

import { useEffect } from "react";

/** Регистрация service worker и ссылка на манифест (PWA, фаза 2) */
export default function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
      navigator.serviceWorker.register(`${base}/sw.js`).catch((e) => {
        console.warn("stoa: регистрация service worker не удалась", e);
      });
    }
  }, []);

  return null;
}
