import { useListNotifications, useMarkAllNotificationsRead, useMarkNotificationRead, getListNotificationsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, CheckCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export default function Notifications() {
  const { data: notifications, isLoading } = useListNotifications();
  const markAll = useMarkAllNotificationsRead();
  const markOne = useMarkNotificationRead();
  const queryClient = useQueryClient();

  const notifs = Array.isArray(notifications) ? notifications : [];

  const handleMarkAll = () => {
    markAll.mutate(undefined, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() }),
    });
  };

  const handleMarkOne = (id: number) => {
    markOne.mutate({ id }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() }),
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {notifs.some((n) => !n.isRead) && (
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={handleMarkAll} data-testid="button-mark-all">
            <CheckCheck className="h-4 w-4" />
            Tout marquer lu
          </Button>
        )}
      </div>
      <div className="bg-card border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-5 space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full" />)}</div>
        ) : notifs.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucune notification</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifs.map((n) => (
              <div key={n.id} className={`px-5 py-4 flex gap-3 cursor-pointer transition-colors ${!n.isRead ? "bg-primary/5" : "hover:bg-muted/30"}`}
                onClick={() => !n.isRead && handleMarkOne(n.id)} data-testid={`notification-${n.id}`}>
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.isRead ? "bg-transparent" : "bg-primary"}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${n.isRead ? "text-foreground" : "text-foreground"}`}>{n.title}</p>
                  <p className="text-sm text-muted-foreground">{n.message}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: fr })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
