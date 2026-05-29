import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

// Public Pages
import Landing from "@/pages/public/Landing";
import Login from "@/pages/public/Login";
import Register from "@/pages/public/Register";

// Layouts
import DashboardLayout from "@/components/layout/DashboardLayout";

// Client Pages
import ClientDashboard from "@/pages/client/Dashboard";
import ClientOrders from "@/pages/client/Orders";
import NewOrder from "@/pages/client/NewOrder";
import OrderDetail from "@/pages/client/OrderDetail";
import ClientNotifications from "@/pages/client/Notifications";

// Driver Pages
import DriverDashboard from "@/pages/driver/Dashboard";
import DriverOrders from "@/pages/driver/Orders";
import CurrentDelivery from "@/pages/driver/CurrentDelivery";
import DriverHistory from "@/pages/driver/History";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminOrders from "@/pages/admin/Orders";
import AdminClients from "@/pages/admin/Clients";
import AdminDrivers from "@/pages/admin/Drivers";
import AdminPartners from "@/pages/admin/Partners";
import AdminProducts from "@/pages/admin/Products";
import AdminPricing from "@/pages/admin/Pricing";
import AdminNotifications from "@/pages/admin/Notifications";

import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({
  component: Component,
  allowedRoles,
}: {
  component: React.ComponentType;
  allowedRoles: string[];
}) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Redirect to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "client") return <Redirect to="/dashboard" />;
    if (user.role === "driver") return <Redirect to="/driver/dashboard" />;
    if (user.role === "admin") return <Redirect to="/admin/dashboard" />;
    return <Redirect to="/" />;
  }

  return (
    <DashboardLayout>
      <Component />
    </DashboardLayout>
  );
}

function PR({ component: C, roles }: { component: React.ComponentType; roles: string[] }) {
  return () => <ProtectedRoute component={C} allowedRoles={roles} />;
}

function Router() {
  return (
    <Switch>
      {/* Public */}
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

      {/* Client */}
      <Route path="/dashboard" component={PR({ component: ClientDashboard, roles: ["client"] })} />
      <Route path="/orders" component={PR({ component: ClientOrders, roles: ["client"] })} />
      <Route path="/orders/new" component={PR({ component: NewOrder, roles: ["client"] })} />
      <Route path="/orders/:id" component={PR({ component: OrderDetail, roles: ["client"] })} />
      <Route path="/notifications" component={PR({ component: ClientNotifications, roles: ["client"] })} />

      {/* Driver */}
      <Route path="/driver/dashboard" component={PR({ component: DriverDashboard, roles: ["driver"] })} />
      <Route path="/driver/orders" component={PR({ component: DriverOrders, roles: ["driver"] })} />
      <Route path="/driver/current" component={PR({ component: CurrentDelivery, roles: ["driver"] })} />
      <Route path="/driver/history" component={PR({ component: DriverHistory, roles: ["driver"] })} />
      <Route path="/driver/notifications" component={PR({ component: ClientNotifications, roles: ["driver"] })} />

      {/* Admin */}
      <Route path="/admin/dashboard" component={PR({ component: AdminDashboard, roles: ["admin"] })} />
      <Route path="/admin/orders" component={PR({ component: AdminOrders, roles: ["admin"] })} />
      <Route path="/admin/clients" component={PR({ component: AdminClients, roles: ["admin"] })} />
      <Route path="/admin/drivers" component={PR({ component: AdminDrivers, roles: ["admin"] })} />
      <Route path="/admin/partners" component={PR({ component: AdminPartners, roles: ["admin"] })} />
      <Route path="/admin/products" component={PR({ component: AdminProducts, roles: ["admin"] })} />
      <Route path="/admin/pricing" component={PR({ component: AdminPricing, roles: ["admin"] })} />
      <Route path="/admin/notifications" component={PR({ component: AdminNotifications, roles: ["admin"] })} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
