export interface AuditFormData {
  url: string;
  pageType: string;
  goal: string;
  audience: string;
  trafficSource: string;
  conversionRate: string;
  monthlyTraffic: string;
}

export interface AuditSection {
  title: string;
  score: number;
  maxScore: number;
  findings: AuditFinding[];
}

export interface AuditFinding {
  type: "positive" | "warning" | "critical";
  text: string;
  recommendation?: string;
}

export interface AuditReport {
  overallScore: number;
  summary: string;
  sections: AuditSection[];
  quickWins: string[];
  estimatedImpact: string;
}
