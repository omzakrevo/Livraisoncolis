import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { useListOrders, getListOrdersQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Package, Clock, CheckCircle2, XCircle, Truck, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { statusLabel, statusColor } from "@/lib/orderStatus";
import DeliveryTracker from "@/components/DeliveryTracker";

const ACTIVE_STATUSES = ["accepted", "pickup_en_route", "picked_up", "delivery_en_route"] as const;
type ActiveStatus = typeof ACTIVE_STATUSES[number];

function isActive(s: string): s is ActiveStatus {
  return (ACTIVE_STATUSES as readonly string[]).includes(s);
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useListOrders(undefined, {
    query: { queryKey: getListOrdersQueryKey(), refetchInterval: 6000 },
  });
  const orders = data?.orders ?? [];

  const pending = orders.filter((o) => ["pending", "assigned"].includes(o.status)).length;
  const active = orders.filter((o) => isActive(o.status)).length;
  const delivered = orders.filter((o) => o.status === "delivered").length;
  const cancelled = orders.filter((o) => o.status === "cancelled").length;

  const activeOrder = orders.find((o) => isActive(o.status));
  const recent = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome banner with photo */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#062d17] via-[#0f6030] to-[#1a9b4b] min-h-[140px] flex items-center">
        {/* Text side */}
        <div className="flex-1 px-6 py-5 z-10">
          <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Tableau de bord</p>
          <h1 className="text-2xl font-extrabold text-white mb-1">
            Bonjour, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-white/70 text-sm mb-4">Que voulez-vous livrer aujourd'hui ?</p>
          <Link to="/orders/new">
            <Button
              className="gap-2 rounded-xl font-bold bg-[#f5c518] hover:bg-[#e6b800] text-[#062d17] border-0 shadow-md"
              size="sm"
              data-testid="button-new-order"
            >
              <PlusCircle className="h-4 w-4" />
              Nouvelle commande
            </Button>
          </Link>
        </div>
        {/* Photo */}
        <div className="hidden sm:block relative h-[140px] w-[140px] shrink-0">
          <img
            src="/hero-photo.png"
            alt="TELIMA Bobo-Dioulasso"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          {/* fade to left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f6030] to-transparent" style={{ width: "40%" }} />
        </div>
      </div>

      {/* Active delivery tracker — shown prominently when order is in progress */}
      {!isLoading && activeOrder && (
        <div className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 p-5 relative overflow-hidden" data-testid="active-delivery-card">
          {/* Animated glow pulse */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ animation: "card-glow 3s ease-in-out infinite" }} />
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Truck className="h-5 w-5 text-primary" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full" style={{ animation: "ping-dot 1.5s ease-in-out infinite" }} />
              </div>
              <span className="font-bold text-primary">Livraison en cours</span>
            </div>
            <Badge className={statusColor(activeOrder.status)} variant="secondary">
              {statusLabel(activeOrder.status)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Commande #{activeOrder.id} · {activeOrder.deliveryAddress}
          </p>

          <DeliveryTracker status={activeOrder.status as Parameters<typeof DeliveryTracker>[0]["status"]} />

          <Link to={`/orders/${activeOrder.id}`}>
            <Button variant="outline" size="sm" className="mt-3 gap-2 border-primary/30 text-primary hover:bg-primary hover:text-white w-full sm:w-auto transition-colors">
              Voir les détails
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Hero card (hidden when active order is shown) */}
      {!activeOrder && (
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
      )}

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

      <style>{`
        @keyframes card-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(26,155,75,0); }
          50% { box-shadow: 0 0 20px 4px rgba(26,155,75,0.12); }
        }
        @keyframes ping-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
