import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useCreateOrder, getListOrdersQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Package, ShoppingBag, ChevronRight, Loader2, CheckCircle2 } from "lucide-react";
import MapPicker, { type MapPickerValue } from "@/components/MapPicker";

const deliverySchema = z.object({
  pickupAddress: z.string().min(3, "Adresse de récupération requise"),
  deliveryAddress: z.string().min(3, "Adresse de livraison requise"),
  itemDescription: z.string().min(3, "Description requise"),
  recipientPhone: z.string().min(8, "Numéro requis"),
  specialInstructions: z.string().optional(),
  paymentMethod: z.literal("cash"),
});

const errandSchema = z.object({
  deliveryAddress: z.string().min(3, "Adresse de livraison requise"),
  itemDescription: z.string().min(3, "Décrivez ce qu'il faut acheter"),
  estimatedPurchaseBudget: z.number({ invalid_type_error: "Budget requis" }).min(1),
  specialInstructions: z.string().optional(),
  paymentMethod: z.literal("cash"),
});

type DeliveryData = z.infer<typeof deliverySchema>;
type ErrandData = z.infer<typeof errandSchema>;

type Coords = { lat: number; lng: number } | null;

export default function NewOrder() {
  const [, setLocation] = useLocation();
  const [orderType, setOrderType] = useState<"delivery" | "errand" | null>(null);
  const createOrder = useCreateOrder();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Coordinates state — separate from form text so the form stays string-based
  const [pickupCoords, setPickupCoords] = useState<Coords>(null);
  const [deliveryCoords, setDeliveryCoords] = useState<Coords>(null);
  const [errandDeliveryCoords, setErrandDeliveryCoords] = useState<Coords>(null);

  const deliveryForm = useForm<DeliveryData>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      pickupAddress: "",
      deliveryAddress: "",
      itemDescription: "",
      recipientPhone: "",
      specialInstructions: "",
      paymentMethod: "cash",
    },
  });

  const errandForm = useForm<ErrandData>({
    resolver: zodResolver(errandSchema),
    defaultValues: {
      deliveryAddress: "",
      itemDescription: "",
      specialInstructions: "",
      paymentMethod: "cash",
    },
  });

  const onSubmitDelivery = (data: DeliveryData) => {
    createOrder.mutate(
      {
        data: {
          ...data,
          orderType: "delivery",
          pickupLatitude: pickupCoords?.lat ?? null,
          pickupLongitude: pickupCoords?.lng ?? null,
          deliveryLatitude: deliveryCoords?.lat ?? null,
          deliveryLongitude: deliveryCoords?.lng ?? null,
        },
      },
      {
        onSuccess: (order) => {
          queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
          toast({ title: "Commande créée !", description: "Nous recherchons un livreur disponible." });
          setLocation(`/orders/${order.id}`);
        },
        onError: () =>
          toast({ title: "Erreur", description: "Impossible de créer la commande.", variant: "destructive" }),
      }
    );
  };

  const onSubmitErrand = (data: ErrandData) => {
    createOrder.mutate(
      {
        data: {
          ...data,
          orderType: "errand",
          deliveryLatitude: errandDeliveryCoords?.lat ?? null,
          deliveryLongitude: errandDeliveryCoords?.lng ?? null,
        },
      },
      {
        onSuccess: (order) => {
          queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
          toast({ title: "Commande créée !", description: "Nous recherchons un livreur disponible." });
          setLocation(`/orders/${order.id}`);
        },
        onError: () =>
          toast({ title: "Erreur", description: "Impossible de créer la commande.", variant: "destructive" }),
      }
    );
  };

  const handlePickupSelect = (val: MapPickerValue, form: typeof deliveryForm) => {
    form.setValue("pickupAddress", val.address, { shouldValidate: true });
    setPickupCoords({ lat: val.lat, lng: val.lng });
  };

  const handleDeliverySelect = (val: MapPickerValue, form: typeof deliveryForm | typeof errandForm, setter: (c: Coords) => void) => {
    (form.setValue as (name: string, value: string, opts?: object) => void)(
      "deliveryAddress",
      val.address,
      { shouldValidate: true }
    );
    setter({ lat: val.lat, lng: val.lng });
  };

  // ─── Type selection ─────────────────────────────────────────────────────────
  if (!orderType) {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Nouvelle commande</h1>
          <p className="text-muted-foreground text-sm mt-1">Choisissez le type de service</p>
        </div>
        <div className="grid gap-4">
          <button
            onClick={() => setOrderType("delivery")}
            data-testid="card-delivery"
            className="bg-card border-2 hover:border-primary rounded-xl p-6 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-bold text-lg mb-1">Livraison de colis</h3>
            <p className="text-muted-foreground text-sm">
              Envoyez un colis d'un point A vers un point B. Fournissez l'adresse de récupération et de livraison.
            </p>
          </button>

          <button
            onClick={() => setOrderType("errand")}
            data-testid="card-errand"
            className="bg-card border-2 hover:border-primary rounded-xl p-6 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-accent-foreground" />
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-bold text-lg mb-1">Course / Achat pour moi</h3>
            <p className="text-muted-foreground text-sm">
              Médicaments, gaz, repas, documents… Le livreur fait l'achat et livre chez vous. Indiquez un budget estimé.
            </p>
          </button>
        </div>
      </div>
    );
  }

  // ─── Delivery form ───────────────────────────────────────────────────────────
  if (orderType === "delivery") {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOrderType(null)}
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            &larr; Retour
          </button>
          <div>
            <h1 className="text-2xl font-bold">Livraison de colis</h1>
            <p className="text-muted-foreground text-sm">Remplissez les informations de livraison</p>
          </div>
        </div>

        <Form {...deliveryForm}>
          <form onSubmit={deliveryForm.handleSubmit(onSubmitDelivery)} className="space-y-4">
            {/* Pickup address with map */}
            <FormField
              control={deliveryForm.control}
              name="pickupAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse de récupération</FormLabel>
                  <FormControl>
                    <MapPicker
                      label="Adresse de récupération"
                      value={field.value}
                      onSelect={(val) => handlePickupSelect(val, deliveryForm)}
                      data-testid="input-pickup"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Delivery address with map */}
            <FormField
              control={deliveryForm.control}
              name="deliveryAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse de livraison</FormLabel>
                  <FormControl>
                    <MapPicker
                      label="Adresse de livraison"
                      value={field.value}
                      onSelect={(val) =>
                        handleDeliverySelect(val, deliveryForm, setDeliveryCoords)
                      }
                      data-testid="input-delivery"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={deliveryForm.control}
              name="itemDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description du colis</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Documents, vêtements…"
                      data-testid="textarea-description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={deliveryForm.control}
              name="recipientPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro du destinataire</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+226 70 00 00 00"
                      data-testid="input-recipient-phone"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={deliveryForm.control}
              name="specialInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions particulières (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Frapper à la porte 3 fois…"
                      data-testid="textarea-instructions"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted/40 rounded-xl p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mode de paiement</span>
                <span className="font-medium">Espèces</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-muted-foreground">Tarif de base</span>
                <span className="font-medium">2 000 FCFA</span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={createOrder.isPending}
              data-testid="button-submit-order"
            >
              {createOrder.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Confirmer la commande
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  // ─── Errand form ─────────────────────────────────────────────────────────────
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOrderType(null)}
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          &larr; Retour
        </button>
        <div>
          <h1 className="text-2xl font-bold">Course / Achat</h1>
          <p className="text-muted-foreground text-sm">Décrivez ce qu'il faut acheter</p>
        </div>
      </div>

      <Form {...errandForm}>
        <form onSubmit={errandForm.handleSubmit(onSubmitErrand)} className="space-y-4">
          <FormField
            control={errandForm.control}
            name="itemDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qu'est-ce qu'il faut acheter ?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="1 bouteille de gaz Total, 12 kg…"
                    data-testid="textarea-description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={errandForm.control}
            name="deliveryAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse de livraison</FormLabel>
                <FormControl>
                  <MapPicker
                    label="Adresse de livraison"
                    value={field.value}
                    onSelect={(val) =>
                      handleDeliverySelect(val, errandForm, setErrandDeliveryCoords)
                    }
                    data-testid="input-delivery"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={errandForm.control}
            name="estimatedPurchaseBudget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget estimé (FCFA)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="5000"
                    data-testid="input-budget"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={errandForm.control}
            name="specialInstructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructions particulières (optionnel)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Prendre de la monnaie…"
                    data-testid="textarea-instructions"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-muted/40 rounded-xl p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mode de paiement</span>
              <span className="font-medium">Espèces</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-muted-foreground">Frais de livraison</span>
              <span className="font-medium">2 000 FCFA</span>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gap-2"
            disabled={createOrder.isPending}
            data-testid="button-submit-order"
          >
            {createOrder.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" /> Confirmer la commande
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
