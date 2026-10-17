import { ErrorState, LoadingState } from "@/components/common";
import type { UserRole } from "@/enums";
import { useStats } from "../hooks/useStats";
import { formatKpi, ROLE_DASHBOARDS } from "../lib/dashboardConfig";
import { StatTile } from "./StatTile";

// The KPI tiles for the user's role (see ROLE_DASHBOARDS)
export function KpiGrid({ role }: { role: UserRole }) {
  const { data, isPending, isError, refetch } = useStats();

  if (isPending) return <LoadingState variant="list" count={1} label="Loading key figures…" />;
  if (isError) return <ErrorState onRetry={() => void refetch()} />;

  return (
    // As many tiles per row as fit: 1–2 on phones, all of them on desktop
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(11rem,1fr))] gap-3">
      {ROLE_DASHBOARDS[role].kpis.map((kpi) => (
        <li key={kpi.key}>
          <StatTile
            label={kpi.label}
            value={formatKpi(kpi, data.totals[kpi.key])}
            icon={kpi.icon}
            tone={kpi.tone}
          />
        </li>
      ))}
    </ul>
  );
}
