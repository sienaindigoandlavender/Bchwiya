"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { askPhoto, type PhotoResult } from "@/app/actions";
import { t, type MessageKey } from "@/i18n";
import { CameraIcon, ChevronIcon, Sparkle } from "@/components/ui/Icons";

/** Shrinks the photo in the browser so it travels light (long side ≤ 1400px, JPEG). */
async function shrink(file: File): Promise<{ base64: string; mediaType: string; preview: string }> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const scale = Math.min(1, 1400 / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    const preview = canvas.toDataURL("image/jpeg", 0.85);
    return { base64: preview.split(",")[1]!, mediaType: "image/jpeg", preview };
  } finally {
    URL.revokeObjectURL(url);
  }
}

const VERDICT_KEY: Record<string, MessageKey> = {
  juste: "photo.verdict.juste",
  presque: "photo.verdict.presque",
  "pas-juste": "photo.verdict.pasJuste",
  "sans-idee": "photo.verdict.sansIdee",
};

export function PhotoQuestion() {
  const input = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<{ base64: string; mediaType: string; preview: string } | null>(
    null,
  );
  const [question, setQuestion] = useState("");
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState<PhotoResult | null>(null);
  const [pending, start] = useTransition();

  function reset() {
    setPhoto(null);
    setQuestion("");
    setGuess("");
    setResult(null);
    if (input.current) input.current.value = "";
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setResult(null);
    try {
      setPhoto(await shrink(file));
    } catch {
      setResult({ ok: false, reason: "failed" });
    }
  }

  if (result?.ok) {
    const { answer, lessons } = result;
    return (
      <div className="fade-in flex flex-col gap-4">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo.preview}
            alt=""
            className="max-h-64 w-full rounded-big object-contain bg-cloud"
          />
        ) : null}
        {guess ? (
          <section className="card flex flex-col gap-1 bg-cloud">
            <h2 className="text-[1rem] font-semibold text-ink">{t("photo.yourIdea")}</h2>
            <p className="text-[1.0625rem]">{guess}</p>
          </section>
        ) : null}
        <section className="card flex flex-col gap-3 bg-mint">
          <p className="pill self-start bg-paper text-ink">
            <Sparkle size={14} /> {t(VERDICT_KEY[answer.verdict] ?? "photo.verdict.sansIdee")}
          </p>
          <p className="font-serif text-[1.375rem] leading-snug">{answer.answer}</p>
          {answer.why ? <p className="text-[1.0625rem] leading-relaxed">{answer.why}</p> : null}
        </section>
        {lessons.length ? (
          <section className="flex flex-col gap-2">
            <h2 className="title text-[1.5rem]">{t("photo.lessons")}</h2>
            {lessons.map((l) => (
              <Link
                key={l.id}
                href={`/lecon/${l.id}`}
                className="flex items-center gap-3 rounded-card bg-blush px-5 py-4 font-medium"
              >
                <span className="flex-1">{l.title}</span>
                <ChevronIcon size={18} />
              </Link>
            ))}
          </section>
        ) : null}
        <p className="text-[0.9375rem] text-ink">{t("photo.note")}</p>
        <button type="button" className="btn self-start" onClick={reset}>
          {t("photo.another")}
        </button>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!photo || !guess.trim()) return;
        start(async () => {
          setResult(
            await askPhoto({
              imageBase64: photo.base64,
              mediaType: photo.mediaType,
              question,
              guess,
            }),
          );
        });
      }}
    >
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="sr-only"
        id="photo-input"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
      {photo ? (
        <label htmlFor="photo-input" className="cursor-pointer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.preview}
            alt=""
            className="max-h-72 w-full rounded-big object-contain bg-cloud"
          />
          <span className="mt-2 block text-center text-[0.9375rem] font-semibold text-rose">
            {t("photo.change")}
          </span>
        </label>
      ) : (
        <label
          htmlFor="photo-input"
          className="flex cursor-pointer flex-col items-center gap-3 rounded-big bg-butter p-8 text-center"
        >
          <span className="flex size-16 items-center justify-center rounded-full bg-paper text-rose">
            <CameraIcon size={30} />
          </span>
          <span className="title text-[1.5rem]">{t("photo.pick")}</span>
          <span className="text-[1rem] text-ink">{t("photo.pick.sub")}</span>
        </label>
      )}

      <label className="flex flex-col gap-2">
        <span className="font-semibold">{t("photo.question")}</span>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t("photo.question.placeholder")}
          className="rounded-card bg-cloud px-4 py-3 text-[1.0625rem]"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-semibold">{t("photo.guess")}</span>
        <span className="text-[0.9375rem] text-ink">{t("photo.guess.sub")}</span>
        <textarea
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          rows={3}
          placeholder={t("photo.guess.placeholder")}
          className="rounded-card bg-cloud px-4 py-3 text-[1.0625rem]"
        />
      </label>

      {result && !result.ok ? (
        <p className="card bg-peach text-[1rem]">
          {t(`photo.error.${result.reason}` as MessageKey)}
        </p>
      ) : null}

      <button
        type="submit"
        className="btn self-start"
        disabled={!photo || !guess.trim() || pending}
      >
        {pending ? t("photo.thinking") : t("photo.ask")}
      </button>
    </form>
  );
}
