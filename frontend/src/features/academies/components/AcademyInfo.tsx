import { Check, Globe, Mail, Phone, Star, Wallet, X } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle, Separator } from "@/components/ui";
import { formatCurrency, formatRating } from "@/lib";
import type { Academy } from "@/types";

const FEATURES = [
  { key: "housing", label: "Housing" },
  { key: "jobAssistance", label: "Job assistance" },
  { key: "jobGuarantee", label: "Job guarantee" },
  { key: "acceptGi", label: "Accepts GI Bill" },
] as const;

function InfoRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      {icon}
      <span className="min-w-0 wrap-break-word">{children}</span>
    </li>
  );
}

interface AcademyInfoProps {
  academy: Academy;
  className?: string;
}

// "At a glance" panel of the academy page: rating, cost, contact details and features
export function AcademyInfo({ academy, className }: AcademyInfoProps) {
  const iconClass = "size-4 shrink-0 text-muted-foreground";

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          <h2>At a glance</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          <InfoRow icon={<Star className={iconClass} aria-hidden />}>
            Rating: {formatRating(academy.averageRating)}
          </InfoRow>
          <InfoRow icon={<Wallet className={iconClass} aria-hidden />}>
            Average cost:{" "}
            {academy.averageCost === undefined
              ? "No courses yet"
              : formatCurrency(academy.averageCost)}
          </InfoRow>
          {academy.website && (
            <InfoRow icon={<Globe className={iconClass} aria-hidden />}>
              <a href={academy.website} target="_blank" rel="noreferrer" className="underline">
                {academy.website}
              </a>
            </InfoRow>
          )}
          {academy.phone && (
            <InfoRow icon={<Phone className={iconClass} aria-hidden />}>
              <a href={`tel:${academy.phone}`} className="underline">
                {academy.phone}
              </a>
            </InfoRow>
          )}
          {academy.email && (
            <InfoRow icon={<Mail className={iconClass} aria-hidden />}>
              <a href={`mailto:${academy.email}`} className="underline">
                {academy.email}
              </a>
            </InfoRow>
          )}
        </ul>
        <Separator />
        <ul className="space-y-2">
          {FEATURES.map(({ key, label }) => (
            <InfoRow
              key={key}
              icon={
                academy[key] ? (
                  <Check className="size-4 shrink-0" aria-hidden />
                ) : (
                  <X className={iconClass} aria-hidden />
                )
              }
            >
              {label}: {academy[key] ? "Yes" : "No"}
            </InfoRow>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
