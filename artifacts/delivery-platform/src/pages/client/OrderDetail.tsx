import { useParams } from "wouter";
import { useGetOrder, getGetOrderQueryKey, useCancelOrder, getListOrdersQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useQueryClient } from "@tanstack/react-query";
import { statusLabel, statusColor } from "@/lib/orderStatus";
import { Package, MapPin, Phone, Truck, Clock, ShieldCheck, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const orderId = parseInt(id ?? "0", 10);
  const { data: order, isLoading } = useGetOrder(orderId, { query: { enabled: !!orderId, queryKey: getGetOrderQueryKey(orderId) } });
  const cancelOrder = useCancelOrder();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleCancel = () => {
    cancelOrder.mutate({ id: orderId }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetOrderQueryKey(orderId) });
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        toast({ title: "Commande annulée" });
      },
    });
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-48 w-full" /></div>;
  if (!order) return <div className="text-center py-10 text-muted-foreground">Commande introuvable</div>;

  const canCancel = ["pending", "assigned"].includes(order.status);
  const isActive = ["accepted", "pickup_en_route", "picked_up", "delivery_en_route"].includes(order.status);

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Commande #{order.id}</h1>
          <p className="text-muted-foreground text-sm capitalize">{order.orderType === "delivery" ? "Livraison de colis" : "Course"}</p>
        </div>
        <Badge className={statusColor(order.status)} variant="secondary">{statusLabel(order.status)}</Badge>
      </div>

      {/* OTP */}
      {order.otpCode && isActive && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Code de confirmation OTP</span>
          </div>
          <p className="text-3xl font-mono font-bold tracking-widest text-primary" data-testid="text-otp">{order.otpCode}</p>
          <p className="text-xs text-muted-foreground mt-1">Donnez ce code au livreur pour confirmer la livraison.</p>
        </div>
      )}

      {/* Details */}
      <div className="bg-card border rounded-xl p-5 space-y-3">
        {order.pickupAddress && (
          <div className="flex gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Récupération</p>
              <p className="text-sm font-medium">{order.pickupAddress}</p>
            </div>
          </div>
        )}
        <div className="flex gap-3">
          <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Livraison</p>
            <p className="text-sm font-medium">{order.deliveryAddress}</p>
          </div>
        </div>
        {order.itemDescription && (
          <div className="flex gap-3">
            <Package className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Description</p>
              <p className="text-sm">{order.itemDescription}</p>
            </div>
          </div>
        )}
        {order.recipientPhone && (
          <div className="flex gap-3">
            <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Destinataire</p>
              <p className="text-sm">{order.recipientPhone}</p>
            </div>
          </div>
        )}
      </div>

      {/* Driver */}
      {order.driver && (
        <div className="bg-card border rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Livreur</p>
              <p className="font-semibold">{order.driver.user?.name}</p>
              <p className="text-sm text-muted-foreground">{order.driver.vehicleType} · {order.driver.user?.phone}</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment */}
      <div className="bg-card border rounded-xl p-5">
        <h3 className="font-semibold mb-3">Paiement</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total</span>
            <span className="font-medium">{order.totalPrice != null ? `${order.totalPrice.toLocaleString()} FCFA` : "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mode</span>
            <span>Espèces</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Statut paiement</span>
            <Badge variant="secondary" className={order.paymentStatus === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
              {order.paymentStatus === "paid" ? "Payé" : "En attente"}
            </Badge>
          </div>
        </div>
      </div>

      {canCancel && (
        <Button variant="destructive" className="w-full gap-2" onClick={handleCancel} disabled={cancelOrder.isPending} data-testid="button-cancel">
          <XCircle className="h-4 w-4" />
          Annuler la commande
        </Button>
      )}
    </div>
  );
}
