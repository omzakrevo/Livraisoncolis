export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "En attente",
    assigned: "Livreur assigné",
    accepted: "Acceptée",
    pickup_en_route: "En route (récup.)",
    picked_up: "Colis récupéré",
    delivery_en_route: "En livraison",
    delivered: "Livré",
    cancelled: "Annulée",
  };
  return labels[status] ?? status;
}

export function statusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    assigned: "bg-blue-100 text-blue-800",
    accepted: "bg-blue-100 text-blue-800",
    pickup_en_route: "bg-indigo-100 text-indigo-800",
    picked_up: "bg-indigo-100 text-indigo-800",
    delivery_en_route: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return colors[status] ?? "bg-gray-100 text-gray-800";
}

export const ORDER_STATUSES = [
  "pending", "assigned", "accepted", "pickup_en_route",
  "picked_up", "delivery_en_route", "delivered", "cancelled"
] as const;
