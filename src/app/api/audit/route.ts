import { NextRequest, NextResponse } from "next/server";
import type { AuditFormData, AuditReport } from "@/types/audit";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

async function fetchPageContent(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; CROAuditBot/1.0; +https://cro-audit.ai)",
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const cleaned = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<svg[\s\S]*?<\/svg>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 8000);
    return cleaned;
  } catch {
    return "[Impossible de recuperer le contenu de la page — l'analyse sera basee uniquement sur le contexte fourni]";
  }
}

function buildPrompt(formData: AuditFormData, pageContent: string): string {
  return `Tu es un consultant expert en CRO (Conversion Rate Optimization) avec plus de 15 ans d'experience dans l'audit de landing pages pour des startups, des marques ecommerce et des agences.

Analyse la landing page suivante et genere un rapport d'audit CRO complet. TOUT LE RAPPORT DOIT ETRE REDIGE EN FRANCAIS.

## Informations sur la page
- **URL** : ${formData.url}
- **Type de page** : ${formData.pageType}
- **Objectif principal** : ${formData.goal}
- **Audience cible** : ${formData.audience}
- **Source de trafic** : ${formData.trafficSource}
${formData.conversionRate ? `- **Taux de conversion actuel** : ${formData.conversionRate}` : ""}
${formData.monthlyTraffic ? `- **Trafic mensuel** : ${formData.monthlyTraffic}` : ""}

## Contenu de la page (texte extrait)
${pageContent}

## Instructions
Analyse cette page en profondeur et retourne un objet JSON correspondant exactement a la structure ci-dessous. Sois specifique et actionnable — fais reference au contenu reel de la page quand c'est possible.

Retourne UNIQUEMENT du JSON valide avec cette structure :
{
  "overallScore": <nombre 0-100>,
  "summary": "<Resume de 2-3 phrases des forces et faiblesses de conversion de la page, EN FRANCAIS>",
  "sections": [
    {
      "title": "Proposition de valeur et titre",
      "score": <nombre>,
      "maxScore": 20,
      "findings": [
        {
          "type": "positive" | "warning" | "critical",
          "text": "<constat specifique EN FRANCAIS>",
          "recommendation": "<recommandation actionnable EN FRANCAIS ou null>"
        }
      ]
    },
    {
      "title": "Efficacite des CTA",
      "score": <nombre>,
      "maxScore": 20,
      "findings": [...]
    },
    {
      "title": "Confiance et preuve sociale",
      "score": <nombre>,
      "maxScore": 15,
      "findings": [...]
    },
    {
      "title": "Hierarchie visuelle et mise en page",
      "score": <nombre>,
      "maxScore": 15,
      "findings": [...]
    },
    {
      "title": "Friction et UX",
      "score": <nombre>,
      "maxScore": 15,
      "findings": [...]
    },
    {
      "title": "Alignement trafic / message",
      "score": <nombre>,
      "maxScore": 15,
      "findings": [...]
    }
  ],
  "quickWins": ["<3-5 changements a fort impact et faciles a implementer, EN FRANCAIS>"],
  "estimatedImpact": "<estimation de l'amelioration potentielle du taux de conversion si les recommandations sont appliquees, EN FRANCAIS>"
}

Regles :
- Chaque section doit contenir 2 a 5 constats
- Sois specifique : fais reference au texte reel, aux CTA ou aux elements de la page
- Note honnetement — ne gonfle pas les scores
- Les quick wins doivent etre realisables en moins d'1 heure
- Le overallScore doit etre la somme de tous les scores de sections
- Pour la source de trafic "${formData.trafficSource}", evalue l'alignement entre le message et l'intention du visiteur
- Pour l'audience "${formData.audience}", evalue si le messaging resonne avec ce segment
- TOUT le contenu textuel (summary, findings, recommendations, quickWins, estimatedImpact) DOIT etre en francais`;
}

export async function POST(request: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Cle API non configuree. Definissez ANTHROPIC_API_KEY dans .env.local" },
      { status: 500 }
    );
  }

  let formData: AuditFormData;
  try {
    formData = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requete invalide" }, { status: 400 });
  }

  if (!formData.url || !formData.pageType || !formData.goal) {
    return NextResponse.json(
      { error: "Champs obligatoires manquants" },
      { status: 400 }
    );
  }

  const pageContent = await fetchPageContent(formData.url);
  const prompt = buildPrompt(formData, pageContent);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Erreur API Anthropic :", errBody);
      return NextResponse.json(
        { error: "L'analyse IA a echoue. Veuillez reessayer." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Pas de JSON trouve dans la reponse :", text);
      return NextResponse.json(
        { error: "Impossible de parser le rapport d'audit" },
        { status: 500 }
      );
    }

    const report: AuditReport = JSON.parse(jsonMatch[0]);
    return NextResponse.json(report);
  } catch (err) {
    console.error("Erreur de generation d'audit :", err);
    return NextResponse.json(
      { error: "Impossible de generer l'audit. Veuillez reessayer." },
      { status: 500 }
    );
  }
}
