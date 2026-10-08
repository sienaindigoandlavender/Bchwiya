import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { LessonPlayer } from "@/components/LessonPlayer";
import { getContent } from "@/content";
import { t } from "@/i18n";
import { loadPath } from "@/lib/data";
import { findModule } from "@/lib/progress";
import { requireSession } from "@/lib/supabase/server";

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const content = getContent();
  const lesson = content.lessons.get(lessonId);
  if (!lesson) notFound();

  const { path } = await loadPath(await requireSession());
  const mod = findModule(path, lesson.moduleId);
  if (!mod) notFound();
  const state = mod.lessons.find((l) => l.id === lessonId);
  if (!state || state.status === "locked") redirect(`/module/${mod.id}`);

  const checks = lesson.checks
    .map((id) => content.questions.get(id))
    .filter((q) => q !== undefined);

  const position = mod.lessons.findIndex((l) => l.id === lessonId);
  const nextLesson = mod.lessons[position + 1];
  const next = nextLesson
    ? { href: `/lecon/${nextLesson.id}`, label: t("lesson.nextLesson") }
    : mod.hasTest
      ? { href: `/test/${mod.id}`, label: t("lesson.goToTest") }
      : null;

  return (
    <>
      <Link href={`/module/${mod.id}`} className="text-sm text-muted">
        ← {mod.title}
      </Link>
      <h1 className="text-2xl font-semibold">{lesson.title}</h1>
      <LessonPlayer lesson={lesson} checks={checks} moduleHref={`/module/${mod.id}`} next={next} />
    </>
  );
}
