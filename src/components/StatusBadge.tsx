import { CheckIcon, LockIcon } from "@/components/ui/Icons";
import { t } from "@/i18n";
import type { Status } from "@/lib/progress";

const TONE: Record<Status, string> = {
  locked: "bg-cloud text-ink-soft",
  available: "bg-paper text-ink ring-1 ring-line ring-inset",
  in_progress: "bg-blush text-rose",
  done: "bg-mint text-success",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`pill shrink-0 ${TONE[status]}`}>
      {status === "done" ? <CheckIcon size={13} /> : null}
      {status === "locked" ? <LockIcon size={12} /> : null}
      {t(`status.${status}`)}
    </span>
  );
}
