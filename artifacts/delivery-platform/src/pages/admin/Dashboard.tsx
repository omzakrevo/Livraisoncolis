import { useGetAdminStats, useGetRevenueStats } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Package, Users, Truck, DollarSign, Clock, CheckCircle2, XCircle, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useGetAdminStats();
  const { data: revenue, isLoading: revLoading } = useGetRevenueStats({ period: "month" });

  const statCards = stats ? [
    { label: "Total commandes", value: stats.totalOrders, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "En attente", value: stats.pendingOrders, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "En cours", value: stats.activeOrders, icon: Truck, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Livrees", value: stats.deliveredOrders, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "Annulees", value: stats.cancelledOrders, icon: XCircle, color: "text-destructive", bg: "bg-red-50" },
    { label: "Clients", value: stats.totalClients, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Livreurs", value: stats.totalDrivers, icon: Truck, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Livreurs disponibles", value: stats.availableDrivers, icon: Truck, color: "text-green-600", bg: "bg-green-50" },
  ] : [];

  const revenueData = revenue ? [
    { name: "Chiffre d'affaires", value: revenue.totalRevenue },
    { name: "Commission", value: revenue.totalCommission },
    { name: "Livreurs", value: revenue.totalDriverEarnings },
  ] : [];

  const COLORS = ["#E84B10", "#F59E0B", "#10B981"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Vue d'ensemble de la plateforme</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({length: 8}).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
        ) : statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-card border rounded-xl p-4" data-testid={`stat-${label.replace(/\s/g, "-").toLowerCase()}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide leading-tight">{label}</span>
              <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Revenue row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Revenue totals */}
        <div className="bg-card border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">Revenus (30 jours)</h2>
          </div>
          {revLoading ? <Skeleton className="h-32 w-full" /> : (
            <div className="space-y-3">
              {[
                { label: "Chiffre d'affaires", value: revenue?.totalRevenue ?? 0, color: "bg-primary" },
                { label: "Commission plateforme", value: revenue?.totalCommission ?? 0, color: "bg-accent" },
                { label: "Revenus livreurs", value: revenue?.totalDriverEarnings ?? 0, color: "bg-green-500" },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-semibold">{value.toLocaleString()} FCFA</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full`} style={{
                      width: revenue?.totalRevenue ? `${(value / revenue.totalRevenue) * 100}%` : "0%"
                    }} />
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground pt-2">{revenue?.orderCount ?? 0} livraisons effectuées</p>
            </div>
          )}
        </div>

        {/* Bar chart */}
        <div className="bg-card border rounded-xl p-5">
          <h2 className="font-semibold mb-4">Répartition financière</h2>
          {revLoading ? <Skeleton className="h-32 w-full" /> : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: any) => [`${v.toLocaleString()} FCFA`, ""]} />
                <Bar dataKey="value" radius={[4,4,0,0]}>
                  {revenueData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
