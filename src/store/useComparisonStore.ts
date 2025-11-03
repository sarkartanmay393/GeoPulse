import { create } from 'zustand';
import { ITableRow } from '~/lib/types';

export interface ComparisonData {
  countries: string[];
  startDate: Date;
  endDate: Date;
  data: ITableRow[];
}

export interface GenerationProgress {
  pairId: string;
  countries: [string, string];
  status: 'pending' | 'generating' | 'completed' | 'error';
  error?: string;
}

interface ComparisonState {
  selectedCountries: string[];
  startDate: Date | null;
  endDate: Date | null;
  comparisonData: ITableRow[];
  loading: boolean;
  error: string | null;
  generationProgress: GenerationProgress[];
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
  generationProgress: [],

  setSelectedCountries: (countries: string[]) => set({ selectedCountries: countries }),
  
  setDateRange: (start: Date | null, end: Date | null) => 
    set({ startDate: start, endDate: end }),

  fetchComparisonData: async () => {
    const { selectedCountries, startDate, endDate } = get();
    
    if (selectedCountries.length < 2) {
      set({ error: 'Please select at least 2 countries' });
      return;
    }

    set({ loading: true, error: null, generationProgress: [] });

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

      const result = await response.json();
      
      // Handle response with progress tracking
      if (result.missingPairs && result.missingPairs.length > 0) {
        // Initialize progress for missing pairs
        const progress: GenerationProgress[] = result.missingPairs.map((pair: any) => ({
          pairId: pair.pairId,
          countries: pair.countries,
          status: 'pending',
        }));
        set({ generationProgress: progress });

        // Generate missing pairs one by one
        const generatedData: ITableRow[] = [...(result.existingData || [])];
        
        for (const pair of result.missingPairs) {
          // Update status to generating
          set((state) => ({
            generationProgress: state.generationProgress.map((p) =>
              p.pairId === pair.pairId ? { ...p, status: 'generating' } : p
            ),
          }));

          try {
            const genResponse = await fetch('/api/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ reportId: pair.pairId }),
            });

            if (!genResponse.ok) {
              throw new Error(`Failed to generate report for ${pair.countries.join(' vs ')}`);
            }

            const generatedReport = await genResponse.json();
            generatedData.push(generatedReport);

            // Update status to completed
            set((state) => ({
              generationProgress: state.generationProgress.map((p) =>
                p.pairId === pair.pairId ? { ...p, status: 'completed' } : p
              ),
            }));
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            set((state) => ({
              generationProgress: state.generationProgress.map((p) =>
                p.pairId === pair.pairId ? { ...p, status: 'error', error: errorMsg } : p
              ),
            }));
          }
        }

        set({ comparisonData: generatedData, loading: false });
      } else {
        // All data exists, just use it
        set({ comparisonData: result.existingData || result, loading: false });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage, loading: false });
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
    generationProgress: [],
  }),
}));
