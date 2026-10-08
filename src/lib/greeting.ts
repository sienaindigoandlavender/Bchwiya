import type { MessageKey } from "@/i18n";

/** Darija greeting for the hour in Marrakech. */
export function greetingKey(now = new Date()): MessageKey {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: "Africa/Casablanca",
    }).format(now),
  );
  if (hour >= 5 && hour < 12) return "greet.morning";
  if (hour >= 12 && hour < 18) return "greet.day";
  return "greet.evening";
}
