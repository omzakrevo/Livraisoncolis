import { useState } from "react";
import { useListUsers, useBlockUser, getListUsersQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Users, Search, ShieldOff, ShieldCheck } from "lucide-react";

export default function AdminClients() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useListUsers({ role: "client" });
  const blockUser = useBlockUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const users = (data?.users ?? []).filter((u) =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleBlock = (id: number, isBlocked: boolean) => {
    blockUser.mutate({ id, data: { isBlocked: !isBlocked } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
        toast({ title: isBlocked ? "Compte débloqué" : "Compte bloqué" });
      },
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clients</h1>
        <span className="text-sm text-muted-foreground">{data?.total ?? 0} inscrits</span>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Rechercher un client..." value={search} onChange={(e) => setSearch(e.target.value)} data-testid="input-search" />
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-5 space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full" />)}</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucun client</p>
          </div>
        ) : (
          <div className="divide-y">
            {users.map((u) => (
              <div key={u.id} className="px-5 py-4 flex items-center justify-between" data-testid={`row-user-${u.id}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email} · {u.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {u.isBlocked && <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">Bloqué</Badge>}
                  <Button variant="ghost" size="sm" className={`text-xs gap-1.5 h-8 ${u.isBlocked ? "text-green-600" : "text-destructive"}`}
                    onClick={() => handleToggleBlock(u.id, u.isBlocked)}
                    data-testid={`button-block-${u.id}`}>
                    {u.isBlocked ? <><ShieldCheck className="h-3.5 w-3.5" />Débloquer</> : <><ShieldOff className="h-3.5 w-3.5" />Bloquer</>}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
