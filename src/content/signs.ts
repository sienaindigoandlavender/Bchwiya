import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { SIGN_PRESETS } from "@/components/diagrams/names";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

/** "Mes panneaux": one card per sign she can meet in the street. */
export const signsFileSchema = z.object({
  $comment: z.string().optional(),
  categories: z.array(z.object({ id: z.string(), title: z.string() })).min(1),
  signs: z
    .array(
      z.object({
        id: z.enum(SIGN_PRESETS),
        category: z.string(),
        meaning: z.string().min(1),
        todo: z.string().min(1),
        lessonId: z.string().optional(),
        check: z.object({
          prompt: z.string().min(1),
          options: z.array(z.object({ id: z.string(), text: z.string() })).min(2),
          correct: z.string(),
          explanation: z.string().min(1),
        }),
      }),
    )
    .min(1),
});

export type SignsContent = z.infer<typeof signsFileSchema>;
export type SignCard = SignsContent["signs"][number];

export function readSigns(locale: Locale = DEFAULT_LOCALE): SignsContent {
  const file = path.join(process.cwd(), "content", locale, "signs.json");
  return signsFileSchema.parse(JSON.parse(fs.readFileSync(file, "utf8")));
}

/** Broken links inside signs.json (categories, answers, lessons). */
export function checkSigns(s: SignsContent, lessonIds: Set<string>): string[] {
  const errors: string[] = [];
  const cats = new Set(s.categories.map((c) => c.id));
  const seen = new Set<string>();
  for (const sign of s.signs) {
    if (seen.has(sign.id)) errors.push(`signs.json: "${sign.id}" appears twice`);
    seen.add(sign.id);
    if (!cats.has(sign.category)) errors.push(`signs.json: "${sign.id}" has unknown category`);
    if (!sign.check.options.some((o) => o.id === sign.check.correct))
      errors.push(`signs.json: "${sign.id}" check answer is not one of its options`);
    if (sign.lessonId && !lessonIds.has(sign.lessonId))
      errors.push(`signs.json: "${sign.id}" points to missing lesson "${sign.lessonId}"`);
  }
  return errors;
}

let cache: SignsContent | null = null;
export function getSigns(): SignsContent {
  cache ??= readSigns();
  return cache;
}
