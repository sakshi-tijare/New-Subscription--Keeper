import { Subscription, getDaysRemaining, getStatus } from "@/types/subscription";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface NotificationPanelProps {
  notifications: Subscription[];
}

export function NotificationPanel({ notifications }: NotificationPanelProps) {
  const sorted = [...notifications].sort(
    (a, b) => getDaysRemaining(a.expiryDate) - getDaysRemaining(b.expiryDate)
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">
              {notifications.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b">
          <h4 className="font-semibold text-sm">Expiry Alerts</h4>
          <p className="text-xs text-muted-foreground">Subscriptions expiring within 30 days</p>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {sorted.length === 0 ? (
            <p className="text-sm text-muted-foreground p-4 text-center">No upcoming expirations</p>
          ) : (
            sorted.map((s) => (
              <div key={s.id} className="px-3 py-2 border-b last:border-0 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.category}</p>
                </div>
                <StatusBadge expiryDate={s.expiryDate} />
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
