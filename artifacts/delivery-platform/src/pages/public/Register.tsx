import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRegister } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
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
  const { refetchUser } = useAuth();
  const register = useRegister();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", password: "", role: "client" },
  });

  const role = form.watch("role");

  const onSubmit = (data: FormData) => {
    register.mutate({ data }, {
      onSuccess: async (res) => {
        await refetchUser();
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

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex w-1/2 bg-sidebar flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <Truck className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-sidebar-foreground">Livrelo</span>
        </div>
        <div>
          <p className="text-4xl font-extrabold text-sidebar-foreground leading-tight mb-4">
            Rejoignez<br />la communauté.
          </p>
          <p className="text-sidebar-foreground/60 leading-relaxed">
            Client ou livreur — chaque rôle a sa place chez Livrelo.
            Inscrivez-vous en quelques secondes.
          </p>
        </div>
        <p className="text-sidebar-foreground/30 text-sm">© 2026 Livrelo</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Truck className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Livrelo</span>
          </div>

          <h1 className="text-2xl font-bold mb-1">Créer un compte</h1>
          <p className="text-muted-foreground text-sm mb-8">Rapide et gratuit</p>

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
                  <FormLabel>Telephone</FormLabel>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-role"><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="client">Client — je veux commander</SelectItem>
                      <SelectItem value="driver">Livreur — je veux livrer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              {role === "driver" && (
                <FormField control={form.control} name="vehicleType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de vehicule</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value ?? "motorcycle"}>
                      <FormControl>
                        <SelectTrigger data-testid="select-vehicle"><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="motorcycle">Moto</SelectItem>
                        <SelectItem value="bicycle">Velo</SelectItem>
                        <SelectItem value="car">Voiture</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
              <Button type="submit" className="w-full" disabled={register.isPending} data-testid="button-submit">
                {register.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Creer mon compte"}
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Deja inscrit ?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline" data-testid="link-login">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
