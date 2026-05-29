import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useLogin, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Truck, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const login = useLogin();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: FormData) => {
    login.mutate({ data }, {
      onSuccess: (res) => {
        // Pre-populate the auth cache so ProtectedRoute sees isAuthenticated=true immediately
        if (res.user) queryClient.setQueryData(getGetMeQueryKey(), res.user);
        const role = res.user?.role;
        if (role === "admin") setLocation("/admin/dashboard");
        else if (role === "driver") setLocation("/driver/dashboard");
        else setLocation("/dashboard");
      },
      onError: () => {
        toast({ title: "Erreur", description: "Email ou mot de passe incorrect.", variant: "destructive" });
      },
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-sidebar flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Truck className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-sidebar-foreground">Livrelo</span>
        </div>
        <div>
          <p className="text-4xl font-extrabold text-sidebar-foreground leading-tight mb-4">
            Chaque commande,<br />livrée avec soin.
          </p>
          <p className="text-sidebar-foreground/60 leading-relaxed">
            La plateforme de livraison à la demande du Burkina Faso.
            Rapide, fiable, à votre service 24h/24.
          </p>
        </div>
        <p className="text-sidebar-foreground/30 text-sm">© 2026 Livrelo</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Truck className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Livrelo</span>
          </div>

          <h1 className="text-2xl font-bold mb-1">Connexion</h1>
          <p className="text-muted-foreground text-sm mb-8">Accédez à votre espace</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="votre@email.com" type="email" data-testid="input-email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••" type="password" data-testid="input-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={login.isPending} data-testid="button-submit">
                {login.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Se connecter"}
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline" data-testid="link-register">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
