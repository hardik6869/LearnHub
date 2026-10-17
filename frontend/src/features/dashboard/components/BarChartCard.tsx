import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui";
import type { CountItem } from "@/types";

interface BarChartCardProps {
  title: string;
  description?: string;
  data: CountItem[];
  /** Name of the value in the tooltip, e.g. "Reviews" */
  valueLabel: string;
  /** Turns an API label ("2026-05", "beginner") into display text */
  formatLabel?: (label: string) => string;
  /** Bars run sideways, for long category names */
  horizontal?: boolean;
  className?: string;
}

// A single-series bar chart in a card. The chart is visual only (aria-hidden); screen readers
// get the same numbers from a visually hidden table.
export function BarChartCard({
  title,
  description,
  data,
  valueLabel,
  formatLabel,
  horizontal = false,
  className,
}: BarChartCardProps) {
  const config = { count: { label: valueLabel, color: "var(--chart-2)" } } satisfies ChartConfig;
  const rows = formatLabel
    ? data.map((item) => ({ ...item, label: formatLabel(item.label) }))
    : data;
  const isEmpty = rows.every((item) => item.count === 0);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <p className="text-sm text-muted-foreground">No data yet.</p>
        ) : (
          <>
            <ChartContainer config={config} className="aspect-auto h-56 w-full" aria-hidden>
              <BarChart
                data={rows}
                layout={horizontal ? "vertical" : "horizontal"}
                accessibilityLayer={false}
                margin={{ left: 0, right: 8 }}
              >
                <CartesianGrid horizontal={!horizontal} vertical={horizontal} />
                {horizontal ? (
                  <>
                    <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
                    <YAxis
                      type="category"
                      dataKey="label"
                      width={112}
                      tickLine={false}
                      axisLine={false}
                    />
                  </>
                ) : (
                  <>
                    <XAxis dataKey="label" interval={0} tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} width={32} tickLine={false} axisLine={false} />
                  </>
                )}
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
                  radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ChartContainer>
            <table className="sr-only">
              <caption>{title}</caption>
              <tbody>
                {rows.map((item) => (
                  <tr key={item.label}>
                    <th scope="row">{item.label}</th>
                    <td>{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </CardContent>
    </Card>
  );
}
