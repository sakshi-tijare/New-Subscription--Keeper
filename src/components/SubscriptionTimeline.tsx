import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Subscription, Renewal } from "@/types/subscription";
import { format } from "date-fns";
import { Calendar, CreditCard, Clock, CheckCircle2, History } from "lucide-react";

interface SubscriptionTimelineProps {
  open: boolean;
  onClose: () => void;
  subscription: Subscription | null;
}

export function SubscriptionTimeline({ open, onClose, subscription }: SubscriptionTimelineProps) {
  if (!subscription) return null;

  const events = [
    {
      type: "purchase",
      date: subscription.activationDate,
      title: "Initial Purchase",
      amount: subscription.price,
      currency: subscription.currency,
      icon: <CreditCard className="h-4 w-4 text-primary" />,
    },
    ...(subscription.renewals || []).map((r) => ({
      type: "renewal",
      date: r.date,
      title: "Subscription Renewal",
      amount: r.amount,
      currency: r.currency,
      proof: r.paymentProof,
      icon: <Clock className="h-4 w-4 text-warning" />,
      newExpiry: r.newExpiryDate,
    })),
    {
      type: "expiry",
      date: subscription.expiryDate,
      title: "Current Expiry",
      icon: <Calendar className="h-4 w-4 text-destructive" />,
    }
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Subscription History: {subscription.name}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-border" />

          <div className="space-y-8">
            {events.map((event, idx) => (
              <div key={idx} className="relative flex gap-4 items-start pl-10">
                {/* Circle marker */}
                <div className="absolute left-0 w-10 flex justify-center">
                  <div className={`z-10 flex items-center justify-center w-9 h-9 rounded-full border-4 border-background bg-secondary shadow-sm`}>
                    {event.icon}
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm leading-none">{event.title}</h4>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {format(new Date(event.date), "MMM d, yyyy")}
                    </span>
                  </div>
                  
                  {event.amount != null && (
                    <p className="text-sm font-medium text-primary">
                      Paid: {event.currency === "INR" ? "₹" : "$"}
                      {event.amount.toFixed(2)}
                    </p>
                  )}
                  
                  {event.type === "renewal" && event.newExpiry && (
                    <p className="text-xs text-muted-foreground italic">
                      Extended expiry to {format(new Date(event.newExpiry), "MMM d, yyyy")}
                    </p>
                  )}

                  {event.proof && (
                    <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-success bg-success/10 px-2 py-0.5 rounded border border-success/20">
                      <CheckCircle2 className="h-3 w-3" />
                      Proof: {event.proof}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
