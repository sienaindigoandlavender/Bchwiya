import { CarExplorer } from "@/components/car/CarExplorer";
import { PageHeader } from "@/components/ui/PageHeader";
import { WallE } from "@/components/ui/WallE";
import { getCarContent } from "@/content/car";
import { t } from "@/i18n";

export default function MyCarPage() {
  return (
    <>
      <div className="flex items-end justify-between gap-3">
        <PageHeader title={t("myCar.title")} />
        <WallE pose="keys-close" height={110} className="-mb-1 shrink-0" />
      </div>
      <CarExplorer content={getCarContent()} />
    </>
  );
}
