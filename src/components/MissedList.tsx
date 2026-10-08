import type { Question } from "@/content/schema";
import { t } from "@/i18n";

/** Corrections for missed questions: the question, the right answer, and why. */
export function MissedList({ questions }: { questions: Question[] }) {
  if (questions.length === 0) {
    return <p className="card font-medium">{t("result.allCorrect")}</p>;
  }
  return (
    <ul className="flex flex-col gap-3">
      {questions.map((q) => (
        <li key={q.id} className="flex flex-col gap-2 rounded-big bg-cloud p-5">
          <p className="font-serif text-[1.25rem] leading-snug">{q.prompt}</p>
          <ul className="flex flex-col items-start gap-1.5">
            {q.options
              .filter((o) => q.correct.includes(o.id))
              .map((o) => (
                <li
                  key={o.id}
                  className="rounded-card bg-mint px-3 py-1.5 text-[1rem] font-semibold"
                >
                  {o.text}
                </li>
              ))}
          </ul>
          <p className="text-[1rem] leading-relaxed">{q.explanation}</p>
        </li>
      ))}
    </ul>
  );
}
