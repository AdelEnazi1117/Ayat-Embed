"use client";

import { useEffect } from "react";

type Payload = Record<string, unknown>;

const getUmami = ():
  | { track?: (event: string, data?: Payload) => void }
  | undefined =>
  typeof window !== "undefined"
    ? (
        window as unknown as {
          umami?: { track?: (event: string, data?: Payload) => void };
        }
      ).umami
    : undefined;

export const slugify = (value: string): string =>
  (value ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "unknown";

const track = (eventName: string, data?: Payload) => {
  const umami = getUmami();
  if (!umami || typeof umami.track !== "function") return;

  try {
    umami.track(eventName, data);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Umami track failed", error);
    }
  }
};

export const trackEvent = (eventName: string, data?: Payload) =>
  track(slugify(eventName), { label: eventName, ...data });

export const trackCTA = (name: string, data?: Payload) =>
  track(`cta_${slugify(name)}`, { cta: name, ...data });

export const trackSocial = (platform: string, url?: string, data?: Payload) =>
  track(`social_${slugify(platform)}`, { platform, url, ...data });

export const trackOutbound = (label: string, url?: string, data?: Payload) =>
  track(`outbound_${slugify(label)}`, { label, url, ...data });

export const trackProfileInteraction = (
  action: "view" | "click",
  target: string,
  data?: Payload
) => track(`profile_${action}_${slugify(target)}`, { action, target, ...data });

export function usePageAnalytics(options?: { pageName?: string }) {
  const pageName = options?.pageName;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const path = window.location.pathname;

    trackEvent("page_ready", { path, page: pageName });

    const engagementTimer = window.setTimeout(() => {
      trackEvent("engaged_10s", { path, page: pageName });
    }, 10_000);

    const thresholds = [25, 50, 75, 90];
    const fired = new Set<number>();

    const handleScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight = Math.max(doc.scrollHeight - doc.clientHeight, 0);
      if (scrollHeight <= 0) return;

      const percent = Math.min(
        100,
        Math.round((scrollTop / scrollHeight) * 100)
      );
      thresholds.forEach((threshold) => {
        if (!fired.has(threshold) && percent >= threshold) {
          fired.add(threshold);
          trackEvent(`scroll_${threshold}`, {
            depth: threshold,
            path,
            page: pageName,
          });
        }
      });

      if (fired.size === thresholds.length) {
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      clearTimeout(engagementTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pageName]);
}
