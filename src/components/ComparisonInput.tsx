'use client';

import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { useComparisonStore } from '~/store/useComparisonStore';
import { useToast } from '~/components/ui/use-toast';
import MultiCountrySelect from './MultiCountrySelect';
import DateRangePicker from './DateRangePicker';

export default function ComparisonInput() {
  const { toast } = useToast();
  const {
    selectedCountries,
    startDate,
    endDate,
    fetchComparisonData,
    resetComparison,
    loading,
  } = useComparisonStore();

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
      toast({
        title: 'Success',
        description: 'Comparison data loaded successfully',
        duration: 2000,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch comparison data',
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 border border-gray-200 rounded-lg shadow-md bg-white mb-8">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Countries (2 or more)
          </label>
          <MultiCountrySelect />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Period (Optional)
          </label>
          <DateRangePicker />
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={handleCompare}
          disabled={loading || selectedCountries.length < 2}
          className="flex-1 bg-blue-500 hover:bg-blue-600"
        >
          {loading ? 'Loading...' : 'Compare Countries'}
        </Button>
        <Button
          onClick={resetComparison}
          variant="outline"
          className="flex-1"
        >
          Reset
        </Button>
      </div>

      {selectedCountries.length > 0 && (
        <div className="text-sm text-gray-600">
          Selected: {selectedCountries.join(', ')} ({selectedCountries.length} countries)
        </div>
      )}
    </div>
  );
}
