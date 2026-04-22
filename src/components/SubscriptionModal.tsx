import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Subscription, SubscriptionCategory, CATEGORIES } from "@/types/subscription";

interface SubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Subscription, "id">) => void;
  editData?: Subscription | null;
}

const emptyForm = {
  name: "",
  category: "Software" as SubscriptionCategory,
  url: "",
  username: "",
  password: "",
  otpRequired: false,
  notes: "",
  activationDate: new Date().toISOString().split("T")[0],
  expiryDate: "",
  price: undefined as number | undefined,
  currency: "USD",
};

export function SubscriptionModal({ open, onClose, onSave, editData }: SubscriptionModalProps) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name,
        category: editData.category,
        url: editData.url || "",
        username: editData.username || "",
        password: editData.password || "",
        otpRequired: editData.otpRequired,
        notes: editData.notes || "",
        activationDate: editData.activationDate,
        expiryDate: editData.expiryDate,
        price: editData.price,
        currency: editData.currency || "USD",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      price: form.price ? Number(form.price) : undefined,
    });
    onClose();
  };

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Subscription" : "Add Subscription"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label htmlFor="name">Subscription Name *</Label>
              <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
            </div>

            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => update("category", v as SubscriptionCategory)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="url">URL</Label>
              <Input id="url" type="url" value={form.url} onChange={(e) => update("url", e.target.value)} placeholder="https://..." />
            </div>

            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={form.username} onChange={(e) => update("username", e.target.value)} />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} />
            </div>

            <div className="flex items-center gap-3 sm:col-span-2">
              <Switch checked={form.otpRequired} onCheckedChange={(v) => update("otpRequired", v)} />
              <Label>OTP Required</Label>
            </div>

            <div>
              <Label htmlFor="activationDate">Activation Date *</Label>
              <Input id="activationDate" type="date" value={form.activationDate} onChange={(e) => update("activationDate", e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="expiryDate">Expiry Date *</Label>
              <Input id="expiryDate" type="date" value={form.expiryDate} onChange={(e) => update("expiryDate", e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" step="0.01" value={form.price ?? ""} onChange={(e) => update("price", e.target.value ? Number(e.target.value) : undefined)} placeholder="0.00" />
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" value={form.currency} onChange={(e) => update("currency", e.target.value)} />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea id="notes" value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Enter any extra details or important information..." rows={3} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{editData ? "Update" : "Add Subscription"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
