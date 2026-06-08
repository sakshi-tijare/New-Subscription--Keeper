// SubscriptionCard component - displays subscription details with actions
import { Subscription, getStatus } from "@/types/subscription";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { CategoryIcon } from "./CategoryIcon";
import { Button } from "@/components/ui/button";
import { ExternalLink, Pencil, Trash2, Eye, EyeOff, RefreshCw, History } from "lucide-react";
import { useState } from "react";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
  onRenew: (sub: Subscription) => void;
  onViewTimeline: (sub: Subscription) => void;
}

export function SubscriptionCard({
  subscription: sub,
  onEdit,
  onDelete,
  onRenew,
  onViewTimeline,
}: SubscriptionCardProps) {
  const status = getStatus(sub.expiryDate);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const borderColor = {
    expired: "border-l-destructive",
    expiring: "border-l-warning",
    active: "border-l-success",
  }[status];

  return (
    <>
      <Card className={`glass-card border-l-4 ${borderColor} p-4 transition-all duration-200 hover:shadow-md group`}>
        <div className="flex items-start gap-3">
          <CategoryIcon category={sub.category} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-card-foreground truncate">{sub.name}</h3>
              {sub.project && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium uppercase tracking-wider">
                  {sub.project}
                </span>
              )}
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
                  <p className="text-card-foreground font-medium">
                    {sub.currency === "INR" ? "₹" : sub.currency === "USD" ? "$" : sub.currency || "$"}{sub.price.toFixed(2)}
                  </p>
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
                <span className="text-card-foreground font-mono text-xs">{showPassword ? sub.password : "••••••••"}</span>
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
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(sub)} title="Edit">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => {
                setDeleteId(sub.id);
                setConfirmOpen(true);
              }}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-2 text-xs h-8" onClick={() => onRenew(sub)}>
            <RefreshCw className="h-3.5 w-3.5 text-primary" />
            Renew
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 text-xs h-8" onClick={() => onViewTimeline(sub)}>
            <History className="h-3.5 w-3.5 text-warning" />
            History
          </Button>
        </div>
      </Card>

      <DeleteConfirmationModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (deleteId) {
            onDelete(deleteId);
          }
          setConfirmOpen(false);
        }}
        itemName={sub.name}
      />
    </>
  );
}
