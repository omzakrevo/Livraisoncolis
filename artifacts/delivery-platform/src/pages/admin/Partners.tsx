import { useState } from "react";
import { useListPartners, useCreatePartner, useUpdatePartner, getListPartnersQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, PlusCircle, Loader2 } from "lucide-react";

const CATEGORIES = ["restaurant", "pharmacy", "boutique", "supermarket", "bakery", "other"] as const;
const CATEGORY_LABELS: Record<string, string> = {
  restaurant: "Restaurant", pharmacy: "Pharmacie", boutique: "Boutique",
  supermarket: "Supérette", bakery: "Boulangerie", other: "Autre"
};

const schema = z.object({
  name: z.string().min(1),
  category: z.enum(CATEGORIES),
  address: z.string().min(1),
  phone: z.string().min(8),
});
type FormData = z.infer<typeof schema>;

export default function AdminPartners() {
  const [open, setOpen] = useState(false);
  const { data: partners, isLoading } = useListPartners();
  const createPartner = useCreatePartner();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", category: "restaurant", address: "", phone: "" },
  });

  const onSubmit = (data: FormData) => {
    createPartner.mutate({ data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListPartnersQueryKey() });
        toast({ title: "Partenaire ajouté" });
        form.reset();
        setOpen(false);
      },
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Partenaires</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" data-testid="button-add-partner"><PlusCircle className="h-4 w-4" />Ajouter</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouveau partenaire</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Nom</FormLabel><FormControl><Input data-testid="input-name" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem><FormLabel>Catégorie</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger data-testid="select-category"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{CATEGORY_LABELS[c]}</SelectItem>)}</SelectContent>
                    </Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem><FormLabel>Adresse</FormLabel><FormControl><Input data-testid="input-address" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem><FormLabel>Téléphone</FormLabel><FormControl><Input data-testid="input-phone" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={createPartner.isPending} data-testid="button-submit">
                  {createPartner.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Créer"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
        ) : (partners ?? []).length === 0 ? (
          <div className="col-span-full bg-card border rounded-xl p-12 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucun partenaire</p>
          </div>
        ) : (partners ?? []).map((p) => (
          <div key={p.id} className="bg-card border rounded-xl p-4" data-testid={`card-partner-${p.id}`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.address}</p>
                <p className="text-xs text-muted-foreground">{p.phone}</p>
              </div>
              <Badge variant="secondary" className="text-xs">{CATEGORY_LABELS[p.category]}</Badge>
            </div>
            <Badge variant="secondary" className={`text-xs ${p.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {p.isActive ? "Actif" : "Inactif"}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
