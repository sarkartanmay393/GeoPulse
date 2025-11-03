'use client';

import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { useComparisonStore } from '~/store/useComparisonStore';
import { useToast } from '~/components/ui/use-toast';
import MultiCountrySelect from './MultiCountrySelect';
import DateRangePicker from './DateRangePicker';
import { Sparkles, RotateCcw } from 'lucide-react';

export default function ComparisonInput() {
  const { toast } = useToast();
  const {
    selectedCountries,
    startDate,
    endDate,
    fetchComparisonData,
    resetComparison,
    loading,
    generationProgress,
  } = useComparisonStore();

  const pairsCount = selectedCountries.length >= 2 
    ? (selectedCountries.length * (selectedCountries.length - 1)) / 2 
    : 0;

  const handleCompare = async () => {
    if (selectedCountries.length < 2) {
      toast({
        title: 'Selection Required',
        description: 'Please select at least 2 countries to compare',
        duration: 3000,
      });
      return;
    }

    try {
      await fetchComparisonData();
      if (generationProgress.length === 0) {
        toast({
          title: 'Success',
          description: 'All comparison data loaded from cache',
          duration: 2000,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch comparison data';
      toast({
        title: 'Error',
        description: errorMessage,
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-8 border-2 border-blue-100 rounded-xl shadow-lg bg-gradient-to-br from-white to-blue-50 mb-8">
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-base font-semibold text-gray-800">
              🌍 Select Countries to Compare
            </label>
            {selectedCountries.length >= 2 && (
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                {pairsCount} {pairsCount === 1 ? 'pair' : 'pairs'} will be analyzed
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">Choose 2 or more countries to analyze their geopolitical relationships</p>
          <MultiCountrySelect />
        </div>
        
        <div className="space-y-3">
          <label className="block text-base font-semibold text-gray-800">
            📅 Time Period <span className="text-sm font-normal text-gray-500">(Optional)</span>
          </label>
          <p className="text-sm text-gray-600">Filter historical data by date range</p>
          <DateRangePicker />
        </div>
      </div>

      <div className="flex gap-4 pt-2">
        <Button
          onClick={handleCompare}
          disabled={loading || selectedCountries.length < 2}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-6 text-lg shadow-md hover:shadow-lg transition-all"
        >
          {loading ? (
            <>
              <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Compare Countries
            </>
          )}
        </Button>
        <Button
          onClick={resetComparison}
          variant="outline"
          className="px-6 py-6 border-2 hover:bg-gray-100 transition-all"
          disabled={loading}
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>

      {selectedCountries.length > 0 && (
        <div className="pt-4 border-t border-blue-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Selected Countries:</p>
          <div className="flex flex-wrap gap-2">
            {selectedCountries.map((country, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {country}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
