import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag, Shield, Clock, MapPin, Truck, ChevronRight, Bike, DollarSign, Calendar } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm">
              <Truck className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">TELIMA</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-medium" data-testid="link-login">Se connecter</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="font-semibold rounded-xl" data-testid="link-register">Commencer</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#062d17] via-[#0f6030] to-[#1a9b4b]">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-white/[0.03] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 py-20 lg:py-28 lg:flex lg:items-center lg:gap-16">
          <div className="flex-1 mb-12 lg:mb-0">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 rounded-full px-4 py-1.5 text-xs font-semibold mb-6 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5c518]" />
              Livraison rapide au Burkina Faso
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight mb-5 text-white">
              Vos courses livrées<br />
              <span className="text-[#f5c518]">en quelques minutes</span>
            </h1>
            <p className="text-white/70 text-base lg:text-lg mb-8 leading-relaxed max-w-lg">
              Médicaments, repas, documents, gaz — nos livreurs à moto parcourent
              Ouagadougou pour vous. Commandez depuis chez vous, recevez où vous êtes.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/register">
                <Button size="lg" className="gap-2 bg-[#f5c518] hover:bg-[#e6b800] text-[#062d17] font-bold rounded-xl border-0 shadow-lg" data-testid="button-get-started">
                  Créer un compte gratuit
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-xl font-medium" data-testid="button-login-hero">
                  Se connecter
                </Button>
              </Link>
            </div>
          </div>

          {/* Illustration card */}
          <div className="lg:w-80 flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 text-center w-64">
              <div className="text-7xl mb-4">🛵</div>
              <p className="text-white font-bold text-lg mb-1">Livreur en route</p>
              <p className="text-white/60 text-sm mb-4">Commande #12345 acceptée</p>
              <div className="flex items-center justify-center gap-2 bg-white/15 rounded-full px-4 py-2">
                <div className="w-2 h-2 rounded-full bg-[#4aba7d] animate-pulse" />
                <span className="text-white/80 text-xs font-semibold">En cours de livraison</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-muted/40 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center">Deux types de service</h2>
          <p className="text-muted-foreground text-center mb-12">Livraison de colis ou course à la demande — on gère tout.</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
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
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card border rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#f5c518]/20 rounded-2xl flex items-center justify-center mb-4">
                <ShoppingBag className="h-6 w-6 text-[#92400e]" />
              </div>
              <h3 className="font-bold text-xl mb-2">Course / Achat pour moi</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Besoin de médicaments, de gaz, de repas ou d'articles divers ? Dites-nous quoi acheter
                et où livrer. Le livreur fait l'achat et vous apporte tout.
              </p>
              <ul className="mt-4 space-y-2">
                {["Médicaments, repas, gaz…", "Budget estimé communiqué", "Paiement en espèces"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f5c518] shrink-0" />
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
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow">
                  {step}
                </span>
              </div>
              <h3 className="font-bold mb-1">{title}</h3>
              <p className="text-muted-foreground text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats banner */}
      <section className="bg-gradient-to-r from-[#062d17] to-[#1a9b4b] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "30 sec", label: "Temps de réponse livreur" },
              { value: "2 000 FCFA", label: "Tarif de base" },
              { value: "24/7", label: "Disponibilité" },
              { value: "OTP", label: "Validation sécurisée" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl font-extrabold mb-1 text-[#f5c518]">{value}</div>
                <div className="text-white/70 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Driver section */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="bg-gradient-to-br from-[#062d17] to-[#0f6030] rounded-3xl p-8 lg:p-12 overflow-hidden relative">
          <div className="absolute right-0 top-0 bottom-0 text-[10rem] flex items-center pr-8 opacity-10 pointer-events-none select-none">
            🛵
          </div>
          <div className="relative lg:flex lg:items-center lg:gap-12">
            <div className="flex-1 mb-8 lg:mb-0">
              <div className="inline-flex items-center gap-2 bg-[#f5c518]/20 text-[#f5c518] rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4">
                Devenez livreur
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">
                Gagnez votre vie<br />à votre rythme
              </h2>
              <p className="text-white/60 leading-relaxed mb-6 max-w-md">
                Rejoignez notre réseau de livreurs à Ouagadougou. Choisissez vos horaires,
                acceptez les courses quand vous voulez et touchez vos gains directement après chaque livraison.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { icon: DollarSign, label: "Gains immédiats", desc: "Après chaque course" },
                  { icon: Calendar, label: "Horaires libres", desc: "Vous décidez" },
                  { icon: Bike, label: "Moto ou vélo", desc: "Tout véhicule" },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="text-center">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Icon className="h-5 w-5 text-[#f5c518]" />
                    </div>
                    <p className="text-white font-semibold text-sm">{label}</p>
                    <p className="text-white/50 text-xs">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-64 shrink-0">
              <Link to="/register?role=driver">
                <Button
                  size="lg"
                  className="w-full bg-[#f5c518] hover:bg-[#e6b800] text-[#062d17] font-bold rounded-xl border-0 shadow-lg gap-2 mb-3"
                  data-testid="button-become-driver"
                >
                  Devenir livreur
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <p className="text-white/40 text-xs text-center">Inscription gratuite · Vérification rapide</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-3">Prêt à commander ?</h2>
        <p className="text-muted-foreground mb-8">Créez votre compte en moins d'une minute.</p>
        <Link to="/register">
          <Button size="lg" className="gap-2 rounded-xl font-semibold" data-testid="button-cta-register">
            Commencer maintenant
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-muted-foreground text-sm bg-muted/20">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
            <Truck className="h-3 w-3 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">TELIMA</span>
        </div>
        <p>Livraison rapide et fiable au Burkina Faso</p>
      </footer>
    </div>
  );
}
