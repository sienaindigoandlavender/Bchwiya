"use client";

import { useState } from "react";
import type { CarContent } from "@/content/car";
import { BackIcon, CheckIcon, ChevronIcon } from "@/components/ui/Icons";
import { WallE } from "@/components/ui/WallE";
import {
  BlindSpots,
  COCKPIT_SPOTS,
  COCKPIT_VIEW,
  Cockpit,
  ENGINE_SPOTS,
  ENGINE_VIEW,
  Engine,
  LightIcon,
} from "./drawings";

type Section = keyof CarContent["sections"];
const ORDER: Section[] = ["cockpit", "lights", "mirrors", "engine", "start"];

/** Tappable numbered spots over a drawing, with an explanation card underneath. */
function Hotspots({
  items,
  spots,
  view,
  previous,
  children,
}: {
  items: CarContent["cockpit"];
  previous: string;
  spots: Record<string, { x: number; y: number }>;
  view: { w: number; h: number };
  children: React.ReactNode;
}) {
  const [i, setI] = useState(0);
  const item = items[i]!;
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-big bg-cloud p-3">
        <svg viewBox={`0 0 ${view.w} ${view.h}`} width="100%" role="img" aria-label={item.title}>
          {children}
          {items.map((it, n) => {
            const p = spots[it.id];
            if (!p) return null;
            const active = n === i;
            return (
              <g
                key={it.id}
                transform={`translate(${p.x} ${p.y})`}
                onClick={() => setI(n)}
                style={{ cursor: "pointer" }}
                role="button"
                aria-label={it.title}
              >
                <circle r="20" fill="transparent" />
                <circle
                  r={active ? 14 : 12}
                  fill={active ? "var(--rose)" : "#fff"}
                  stroke={active ? "#fff" : "var(--rose)"}
                  strokeWidth="2.5"
                />
                <text
                  y="4.5"
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="700"
                  fill={active ? "#fff" : "var(--rose)"}
                  fontFamily="var(--font-sans)"
                >
                  {n + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div aria-live="polite" className="flex flex-col gap-2 rounded-big bg-blush p-5">
        <div className="flex items-center gap-2">
          <span className="title flex size-9 shrink-0 items-center justify-center rounded-full bg-rose text-[1.25rem] text-rose-ink">
            {i + 1}
          </span>
          <h3 className="title text-[1.625rem]">{item.title}</h3>
        </div>
        <p className="text-[1.0625rem] leading-relaxed">{item.body}</p>
        <p className="rounded-card bg-paper px-4 py-3 text-[1rem]">{item.tip}</p>
        <div className="mt-1 flex gap-3">
          <button
            type="button"
            className="btn btn-secondary bg-paper px-5"
            onClick={() => setI((i - 1 + items.length) % items.length)}
            aria-label={previous}
          >
            <BackIcon size={20} />
          </button>
          <button type="button" className="btn flex-1" onClick={() => setI((i + 1) % items.length)}>
            {i + 1 < items.length ? items[i + 1]!.title : items[0]!.title}
            <ChevronIcon size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Lights({ items, labels }: { items: CarContent["lights"]; labels: CarContent["labels"] }) {
  const [open, setOpen] = useState(items[0]!.id);
  const groups: { color: CarContent["lights"][number]["color"][]; label: string; tone: string }[] =
    [
      { color: ["red"], label: labels.red, tone: "bg-blush" },
      { color: ["orange"], label: labels.orange, tone: "bg-butter" },
      { color: ["green", "blue"], label: labels.info, tone: "bg-mint" },
    ];
  const current = items.find((l) => l.id === open)!;
  return (
    <div className="flex flex-col gap-5">
      {groups.map((g) => (
        <section key={g.label} className="flex flex-col gap-2.5">
          <h3 className="title text-[1.5rem]">{g.label}</h3>
          <div className="grid grid-cols-4 gap-2">
            {items
              .filter((l) => g.color.includes(l.color))
              .map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setOpen(l.id)}
                  aria-pressed={open === l.id}
                  aria-label={l.title}
                  className={`flex aspect-square items-center justify-center rounded-card transition-colors ${
                    open === l.id ? `${g.tone} ring-2 ring-rose ring-inset` : "bg-cloud"
                  }`}
                >
                  <LightIcon id={l.id} color={l.color} />
                </button>
              ))}
          </div>
        </section>
      ))}
      <div aria-live="polite" className="flex flex-col gap-2 rounded-big bg-blush p-5">
        <div className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-card bg-paper">
            <LightIcon id={current.id} color={current.color} />
          </span>
          <h3 className="title text-[1.625rem]">{current.title}</h3>
        </div>
        <p className="text-[1.0625rem] leading-relaxed">{current.body}</p>
        <p className="rounded-card bg-paper px-4 py-3 text-[1rem] font-semibold">
          {current.action}
        </p>
      </div>
    </div>
  );
}

function Mirrors({
  content,
  labels,
}: {
  content: CarContent["mirrors"];
  labels: CarContent["labels"];
}) {
  const [scooter, setScooter] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[1.0625rem] leading-relaxed">{content.body}</p>
      <div className="flex flex-wrap gap-2">
        <span className="pill bg-lilac text-ink">{labels.mirrorsSee}</span>
        <span className="pill bg-butter text-ink">{labels.blindSpot}</span>
      </div>
      <div className="flex justify-center">
        <BlindSpots scooter={scooter} />
      </div>
      <button type="button" className="btn self-start" onClick={() => setScooter((v) => !v)}>
        {scooter ? content.hide : content.show}
      </button>
      {scooter ? (
        <p className="rounded-big bg-butter p-5 text-[1.0625rem]">{content.scooter}</p>
      ) : null}
      <p className="rounded-big bg-blush p-5 text-[1.0625rem] font-medium">{content.tip}</p>
    </div>
  );
}

function StartChecklist({ content }: { content: CarContent["start"] }) {
  const [done, setDone] = useState<boolean[]>(() => content.steps.map(() => false));
  const count = done.filter(Boolean).length;
  const all = count === content.steps.length;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1.5" aria-hidden>
        {content.steps.map((_, n) => (
          <span key={n} className={`h-2 flex-1 rounded-full ${done[n] ? "bg-rose" : "bg-cloud"}`} />
        ))}
      </div>
      <ol className="flex flex-col gap-2.5">
        {content.steps.map((step, n) => {
          const next = !done[n] && done.slice(0, n).every(Boolean);
          return (
            <li key={n}>
              <button
                type="button"
                role="checkbox"
                aria-checked={done[n]}
                onClick={() => setDone((d) => d.map((v, k) => (k === n ? !v : v)))}
                className={`flex w-full items-center gap-3.5 rounded-card px-4 py-3.5 text-start text-[1.0625rem] transition-colors ${
                  done[n] ? "bg-mint" : next ? "bg-blush ring-2 ring-rose ring-inset" : "bg-cloud"
                }`}
              >
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full font-semibold ${
                    done[n] ? "bg-success text-paper" : "bg-paper text-ink"
                  }`}
                >
                  {done[n] ? <CheckIcon size={16} /> : n + 1}
                </span>
                <span>{step}</span>
              </button>
            </li>
          );
        })}
      </ol>
      {all ? (
        <div className="flex items-end justify-between gap-3 overflow-hidden rounded-big bg-mint px-6 pt-6">
          <div className="flex flex-col gap-4 pb-6">
            <p className="title text-[2.25rem]">{content.done}</p>
            <button
              type="button"
              className="btn btn-secondary self-start bg-paper"
              onClick={() => setDone(content.steps.map(() => false))}
            >
              {content.reset}
            </button>
          </div>
          <WallE pose="joy" height={170} className="-mb-2 shrink-0" />
        </div>
      ) : null}
    </div>
  );
}

/** Ma voiture: get to know the car before sitting in one. */
export function CarExplorer({ content }: { content: CarContent }) {
  const [section, setSection] = useState<Section>("cockpit");
  return (
    <div className="flex flex-col gap-5">
      <div
        role="tablist"
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {ORDER.map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={section === s}
            onClick={() => setSection(s)}
            className={`shrink-0 rounded-full px-4 py-2 text-[0.9375rem] font-semibold transition-colors ${
              section === s ? "bg-rose text-rose-ink" : "bg-cloud text-ink"
            }`}
          >
            {content.sections[s]}
          </button>
        ))}
      </div>

      {section === "cockpit" ? (
        <>
          <p className="text-[1.0625rem] leading-relaxed">{content.intro}</p>
          <Hotspots
            items={content.cockpit}
            spots={COCKPIT_SPOTS}
            view={COCKPIT_VIEW}
            previous={content.labels.previous}
          >
            <Cockpit />
          </Hotspots>
        </>
      ) : null}
      {section === "lights" ? <Lights items={content.lights} labels={content.labels} /> : null}
      {section === "mirrors" ? <Mirrors content={content.mirrors} labels={content.labels} /> : null}
      {section === "engine" ? (
        <Hotspots
          items={content.engine}
          spots={ENGINE_SPOTS}
          view={ENGINE_VIEW}
          previous={content.labels.previous}
        >
          <Engine />
        </Hotspots>
      ) : null}
      {section === "start" ? <StartChecklist content={content.start} /> : null}
    </div>
  );
}
