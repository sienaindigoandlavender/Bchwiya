"use client";

import { useMemo, useState, useTransition } from "react";
import { recordSignCheck, spotSign } from "@/app/actions";
import { t } from "@/i18n";
import { CheckIcon, Sparkle } from "@/components/ui/Icons";

/** "Je l'ai vu dans la rue". */
export function SpotButton({ signId, already }: { signId: string; already: boolean }) {
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();
  if (done) {
    return (
      <p className="pill fade-in bg-paper text-rose">
        <Sparkle size={14} /> {t("signs.spotted")}
      </p>
    );
  }
  return (
    <button
      type="button"
      className="btn"
      disabled={pending}
      onClick={() =>
        start(async () => {
          await spotSign(signId);
          setDone(true);
        })
      }
    >
      {already ? t("signs.spotAgain") : t("signs.spot")}
    </button>
  );
}

type Check = {
  prompt: string;
  options: { id: string; text: string }[];
  correct: string;
  explanation: string;
};

/** Same order every visit for a given sign, but not always the right answer first. */
function shuffled<T>(items: T[], seed: string): T[] {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) >>> 0;
    const j = h % (i + 1);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/** One calm question: pick, see the answer and why, move on. */
export function SignCheck({ signId, check }: { signId: string; check: Check }) {
  const options = useMemo(() => shuffled(check.options, signId), [check.options, signId]);
  const [picked, setPicked] = useState<string | null>(null);
  const answered = picked !== null;
  const right = picked === check.correct;
  const correctText = check.options.find((o) => o.id === check.correct)?.text ?? "";

  return (
    <section className="flex flex-col gap-3">
      <h2 className="title text-[1.625rem]">{t("signs.check")}</h2>
      <p className="font-serif text-[1.25rem] leading-snug">{check.prompt}</p>
      <ul className="flex flex-col gap-2">
        {options.map((o) => {
          const isRight = o.id === check.correct;
          const tone = !answered
            ? "bg-cloud"
            : isRight
              ? "bg-mint"
              : o.id === picked
                ? "bg-blush"
                : "bg-cloud";
          return (
            <li key={o.id}>
              <button
                type="button"
                disabled={answered}
                onClick={() => {
                  setPicked(o.id);
                  void recordSignCheck(signId, o.id);
                }}
                className={`flex w-full items-center gap-3 rounded-card px-4 py-3.5 text-start text-[1.0625rem] ${tone}`}
              >
                <span className="flex-1">{o.text}</span>
                {answered && isRight ? <CheckIcon size={18} /> : null}
              </button>
            </li>
          );
        })}
      </ul>
      {answered ? (
        <div className="fade-in rounded-card bg-paper px-1 py-1">
          <p className="font-semibold">
            {right ? t("signs.right") : `${t("signs.wrong")} ${correctText}`}
          </p>
          <p className="text-ink">{check.explanation}</p>
          <button
            type="button"
            className="mt-3 text-[0.9375rem] font-semibold text-rose"
            onClick={() => setPicked(null)}
          >
            {t("signs.retry")}
          </button>
        </div>
      ) : null}
    </section>
  );
}
