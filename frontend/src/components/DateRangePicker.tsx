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

    if ('custom' in preset) {
      if (preset.custom === 'month') {
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
      } else if (preset.custom === 'year') {
        startDate = new Date(endDate.getFullYear(), 0, 1);
      }
    } else {
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

  // Format display text based on screen size
  const displayText = {
    mobile: `${format(range.startDate, 'dd/MM/yy')} - ${format(range.endDate, 'dd/MM/yy')}`,
    desktop: `${format(range.startDate, 'dd MMM yyyy')} - ${format(range.endDate, 'dd MMM yyyy')}`
  };

  return (
    <div className="relative w-full md:w-auto" ref={dropdownRef}>
      {/* Trigger Button - Full width on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full md:w-auto flex items-center justify-between md:justify-start space-x-2 px-4 py-3 md:py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500 shrink-0" />
          {/* Mobile text - shorter format */}
          <span className="text-sm text-gray-700 md:hidden">
            {displayText.mobile}
          </span>
          {/* Desktop text - full format */}
          <span className="text-sm text-gray-700 hidden md:inline">
            {displayText.desktop}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel - Responsive positioning and sizing */}
      {isOpen && (
        <div className={`
          fixed md:absolute 
          inset-x-4 md:inset-x-auto 
          bottom-4 md:bottom-auto 
          md:right-0 
          mt-0 md:mt-2
          w-auto md:w-96 
          bg-white rounded-xl md:rounded-lg 
          shadow-2xl md:shadow-xl 
          border border-gray-200 
          z-50
          max-h-[90vh] md:max-h-none
          overflow-y-auto
          animate-slide-up md:animate-none
        `}>
          <div className="p-4 md:p-4">
            {/* Header with close button for mobile */}
            <div className="flex justify-between items-center mb-4 md:hidden">
              <h3 className="text-lg font-semibold text-gray-800">Select Date Range</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <span className="text-2xl leading-none">×</span>
              </button>
            </div>
            
            {/* Desktop header */}
            <h3 className="hidden md:block text-sm font-medium text-gray-700 mb-3">
              Select Date Range
            </h3>
            
            {/* Preset buttons - Responsive grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2 mb-4">
              {presetRanges.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePresetClick(preset)}
                  className="px-3 py-3 md:py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Date inputs */}
            <div className="space-y-4 md:space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={format(localRange.startDate, 'yyyy-MM-dd')}
                  onChange={(e) => setLocalRange({
                    ...localRange,
                    startDate: new Date(e.target.value)
                  })}
                  className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg text-base md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={format(localRange.endDate, 'yyyy-MM-dd')}
                  onChange={(e) => setLocalRange({
                    ...localRange,
                    endDate: new Date(e.target.value)
                  })}
                  className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg text-base md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col-reverse md:flex-row justify-end space-y-2 space-y-reverse md:space-y-0 md:space-x-2 mt-6 md:mt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full md:w-auto px-4 py-3 md:py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 touch-manipulation"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="w-full md:w-auto px-4 py-3 md:py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 touch-manipulation"
              >
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add animation keyframes to your index.css or global styles */}
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};