import { getDaysRemaining, getStatus } from "@/types/subscription";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  expiryDate: string;
}

export function StatusBadge({ expiryDate }: StatusBadgeProps) {
  const status = getStatus(expiryDate);
  const days = getDaysRemaining(expiryDate);

  const labels = {
    expired: `Expired ${Math.abs(days)}d ago`,
    expiring: `${days}d remaining`,
    active: `${days}d remaining`,
  };

  const classes = {
    expired: "status-badge-expired",
    expiring: "status-badge-expiring",
    active: "status-badge-active",
  };

  return (
    <Badge variant="outline" className={`${classes[status]} border-0 font-medium text-xs`}>
      {labels[status]}
    </Badge>
  );
}
