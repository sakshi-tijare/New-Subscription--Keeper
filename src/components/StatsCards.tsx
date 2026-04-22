import { Subscription, getStatus } from "@/types/subscription";
import { Card } from "@/components/ui/card";
import { Package, AlertTriangle, XCircle, CheckCircle } from "lucide-react";

export function StatsCards({ subscriptions }: { subscriptions: Subscription[] }) {
  const total = subscriptions.length;
  const active = subscriptions.filter((s) => getStatus(s.expiryDate) === "active").length;
  const expiring = subscriptions.filter((s) => getStatus(s.expiryDate) === "expiring").length;
  const expired = subscriptions.filter((s) => getStatus(s.expiryDate) === "expired").length;

  const stats = [
    { label: "Total", value: total, icon: Package, color: "text-primary bg-primary/10" },
    { label: "Active", value: active, icon: CheckCircle, color: "text-success bg-success/10" },
    { label: "Expiring Soon", value: expiring, icon: AlertTriangle, color: "text-warning bg-warning/10" },
    { label: "Expired", value: expired, icon: XCircle, color: "text-destructive bg-destructive/10" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s) => (
        <Card key={s.label} className="glass-card p-4 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
            <s.icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-card-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
