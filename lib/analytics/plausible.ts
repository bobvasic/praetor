export type PlausiblePropertyValue = string | number | boolean;
export type PlausibleProperties = Record<string, PlausiblePropertyValue | null | undefined>;

declare global {
  interface Window {
    plausible?: (
      eventName: string,
      options?: {
        props?: Record<string, PlausiblePropertyValue>;
        u?: string;
      },
    ) => void;
  }
}

function cleanValue(value: PlausiblePropertyValue) {
  return typeof value === "string" ? value.slice(0, 140) : value;
}

export function trackPlausible(eventName: string, props: PlausibleProperties = {}) {
  if (typeof window === "undefined") return;

  const cleanProps = Object.fromEntries(
    Object.entries(props)
      .filter((entry): entry is [string, PlausiblePropertyValue] => {
        const value = entry[1];
        return value !== null && value !== undefined && value !== "";
      })
      .map(([key, value]) => [key, cleanValue(value)]),
  );

  window.plausible?.(eventName, { props: cleanProps });
}
