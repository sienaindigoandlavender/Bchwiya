"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t } from "@/i18n";
import { CarIcon, ExamIcon, ReviewIcon, RoadIcon, SignIcon } from "./Icons";

const ITEMS = [
  { href: "/", label: "nav.home", Icon: RoadIcon },
  { href: "/panneaux", label: "nav.signs", Icon: SignIcon },
  { href: "/revision", label: "nav.review", Icon: ReviewIcon },
  { href: "/examen-blanc", label: "nav.mockExam", Icon: ExamIcon },
  { href: "/ma-voiture", label: "nav.myCar", Icon: CarIcon },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return (
      pathname === "/" ||
      ["/niveau", "/module", "/lecon", "/test"].some((p) => pathname.startsWith(p))
    );
  }
  return pathname.startsWith(href);
}

/** App-style tab bar, thumb-reachable on a phone. */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navigation"
      className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-paper pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto grid max-w-xl grid-cols-5 px-1 py-2">
        {ITEMS.map(({ href, label, Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="flex flex-col items-center gap-1 py-1 text-[0.8125rem] font-medium"
              >
                <span
                  className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors ${
                    active ? "bg-blush text-rose" : "text-ink"
                  }`}
                >
                  <Icon size={21} />
                </span>
                <span className={active ? "text-rose" : "text-ink"}>{t(label)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
