import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag, Shield, Clock, MapPin, Truck, Star, ChevronRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Truck className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">Livrelo</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" data-testid="link-login">Se connecter</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" data-testid="link-register">Commencer</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold mb-6 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Livraison rapide au Burkina Faso
          </div>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight mb-6">
            Vos courses livrées<br />
            <span className="text-primary">en quelques minutes</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Médicaments, repas, documents, gaz — nos livreurs à moto parcourent
            Ouagadougou pour vous. Commandez depuis chez vous, recevez où vous êtes.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/register">
              <Button size="lg" className="gap-2" data-testid="button-get-started">
                Créer un compte gratuit
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" data-testid="button-login-hero">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-muted/40 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center">Deux types de service</h2>
          <p className="text-muted-foreground text-center mb-12">Livraison de colis ou course à la demande — on gère tout.</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border rounded-xl p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">Livraison de colis</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Envoyez un colis d'un point A vers un point B. Renseignez l'adresse de récupération,
                l'adresse de livraison, et le numéro du destinataire. Notre livreur s'occupe du reste.
              </p>
              <ul className="mt-4 space-y-2">
                {["Récupération à votre adresse", "Livraison en mains propres", "Code OTP de confirmation"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card border rounded-xl p-6">
              <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-4">
                <ShoppingBag className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="font-bold text-xl mb-2">Course / Achat pour moi</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Besoin de médicaments, de gaz, de repas ou d'articles divers ? Dites-nous quoi acheter
                et où livrer. Le livreur fait l'achat et vous apporte tout.
              </p>
              <ul className="mt-4 space-y-2">
                {["Médicaments, repas, gaz…", "Budget estimé communiqué", "Paiement en espèces"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Comment ça marche</h2>
        <p className="text-muted-foreground text-center mb-12">Simple, rapide, fiable.</p>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: "1", icon: Package, title: "Passez commande", desc: "Choisissez le type, remplissez les détails en 2 minutes." },
            { step: "2", icon: MapPin, title: "Livreur assigné", desc: "Le livreur disponible le plus proche reçoit votre commande." },
            { step: "3", icon: Truck, title: "Suivi en temps réel", desc: "Suivez chaque étape : récupération, trajet, livraison." },
            { step: "4", icon: Shield, title: "Confirmation OTP", desc: "Validez la livraison avec un code à 4 chiffres. Paiement en espèces." },
          ].map(({ step, icon: Icon, title, desc }) => (
            <div key={step} className="text-center">
              <div className="relative mx-auto w-16 h-16 mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {step}
                </span>
              </div>
              <h3 className="font-bold mb-1">{title}</h3>
              <p className="text-muted-foreground text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "30 sec", label: "Temps de réponse livreur" },
              { value: "2 000 FCFA", label: "Tarif de base" },
              { value: "24/7", label: "Disponibilité" },
              { value: "OTP", label: "Validation sécurisée" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl font-extrabold mb-1">{value}</div>
                <div className="text-primary-foreground/70 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-3">Prêt à commander ?</h2>
        <p className="text-muted-foreground mb-8">Créez votre compte en moins d'une minute.</p>
        <Link to="/register">
          <Button size="lg" className="gap-2" data-testid="button-cta-register">
            Commencer maintenant
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-muted-foreground text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Truck className="h-4 w-4 text-primary" />
          <span className="font-semibold text-foreground">Livrelo</span>
        </div>
        <p>Livraison rapide et fiable au Burkina Faso</p>
      </footer>
    </div>
  );
}
