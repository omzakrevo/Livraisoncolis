import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { useListOrders } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Package, Clock, CheckCircle2, XCircle, Truck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { statusLabel, statusColor } from "@/lib/orderStatus";

export default function ClientDashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useListOrders();
  const orders = data?.orders ?? [];

  const pending = orders.filter((o) => ["pending", "assigned"].includes(o.status)).length;
  const active = orders.filter((o) => ["accepted", "pickup_en_route", "picked_up", "delivery_en_route"].includes(o.status)).length;
  const delivered = orders.filter((o) => o.status === "delivered").length;
  const cancelled = orders.filter((o) => o.status === "cancelled").length;

  const recent = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bonjour, {user?.name?.split(" ")[0]} 👋</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Que voulez-vous livrer aujourd'hui ?</p>
        </div>
        <Link to="/orders/new">
          <Button className="gap-2 rounded-xl font-semibold" data-testid="button-new-order">
            <PlusCircle className="h-4 w-4" />
            Nouvelle commande
          </Button>
        </Link>
      </div>

      {/* Hero card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0f6030] to-[#1a9b4b] p-5 text-white relative overflow-hidden">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-6xl opacity-20 pointer-events-none">🛵</div>
        <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Livraison rapide et fiable</p>
        <p className="font-bold text-lg mb-3">Nous sommes là pour vous servir !</p>
        <Link to="/orders/new">
          <button className="bg-white text-primary font-semibold text-sm rounded-xl px-4 py-2 hover:bg-white/90 transition-colors">
            Commander maintenant →
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "En attente", value: pending, icon: Clock, colorCls: "text-yellow-600", bgCls: "bg-yellow-50" },
          { label: "En cours", value: active, icon: Truck, colorCls: "text-blue-600", bgCls: "bg-blue-50" },
          { label: "Livrées", value: delivered, icon: CheckCircle2, colorCls: "text-primary", bgCls: "bg-primary/10" },
          { label: "Annulées", value: cancelled, icon: XCircle, colorCls: "text-destructive", bgCls: "bg-red-50" },
        ].map(({ label, value, icon: Icon, colorCls, bgCls }) => (
          <div key={label} className="bg-card border rounded-2xl p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
              <div className={`w-8 h-8 ${bgCls} rounded-xl flex items-center justify-center`}>
                <Icon className={`h-4 w-4 ${colorCls}`} />
              </div>
            </div>
            {isLoading ? <Skeleton className="h-7 w-12" /> : (
              <p className="text-2xl font-bold" data-testid={`stat-${label.toLowerCase()}`}>{value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-card border rounded-2xl">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Commandes récentes</h2>
          <Link to="/orders">
            <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary">Tout voir</Button>
          </Link>
        </div>
        {isLoading ? (
          <div className="p-5 space-y-3">
            {[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
          </div>
        ) : recent.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Package className="h-8 w-8 text-primary/40" />
            </div>
            <p className="font-medium text-muted-foreground">Aucune commande</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Commencez par créer une nouvelle commande.</p>
            <Link to="/orders/new">
              <Button size="sm" className="mt-4 rounded-xl">Créer une commande</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {recent.map((order) => (
              <Link key={order.id} to={`/orders/${order.id}`}>
                <div className="px-5 py-4 hover:bg-muted/30 transition-colors cursor-pointer flex items-center justify-between" data-testid={`row-order-${order.id}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        {order.orderType === "delivery" ? "Livraison" : "Course"} #{order.id}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-48">{order.deliveryAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={statusColor(order.status)} variant="secondary">
                      {statusLabel(order.status)}
                    </Badge>
                    <span className="text-xs text-muted-foreground hidden sm:block">
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
