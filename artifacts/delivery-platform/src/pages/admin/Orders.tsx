import { useState } from "react";
import { useListOrders, useUpdateOrderStatus, useCancelOrder, getListOrdersQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { statusLabel, statusColor, ORDER_STATUSES } from "@/lib/orderStatus";
import { ClipboardList, Search, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { data, isLoading } = useListOrders();
  const updateStatus = useUpdateOrderStatus();
  const cancelOrder = useCancelOrder();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const orders = (data?.orders ?? []).filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (search && !o.deliveryAddress.toLowerCase().includes(search.toLowerCase()) &&
        !o.customer?.name?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Commandes</h1>
        <span className="text-sm text-muted-foreground">{data?.total ?? 0} au total</span>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} data-testid="input-search" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44" data-testid="select-status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {ORDER_STATUSES.map((s) => <SelectItem key={s} value={s}>{statusLabel(s)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-5 space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <ClipboardList className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucune commande</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/30">
                <tr className="text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Client</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Adresse</th>
                  <th className="px-4 py-3 text-left">Statut</th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell">Montant</th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-muted/20 transition-colors" data-testid={`row-order-${o.id}`}>
                    <td className="px-4 py-3 text-sm font-mono">#{o.id}</td>
                    <td className="px-4 py-3 text-sm font-medium">{o.customer?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell max-w-40 truncate">{o.deliveryAddress}</td>
                    <td className="px-4 py-3">
                      <Badge className={statusColor(o.status)} variant="secondary">{statusLabel(o.status)}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm hidden lg:table-cell">{o.totalPrice != null ? `${o.totalPrice.toLocaleString()} FCFA` : "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">
                      {formatDistanceToNow(new Date(o.createdAt), { addSuffix: true, locale: fr })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!["delivered", "cancelled"].includes(o.status) && (
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive h-7 text-xs"
                          onClick={() => {
                            cancelOrder.mutate({ id: o.id }, {
                              onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() }); toast({ title: "Commande annulée" }); }
                            });
                          }}
                          data-testid={`button-cancel-${o.id}`}>
                          <XCircle className="h-3.5 w-3.5 mr-1" />Annuler
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
