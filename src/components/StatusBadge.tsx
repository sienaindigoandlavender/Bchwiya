import { t } from "@/i18n";
import type { Status } from "@/lib/progress";

const TONE: Record<Status, string> = {
  locked: "bg-surface-muted text-locked",
  available: "bg-accent-soft text-accent",
  in_progress: "bg-accent text-accent-contrast",
  done: "bg-success-soft text-success",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${TONE[status]}`}>
      {t(`status.${status}`)}
    </span>
  );
}
