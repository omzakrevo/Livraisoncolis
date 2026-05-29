import { Link } from "wouter";
import { useState } from "react";
import { useListOrders } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Package, PlusCircle, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { statusLabel, statusColor } from "@/lib/orderStatus";

export default function ClientOrders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data, isLoading } = useListOrders();
  const orders = data?.orders ?? [];

  const filtered = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (search && !o.deliveryAddress.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const tabs = [
    { key: "all", label: "Toutes" },
    { key: "pending", label: "En attente" },
    { key: "delivery_en_route", label: "En cours" },
    { key: "delivered", label: "Livrees" },
    { key: "cancelled", label: "Annulees" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mes commandes</h1>
        <Link to="/orders/new">
          <Button className="gap-2" data-testid="button-new-order">
            <PlusCircle className="h-4 w-4" />
            Nouvelle
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Rechercher par adresse..." value={search}
          onChange={(e) => setSearch(e.target.value)} data-testid="input-search" />
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setStatusFilter(t.key)}
            data-testid={`tab-${t.key}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === t.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/60"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-5 space-y-3">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="font-medium text-muted-foreground">Aucune commande trouvée</p>
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map((order) => (
              <Link key={order.id} to={`/orders/${order.id}`}>
                <div className="px-5 py-4 hover:bg-muted/30 cursor-pointer flex items-center justify-between" data-testid={`row-order-${order.id}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {order.orderType === "delivery" ? "Livraison" : "Course"} #{order.id}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-52">{order.deliveryAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge className={statusColor(order.status)} variant="secondary">{statusLabel(order.status)}</Badge>
                    <span className="text-xs text-muted-foreground hidden md:block">
                      {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: fr })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
