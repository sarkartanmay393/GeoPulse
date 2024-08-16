export type TCountry = {
  name: string;
  code: string;
  emoji: string;
  flag: string;
};

export type TCountryOption = {
  label: string;
  value: string;
  flag: string;
};

export interface IKeyFactor {
  score?: number;
  explanation?: string;
}

export interface IGeopoliticalAnalysis {
  diplomatic_relations?: IKeyFactor;
  economic_ties?: IKeyFactor;
  military_relations?: IKeyFactor;
  political_alignments?: IKeyFactor;
  cultural_social_ties?: IKeyFactor;
  historical_context?: IKeyFactor;
  overall_score?: IKeyFactor;
}

export interface ITableRow {
  id: string;
  countries: string[];
  last_updated: string;
  diplomatic_relations_score?: number;
  diplomatic_relations_explanation?: string;
  economic_ties_score?: number;
  economic_ties_explanation?: string;
  military_relations_score?: number;
  military_relations_explanation?: string;
  political_alignments_score?: number;
  political_alignments_explanation?: string;
  cultural_social_ties_score?: number;
  cultural_social_ties_explanation?: string;
  historical_context_score?: number;
  historical_context_explanation?: string;
  overall_score?: number;
  overall_explanation?: string;
}

export type TFormValues = {
  country1: string;
  country2: string;
}

export type TWrongReport = {
  id?: string;
  created_at: string;
  country1: string;
  country2: string;
  pulse_id: string;
  report_corrected: boolean
}