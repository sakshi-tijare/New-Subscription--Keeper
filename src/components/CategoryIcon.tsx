import { Globe, Server, Mail, Package, Cloud, Tv, HelpCircle } from "lucide-react";
import { SubscriptionCategory } from "@/types/subscription";

const iconMap: Record<SubscriptionCategory, React.ElementType> = {
  "Domain Name": Globe,
  Server: Server,
  "Google Workspace": Mail,
  Software: Package,
  "Cloud Service": Cloud,
  Streaming: Tv,
  Other: HelpCircle,
};

const colorMap: Record<SubscriptionCategory, string> = {
  "Domain Name": "text-primary bg-primary/10",
  Server: "text-orange-500 bg-orange-500/10",
  "Google Workspace": "text-red-500 bg-red-500/10",
  Software: "text-violet-500 bg-violet-500/10",
  "Cloud Service": "text-sky-500 bg-sky-500/10",
  Streaming: "text-pink-500 bg-pink-500/10",
  Other: "text-muted-foreground bg-muted",
};

export function CategoryIcon({ category }: { category: SubscriptionCategory }) {
  const Icon = iconMap[category] || HelpCircle;
  const color = colorMap[category] || colorMap.Other;

  return (
    <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
  );
}
