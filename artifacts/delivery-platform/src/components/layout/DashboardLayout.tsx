import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useLogout } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useListDrivers, getListDriversQueryKey } from "@workspace/api-client-react";
import { useNotificationAlert } from "@/hooks/useNotificationAlert";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Bell,
  LogOut,
  Menu,
  X,
  Truck,
  History,
  ToggleLeft,
  Users,
  UserCheck,
  Settings,
  BarChart3,
  ShoppingBag,
  DollarSign,
  ClipboardList,
} from "lucide-react";

function NavItem({ to, icon: Icon, label, badge, onClick }: { to: string; icon: any; label: string; badge?: number; onClick?: () => void }) {
  const [location] = useLocation();
  const active = location === to || location.startsWith(to + "/");
  return (
    <Link to={to}>
      <div
        data-testid={`nav-${label.toLowerCase().replace(/\s/g, "-")}`}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-all text-sm font-medium ${
          active
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        }`}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span>{label}</span>
        {badge != null && badge > 0 && (
          <Badge className="ml-auto h-5 min-w-5 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
            {badge}
          </Badge>
        )}
      </div>
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, refetchUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const logout = useLogout();
  const unreadCount = useNotificationAlert();

  const { data: driversData } = useListDrivers(undefined, {
    query: { queryKey: getListDriversQueryKey(), enabled: user?.role === "admin" },
  });
  const pendingDriversCount = (driversData ?? []).filter((d) => !d.isVerified && !d.user?.isBlocked).length;

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => { refetchUser(); },
    });
  };

  const clientNav = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
    { to: "/orders/new", icon: PlusCircle, label: "Nouvelle commande" },
    { to: "/orders", icon: Package, label: "Mes commandes" },
    { to: "/notifications", icon: Bell, label: "Notifications", badge: unreadCount },
  ];

  const driverNav = [
    { to: "/driver/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
    { to: "/driver/orders", icon: ClipboardList, label: "Commandes" },
    { to: "/driver/current", icon: Truck, label: "En cours" },
    { to: "/driver/history", icon: History, label: "Historique" },
    { to: "/driver/notifications", icon: Bell, label: "Notifications", badge: unreadCount },
  ];

  const adminNav = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
    { to: "/admin/orders", icon: ClipboardList, label: "Commandes" },
    { to: "/admin/clients", icon: Users, label: "Clients" },
    { to: "/admin/drivers", icon: UserCheck, label: "Livreurs", badge: pendingDriversCount },
    { to: "/admin/partners", icon: ShoppingBag, label: "Partenaires" },
    { to: "/admin/products", icon: Package, label: "Produits" },
    { to: "/admin/pricing", icon: DollarSign, label: "Tarifs" },
    { to: "/admin/notifications", icon: Bell, label: "Notifications", badge: unreadCount },
  ];

  const navItems = user?.role === "client" ? clientNav : user?.role === "driver" ? driverNav : adminNav;

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Truck className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <div>
            <p className="font-bold text-sidebar-foreground text-sm">TELIMA</p>
            <p className="text-xs text-sidebar-foreground/50 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} onClick={() => setMobileOpen(false)} />
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-sidebar-foreground truncate">{user?.name}</p>
            <p className="text-xs text-sidebar-foreground/50 truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={handleLogout}
          data-testid="button-logout"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 shrink-0 flex-col">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-56 flex flex-col">
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 border-b bg-sidebar text-sidebar-foreground shrink-0">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-sidebar-primary" />
            <span className="font-bold text-sm">TELIMA</span>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} data-testid="button-menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
