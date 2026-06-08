import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Subscription, SubscriptionCategory, CATEGORIES } from "@/types/subscription";
import { addDays, addMonths, addYears, format, isValid, parseISO } from "date-fns";
import { Plus, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface SubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Subscription, "id">) => void;
  editData?: Subscription | null;
  projects?: string[];
  customCategories?: string[];
}

const emptyForm = {
  name: "",
  project: "",
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
  durationValue: 1,
  durationUnit: "months" as "days" | "months" | "years",
};

export function SubscriptionModal({ open, onClose, onSave, editData, projects, customCategories }: SubscriptionModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [projectSearch, setProjectSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [projectPopoverOpen, setProjectPopoverOpen] = useState(false);
  const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name,
        project: editData.project || "",
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
        durationValue: 1,
        durationUnit: "months",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editData, open]);

  useEffect(() => {
    if (form.activationDate && form.durationValue) {
      const date = parseISO(form.activationDate);
      if (isValid(date)) {
        let expiry;
        if (form.durationUnit === "days") {
          expiry = addDays(date, form.durationValue);
        } else if (form.durationUnit === "months") {
          expiry = addMonths(date, form.durationValue);
        } else {
          expiry = addYears(date, form.durationValue);
        }
        update("expiryDate", format(expiry, "yyyy-MM-dd"));
      }
    }
  }, [form.activationDate, form.durationValue, form.durationUnit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.project === "_new") {
      toast.error("Please enter a project name");
      return;
    }
    if (form.category === "_new_category") {
      toast.error("Please enter a category name");
      return;
    }
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
              <Label>Project</Label>
              <Popover open={projectPopoverOpen} onOpenChange={setProjectPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between font-normal",
                      !form.project && "text-muted-foreground"
                    )}
                  >
                    {form.project || "Select or create project"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput 
                      placeholder="Search project..." 
                      value={projectSearch}
                      onValueChange={setProjectSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No project found. Type to create.</CommandEmpty>
                      {projectSearch && !projects?.includes(projectSearch) && (
                        <CommandGroup heading="New Project">
                          <CommandItem
                            value={projectSearch}
                            onSelect={() => {
                              update("project", projectSearch);
                              toast.success(`Selected new project: ${projectSearch}`);
                              setProjectPopoverOpen(false);
                              setProjectSearch("");
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Create "{projectSearch}"
                          </CommandItem>
                        </CommandGroup>
                      )}
                      {!projectSearch && (
                        <CommandGroup>
                          <CommandItem
                            onSelect={() => {
                              // Focus the command input
                              const input = document.querySelector('[cmdk-input]') as HTMLInputElement;
                              input?.focus();
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Create New Project...
                          </CommandItem>
                        </CommandGroup>
                      )}
                      <CommandGroup heading="Existing Projects">
                        {form.project && !projects?.includes(form.project) && (
                          <CommandItem
                            value={form.project}
                            onSelect={() => {
                              setProjectPopoverOpen(false);
                            }}
                          >
                            <Check className="mr-2 h-4 w-4 opacity-100" />
                            {form.project} (New)
                          </CommandItem>
                        )}
                        {projects?.map((p) => (
                          <CommandItem
                            key={p}
                            value={p}
                            onSelect={(v) => {
                              update("project", v);
                              setProjectPopoverOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                form.project === p ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {p}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>


            <div className="sm:col-span-2">
              <Label htmlFor="name">Subscription Name *</Label>
              <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
            </div>

            <div>
              <Label>Category</Label>
              <Popover open={categoryPopoverOpen} onOpenChange={setCategoryPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between font-normal"
                  >
                    {form.category}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput 
                      placeholder="Search category..." 
                      value={categorySearch}
                      onValueChange={setCategorySearch}
                    />
                    <CommandList>
                      <CommandEmpty>No category found. Type to create.</CommandEmpty>
                      {categorySearch && !CATEGORIES.includes(categorySearch) && !customCategories?.includes(categorySearch) && (
                        <CommandGroup heading="New Category">
                          <CommandItem
                            value={categorySearch}
                            onSelect={() => {
                              update("category", categorySearch as SubscriptionCategory);
                              toast.success(`Selected new category: ${categorySearch}`);
                              setCategoryPopoverOpen(false);
                              setCategorySearch("");
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Create "{categorySearch}"
                          </CommandItem>
                        </CommandGroup>
                      )}
                      {!categorySearch && (
                        <CommandGroup>
                          <CommandItem
                            onSelect={() => {
                              // Focus the command input
                              const input = document.querySelector('[cmdk-input]') as HTMLInputElement;
                              input?.focus();
                            }}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Create New Category...
                          </CommandItem>
                        </CommandGroup>
                      )}
                      <CommandGroup heading="Existing Categories">
                        {form.category && !CATEGORIES.includes(form.category) && !customCategories?.includes(form.category) && (
                          <CommandItem
                            value={form.category}
                            onSelect={() => {
                              setCategoryPopoverOpen(false);
                            }}
                          >
                            <Check className="mr-2 h-4 w-4 opacity-100" />
                            {form.category} (New)
                          </CommandItem>
                        )}
                        {CATEGORIES.map((c) => (
                          <CommandItem
                            key={c}
                            value={c}
                            onSelect={(v) => {
                              update("category", v as SubscriptionCategory);
                              setCategoryPopoverOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                form.category === c ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {c}
                          </CommandItem>
                        ))}
                        {customCategories?.filter(c => !CATEGORIES.includes(c)).map((c) => (
                          <CommandItem
                            key={c}
                            value={c}
                            onSelect={(v) => {
                              update("category", v as SubscriptionCategory);
                              setCategoryPopoverOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                form.category === c ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {c}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="durationValue">Duration</Label>
                <Input 
                  id="durationValue" 
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

            <div>
              <Label htmlFor="expiryDate">Expiry Date *</Label>
              <Input id="expiryDate" type="date" value={form.expiryDate} onChange={(e) => update("expiryDate", e.target.value)} required />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:col-span-2">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" step="0.01" value={form.price ?? ""} onChange={(e) => update("price", e.target.value ? Number(e.target.value) : undefined)} placeholder="0.00" />
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
