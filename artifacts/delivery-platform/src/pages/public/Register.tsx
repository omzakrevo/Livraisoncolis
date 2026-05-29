import { Link, useLocation, useSearch } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRegister, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Truck, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro invalide"),
  password: z.string().min(6, "Minimum 6 caractères"),
  role: z.enum(["client", "driver"]),
  vehicleType: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialRole = params.get("role") === "driver" ? "driver" : "client";

  const queryClient = useQueryClient();
  const register = useRegister();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", password: "", role: initialRole, vehicleType: "motorcycle" },
  });

  const role = form.watch("role");

  const onSubmit = (data: FormData) => {
    register.mutate({ data }, {
      onSuccess: (res) => {
        if (res.user) queryClient.setQueryData(getGetMeQueryKey(), res.user);
        const r = res.user?.role;
        if (r === "driver") setLocation("/driver/dashboard");
        else setLocation("/dashboard");
      },
      onError: (err: any) => {
        const msg = err?.data?.error || "Une erreur est survenue.";
        toast({ title: "Erreur", description: msg, variant: "destructive" });
      },
    });
  };

  const isDriver = role === "driver";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className={`hidden lg:flex w-1/2 flex-col justify-between p-12 transition-colors ${
        isDriver
          ? "bg-gradient-to-br from-[#062d17] via-[#0f6030] to-[#1a9b4b]"
          : "bg-sidebar"
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Truck className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-sidebar-foreground">TELIMA</span>
        </div>
        <div>
          {isDriver ? (
            <>
              <div className="text-5xl mb-4">🛵</div>
              <p className="text-4xl font-extrabold text-white leading-tight mb-4">
                Gagnez votre vie<br />à votre rythme.
              </p>
              <p className="text-white/60 leading-relaxed mb-6">
                Rejoignez notre réseau de livreurs à Ouagadougou.
                Travaillez quand vous voulez, acceptez les courses qui vous conviennent.
              </p>
              <ul className="space-y-2">
                {[
                  "Revenus directs après chaque livraison",
                  "Disponibilité flexible — vous décidez",
                  "Application simple et intuitive",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-white/80 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f5c518] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <p className="text-4xl font-extrabold text-sidebar-foreground leading-tight mb-4">
                Rejoignez<br />la communauté.
              </p>
              <p className="text-sidebar-foreground/60 leading-relaxed">
                Client ou livreur — chaque rôle a sa place chez TELIMA.
                Inscrivez-vous en quelques secondes.
              </p>
            </>
          )}
        </div>
        <p className="text-sidebar-foreground/30 text-sm">© 2026 TELIMA</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Truck className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">TELIMA</span>
          </div>

          <h1 className="text-2xl font-bold mb-1">
            {isDriver ? "Devenir livreur" : "Créer un compte"}
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            {isDriver ? "Rejoignez le réseau TELIMA" : "Rapide et gratuit"}
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl><Input placeholder="Aminata Sawadogo" data-testid="input-name" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" placeholder="votre@email.com" data-testid="input-email" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl><Input placeholder="+226 70 00 00 00" data-testid="input-phone" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl><Input type="password" placeholder="••••••••" data-testid="input-password" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem>
                  <FormLabel>Je suis</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-role"><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="client">🛍️ Client — je veux commander</SelectItem>
                      <SelectItem value="driver">🛵 Livreur — je veux livrer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              {role === "driver" && (
                <FormField control={form.control} name="vehicleType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de véhicule</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? "motorcycle"}>
                      <FormControl>
                        <SelectTrigger data-testid="select-vehicle"><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="motorcycle">🏍️ Moto</SelectItem>
                        <SelectItem value="bicycle">🚲 Vélo</SelectItem>
                        <SelectItem value="car">🚗 Voiture</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
              <Button
                type="submit"
                className="w-full rounded-xl font-semibold"
                disabled={register.isPending}
                data-testid="button-submit"
              >
                {register.isPending
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : isDriver ? "Rejoindre en tant que livreur" : "Créer mon compte"
                }
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Déjà inscrit ?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline" data-testid="link-login">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
