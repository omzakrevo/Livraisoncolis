import { useGetPricing, useUpdatePricing, getGetPricingQueryKey } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Loader2 } from "lucide-react";
import { useEffect } from "react";

const schema = z.object({
  baseDeliveryFee: z.number({ invalid_type_error: "Entrez un nombre" }).min(100, "Minimum 100 FCFA"),
  commissionPercent: z.number({ invalid_type_error: "Entrez un nombre" }).min(0).max(100, "Maximum 100%"),
  minDeliveryFee: z.number({ invalid_type_error: "Entrez un nombre" }).min(0),
});

type FormData = z.infer<typeof schema>;

export default function AdminPricing() {
  const { data: pricing, isLoading } = useGetPricing();
  const updatePricing = useUpdatePricing();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { baseDeliveryFee: 2000, commissionPercent: 25, minDeliveryFee: 1000 },
  });

  useEffect(() => {
    if (pricing) {
      form.reset({
        baseDeliveryFee: pricing.baseDeliveryFee,
        commissionPercent: Math.round(pricing.commissionRate * 100),
        minDeliveryFee: pricing.minDeliveryFee,
      });
    }
  }, [pricing]);

  const onSubmit = (data: FormData) => {
    updatePricing.mutate({
      data: {
        baseDeliveryFee: data.baseDeliveryFee,
        commissionRate: data.commissionPercent / 100,
        minDeliveryFee: data.minDeliveryFee,
      }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetPricingQueryKey() });
        toast({ title: "Tarifs mis à jour avec succès" });
      },
      onError: () => toast({ title: "Erreur lors de la mise à jour", variant: "destructive" }),
    });
  };

  const fee = form.watch("baseDeliveryFee") ?? 2000;
  const percent = form.watch("commissionPercent") ?? 25;
  const commission = Math.round(fee * (percent / 100));
  const driverShare = fee - commission;

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tarifs de livraison</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Définissez les prix facturés aux clients et la commission de la plateforme</p>
      </div>

      {isLoading ? (
        <div className="space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-20 w-full" /></div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

            <FormField control={form.control} name="baseDeliveryFee" render={({ field }) => (
              <FormItem>
                <FormLabel>Prix de livraison (FCFA)</FormLabel>
                <FormDescription>Montant payé par le client pour chaque commande</FormDescription>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      min="100"
                      step="100"
                      placeholder="2000"
                      data-testid="input-base-fee"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">FCFA</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="commissionPercent" render={({ field }) => (
              <FormItem>
                <FormLabel>Commission plateforme (%)</FormLabel>
                <FormDescription>Pourcentage prélevé sur chaque livraison (ex: 25 pour 25%)</FormDescription>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      placeholder="25"
                      data-testid="input-commission-rate"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="minDeliveryFee" render={({ field }) => (
              <FormItem>
                <FormLabel>Frais minimum (FCFA)</FormLabel>
                <FormDescription>Prix minimum en dessous duquel une commande ne peut pas descendre</FormDescription>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      step="100"
                      placeholder="1000"
                      data-testid="input-min-fee"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">FCFA</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Live preview */}
            <div className="bg-muted/40 border rounded-xl p-5 space-y-3">
              <p className="font-semibold text-sm">Aperçu de la répartition</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Client paie</span>
                  <span className="font-bold text-lg">{(fee || 0).toLocaleString()} FCFA</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${100 - (percent || 0)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-muted-foreground">Part livreur ({100 - (percent || 0)}%)</span>
                  </div>
                  <span className="font-semibold text-primary">{(driverShare || 0).toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                    <span className="text-muted-foreground">Commission plateforme ({percent || 0}%)</span>
                  </div>
                  <span className="font-semibold">{(commission || 0).toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={updatePricing.isPending}
              data-testid="button-save-pricing"
            >
              {updatePricing.isPending
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <><DollarSign className="h-4 w-4" />Enregistrer les tarifs</>
              }
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
