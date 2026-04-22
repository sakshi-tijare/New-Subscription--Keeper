import { useState, useEffect } from "react";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatsCards } from "@/components/StatsCards";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { SubscriptionModal } from "@/components/SubscriptionModal";
import { Subscription } from "@/types/subscription";
import { toast } from "sonner";

const Index = () => {
  const {
    subscriptions, allSubscriptions, notifications, projects, customCategories,
    search, setSearch,
    categoryFilter, setCategoryFilter,
    statusFilter, setStatusFilter,
    sort, setSort,
    addSubscription, updateSubscription, deleteSubscription,
  } = useSubscriptions();

  const [modalOpen, setModalOpen] = useState(false);
  const [editSub, setEditSub] = useState<Subscription | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleAdd = () => {
    setEditSub(null);
    setModalOpen(true);
  };

  const handleEdit = (sub: Subscription) => {
    setEditSub(sub);
    setModalOpen(true);
  };

  const handleSave = (data: Omit<Subscription, "id">) => {
    if (editSub) {
      updateSubscription(editSub.id, data);
      toast.success("Subscription updated");
    } else {
      addSubscription(data);
      toast.success("Subscription added");
    }
  };

  const handleDelete = (id: string) => {
    deleteSubscription(id);
    toast.success("Subscription deleted");
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <DashboardHeader
          search={search} onSearchChange={setSearch}
          categoryFilter={categoryFilter} onCategoryChange={setCategoryFilter}
          statusFilter={statusFilter} onStatusChange={setStatusFilter}
          sort={sort} onSortChange={setSort}
          onAdd={handleAdd}
          notifications={notifications}
          darkMode={darkMode} onToggleDark={() => setDarkMode(!darkMode)}
        />

        <StatsCards subscriptions={allSubscriptions} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subscriptions.map((sub) => (
            <SubscriptionCard
              key={sub.id}
              subscription={sub}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {subscriptions.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No subscriptions found</p>
          </div>
        )}

        <SubscriptionModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          editData={editSub}
          projects={projects}
          customCategories={customCategories}
        />
      </div>
    </div>
  );
};

export default Index;
