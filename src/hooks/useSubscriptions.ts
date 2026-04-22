import { useState, useMemo } from "react";
import { Subscription, SortOption, getDaysRemaining, getStatus } from "@/types/subscription";
import { sampleSubscriptions } from "@/data/sampleSubscriptions";

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(sampleSubscriptions);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sort, setSort] = useState<SortOption>("expiry-asc");

  const filtered = useMemo(() => {
    let result = [...subscriptions];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.notes?.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((s) => s.category === categoryFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((s) => getStatus(s.expiryDate) === statusFilter);
    }

    result.sort((a, b) => {
      switch (sort) {
        case "expiry-asc":
          return getDaysRemaining(a.expiryDate) - getDaysRemaining(b.expiryDate);
        case "expiry-desc":
          return getDaysRemaining(b.expiryDate) - getDaysRemaining(a.expiryDate);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return result;
  }, [subscriptions, search, categoryFilter, statusFilter, sort]);

  const notifications = useMemo(
    () => subscriptions.filter((s) => {
      const days = getDaysRemaining(s.expiryDate);
      return days <= 30;
    }),
    [subscriptions]
  );

  const addSubscription = (sub: Omit<Subscription, "id">) => {
    setSubscriptions((prev) => [
      ...prev,
      { ...sub, id: crypto.randomUUID() },
    ]);
  };

  const updateSubscription = (id: string, data: Partial<Subscription>) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  };

  return {
    subscriptions: filtered,
    allSubscriptions: subscriptions,
    notifications,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    sort,
    setSort,
    addSubscription,
    updateSubscription,
    deleteSubscription,
  };
}
