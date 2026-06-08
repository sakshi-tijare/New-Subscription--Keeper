import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Subscription, Renewal } from "@/types/subscription";
import { addDays, addMonths, addYears, format, isValid, parseISO } from "date-fns";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface RenewalModalProps {
  open: boolean;
  onClose: () => void;
  onRenew: (id: string, data: Omit<Renewal, "id">) => void;
  subscription: Subscription | null;
}

export function RenewalModal({ open, onClose, onRenew, subscription }: RenewalModalProps) {
  const [form, setForm] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    amount: subscription?.price || 0,
    currency: subscription?.currency || "USD",
    durationValue: 1,
    durationUnit: "months" as "days" | "months" | "years",
    newExpiryDate: "",
    paymentProof: "",
    notes: "",
  });

  useEffect(() => {
    if (subscription) {
      setForm((prev) => ({
        ...prev,
        amount: subscription.price || 0,
        currency: subscription.currency || "USD",
        // Default new expiry date based on current expiry or today
        date: format(new Date(), "yyyy-MM-dd"),
      }));
    }
  }, [subscription, open]);

  useEffect(() => {
    const baseDate = subscription ? parseISO(subscription.expiryDate) : new Date();
    const startDate = isValid(baseDate) && baseDate > new Date() ? baseDate : new Date();
    
    let expiry;
    if (form.durationUnit === "days") {
      expiry = addDays(startDate, form.durationValue);
    } else if (form.durationUnit === "months") {
      expiry = addMonths(startDate, form.durationValue);
    } else {
      expiry = addYears(startDate, form.durationValue);
    }
    setForm((prev) => ({ ...prev, newExpiryDate: format(expiry, "yyyy-MM-dd") }));
  }, [form.durationValue, form.durationUnit, subscription]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, paymentProof: file.name }));
      toast.success(`Selected file: ${file.name}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscription) return;

    onRenew(subscription.id, {
      date: form.date,
      amount: Number(form.amount),
      currency: form.currency,
      paymentProof: form.paymentProof,
      newExpiryDate: form.newExpiryDate,
      notes: form.notes,
    });
    
    toast.success("Subscription renewed successfully");
    onClose();
  };

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Renew Subscription: {subscription?.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="renewalDate">Payment/Renewal Date</Label>
              <Input 
                id="renewalDate" 
                type="date" 
                value={form.date} 
                onChange={(e) => update("date", e.target.value)} 
                required 
              />
            </div>

            <div>
              <Label htmlFor="renewAmount">Amount Paid</Label>
              <Input 
                id="renewAmount" 
                type="number" 
                step="0.01" 
                value={form.amount} 
                onChange={(e) => update("amount", Number(e.target.value))} 
                required 
              />
            </div>

            <div>
              <Label>Currency</Label>
              <Select value={form.currency} onValueChange={(v) => update("currency", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="renewDuration">Extend By</Label>
                <Input 
                  id="renewDuration" 
                  type="number" 
                  min="1"
                  value={form.durationValue} 
                  onChange={(e) => update("durationValue", parseInt(e.target.value) || 0)} 
                />
              </div>
              <div>
                <Label>Unit</Label>
                <Select value={form.durationUnit} onValueChange={(v: any) => update("durationUnit", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                    <SelectItem value="years">Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="col-span-2">
              <Label>New Expiry Date (Preview)</Label>
              <div className="p-2 border rounded-md bg-muted/30 text-sm font-medium">
                {form.newExpiryDate ? new Date(form.newExpiryDate).toLocaleDateString() : "---"}
              </div>
            </div>

            <div className="col-span-2">
              <Label>Payment Proof</Label>
              <div className="mt-1 flex items-center gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex items-center gap-2 border-dashed h-20"
                  onClick={() => document.getElementById("proof-upload")?.click()}
                >
                  {form.paymentProof ? (
                    <span className="truncate max-w-[200px]">{form.paymentProof}</span>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>Upload Proof (Image/PDF)</span>
                    </>
                  )}
                </Button>
                <input 
                  id="proof-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*,.pdf" 
                  onChange={handleFileChange} 
                />
                {form.paymentProof && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => update("paymentProof", "")}
                  >
                    <X className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Complete Renewal</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
