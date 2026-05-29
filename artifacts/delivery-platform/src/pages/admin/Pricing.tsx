import { useGetPricing, useUpdatePricing, getGetPricingQueryKey } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Loader2 } from "lucide-react";
import { useEffect } from "react";

const schema = z.object({
  baseDeliveryFee: z.number().min(0),
  commissionRate: z.number().min(0).max(1),
  minDeliveryFee: z.number().min(0),
});

type FormData = z.infer<typeof schema>;

export default function AdminPricing() {
  const { data: pricing, isLoading } = useGetPricing();
  const updatePricing = useUpdatePricing();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { baseDeliveryFee: 2000, commissionRate: 0.25, minDeliveryFee: 1000 },
  });

  useEffect(() => {
    if (pricing) {
      form.reset({
        baseDeliveryFee: pricing.baseDeliveryFee,
        commissionRate: pricing.commissionRate,
        minDeliveryFee: pricing.minDeliveryFee,
      });
    }
  }, [pricing]);

  const onSubmit = (data: FormData) => {
    updatePricing.mutate({ data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetPricingQueryKey() });
        toast({ title: "Tarifs mis à jour" });
      },
      onError: () => toast({ title: "Erreur", variant: "destructive" }),
    });
  };

  const fee = form.watch("baseDeliveryFee") ?? 2000;
  const rate = form.watch("commissionRate") ?? 0.25;
  const commission = Math.round(fee * rate);
  const driverShare = fee - commission;

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tarifs</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Gérez les tarifs de livraison et la commission</p>
      </div>

      {isLoading ? (
        <div className="space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-20 w-full" /></div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="baseDeliveryFee" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tarif de base (FCFA)</FormLabel>
                  <FormControl>
                    <Input type="number" data-testid="input-base-fee" {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="commissionRate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Taux de commission (ex: 0.25 = 25%)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0" max="1" data-testid="input-commission-rate" {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="minDeliveryFee" render={({ field }) => (
                <FormItem>
                  <FormLabel>Frais minimum (FCFA)</FormLabel>
                  <FormControl>
                    <Input type="number" data-testid="input-min-fee" {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* Preview */}
              <div className="bg-muted/40 rounded-xl p-4 space-y-2 text-sm">
                <p className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Aperçu</p>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prix client</span>
                  <span className="font-semibold">{fee.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Part livreur</span>
                  <span className="font-semibold text-green-600">{driverShare.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Commission plateforme</span>
                  <span className="font-semibold text-primary">{commission.toLocaleString()} FCFA ({Math.round(rate * 100)}%)</span>
                </div>
              </div>

              <Button type="submit" className="w-full gap-2" disabled={updatePricing.isPending} data-testid="button-save-pricing">
                {updatePricing.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><DollarSign className="h-4 w-4" />Enregistrer</>}
              </Button>
            </form>
          </Form>
        </>
      )}
    </div>
  );
}
