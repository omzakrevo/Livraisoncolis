import { useState, useEffect } from "react";
import { useListOrders, useAcceptOrder, useRejectOrder, getListOrdersQueryKey, ListOrdersParams } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ClipboardList, MapPin, Package, CheckCircle2, XCircle } from "lucide-react";

function CountdownTimer({ seconds }: { seconds: number }) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (remaining <= 0) return;
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining]);
  return (
    <span className={`text-xs font-mono font-bold ${remaining <= 10 ? "text-destructive" : "text-muted-foreground"}`}>
      {remaining}s
    </span>
  );
}

export default function DriverOrders() {
  const params: ListOrdersParams = { status: "assigned" };
  const { data, isLoading, refetch, isFetching } = useListOrders(params, {
    query: { queryKey: getListOrdersQueryKey(params), refetchInterval: 5000 },
  });
  const acceptOrder = useAcceptOrder();
  const rejectOrder = useRejectOrder();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const assigned = data?.orders ?? [];

  const handleAccept = (id: number) => {
    acceptOrder.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        toast({ title: "Commande acceptée !" });
      },
    });
  };

  const handleReject = (id: number) => {
    rejectOrder.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        toast({ title: "Commande refusée" });
      },
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Commandes disponibles</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-primary/10 text-primary rounded-full px-3 py-1.5 text-xs font-semibold">
            <span className={`w-1.5 h-1.5 rounded-full ${isFetching ? "bg-primary animate-ping" : "bg-primary animate-pulse"}`} />
            En direct
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} data-testid="button-refresh">Actualiser</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1,2].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}</div>
      ) : assigned.length === 0 ? (
        <div className="bg-card border rounded-xl p-12 text-center">
          <ClipboardList className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="font-medium text-muted-foreground">Aucune commande disponible</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Assurez-vous d'être en ligne pour recevoir des commandes.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assigned.map((order) => (
            <div key={order.id} className="bg-card border-2 border-primary/30 rounded-xl p-5" data-testid={`card-order-${order.id}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Commande #{order.id}</span>
                  <Badge variant="secondary" className="text-xs">{order.orderType === "delivery" ? "Livraison" : "Course"}</Badge>
                </div>
                <CountdownTimer seconds={30} />
              </div>
              <div className="space-y-2 mb-4">
                {order.pickupAddress && (
                  <div className="flex gap-2 text-sm">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                    <div><span className="text-muted-foreground text-xs">Récup. </span>{order.pickupAddress}</div>
                  </div>
                )}
                <div className="flex gap-2 text-sm">
                  <MapPin className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                  <div><span className="text-muted-foreground text-xs">Livraison </span>{order.deliveryAddress}</div>
                </div>
                {order.itemDescription && (
                  <div className="text-sm text-muted-foreground pl-5">{order.itemDescription}</div>
                )}
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-green-600">{(order.driverAmount ?? 0).toLocaleString()} FCFA</span>
                <span className="text-xs text-muted-foreground">Paiement: espèces</span>
              </div>
              <div className="flex gap-3">
                <Button className="flex-1 gap-2" onClick={() => handleAccept(order.id)} disabled={acceptOrder.isPending} data-testid={`button-accept-${order.id}`}>
                  <CheckCircle2 className="h-4 w-4" />
                  Accepter
                </Button>
                <Button variant="outline" className="flex-1 gap-2 border-destructive text-destructive hover:bg-destructive/10" onClick={() => handleReject(order.id)} disabled={rejectOrder.isPending} data-testid={`button-reject-${order.id}`}>
                  <XCircle className="h-4 w-4" />
                  Refuser
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
