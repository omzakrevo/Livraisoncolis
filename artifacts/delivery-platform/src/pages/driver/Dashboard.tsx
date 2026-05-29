import { useAuth } from "@/lib/auth";
import { useGetMyDriver, useSetDriverAvailability, useListOrders, getGetMyDriverQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { statusLabel, statusColor } from "@/lib/orderStatus";
import { Truck, Package, CheckCircle2, DollarSign, ToggleRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export default function DriverDashboard() {
  const { user } = useAuth();
  const { data: driver, isLoading: driverLoading } = useGetMyDriver();
  const { data: ordersData, isLoading: ordersLoading } = useListOrders();
  const setAvailability = useSetDriverAvailability();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const orders = ordersData?.orders ?? [];
  const delivered = orders.filter((o) => o.status === "delivered");
  const active = orders.find((o) =>
    ["accepted", "pickup_en_route", "picked_up", "delivery_en_route"].includes(o.status)
  );
  const totalEarnings = delivered.reduce((s, o) => s + (o.driverAmount ?? 0), 0);

  const handleToggle = (checked: boolean) => {
    setAvailability.mutate({ data: { isAvailable: checked } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMyDriverQueryKey() });
        toast({ title: checked ? "Vous êtes en ligne" : "Vous êtes hors ligne" });
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bonjour, {user?.name?.split(" ")[0]}</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Tableau de bord livreur</p>
        </div>
      </div>

      {/* Availability toggle */}
      <div className={`rounded-xl p-5 border-2 flex items-center justify-between transition-colors ${
        driver?.isAvailable ? "bg-green-50 border-green-200" : "bg-card border-border"
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            driver?.isAvailable ? "bg-green-100" : "bg-muted"
          }`}>
            <ToggleRight className={`h-5 w-5 ${driver?.isAvailable ? "text-green-600" : "text-muted-foreground"}`} />
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
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
          Votre compte livreur est en attente de vérification par l'administrateur. Vous ne pourrez pas recevoir de commandes tant que votre compte n'est pas vérifié.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total livraisons", value: delivered.length, icon: CheckCircle2, color: "text-green-600" },
          { label: "Gains totaux", value: `${totalEarnings.toLocaleString()} FCFA`, icon: DollarSign, color: "text-primary" },
          { label: "Commandes reçues", value: orders.length, icon: Package, color: "text-blue-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            {ordersLoading ? <Skeleton className="h-7 w-16" /> : (
              <p className="text-xl font-bold" data-testid={`stat-${label.replace(/\s/g, "-").toLowerCase()}`}>{value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Active order */}
      {active && (
        <div className="bg-card border-2 border-primary rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Truck className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-primary">Commande en cours</h2>
          </div>
          <div className="space-y-2 text-sm mb-4">
            {active.pickupAddress && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Récupération</span>
                <span className="font-medium max-w-48 text-right truncate">{active.pickupAddress}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Livraison</span>
              <span className="font-medium max-w-48 text-right truncate">{active.deliveryAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Statut</span>
              <Badge className={statusColor(active.status)} variant="secondary">{statusLabel(active.status)}</Badge>
            </div>
          </div>
          <Link to="/driver/current">
            <Button className="w-full" size="sm" data-testid="button-view-current">Voir la commande</Button>
          </Link>
        </div>
      )}

      {/* Recent history */}
      <div className="bg-card border rounded-xl">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Livraisons récentes</h2>
          <Link to="/driver/history">
            <Button variant="ghost" size="sm" className="text-xs">Tout voir</Button>
          </Link>
        </div>
        {ordersLoading ? (
          <div className="p-5 space-y-3">{[1,2].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : delivered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Aucune livraison effectuée</div>
        ) : (
          <div className="divide-y">
            {delivered.slice(0, 4).map((o) => (
              <div key={o.id} className="px-5 py-3 flex items-center justify-between text-sm" data-testid={`row-order-${o.id}`}>
                <div>
                  <p className="font-medium">Commande #{o.id}</p>
                  <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(o.createdAt), { addSuffix: true, locale: fr })}</p>
                </div>
                <span className="font-semibold text-green-600">+{(o.driverAmount ?? 0).toLocaleString()} FCFA</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
