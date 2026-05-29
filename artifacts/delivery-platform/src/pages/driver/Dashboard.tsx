import { useAuth } from "@/lib/auth";
import {
  useGetMyDriver,
  useSetDriverAvailability,
  useListOrders,
  useAcceptOrder,
  useRejectOrder,
  getGetMyDriverQueryKey,
  getListOrdersQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { statusLabel, statusColor } from "@/lib/orderStatus";
import {
  Truck,
  Package,
  CheckCircle2,
  DollarSign,
  ToggleRight,
  Radio,
  PhoneIncoming,
  MapPin,
  X,
  Check,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import DeliveryTracker from "@/components/DeliveryTracker";
import { useIncomingOrderAlert } from "@/hooks/useIncomingOrderAlert";

export default function DriverDashboard() {
  const { user } = useAuth();
  const { data: driver, isLoading: driverLoading } = useGetMyDriver({
    query: { queryKey: getGetMyDriverQueryKey(), refetchInterval: 5000 },
  });
  const { data: ordersData, isLoading: ordersLoading } = useListOrders(undefined, {
    query: { queryKey: getListOrdersQueryKey(), refetchInterval: 3000 },
  });
  const setAvailability = useSetDriverAvailability();
  const acceptOrder = useAcceptOrder();
  const rejectOrder = useRejectOrder();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const orders = ordersData?.orders ?? [];
  const delivered = orders.filter((o) => o.status === "delivered");
  // "assigned" = order assigned to this driver, waiting for accept/reject
  const pending = orders.find((o) => o.status === "assigned");
  const active = orders.find((o) =>
    ["accepted", "pickup_en_route", "picked_up", "delivery_en_route"].includes(o.status)
  );
  const totalEarnings = delivered.reduce((s, o) => s + (o.driverAmount ?? 0), 0);

  const countdown = useIncomingOrderAlert(pending);

  const handleToggle = (checked: boolean) => {
    setAvailability.mutate({ data: { isAvailable: checked } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMyDriverQueryKey() });
        toast({ title: checked ? "Vous êtes en ligne" : "Vous êtes hors ligne" });
      },
    });
  };

  const handleAccept = () => {
    if (!pending) return;
    acceptOrder.mutate({ id: pending.id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        toast({ title: "Commande acceptée !", description: "Rendez-vous au point de récupération." });
      },
      onError: () => toast({ title: "Erreur", description: "Impossible d'accepter la commande.", variant: "destructive" }),
    });
  };

  const handleReject = () => {
    if (!pending) return;
    rejectOrder.mutate({ id: pending.id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        toast({ title: "Commande refusée", description: "La commande sera réassignée." });
      },
      onError: () => toast({ title: "Erreur", description: "Impossible de refuser la commande.", variant: "destructive" }),
    });
  };

  const countdownColor =
    countdown > 15 ? "text-green-600" : countdown > 5 ? "text-yellow-500" : "text-red-500";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bonjour, {user?.name?.split(" ")[0]} 👋</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Tableau de bord livreur</p>
        </div>
        <div className="flex items-center gap-1.5 bg-primary/10 text-primary rounded-full px-3 py-1.5 text-xs font-semibold">
          <Radio className="h-3 w-3 animate-pulse" />
          En direct
        </div>
      </div>

      {/* ─── INCOMING ORDER ALERT ─── */}
      {pending && (
        <div
          className="rounded-2xl overflow-hidden border-2 border-orange-400 shadow-lg animate-in slide-in-from-top-4 duration-300"
          data-testid="incoming-order-card"
        >
          {/* flashing header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <PhoneIncoming className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-base leading-none">Nouvelle commande !</p>
                  <p className="text-white/80 text-xs mt-0.5">Commande #{pending.id}</p>
                </div>
              </div>
              {/* countdown ring */}
              <div className="flex flex-col items-center">
                <div className={`text-2xl font-black tabular-nums ${countdown <= 10 ? "text-white animate-pulse" : "text-white"}`}>
                  {countdown}s
                </div>
                <p className="text-white/70 text-xs">restantes</p>
              </div>
            </div>

            {/* progress bar */}
            <div className="mt-3 h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-1000"
                style={{ width: `${(countdown / 30) * 100}%` }}
              />
            </div>
          </div>

          {/* order details */}
          <div className="bg-orange-50 px-5 py-4 space-y-3">
            {pending.pickupAddress && (
              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Récupération</p>
                  <p className="text-sm font-semibold">{pending.pickupAddress}</p>
                </div>
              </div>
            )}
            <div className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Livraison</p>
                <p className="text-sm font-semibold">{pending.deliveryAddress}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-orange-200">
              <div className="flex items-center gap-1.5 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Votre gain estimé</span>
              </div>
              <span className="font-bold text-lg text-green-600">
                {(pending.driverAmount ?? 0).toLocaleString()} FCFA
              </span>
            </div>
          </div>

          {/* action buttons */}
          <div className="grid grid-cols-2 gap-0 border-t border-orange-200">
            <button
              onClick={handleReject}
              disabled={rejectOrder.isPending || acceptOrder.isPending}
              className="flex items-center justify-center gap-2 py-4 bg-white hover:bg-red-50 text-red-500 font-semibold text-sm border-r border-orange-200 transition-colors disabled:opacity-50"
              data-testid="button-reject-order"
            >
              <X className="h-4 w-4" />
              Refuser
            </button>
            <button
              onClick={handleAccept}
              disabled={acceptOrder.isPending || rejectOrder.isPending}
              className="flex items-center justify-center gap-2 py-4 bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-colors disabled:opacity-50"
              data-testid="button-accept-order"
            >
              <Check className="h-4 w-4" />
              {acceptOrder.isPending ? "Acceptation…" : "Accepter"}
            </button>
          </div>
        </div>
      )}

      {/* Availability toggle */}
      <div className={`rounded-2xl p-5 border-2 flex items-center justify-between transition-all ${
        driver?.isAvailable
          ? "bg-primary/5 border-primary/30"
          : "bg-card border-border"
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
            driver?.isAvailable ? "bg-primary/15" : "bg-muted"
          }`}>
            <ToggleRight className={`h-5 w-5 ${driver?.isAvailable ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          <div>
            <p className="font-semibold">{driver?.isAvailable ? "En ligne — disponible" : "Hors ligne"}</p>
            <p className="text-sm text-muted-foreground">
              {driver?.isAvailable ? "Vous recevez des commandes" : "Activez pour recevoir des commandes"}
            </p>
          </div>
        </div>
        {driverLoading ? <Skeleton className="h-6 w-11" /> : (
          <Switch
            checked={driver?.isAvailable ?? false}
            onCheckedChange={handleToggle}
            disabled={setAvailability.isPending}
            data-testid="switch-availability"
          />
        )}
      </div>

      {/* Verification warning */}
      {driver && !driver.isVerified && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-800">
          ⚠️ Votre compte livreur est en attente de vérification. Vous ne pourrez pas recevoir de commandes tant que votre compte n'est pas vérifié.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total livraisons", value: delivered.length, icon: CheckCircle2, colorCls: "text-primary", bgCls: "bg-primary/10" },
          { label: "Gains totaux", value: `${totalEarnings.toLocaleString()} FCFA`, icon: DollarSign, colorCls: "text-[#f5c518]", bgCls: "bg-yellow-50" },
          { label: "Commandes reçues", value: orders.length, icon: Package, colorCls: "text-blue-600", bgCls: "bg-blue-50" },
        ].map(({ label, value, icon: Icon, colorCls, bgCls }) => (
          <div key={label} className="bg-card border rounded-2xl p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
              <div className={`w-8 h-8 ${bgCls} rounded-xl flex items-center justify-center`}>
                <Icon className={`h-4 w-4 ${colorCls}`} />
              </div>
            </div>
            {ordersLoading ? <Skeleton className="h-7 w-16" /> : (
              <p className="text-xl font-bold" data-testid={`stat-${label.replace(/\s/g, "-").toLowerCase()}`}>{value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Active order with inline tracker */}
      {active && (
        <div className="rounded-2xl border-2 border-primary/30 overflow-hidden" data-testid="active-order-card">
          <div className="bg-gradient-to-r from-[#0f6030] to-[#1a9b4b] px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#f5c518] animate-ping" />
              <h2 className="font-semibold text-sm text-white uppercase tracking-wide">Livraison en cours</h2>
            </div>
            <Badge className={statusColor(active.status)} variant="secondary">{statusLabel(active.status)}</Badge>
          </div>

          <div className="px-5 pt-4 pb-2 bg-primary/5">
            <DeliveryTracker status={active.status as Parameters<typeof DeliveryTracker>[0]["status"]} />
          </div>

          <div className="px-5 pb-4 bg-primary/5 space-y-2 text-sm">
            {active.pickupAddress && (
              <div className="flex gap-2 items-start">
                <span className="text-muted-foreground shrink-0 w-24">Récupération</span>
                <span className="font-medium truncate">{active.pickupAddress}</span>
              </div>
            )}
            <div className="flex gap-2 items-start">
              <span className="text-muted-foreground shrink-0 w-24">Livraison</span>
              <span className="font-medium truncate">{active.deliveryAddress}</span>
            </div>
            <div className="flex gap-2 items-center pt-1">
              <span className="text-muted-foreground shrink-0 w-24">Votre gain</span>
              <span className="font-bold text-green-600">{(active.driverAmount ?? 0).toLocaleString()} FCFA</span>
            </div>
          </div>

          <div className="px-5 py-3 bg-card border-t">
            <Link to="/driver/current">
              <Button className="w-full gap-2 font-semibold" size="sm" data-testid="button-view-current">
                <Truck className="h-4 w-4" />
                Gérer la livraison →
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Empty state when no orders */}
      {!pending && !active && !ordersLoading && driver?.isAvailable && (
        <div className="rounded-2xl border border-dashed border-primary/30 p-8 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Truck className="h-6 w-6 text-primary" />
          </div>
          <p className="font-semibold text-foreground">En attente de commandes</p>
          <p className="text-sm text-muted-foreground mt-1">Les nouvelles commandes apparaîtront ici automatiquement</p>
        </div>
      )}

      {/* Recent deliveries */}
      <div className="bg-card border rounded-2xl">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Livraisons récentes</h2>
          <Link to="/driver/history">
            <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary">Tout voir</Button>
          </Link>
        </div>
        {ordersLoading ? (
          <div className="p-5 space-y-3">{[1, 2].map(i => <Skeleton key={i} className="h-12 w-full rounded-xl" />)}</div>
        ) : delivered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Aucune livraison effectuée</div>
        ) : (
          <div className="divide-y">
            {delivered.slice(0, 4).map((o) => (
              <div key={o.id} className="px-5 py-3 flex items-center justify-between text-sm" data-testid={`row-order-${o.id}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Commande #{o.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(o.createdAt), { addSuffix: true, locale: fr })}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-primary">+{(o.driverAmount ?? 0).toLocaleString()} FCFA</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
