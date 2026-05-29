import { useState } from "react";
import { useListProducts, useCreateProduct, useListPartners, getListProductsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Package, PlusCircle, Loader2 } from "lucide-react";

const schema = z.object({
  partnerId: z.number(),
  name: z.string().min(1),
  price: z.number().min(0),
  description: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function AdminProducts() {
  const [open, setOpen] = useState(false);
  const { data: products, isLoading } = useListProducts();
  const { data: partners } = useListPartners();
  const createProduct = useCreateProduct();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", price: 0, description: "" },
  });

  const onSubmit = (data: FormData) => {
    createProduct.mutate({ data: { ...data, isAvailable: true } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
        toast({ title: "Produit ajouté" });
        form.reset();
        setOpen(false);
      },
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produits</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" data-testid="button-add-product"><PlusCircle className="h-4 w-4" />Ajouter</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouveau produit</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="partnerId" render={({ field }) => (
                  <FormItem><FormLabel>Partenaire</FormLabel>
                    <Select onValueChange={(v) => field.onChange(parseInt(v))} defaultValue={field.value?.toString()}>
                      <FormControl><SelectTrigger data-testid="select-partner"><SelectValue placeholder="Choisir un partenaire" /></SelectTrigger></FormControl>
                      <SelectContent>{(partners ?? []).map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}</SelectContent>
                    </Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Nom</FormLabel><FormControl><Input data-testid="input-name" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="price" render={({ field }) => (
                  <FormItem><FormLabel>Prix (FCFA)</FormLabel><FormControl><Input type="number" data-testid="input-price" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description (optionnel)</FormLabel><FormControl><Input data-testid="input-description" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="w-full" disabled={createProduct.isPending} data-testid="button-submit">
                  {createProduct.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Créer"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-5 space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full" />)}</div>
        ) : (products ?? []).length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucun produit</p>
          </div>
        ) : (
          <div className="divide-y">
            {(products ?? []).map((p) => (
              <div key={p.id} className="px-5 py-4 flex items-center justify-between" data-testid={`row-product-${p.id}`}>
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  {p.description && <p className="text-xs text-muted-foreground">{p.description}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">{p.price.toLocaleString()} FCFA</span>
                  <Badge variant="secondary" className={p.isAvailable ? "bg-green-100 text-green-800 text-xs" : "bg-red-100 text-red-800 text-xs"}>
                    {p.isAvailable ? "Disponible" : "Indisponible"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
