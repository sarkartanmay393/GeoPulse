'use client';

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { useComparisonStore } from "~/store/useComparisonStore"

export default function DateRangePicker() {
  const { startDate, endDate, setDateRange } = useComparisonStore();

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    setDateRange(date, endDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    setDateRange(startDate, date);
  };

  const handleClear = () => {
    setDateRange(null, null);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <label className="block text-xs text-gray-600 mb-1">Start Date</label>
        <input
          type="date"
          value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
          onChange={handleStartDateChange}
          max={endDate ? format(endDate, 'yyyy-MM-dd') : undefined}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex-1">
        <label className="block text-xs text-gray-600 mb-1">End Date</label>
        <input
          type="date"
          value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
          onChange={handleEndDateChange}
          min={startDate ? format(startDate, 'yyyy-MM-dd') : undefined}
          max={format(new Date(), 'yyyy-MM-dd')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {(startDate || endDate) && (
        <div className="flex items-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
