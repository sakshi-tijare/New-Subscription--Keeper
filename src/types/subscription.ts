export type SubscriptionCategory = string;

export const CATEGORIES: SubscriptionCategory[] = [
  "Domain Name",
  "Server",
  "Google Workspace",
  "Software",
  "Cloud Service",
  "Streaming",
  "Other",
];

export interface Renewal {
  id: string;
  date: string;
  amount: number;
  currency: string;
  paymentProof?: string; // Filename or URL
  newExpiryDate: string;
  notes?: string;
}

export interface Subscription {
  id: string;
  name: string;
  project?: string;
  category: SubscriptionCategory;
  url?: string;
  username?: string;
  password?: string;
  otpRequired: boolean;
  notes?: string;
  activationDate: string;
  expiryDate: string;
  price?: number;
  currency?: string;
  documents?: { name: string; url: string }[];
  renewals?: Renewal[];
}

export type SortOption = "expiry-asc" | "expiry-desc" | "name-asc" | "name-desc";

export function getDaysRemaining(expiryDate: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getStatus(expiryDate: string): "expired" | "expiring" | "active" {
  const days = getDaysRemaining(expiryDate);
  if (days < 0) return "expired";
  if (days <= 30) return "expiring";
  return "active";
}
