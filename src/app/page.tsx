"use client";

import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Target,
  BarChart3,
  Clock,
  CheckCircle2,
  Star,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Analyse par IA",
    description:
      "Notre IA parcourt votre page et analyse chaque element CRO en quelques secondes.",
  },
  {
    icon: Target,
    title: "Recommandations actionnables",
    description:
      "Des conseils concrets que vous pouvez appliquer aujourd'hui, pas des generalites.",
  },
  {
    icon: BarChart3,
    title: "Score detaille",
    description:
      "Visualisez exactement ou votre page excelle et ou elle doit progresser.",
  },
  {
    icon: Clock,
    title: "Pret en 2 minutes",
    description:
      "Repondez a 5 questions rapides et obtenez votre audit CRO complet instantanement.",
  },
];

const checklist = [
  "Clarte du titre et de la proposition de valeur",
  "Placement et efficacite des CTA",
  "Hierarchie visuelle et mise en page",
  "Signaux de confiance et preuve sociale",
  "Points de friction et optimisation des formulaires",
  "Compatibilite mobile",
  "Alignement trafic / message",
  "Recommandations UX et vitesse de chargement",
];

const testimonials = [
  {
    name: "Sarah K.",
    role: "Growth Lead @ Startup SaaS",
    text: "On a ameliore notre taux de conversion de 34% juste en appliquant les quick wins de l'audit.",
    stars: 5,
  },
  {
    name: "Marc D.",
    role: "Consultant freelance",
    text: "J'utilise cet outil avant chaque appel client. Ca me donne un apercu instantane de ce qu'il faut corriger.",
    stars: 5,
  },
  {
    name: "Julie T.",
    role: "Fondatrice Ecommerce",
    text: "Bien mieux que de payer 500\u20AC pour un rapport PDF generique. Les recommandations sont vraiment specifiques a ma page.",
    stars: 5,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white text-sm font-bold">
              C
            </div>
            <span className="text-lg font-semibold">CRO Audit IA</span>
          </div>
          <Link
            href="/audit"
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Lancer un audit gratuit
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/60 to-white" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-primary">
            <Zap className="h-4 w-4" />
            Audit CRO gratuit par IA
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
            Obtenez un audit CRO complet de votre landing page{" "}
            <span className="text-primary">en 2 minutes</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted leading-relaxed">
            Arretez de deviner pourquoi votre page ne convertit pas. Notre IA
            analyse votre landing page selon 50+ bonnes pratiques CRO et vous
            fournit un plan d&apos;action priorise.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/audit"
              className="group flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 animate-pulse-glow"
            >
              Lancer mon audit gratuit
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="text-sm text-muted">
              Sans inscription · 2 min · 100% gratuit
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-4 text-center text-3xl font-bold">
            Pourquoi utiliser CRO Audit IA ?
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-muted">
            Une analyse CRO de niveau expert propulsee par l&apos;IA, accessible
            a tous gratuitement.
          </p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-white p-6 transition-shadow hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we analyze */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold">
                Ce que l&apos;audit analyse
              </h2>
              <p className="mb-8 text-muted">
                Notre IA evalue votre landing page sur 8 dimensions CRO
                essentielles pour vous donner une vision complete de votre
                potentiel de conversion.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {checklist.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-white p-8 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Exemple de score</h3>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                  62/100
                </span>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Proposition de valeur", score: 75 },
                  { label: "Efficacite des CTA", score: 45 },
                  { label: "Confiance et preuve sociale", score: 60 },
                  { label: "Hierarchie visuelle", score: 70 },
                  { label: "Friction et UX", score: 55 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>{item.label}</span>
                      <span className="font-medium">{item.score}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-dark">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${item.score}%`,
                          backgroundColor:
                            item.score >= 70
                              ? "#22c55e"
                              : item.score >= 50
                                ? "#f59e0b"
                                : "#ef4444",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Ils nous font confiance
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-border bg-white p-6"
              >
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-muted">
                  &laquo; {t.text} &raquo;
                </p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Pret a optimiser vos conversions ?
          </h2>
          <p className="mb-8 text-indigo-200">
            Rejoignez des milliers de marketeurs qui ont deja ameliore leurs
            landing pages grace a notre audit IA gratuit.
          </p>
          <Link
            href="/audit"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-primary shadow-lg transition-all hover:shadow-xl"
          >
            Lancer mon audit maintenant
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-muted">
          <p>&copy; 2026 CRO Audit IA. Tous droits reserves.</p>
        </div>
      </footer>
    </div>
  );
}
