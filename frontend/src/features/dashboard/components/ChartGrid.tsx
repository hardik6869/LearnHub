import { ErrorState, LoadingState } from "@/components/common";
import { useStats } from "../hooks/useStats";
import type { ChartItem } from "../lib/dashboardConfig";
import { BarChartCard } from "./BarChartCard";

// Charts two per row on wider screens; an odd last chart spans the full row
export function ChartGrid({ charts }: { charts: ChartItem[] }) {
  const { data, isPending, isError, refetch } = useStats();

  if (isPending) return <LoadingState variant="list" count={2} label="Loading charts…" />;
  if (isError) return <ErrorState onRetry={() => void refetch()} />;

  const lastIsAlone = charts.length % 2 === 1;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {charts.map((chart, index) => (
        <BarChartCard
          key={chart.key}
          title={chart.title}
          description={chart.description}
          valueLabel={chart.valueLabel}
          color={chart.color}
          data={data[chart.key]}
          formatLabel={chart.formatLabel}
          horizontal={chart.horizontal}
          className={lastIsAlone && index === charts.length - 1 ? "md:col-span-2" : undefined}
        />
      ))}
    </div>
  );
}
