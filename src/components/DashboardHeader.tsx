import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, SortOption } from "@/types/subscription";
import { NotificationPanel } from "./NotificationPanel";
import { Plus, Search, Moon, Sun } from "lucide-react";
import { Subscription } from "@/types/subscription";

interface DashboardHeaderProps {
  search: string;
  onSearchChange: (v: string) => void;
  categoryFilter: string;
  onCategoryChange: (v: string) => void;
  statusFilter: string;
  onStatusChange: (v: string) => void;
  sort: SortOption;
  onSortChange: (v: SortOption) => void;
  onAdd: () => void;
  notifications: Subscription[];
  darkMode: boolean;
  onToggleDark: () => void;
}

export function DashboardHeader({
  search, onSearchChange,
  categoryFilter, onCategoryChange,
  statusFilter, onStatusChange,
  sort, onSortChange,
  onAdd, notifications,
  darkMode, onToggleDark,
}: DashboardHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Subscription Manager</h1>
          <p className="text-sm text-muted-foreground">Track and manage all your subscriptions in one place</p>
        </div>
        <div className="flex items-center gap-2">
          <NotificationPanel notifications={notifications} />
          <Button variant="outline" size="icon" onClick={onToggleDark}>
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button onClick={onAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Subscription</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subscriptions..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expiring">Expiring</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Sort" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="expiry-asc">Expiry ↑</SelectItem>
            <SelectItem value="expiry-desc">Expiry ↓</SelectItem>
            <SelectItem value="name-asc">Name A-Z</SelectItem>
            <SelectItem value="name-desc">Name Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
