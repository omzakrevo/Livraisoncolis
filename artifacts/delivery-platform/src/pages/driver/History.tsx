import { useListOrders } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { History, CheckCircle2 } from "lucide-react";
import { statusLabel, statusColor } from "@/lib/orderStatus";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export default function DriverHistory() {
  const { data, isLoading } = useListOrders({ status: "delivered" });
  const orders = data?.orders ?? [];
  const totalEarnings = orders.reduce((s, o) => s + (o.driverAmount ?? 0), 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Historique</h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Livraisons</p>
          <p className="text-2xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Gains totaux</p>
          <p className="text-2xl font-bold text-green-600">{totalEarnings.toLocaleString()} FCFA</p>
        </div>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-5 space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full" />)}</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <History className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucune livraison effectuée</p>
          </div>
        ) : (
          <div className="divide-y">
            {orders.map((o) => (
              <div key={o.id} className="px-5 py-4 flex items-center justify-between" data-testid={`row-order-${o.id}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Commande #{o.id}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-40">{o.deliveryAddress}</p>
                    <p className="text-xs text-muted-foreground/60">{formatDistanceToNow(new Date(o.createdAt), { addSuffix: true, locale: fr })}</p>
                  </div>
                </div>
                <span className="font-semibold text-green-600 text-sm">+{(o.driverAmount ?? 0).toLocaleString()} FCFA</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
