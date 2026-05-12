"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackPlausible, type PlausibleProperties } from "@/lib/analytics/plausible";

const SCROLL_DEPTHS = [25, 50, 75, 90] as const;
const ENGAGEMENT_SECONDS = [15, 30, 60, 120, 180] as const;

function getRouteGroup(pathname: string) {
  if (pathname === "/") return "landing";
  if (pathname.startsWith("/app")) return "devnet_app";
  if (pathname.startsWith("/dashboard")) return "dashboard";
  if (pathname.startsWith("/demo")) return "guided_demo";
  return "other";
}

function getViewportClass() {
  const width = window.innerWidth;
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

function getReferrerDomain() {
  if (!document.referrer) return "direct";
  try {
    return new URL(document.referrer).hostname;
  } catch {
    return "unknown";
  }
}

function getCampaignProps() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_content: params.get("utm_content"),
    utm_term: params.get("utm_term"),
  };
}

function getText(element: Element) {
  return (
    element.getAttribute("data-analytics-label") ??
    element.getAttribute("aria-label") ??
    element.textContent ??
    ""
  )
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
}

function sanitizePath(pathname: string) {
  return pathname.replace(/[1-9A-HJ-NP-Za-km-z]{32,}/g, ":id");
}

function getPageProps(pathname: string): PlausibleProperties {
  return {
    path: pathname,
    route_group: getRouteGroup(pathname),
    page_title: document.title,
    viewport: getViewportClass(),
  };
}

function getLinkProps(anchor: HTMLAnchorElement, pathname: string): PlausibleProperties {
  const url = new URL(anchor.href, window.location.href);
  const outbound = url.origin !== window.location.origin;

  return {
    ...getPageProps(pathname),
    label: getText(anchor) || "unlabeled_link",
    link_type: outbound ? "outbound" : "internal",
    link_domain: outbound ? url.hostname : "internal",
    link_path: outbound ? sanitizePath(url.pathname) : sanitizePath(url.pathname || "/"),
    target: anchor.target || "same_tab",
  };
}

export function PlausibleAnalytics() {
  const pathname = usePathname() ?? "/";
  const scrollDepths = useRef<Set<number>>(new Set());
  const trackedVisibilityEnd = useRef(false);

  useEffect(() => {
    const startedAt = Date.now();
    scrollDepths.current = new Set();
    trackedVisibilityEnd.current = false;

    trackPlausible("Page Context", {
      ...getPageProps(pathname),
      referrer_domain: getReferrerDomain(),
      ...getCampaignProps(),
    });

    const timers = ENGAGEMENT_SECONDS.map((seconds) =>
      window.setTimeout(() => {
        trackPlausible("Engaged Visit", {
          ...getPageProps(pathname),
          seconds,
        });
      }, seconds * 1000),
    );

    function trackRouteDuration() {
      if (trackedVisibilityEnd.current) return;
      const seconds = Math.round((Date.now() - startedAt) / 1000);
      if (seconds >= 3) {
        trackedVisibilityEnd.current = true;
        trackPlausible("Route Duration", {
          ...getPageProps(pathname),
          seconds,
        });
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") trackRouteDuration();
    }

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      document.removeEventListener("visibilitychange", onVisibilityChange);
      trackRouteDuration();
    };
  }, [pathname]);

  useEffect(() => {
    function onScroll() {
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (documentHeight <= 0) return;

      const percent = Math.min(100, Math.round((window.scrollY / documentHeight) * 100));
      SCROLL_DEPTHS.forEach((depth) => {
        if (percent >= depth && !scrollDepths.current.has(depth)) {
          scrollDepths.current.add(depth);
          trackPlausible("Scroll Depth", {
            ...getPageProps(pathname),
            depth,
          });
        }
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      const tagged = target.closest<HTMLElement>("[data-analytics-event]");
      if (tagged) {
        trackPlausible(tagged.dataset.analyticsEvent ?? "Tagged Interaction", {
          ...getPageProps(pathname),
          label: getText(tagged),
        });
        return;
      }

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (anchor) {
        const props = getLinkProps(anchor, pathname);
        trackPlausible(props.link_type === "outbound" ? "Outbound Link Click" : "Internal Link Click", props);
        return;
      }

      const button = target.closest<HTMLButtonElement>("button,[role='button']");
      if (button) {
        trackPlausible("Button Click", {
          ...getPageProps(pathname),
          label: getText(button) || "unlabeled_button",
        });
      }
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  return null;
}
