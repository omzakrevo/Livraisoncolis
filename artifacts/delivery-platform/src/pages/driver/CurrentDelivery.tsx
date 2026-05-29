import { useListOrders, useUpdateOrderStatus, useConfirmDelivery, getListOrdersQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { statusLabel, statusColor } from "@/lib/orderStatus";
import { Truck, MapPin, Package, ShieldCheck, ChevronRight, CheckCircle2 } from "lucide-react";

const STATUS_FLOW = [
  "accepted", "pickup_en_route", "picked_up", "delivery_en_route", "delivered"
] as const;

const NEXT_STATUS_LABEL: Record<string, string> = {
  accepted: "Je suis en route vers la récupération",
  pickup_en_route: "J'ai récupéré le colis",
  picked_up: "Je suis en route vers la livraison",
  delivery_en_route: "Confirmer la livraison (OTP)",
};

export default function CurrentDelivery() {
  const { data, isLoading } = useListOrders();
  const updateStatus = useUpdateOrderStatus();
  const confirmDelivery = useConfirmDelivery();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [otpInput, setOtpInput] = useState("");

  const orders = data?.orders ?? [];
  const active = orders.find((o) =>
    ["accepted", "pickup_en_route", "picked_up", "delivery_en_route"].includes(o.status)
  );

  const handleNextStatus = () => {
    if (!active) return;
    const idx = STATUS_FLOW.indexOf(active.status as any);
    if (idx < 0 || idx >= STATUS_FLOW.length - 2) return;
    const next = STATUS_FLOW[idx + 1];
    updateStatus.mutate({ id: active.id, data: { status: next } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        toast({ title: "Statut mis à jour" });
      },
    });
  };

  const handleConfirmOtp = () => {
    if (!active) return;
    confirmDelivery.mutate({ id: active.id, data: { otpCode: otpInput } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
        toast({ title: "Livraison confirmée !", description: "Félicitations !" });
        setOtpInput("");
      },
      onError: () => toast({ title: "Code OTP incorrect", variant: "destructive" }),
    });
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-48 w-full" /></div>;

  if (!active) return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Livraison en cours</h1>
      <div className="bg-card border rounded-xl p-12 text-center">
        <Truck className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
        <p className="font-medium text-muted-foreground">Aucune livraison en cours</p>
        <p className="text-sm text-muted-foreground/60 mt-1">Acceptez une commande depuis l'onglet "Commandes".</p>
      </div>
    </div>
  );

  const currentIdx = STATUS_FLOW.indexOf(active.status as any);
  const isOtpStep = active.status === "delivery_en_route";

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Livraison #{active.id}</h1>
        <Badge className={statusColor(active.status)} variant="secondary">{statusLabel(active.status)}</Badge>
      </div>

      {/* Progress */}
      <div className="bg-card border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Progression</h3>
        <div className="space-y-3">
          {STATUS_FLOW.slice(0, -1).map((s, i) => (
            <div key={s} className={`flex items-center gap-3 text-sm ${i <= currentIdx ? "text-foreground" : "text-muted-foreground/40"}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${
                i < currentIdx ? "bg-green-500 text-white" :
                i === currentIdx ? "bg-primary text-primary-foreground" :
                "bg-muted"
              }`}>
                {i < currentIdx ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
              </div>
              {statusLabel(s)}
            </div>
          ))}
        </div>
      </div>

      {/* Order info */}
      <div className="bg-card border rounded-xl p-5 space-y-3">
        {active.pickupAddress && (
          <div className="flex gap-3 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Récupération</p>
              <p className="font-medium">{active.pickupAddress}</p>
            </div>
          </div>
        )}
        <div className="flex gap-3 text-sm">
          <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Livraison</p>
            <p className="font-medium">{active.deliveryAddress}</p>
          </div>
        </div>
        {active.itemDescription && (
          <div className="flex gap-3 text-sm">
            <Package className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Contenu</p>
              <p>{active.itemDescription}</p>
            </div>
          </div>
        )}
        <div className="text-sm font-semibold text-green-600 pt-1">
          Votre gain: {(active.driverAmount ?? 0).toLocaleString()} FCFA
        </div>
      </div>

      {/* OTP confirmation */}
      {isOtpStep ? (
        <div className="bg-card border-2 border-primary rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-primary">Saisir le code OTP du client</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Demandez au client son code à 4 chiffres pour confirmer la livraison.</p>
          <div className="flex gap-3">
            <Input
              placeholder="0000"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              maxLength={4}
              className="text-center text-xl font-mono tracking-widest"
              data-testid="input-otp"
            />
            <Button onClick={handleConfirmOtp} disabled={otpInput.length !== 4 || confirmDelivery.isPending} data-testid="button-confirm-otp">
              Valider
            </Button>
          </div>
        </div>
      ) : NEXT_STATUS_LABEL[active.status] && (
        <Button className="w-full gap-2" size="lg" onClick={handleNextStatus} disabled={updateStatus.isPending} data-testid="button-next-status">
          {NEXT_STATUS_LABEL[active.status]}
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
