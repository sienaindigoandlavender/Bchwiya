import "server-only";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

const item = z.object({ id: z.string(), title: z.string(), body: z.string(), tip: z.string() });

export const carSchema = z.object({
  $comment: z.string().optional(),
  intro: z.string(),
  sections: z.object({
    cockpit: z.string(),
    lights: z.string(),
    mirrors: z.string(),
    engine: z.string(),
    start: z.string(),
  }),
  cockpit: z.array(item),
  lights: z.array(
    z.object({
      id: z.string(),
      color: z.enum(["red", "orange", "green", "blue"]),
      title: z.string(),
      body: z.string(),
      action: z.string(),
    }),
  ),
  mirrors: z.object({
    body: z.string(),
    tip: z.string(),
    show: z.string(),
    hide: z.string(),
    scooter: z.string(),
  }),
  engine: z.array(item),
  labels: z.object({
    red: z.string(),
    orange: z.string(),
    info: z.string(),
    mirrorsSee: z.string(),
    blindSpot: z.string(),
    previous: z.string(),
  }),
  start: z.object({ steps: z.array(z.string()).min(1), done: z.string(), reset: z.string() }),
});

export type CarContent = z.infer<typeof carSchema>;

/** Ma voiture content, from content/<locale>/car.json. */
export function getCarContent(locale: Locale = DEFAULT_LOCALE): CarContent {
  const file = path.join(process.cwd(), "content", locale, "car.json");
  return carSchema.parse(JSON.parse(fs.readFileSync(file, "utf8")));
}
