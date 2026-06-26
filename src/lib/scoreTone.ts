export type ScoreTone = {
  label: "Strong" | "Good" | "Moderate" | "Weak";
  rangeLabel: string;
  min: number;
  textClass: string;
  hex: string;
};

export const SCORE_TONES: ScoreTone[] = [
  { label: "Strong", rangeLabel: "85+", min: 85, textClass: "text-emerald-600", hex: "#059669" },
  { label: "Good", rangeLabel: "70-84", min: 70, textClass: "text-blue-600", hex: "#2563eb" },
  { label: "Moderate", rangeLabel: "50-69", min: 50, textClass: "text-amber-600", hex: "#d97706" },
  { label: "Weak", rangeLabel: "<50", min: 0, textClass: "text-rose-600", hex: "#e11d48" },
];

export function getScoreTone(score: number): ScoreTone {
  return SCORE_TONES.find((tone) => score >= tone.min) ?? SCORE_TONES[SCORE_TONES.length - 1]!;
}
