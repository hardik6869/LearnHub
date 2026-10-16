import { ErrorState, LoadingState } from "@/components/common";
import type { UserRole } from "@/enums";
import { useStats } from "../hooks/useStats";
import { formatKpi, ROLE_DASHBOARDS } from "../lib/dashboardConfig";
import { BarChartCard } from "./BarChartCard";
import { StatTile } from "./StatTile";

// KPI tiles and charts for the user's role (see ROLE_DASHBOARDS)
export function DashboardOverview({ role }: { role: UserRole }) {
  const { data, isPending, isError, refetch } = useStats();
  const { kpis, charts } = ROLE_DASHBOARDS[role];

  const renderContent = () => {
    if (isPending) return <LoadingState variant="list" count={2} label="Loading your overview…" />;
    if (isError) return <ErrorState onRetry={() => void refetch()} />;
    return (
      <>
        {/* As many tiles per row as fit: 2 on phones, all of them on desktop */}
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-3">
          {kpis.map((kpi) => (
            <li key={kpi.key}>
              <StatTile
                label={kpi.label}
                value={formatKpi(kpi, data.totals[kpi.key])}
                icon={kpi.icon}
              />
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {charts.map((chart) => (
            <BarChartCard
              key={chart.key}
              title={chart.title}
              description={chart.description}
              valueLabel={chart.valueLabel}
              data={data[chart.key]}
              formatLabel={chart.formatLabel}
              horizontal={chart.horizontal}
              className={chart.wide ? "md:col-span-2" : undefined}
            />
          ))}
        </div>
      </>
    );
  };

  return (
    <section aria-labelledby="overview-heading" className="space-y-4">
      <h2 id="overview-heading" className="text-lg font-semibold">
        Overview
      </h2>
      {renderContent()}
    </section>
  );
}
