import { CheckCircle2, Circle, Loader2 } from "lucide-react";

type OrderStatus =
  | "pending"
  | "assigned"
  | "accepted"
  | "pickup_en_route"
  | "picked_up"
  | "delivery_en_route"
  | "delivered"
  | "cancelled";

interface Stage {
  id: string;
  label: string;
  sublabel: string;
  statuses: OrderStatus[];
}

const STAGES: Stage[] = [
  { id: "created",   label: "Reçue",              sublabel: "Commande enregistrée",      statuses: ["pending", "assigned"] },
  { id: "assigned",  label: "Livreur trouvé",      sublabel: "En route vers le colis",    statuses: ["accepted", "pickup_en_route"] },
  { id: "picked",    label: "Colis récupéré",      sublabel: "Livreur a le colis",        statuses: ["picked_up"] },
  { id: "enroute",   label: "En livraison",         sublabel: "En chemin vers vous",       statuses: ["delivery_en_route"] },
  { id: "done",      label: "Livré !",              sublabel: "Mission accomplie",         statuses: ["delivered"] },
];

function getStageIndex(status: OrderStatus): number {
  for (let i = 0; i < STAGES.length; i++) {
    if (STAGES[i].statuses.includes(status)) return i;
  }
  return 0;
}

interface DeliveryTrackerProps {
  status: OrderStatus;
  compact?: boolean;
}

export default function DeliveryTracker({ status, compact = false }: DeliveryTrackerProps) {
  if (status === "cancelled") return null;

  const current = getStageIndex(status);
  const isComplete = status === "delivered";

  return (
    <div className={compact ? "py-2" : "py-4"}>
      <div className="flex items-start gap-0">
        {STAGES.map((stage, i) => {
          const done = i < current || isComplete;
          const active = i === current && !isComplete;
          const future = i > current && !isComplete;

          return (
            <div key={stage.id} className="flex-1 flex flex-col items-center relative">
              {/* Connector line — left half */}
              {i > 0 && (
                <div className="absolute top-[14px] right-1/2 left-0 h-0.5 z-0">
                  <div className={`h-full transition-all duration-700 ${done || active ? "bg-primary" : "bg-muted"}`} />
                  {active && (
                    <div
                      className="absolute inset-0 bg-primary/40 rounded-full"
                      style={{ animation: "pulse-bar 1.5s ease-in-out infinite" }}
                    />
                  )}
                </div>
              )}
              {/* Connector line — right half */}
              {i < STAGES.length - 1 && (
                <div className="absolute top-[14px] left-1/2 right-0 h-0.5 z-0">
                  <div className={`h-full transition-all duration-700 ${done ? "bg-primary" : "bg-muted"}`} />
                </div>
              )}

              {/* Node */}
              <div className="relative z-10 mb-2">
                {done ? (
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-sm">
                    <CheckCircle2 className="h-4 w-4 text-white fill-primary" />
                  </div>
                ) : active ? (
                  <div className="relative">
                    <div
                      className="w-7 h-7 rounded-full bg-primary/20 absolute inset-0 -m-1"
                      style={{ animation: "ping-slow 1.8s ease-in-out infinite" }}
                    />
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-md relative">
                      <Loader2 className="h-3.5 w-3.5 text-white animate-spin" />
                    </div>
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-muted border-2 border-muted-foreground/20 flex items-center justify-center">
                    <Circle className="h-3 w-3 text-muted-foreground/30 fill-muted-foreground/10" />
                  </div>
                )}
              </div>

              {/* Label */}
              {!compact && (
                <div className="text-center px-1">
                  <p className={`text-xs font-semibold leading-tight ${done || active ? "text-foreground" : "text-muted-foreground/50"}`}>
                    {stage.label}
                  </p>
                  {active && (
                    <p className="text-[10px] text-primary/80 mt-0.5 leading-tight">{stage.sublabel}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes ping-slow {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes pulse-bar {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
