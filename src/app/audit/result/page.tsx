"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Zap,
  Download,
  RotateCcw,
  Monitor,
  ImageOff,
} from "lucide-react";
import type { AuditReport, AuditFormData, AuditSection } from "@/types/audit";

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 75
      ? "bg-green-100 text-green-700 border-green-200"
      : score >= 50
        ? "bg-amber-100 text-amber-700 border-amber-200"
        : "bg-red-100 text-red-700 border-red-200";

  return (
    <span className={`rounded-full border px-3 py-1 text-sm font-bold ${color}`}>
      {score}/100
    </span>
  );
}

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle
          cx="70"
          cy="70"
          r="54"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="10"
        />
        <circle
          cx="70"
          cy="70"
          r="54"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold">{score}</span>
        <span className="text-xs text-muted">/100</span>
      </div>
    </div>
  );
}

function FindingIcon({ type }: { type: string }) {
  switch (type) {
    case "positive":
      return <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />;
    case "critical":
      return <XCircle className="h-5 w-5 shrink-0 text-red-500" />;
    default:
      return null;
  }
}

function PageScreenshot({ url }: { url: string }) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const screenshotSrc = `/api/screenshot?url=${encodeURIComponent(url)}`;

  return (
    <div className="mb-10 rounded-2xl border border-border bg-white p-6 animate-fade-in">
      <div className="mb-4 flex items-center gap-2">
        <Monitor className="h-5 w-5 text-muted" />
        <h2 className="text-lg font-semibold">Capture d&apos;ecran de la page</h2>
      </div>
      <div className="relative overflow-hidden rounded-xl border border-border bg-surface-dark">
        {status === "loading" && (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-sm text-muted">Capture en cours...</p>
            </div>
          </div>
        )}
        {status === "error" && (
          <div className="flex h-48 items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-muted">
              <ImageOff className="h-8 w-8" />
              <p className="text-sm">Impossible de capturer la page</p>
            </div>
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={screenshotSrc}
          alt={`Capture d'ecran de ${url}`}
          className={`w-full ${status === "loaded" ? "block" : "hidden"}`}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
        />
      </div>
      <p className="mt-3 text-center text-xs text-muted break-all">{url}</p>
    </div>
  );
}

function SectionCard({ section }: { section: AuditSection }) {
  const pct = Math.round((section.score / section.maxScore) * 100);

  return (
    <div className="rounded-2xl border border-border bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{section.title}</h3>
        <ScoreBadge score={pct} />
      </div>
      <div className="mb-4 h-2 rounded-full bg-surface-dark">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            backgroundColor:
              pct >= 75 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444",
          }}
        />
      </div>
      <div className="space-y-3">
        {section.findings.map((finding, i) => (
          <div key={i} className="flex gap-3">
            <FindingIcon type={finding.type} />
            <div>
              <p className="text-sm">{finding.text}</p>
              {finding.recommendation && (
                <p className="mt-1 text-sm text-primary font-medium">
                  → {finding.recommendation}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const [report, setReport] = useState<AuditReport | null>(null);
  const [formData, setFormData] = useState<AuditFormData | null>(null);

  useEffect(() => {
    const storedReport = sessionStorage.getItem("auditReport");
    const storedForm = sessionStorage.getItem("auditFormData");
    if (storedReport && storedForm) {
      setReport(JSON.parse(storedReport));
      setFormData(JSON.parse(storedForm));
    } else {
      router.push("/audit");
    }
  }, [router]);

  if (!report || !formData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="border-b border-border bg-white">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Accueil
          </Link>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/audit")}
              className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-dark"
            >
              <RotateCcw className="h-4 w-4" />
              Nouvel audit
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              <Download className="h-4 w-4" />
              Exporter en PDF
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Score overview */}
        <div className="mb-10 rounded-2xl border border-border bg-white p-8 text-center animate-fade-in">
          <p className="mb-2 text-sm text-muted">Rapport d&apos;audit CRO pour</p>
          <p className="mb-6 text-lg font-semibold text-primary break-all">
            {formData.url}
          </p>
          <ScoreRing score={report.overallScore} />
          <p className="mt-6 mx-auto max-w-xl text-muted leading-relaxed">
            {report.summary}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-muted">
            <span className="rounded-full bg-surface px-3 py-1">
              {formData.pageType}
            </span>
            <span className="rounded-full bg-surface px-3 py-1">
              {formData.goal}
            </span>
            <span className="rounded-full bg-surface px-3 py-1">
              {formData.audience}
            </span>
            <span className="rounded-full bg-surface px-3 py-1">
              {formData.trafficSource}
            </span>
          </div>
        </div>

        {/* Page Screenshot */}
        <PageScreenshot url={formData.url} />

        {/* Quick Wins */}
        {report.quickWins.length > 0 && (
          <div className="mb-10 rounded-2xl border-2 border-amber-200 bg-amber-50 p-6 animate-slide-up">
            <div className="mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-600" />
              <h2 className="text-lg font-bold text-amber-900">
                Quick Wins — A faire en priorite
              </h2>
            </div>
            <ul className="space-y-2">
              {report.quickWins.map((win, i) => (
                <li key={i} className="flex gap-3 text-sm text-amber-800">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" />
                  {win}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sections */}
        <div className="space-y-6">
          {report.sections.map((section, i) => (
            <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <SectionCard section={section} />
            </div>
          ))}
        </div>

        {/* Estimated Impact */}
        {report.estimatedImpact && (
          <div className="mt-10 rounded-2xl bg-primary p-8 text-center text-white">
            <h2 className="mb-2 text-xl font-bold">Impact estime</h2>
            <p className="text-indigo-200">{report.estimatedImpact}</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 text-center">
          <button
            onClick={() => router.push("/audit")}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            <RotateCcw className="h-4 w-4" />
            Auditer une autre page
          </button>
        </div>
      </div>
    </div>
  );
}
