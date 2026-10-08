import Link from "next/link";
import { BackIcon } from "./Icons";

/** Every inner page opens the same way: a back pill, a small kicker, a big serif title. */
export function PageHeader({
  back,
  kicker,
  title,
  aside,
}: {
  back?: { href: string; label: string };
  kicker?: string;
  title: string;
  aside?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4">
      {back ? (
        <Link href={back.href} className="back-link">
          <BackIcon size={16} />
          {back.label}
        </Link>
      ) : null}
      <div className="flex flex-col gap-2">
        {kicker || aside ? (
          <div className="flex flex-wrap items-center gap-2">
            {kicker ? (
              <span className="text-[0.875rem] font-medium text-ink-soft">{kicker}</span>
            ) : null}
            {aside}
          </div>
        ) : null}
        <h1 className="title text-[2.5rem] text-ink">{title}</h1>
      </div>
    </header>
  );
}
