'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { DigitStats } from '../lib/types';
import { ChevronDown } from 'lucide-react';

interface DigitStatsBarProps {
  digitStats: DigitStats;
  selectedDigit: number;
  onDigitSelect: (digit: number) => void;
  cursorColor?: 'red' | 'green';
}

export function DigitStatsBar({
  digitStats,
  selectedDigit,
  onDigitSelect,
  cursorColor = 'red',
}: DigitStatsBarProps) {
  const maxPct = Math.max(...digitStats.percentages);
  const minPct = Math.min(...digitStats.percentages);

  return (
    <div className="h-full flex flex-col min-h-0">
      <span className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
        Last digit prediction
      </span>

      <div className="flex-1 flex items-center">
        <div className="grid grid-cols-5 gap-1.5 sm:gap-3 w-full place-items-center">
          {digitStats.percentages.map((pct, digit) => {
            const isSelected = digit === selectedDigit;
            const isHighest = digitStats.totalTicks > 0 && pct === maxPct;
            const isLowest = digitStats.totalTicks > 0 && pct === minPct;

            return (
              <div key={digit} className="flex flex-col items-center gap-1">
                {/* Arrow */}
                <div className="h-5 flex items-center justify-center">
                  {isSelected && (
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 animate-bounce transition-colors duration-300',
                        cursorColor === 'green'
                          ? 'text-green-500'
                          : 'text-red-500'
                      )}
                    />
                  )}
                </div>

                {/* Digit Button */}
                <Button
                  variant="outline"
                  onClick={() => onDigitSelect(digit)}
                  className={cn(
                    'w-11 h-11 sm:w-14 sm:h-14 text-base sm:text-xl font-semibold p-0 transition-all',
                    isSelected
                      ? 'border-red-500 ring-2 ring-red-500'
                      : 'opacity-80'
                  )}
                >
                  {digit}
                </Button>

                {/* Percentage */}
                <span
                  className={cn(
                    'text-xs font-mono',
                    isHighest && 'text-green-500 font-semibold',
                    isLowest && 'text-red-500 font-semibold'
                  )}
                >
                  {pct.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
