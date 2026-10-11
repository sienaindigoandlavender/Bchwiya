// Each family of signs wears one pastel from the design system.
export const SIGN_TINT: Record<string, string> = {
  priorite: "bg-butter",
  danger: "bg-peach",
  interdiction: "bg-blush",
  obligation: "bg-sky",
  indication: "bg-lilac",
};

const TZ = "Africa/Casablanca";
export const shortDate = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, day: "numeric", month: "long" }).format(
    new Date(iso),
  );
