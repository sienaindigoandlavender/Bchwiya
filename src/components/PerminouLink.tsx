"use client";

import { trackPageView } from "@/app/actions";
import { t } from "@/i18n";
import { PERMINOU_URL } from "@/lib/links";

/**
 * The bridge to NARSA's official practice platform, where she trains on the real
 * question bank. Each visit is noted in her journal.
 */
export function PerminouLink({ tone = "cloud" }: { tone?: "cloud" | "mint" }) {
  return (
    <a
      href={PERMINOU_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => void trackPageView("/perminou").catch(() => {})}
      className={`flex items-center gap-4 rounded-big p-5 ${tone === "mint" ? "bg-paper" : "bg-cloud"}`}
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-paper text-[1.375rem]">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
        </svg>
      </span>
      <span className="flex flex-1 flex-col">
        <span className="title text-[1.5rem]">{t("perminou.title")}</span>
        <span className="text-[1rem] text-ink-soft">{t("perminou.sub")}</span>
      </span>
    </a>
  );
}
