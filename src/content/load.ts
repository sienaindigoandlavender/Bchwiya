import fs from "node:fs";
import path from "node:path";
import {
  lessonSchema,
  levelsFileSchema,
  questionFileSchema,
  rulesFileSchema,
  type Lesson,
  type Media,
  type Level,
  type Module,
  type Question,
  type Rule,
} from "./schema";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { SCENE_NAMES, SIGN_PRESETS } from "@/components/diagrams/names";

export type Content = {
  locale: Locale;
  levels: Level[];
  rules: Rule[];
  lessons: Map<string, Lesson>;
  questions: Map<string, Question>;
  /** Module ids in path order. */
  moduleOrder: string[];
  modules: Map<string, Module & { levelId: string }>;
  questionsByModule: Map<string, Question[]>;
};

const CONTENT_ROOT = path.join(process.cwd(), "content");

function readJson(file: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (err) {
    throw new Error(`Cannot read ${path.relative(process.cwd(), file)}: ${String(err)}`);
  }
}

function parse<T>(schema: { parse: (v: unknown) => T }, file: string): T {
  try {
    return schema.parse(readJson(file));
  } catch (err) {
    throw new Error(`Invalid content in ${path.relative(process.cwd(), file)}:\n${String(err)}`);
  }
}

function jsonFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => path.join(dir, f));
}

/** Reads and schema-validates every content file. Does not check cross-references. */
export function readContent(locale: Locale = DEFAULT_LOCALE): Content {
  const root = path.join(CONTENT_ROOT, locale);
  const { levels } = parse(levelsFileSchema, path.join(root, "levels.json"));
  const { rules } = parse(rulesFileSchema, path.join(root, "rules.json"));

  const lessons = new Map<string, Lesson>();
  for (const file of jsonFiles(path.join(root, "lessons"))) {
    const lesson = parse(lessonSchema, file);
    if (path.basename(file, ".json") !== lesson.id) {
      throw new Error(`${file}: file name must match lesson id "${lesson.id}"`);
    }
    lessons.set(lesson.id, lesson);
  }

  const questions = new Map<string, Question>();
  const questionsByModule = new Map<string, Question[]>();
  for (const file of jsonFiles(path.join(root, "questions"))) {
    const data = parse(questionFileSchema, file);
    if (path.basename(file, ".json") !== data.moduleId) {
      throw new Error(`${file}: file name must match moduleId "${data.moduleId}"`);
    }
    for (const q of data.questions) {
      if (questions.has(q.id)) throw new Error(`Duplicate question id "${q.id}"`);
      if (q.moduleId !== data.moduleId) {
        throw new Error(`${file}: question "${q.id}" has moduleId "${q.moduleId}"`);
      }
      questions.set(q.id, q);
    }
    questionsByModule.set(data.moduleId, data.questions);
  }

  const modules = new Map<string, Module & { levelId: string }>();
  const moduleOrder: string[] = [];
  for (const level of levels) {
    for (const mod of level.modules) {
      modules.set(mod.id, { ...mod, levelId: level.id });
      moduleOrder.push(mod.id);
    }
  }

  return { locale, levels, rules, lessons, questions, moduleOrder, modules, questionsByModule };
}

/** Returns a list of broken cross-references. Empty means the content is sound. */
function checkMedia(where: string, media: Media | undefined, errors: string[]) {
  if (!media || media.kind !== "svg") return;
  const props = media.props ?? {};
  if (media.component === "Sign" && !(SIGN_PRESETS as readonly unknown[]).includes(props.preset)) {
    errors.push(`${where}: unknown sign preset "${String(props.preset)}"`);
  }
  if (media.component === "Scene" && !(SCENE_NAMES as readonly unknown[]).includes(props.name)) {
    errors.push(`${where}: unknown scene "${String(props.name)}"`);
  }
}

export function checkReferences(c: Content): string[] {
  const errors: string[] = [];
  const levelIds = new Set(c.levels.map((l) => l.id));
  const ruleIds = new Set<string>();

  for (const rule of c.rules) {
    if (ruleIds.has(rule.id)) errors.push(`rules.json: duplicate rule id "${rule.id}"`);
    ruleIds.add(rule.id);
    if (!levelIds.has(rule.levelId)) {
      errors.push(`rules.json: rule "${rule.id}" has unknown levelId "${rule.levelId}"`);
    }
  }

  const seenModules = new Set<string>();
  const referencedLessons = new Set<string>();
  for (const level of c.levels) {
    for (const mod of level.modules) {
      if (seenModules.has(mod.id)) errors.push(`levels.json: duplicate module id "${mod.id}"`);
      seenModules.add(mod.id);
      for (const lessonId of mod.lessonIds) {
        referencedLessons.add(lessonId);
        const lesson = c.lessons.get(lessonId);
        if (!lesson)
          errors.push(`levels.json: module "${mod.id}" lists missing lesson "${lessonId}"`);
        else if (lesson.moduleId !== mod.id) {
          errors.push(
            `lesson "${lessonId}" has moduleId "${lesson.moduleId}", listed under "${mod.id}"`,
          );
        }
      }
    }
  }

  for (const lesson of c.lessons.values()) {
    if (!referencedLessons.has(lesson.id)) {
      errors.push(`lesson "${lesson.id}" is not listed in levels.json`);
    }
    for (const r of lesson.ruleIds) {
      if (!ruleIds.has(r)) errors.push(`lesson "${lesson.id}": unknown ruleId "${r}"`);
    }
    for (const q of lesson.checks) {
      if (!c.questions.has(q)) errors.push(`lesson "${lesson.id}": check "${q}" is not a question`);
    }
    lesson.screens.forEach((s, i) =>
      checkMedia(`lesson "${lesson.id}" screen ${i + 1}`, s.media, errors),
    );
  }

  for (const [moduleId] of c.questionsByModule) {
    if (!seenModules.has(moduleId)) errors.push(`questions/${moduleId}.json: unknown module`);
  }

  for (const q of c.questions.values()) {
    const optionIds = new Set(q.options.map((o) => o.id));
    if (optionIds.size !== q.options.length)
      errors.push(`question "${q.id}": duplicate option ids`);
    for (const id of q.correct) {
      if (!optionIds.has(id)) errors.push(`question "${q.id}": correct "${id}" is not an option`);
    }
    for (const r of q.ruleIds) {
      if (!ruleIds.has(r)) errors.push(`question "${q.id}": unknown ruleId "${r}"`);
    }
    checkMedia(`question "${q.id}"`, q.media, errors);
    if (
      q.media?.kind === "image" &&
      !fs.existsSync(path.join(process.cwd(), "public/images", q.media.src))
    ) {
      errors.push(`question "${q.id}": image "${q.media.src}" not found in public/images`);
    }
  }

  return errors;
}
