import React, { useState, useRef, useEffect } from 'react';
import { type DateRange } from '../types';
import { Calendar, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  range: DateRange;
  onChange: (range: DateRange) => void;
}

// Define a proper type for the preset ranges
type PresetRange = 
  | { label: string; days: number; custom?: never }
  | { label: string; custom: 'month' | 'year'; days?: never };

const presetRanges: PresetRange[] = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
  { label: 'This month', custom: 'month' },
  { label: 'This year', custom: 'year' },
];

export const DateRangePicker: React.FC<Props> = ({ range, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localRange, setLocalRange] = useState(range);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePresetClick = (preset: PresetRange) => {
    const endDate = new Date();
    let startDate = new Date();

    // Type-safe check using type guard
    if ('custom' in preset) {
      // Handle custom presets
      if (preset.custom === 'month') {
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      } else if (preset.custom === 'year') {
        startDate = new Date(endDate.getFullYear(), 0, 1);
      }
    } else {
      // Handle days-based presets
      startDate.setDate(endDate.getDate() - preset.days);
    }

    const newRange = { startDate, endDate };
    setLocalRange(newRange);
    onChange(newRange);
    setIsOpen(false);
  };

  const handleApply = () => {
    onChange(localRange);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Calendar className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-700">
          {format(range.startDate, 'dd MMM yyyy')} - {format(range.endDate, 'dd MMM yyyy')}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Select Date Range</h3>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              {presetRanges.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePresetClick(preset)}
                  className="px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={format(localRange.startDate, 'yyyy-MM-dd')}
                  onChange={(e) => setLocalRange({
                    ...localRange,
                    startDate: new Date(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End Date</label>
                <input
                  type="date"
                  value={format(localRange.endDate, 'yyyy-MM-dd')}
                  onChange={(e) => setLocalRange({
                    ...localRange,
                    endDate: new Date(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};