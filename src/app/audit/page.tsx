"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Globe,
  Target,
  Users,
  Megaphone,
  BarChart3,
  Loader2,
} from "lucide-react";
import type { AuditFormData } from "@/types/audit";

const steps = [
  {
    id: 1,
    title: "Landing Page",
    subtitle: "Parlez-nous de votre page",
    icon: Globe,
  },
  {
    id: 2,
    title: "Objectif",
    subtitle: "Que doivent faire vos visiteurs ?",
    icon: Target,
  },
  {
    id: 3,
    title: "Audience",
    subtitle: "Qui sont vos visiteurs ?",
    icon: Users,
  },
  {
    id: 4,
    title: "Source de trafic",
    subtitle: "D'ou viennent vos visiteurs ?",
    icon: Megaphone,
  },
  {
    id: 5,
    title: "Metriques",
    subtitle: "Performance actuelle (optionnel)",
    icon: BarChart3,
  },
];

const pageTypes = [
  "SaaS",
  "Ecommerce",
  "Generation de leads",
  "Application",
  "Agence",
  "Autre",
];
const goals = [
  "Collecter des leads",
  "Vendre un produit",
  "Reserver une demo",
  "Installer une app",
  "Autre",
];
const audiences = [
  "B2B",
  "B2C",
  "Developpeurs",
  "Marketeurs",
  "TPE / PME",
  "Grands comptes",
  "Autre",
];
const trafficSources = [
  "Google Ads",
  "Meta Ads",
  "SEO",
  "Email",
  "Reseaux sociaux",
  "Direct",
  "Autre",
];

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border-2 px-5 py-3 text-sm font-medium transition-all ${
        selected
          ? "border-primary bg-indigo-50 text-primary"
          : "border-border bg-white text-foreground hover:border-primary/40 hover:bg-indigo-50/50"
      }`}
    >
      {label}
    </button>
  );
}

export default function AuditPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<AuditFormData>({
    url: "",
    pageType: "",
    goal: "",
    audience: "",
    trafficSource: "",
    conversionRate: "",
    monthlyTraffic: "",
  });

  const updateField = (field: keyof AuditFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.url.trim() !== "" && formData.pageType !== "";
      case 2:
        return formData.goal !== "";
      case 3:
        return formData.audience !== "";
      case 4:
        return formData.trafficSource !== "";
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "La generation de l'audit a echoue");
      }
      const report = await res.json();
      sessionStorage.setItem("auditReport", JSON.stringify(report));
      sessionStorage.setItem("auditFormData", JSON.stringify(formData));
      router.push("/audit/result");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur est survenue"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="border-b border-border bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <button
            onClick={() =>
              currentStep === 1 ? router.push("/") : handleBack()
            }
            className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {currentStep === 1 ? "Accueil" : "Retour"}
          </button>
          <span className="text-sm text-muted">
            Etape {currentStep} sur {steps.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-surface-dark">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="mx-auto max-w-3xl px-6 pt-8">
        <div className="mb-8 flex justify-center gap-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all ${
                step.id === currentStep
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : step.id < currentStep
                    ? "bg-primary/20 text-primary"
                    : "bg-surface-dark text-muted"
              }`}
            >
              {step.id < currentStep ? "\u2713" : step.id}
            </div>
          ))}
        </div>
      </div>

      {/* Form content */}
      <div className="mx-auto max-w-xl px-6 pb-20">
        <div className="animate-fade-in">
          {/* Step 1 — URL & Page Type */}
          {currentStep === 1 && (
            <div>
              <h2 className="mb-2 text-2xl font-bold">
                Quelle est l&apos;URL de votre landing page ?
              </h2>
              <p className="mb-8 text-muted">
                Nous allons analyser le contenu et la structure de votre page.
              </p>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium">
                  URL de la landing page
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => updateField("url", e.target.value)}
                  placeholder="https://exemple.com/landing-page"
                  className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-3 block text-sm font-medium">
                  Quel type de page est-ce ?
                </label>
                <div className="flex flex-wrap gap-3">
                  {pageTypes.map((type) => (
                    <OptionButton
                      key={type}
                      label={type}
                      selected={formData.pageType === type}
                      onClick={() => updateField("pageType", type)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Goal */}
          {currentStep === 2 && (
            <div>
              <h2 className="mb-2 text-2xl font-bold">
                Quel est l&apos;objectif principal de la page ?
              </h2>
              <p className="mb-8 text-muted">
                Cela nous aide a evaluer si votre page est optimisee pour la
                bonne action de conversion.
              </p>
              <div className="flex flex-wrap gap-3">
                {goals.map((goal) => (
                  <OptionButton
                    key={goal}
                    label={goal}
                    selected={formData.goal === goal}
                    onClick={() => updateField("goal", goal)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 3 — Audience */}
          {currentStep === 3 && (
            <div>
              <h2 className="mb-2 text-2xl font-bold">
                Quelle est votre audience cible ?
              </h2>
              <p className="mb-8 text-muted">
                Chaque audience reagit differemment aux messages et aux choix de
                design.
              </p>
              <div className="flex flex-wrap gap-3">
                {audiences.map((aud) => (
                  <OptionButton
                    key={aud}
                    label={aud}
                    selected={formData.audience === aud}
                    onClick={() => updateField("audience", aud)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 4 — Traffic Source */}
          {currentStep === 4 && (
            <div>
              <h2 className="mb-2 text-2xl font-bold">
                D&apos;ou vient la majorite de votre trafic ?
              </h2>
              <p className="mb-8 text-muted">
                Votre source de trafic influence les attentes des visiteurs
                lorsqu&apos;ils arrivent sur votre page.
              </p>
              <div className="flex flex-wrap gap-3">
                {trafficSources.map((src) => (
                  <OptionButton
                    key={src}
                    label={src}
                    selected={formData.trafficSource === src}
                    onClick={() => updateField("trafficSource", src)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 5 — Metrics */}
          {currentStep === 5 && (
            <div>
              <h2 className="mb-2 text-2xl font-bold">
                Metriques de performance actuelles
              </h2>
              <p className="mb-8 text-muted">
                Optionnel, mais nous permet de fournir des recommandations plus
                pertinentes.
              </p>
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Taux de conversion actuel
                  </label>
                  <input
                    type="text"
                    value={formData.conversionRate}
                    onChange={(e) =>
                      updateField("conversionRate", e.target.value)
                    }
                    placeholder="ex : 2,5%"
                    className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Trafic mensuel
                  </label>
                  <input
                    type="text"
                    value={formData.monthlyTraffic}
                    onChange={(e) =>
                      updateField("monthlyTraffic", e.target.value)
                    }
                    placeholder="ex : 5 000 visiteurs"
                    className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="mt-10 flex justify-between">
          <button
            onClick={handleBack}
            className={`flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-surface-dark ${
              currentStep === 1 ? "invisible" : ""
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              Suivant
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  Generer l&apos;audit
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
