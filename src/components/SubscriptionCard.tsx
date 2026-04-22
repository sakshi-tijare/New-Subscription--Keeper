import { Subscription, getStatus } from "@/types/subscription";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { CategoryIcon } from "./CategoryIcon";
import { Button } from "@/components/ui/button";
import { ExternalLink, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
}

export function SubscriptionCard({ subscription: sub, onEdit, onDelete }: SubscriptionCardProps) {
  const status = getStatus(sub.expiryDate);
  const [showPassword, setShowPassword] = useState(false);

  const borderColor = {
    expired: "border-l-destructive",
    expiring: "border-l-warning",
    active: "border-l-success",
  }[status];

  return (
    <Card className={`glass-card border-l-4 ${borderColor} p-4 transition-all duration-200 hover:shadow-md group`}>
      <div className="flex items-start gap-3">
        <CategoryIcon category={sub.category} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-card-foreground truncate">{sub.name}</h3>
            <StatusBadge expiryDate={sub.expiryDate} />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{sub.category}</p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-sm">
            <div>
              <span className="text-muted-foreground text-xs">Activation</span>
              <p className="text-card-foreground">{new Date(sub.activationDate).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Expiry</span>
              <p className="text-card-foreground">{new Date(sub.expiryDate).toLocaleDateString()}</p>
            </div>
            {sub.price != null && (
              <div>
                <span className="text-muted-foreground text-xs">Price</span>
                <p className="text-card-foreground font-medium">{sub.currency || "$"}{sub.price.toFixed(2)}</p>
              </div>
            )}
            {sub.username && (
              <div>
                <span className="text-muted-foreground text-xs">Username</span>
                <p className="text-card-foreground truncate">{sub.username}</p>
              </div>
            )}
          </div>

          {sub.password && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="text-muted-foreground text-xs">Password:</span>
              <span className="text-card-foreground font-mono text-xs">
                {showPassword ? sub.password : "••••••••"}
              </span>
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
            </div>
          )}

          {sub.notes && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{sub.notes}</p>
          )}
        </div>

        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {sub.url && (
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a href={sub.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(sub)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(sub.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
