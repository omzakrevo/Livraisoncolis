import { useState } from "react";
import { useListDrivers, useBlockUser, useVerifyDriver, getListDriversQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Truck, Search, ShieldOff, ShieldCheck, UserCheck, UserX, Clock } from "lucide-react";

export default function AdminDrivers() {
  const [search, setSearch] = useState("");
  const { data: driversData, isLoading } = useListDrivers();
  const verifyDriver = useVerifyDriver();
  const blockUser = useBlockUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const all = driversData ?? [];

  const pending = all.filter((d) => !d.isVerified && !d.user?.isBlocked);
  const verified = all.filter((d) => d.isVerified);
  const blocked = all.filter((d) => d.user?.isBlocked);

  const filtered = all.filter((d) =>
    !search || d.user?.name?.toLowerCase().includes(search.toLowerCase()) || d.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleVerify = (id: number, isVerified: boolean) => {
    verifyDriver.mutate({ id, data: { isVerified: !isVerified } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListDriversQueryKey() });
        toast({ title: isVerified ? "Vérification retirée" : "Livreur approuvé — il peut maintenant recevoir des commandes" });
      },
    });
  };

  const handleBlock = (userId: number, isBlocked: boolean) => {
    blockUser.mutate({ id: userId, data: { isBlocked: !isBlocked } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListDriversQueryKey() });
        toast({ title: isBlocked ? "Compte débloqué" : "Compte bloqué" });
      },
    });
  };

  const DriverRow = ({ d }: { d: (typeof all)[0] }) => (
    <div key={d.id} className="px-5 py-4 flex items-center justify-between" data-testid={`row-driver-${d.id}`}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {d.user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${d.isAvailable ? "bg-green-500" : "bg-muted-foreground/40"}`} />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium">{d.user?.name}</p>
            {d.isVerified && <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs h-4">Approuvé</Badge>}
            {!d.isVerified && !d.user?.isBlocked && <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs h-4">En attente</Badge>}
            {d.user?.isBlocked && <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs h-4">Bloqué</Badge>}
            {d.isAvailable && <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs h-4">En ligne</Badge>}
          </div>
          <p className="text-xs text-muted-foreground">{d.user?.phone} · {d.vehicleType}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant={d.isVerified ? "outline" : "default"}
          size="sm"
          className={`text-xs gap-1.5 h-8 ${d.isVerified ? "text-muted-foreground" : ""}`}
          onClick={() => handleVerify(d.id, d.isVerified)}
          data-testid={`button-verify-${d.id}`}
        >
          {d.isVerified
            ? <><UserX className="h-3.5 w-3.5" />Retirer</>
            : <><UserCheck className="h-3.5 w-3.5" />Approuver</>
          }
        </Button>
        {d.user && (
          <Button
            variant="ghost"
            size="sm"
            className={`text-xs gap-1.5 h-8 ${d.user.isBlocked ? "text-green-600" : "text-destructive"}`}
            onClick={() => handleBlock(d.user!.id, d.user!.isBlocked)}
            data-testid={`button-block-${d.id}`}
          >
            {d.user.isBlocked
              ? <><ShieldCheck className="h-3.5 w-3.5" />Débloquer</>
              : <><ShieldOff className="h-3.5 w-3.5" />Bloquer</>
            }
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Livreurs</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{all.length} inscrits · {verified.length} approuvés · {pending.length} en attente</p>
        </div>
      </div>

      {/* Pending approval — most important section */}
      {!isLoading && pending.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-amber-200 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-600" />
            <h2 className="font-semibold text-amber-900 text-sm">En attente d'approbation ({pending.length})</h2>
            <span className="ml-auto text-xs text-amber-700">Cliquez sur « Approuver » pour autoriser un livreur à recevoir des commandes</span>
          </div>
          <div className="divide-y divide-amber-100">
            {pending.map((d) => <DriverRow key={d.id} d={d} />)}
          </div>
        </div>
      )}

      {/* Search + all drivers */}
      <div>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Rechercher un livreur..." value={search} onChange={(e) => setSearch(e.target.value)} data-testid="input-search" />
        </div>

        <div className="bg-card border rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="p-5 space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Truck className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">{search ? "Aucun résultat" : "Aucun livreur inscrit"}</p>
            </div>
          ) : (
            <div className="divide-y">
              {filtered.map((d) => <DriverRow key={d.id} d={d} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
