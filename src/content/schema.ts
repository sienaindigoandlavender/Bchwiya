import { z } from "zod";
import { DIAGRAM_NAMES } from "@/components/diagrams/names";

export const mediaSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("svg"),
    component: z.enum(DIAGRAM_NAMES),
    props: z.record(z.string(), z.unknown()).optional(),
  }),
  z.object({
    kind: z.literal("image"),
    // Path relative to public/images/
    src: z.string().min(1),
    alt: z.string().optional(),
  }),
  z.object({ kind: z.literal("none") }),
]);

export const screenSchema = z.object({
  type: z.enum(["text", "keypoint"]),
  body: z.string().min(1),
  media: mediaSchema.optional(),
});

export const lessonSchema = z.object({
  $comment: z.string().optional(),
  id: z.string().min(1),
  moduleId: z.string().min(1),
  title: z.string().min(1),
  minutes: z.number().int().positive(),
  ruleIds: z.array(z.string()),
  screens: z.array(screenSchema).min(1),
  checks: z.array(z.string()).max(3),
});

export const optionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
});

export const questionSchema = z.object({
  id: z.string().min(1),
  moduleId: z.string().min(1),
  ruleIds: z.array(z.string()).min(1),
  prompt: z.string().min(1),
  media: mediaSchema.optional(),
  options: z.array(optionSchema).min(2),
  correct: z.array(z.string()).min(1),
  explanation: z.string().min(1),
});

export const questionFileSchema = z.object({
  $comment: z.string().optional(),
  moduleId: z.string().min(1),
  questions: z.array(questionSchema),
});

export const ruleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  levelId: z.string().min(1),
});

export const moduleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  lessonIds: z.array(z.string()).min(1),
});

export const levelSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  modules: z.array(moduleSchema).min(1),
});

export const levelsFileSchema = z.object({ levels: z.array(levelSchema).min(1) });
export const rulesFileSchema = z.object({ rules: z.array(ruleSchema) });

export type Media = z.infer<typeof mediaSchema>;
export type Screen = z.infer<typeof screenSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Rule = z.infer<typeof ruleSchema>;
export type Module = z.infer<typeof moduleSchema>;
export type Level = z.infer<typeof levelSchema>;
