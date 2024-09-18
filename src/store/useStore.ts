import { create } from 'zustand';
import { ITableRow } from '~/lib/types';

interface AnalysisState {
  output: ITableRow | null;
  loading: boolean;
  error: string | null;
  fetchReport: (reportId: string) => Promise<void>;
  resetOutput: () => void;
}

export const useStore = create<AnalysisState>((set) => ({
  output: null,
  loading: false,
  error: null,

  resetOutput: () => set({ output: null, loading: false, error: null }),

  fetchReport: async (reportId: string) => {
    set({ loading: true, error: null });

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportId }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch or generate data.');
      }

      const data = await response.json();
      set({ output: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
