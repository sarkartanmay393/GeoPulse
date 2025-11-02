import { create } from 'zustand';
import { ITableRow } from '~/lib/types';

export interface ComparisonData {
  countries: string[];
  startDate: Date;
  endDate: Date;
  data: ITableRow[];
}

interface ComparisonState {
  selectedCountries: string[];
  startDate: Date | null;
  endDate: Date | null;
  comparisonData: ITableRow[];
  loading: boolean;
  error: string | null;
  setSelectedCountries: (countries: string[]) => void;
  setDateRange: (start: Date | null, end: Date | null) => void;
  fetchComparisonData: () => Promise<void>;
  resetComparison: () => void;
}

export const useComparisonStore = create<ComparisonState>((set, get) => ({
  selectedCountries: [],
  startDate: null,
  endDate: null,
  comparisonData: [],
  loading: false,
  error: null,

  setSelectedCountries: (countries: string[]) => set({ selectedCountries: countries }),
  
  setDateRange: (start: Date | null, end: Date | null) => 
    set({ startDate: start, endDate: end }),

  fetchComparisonData: async () => {
    const { selectedCountries, startDate, endDate } = get();
    
    if (selectedCountries.length < 2) {
      set({ error: 'Please select at least 2 countries' });
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countries: selectedCountries,
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch comparison data');
      }

      const data = await response.json();
      set({ comparisonData: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  resetComparison: () => set({
    selectedCountries: [],
    startDate: null,
    endDate: null,
    comparisonData: [],
    loading: false,
    error: null,
  }),
}));
