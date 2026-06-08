import { useState, useMemo, useEffect } from "react";
import { Subscription, Renewal, SortOption, getDaysRemaining, getStatus } from "@/types/subscription";
import { toast } from "sonner";

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sort, setSort] = useState<SortOption>("expiry-asc");

  // Fetch all subscriptions from API
  const fetchSubscriptions = async () => {
    try {
      const response = await fetch("/api/subscriptions");
      if (!response.ok) {
        throw new Error("Failed to fetch subscriptions");
      }
      const data = await response.json();
      setSubscriptions(data);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error fetching subscriptions");
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

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

    if (projectFilter !== "all") {
      result = result.filter((s) => s.project === projectFilter);
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
  }, [subscriptions, search, categoryFilter, projectFilter, statusFilter, sort]);

  const notifications = useMemo(
    () => subscriptions.filter((s) => {
      const days = getDaysRemaining(s.expiryDate);
      return days <= 30;
    }),
    [subscriptions]
  );

  const addSubscription = async (sub: Omit<Subscription, "id">) => {
    try {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sub),
      });
      if (!response.ok) {
        throw new Error("Failed to add subscription");
      }
      const newSub = await response.json();
      setSubscriptions((prev) => [...prev, newSub]);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error adding subscription");
    }
  };

  const updateSubscription = async (id: string, data: Partial<Subscription>) => {
    try {
      const currentSub = subscriptions.find((s) => s.id === id);
      if (!currentSub) return;
      const updatedSubData = { ...currentSub, ...data };

      const response = await fetch(`/api/subscriptions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSubData),
      });
      if (!response.ok) {
        throw new Error("Failed to update subscription");
      }
      const updated = await response.json();
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === id ? updated : s))
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error updating subscription");
    }
  };

  const deleteSubscription = async (id: string) => {
    try {
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete subscription");
      }
      setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error deleting subscription");
    }
  };

  const renewSubscription = async (id: string, renewal: Omit<Renewal, "id">) => {
    try {
      const sub = subscriptions.find((s) => s.id === id);
      if (!sub) return;

      const newRenewal = { ...renewal };
      const updatedSubData = {
        ...sub,
        expiryDate: renewal.newExpiryDate,
        renewals: [...(sub.renewals || []), newRenewal],
      };

      const response = await fetch(`/api/subscriptions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSubData),
      });
      if (!response.ok) {
        throw new Error("Failed to renew subscription");
      }
      const updated = await response.json();
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === id ? updated : s))
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error renewing subscription");
    }
  };

  const projects = useMemo(() => {
    const set = new Set<string>();
    subscriptions.forEach((s) => {
      if (s.project) set.add(s.project);
    });
    return Array.from(set);
  }, [subscriptions]);

  const customCategories = useMemo(() => {
    const set = new Set<string>();
    subscriptions.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set);
  }, [subscriptions]);

  return {
    subscriptions: filtered,
    allSubscriptions: subscriptions,
    notifications,
    projects,
    customCategories,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    projectFilter,
    setProjectFilter,
    statusFilter,
    setStatusFilter,
    sort,
    setSort,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    renewSubscription,
  };
}
