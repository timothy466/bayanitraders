'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import type { DigitStats } from '../lib/types';

interface DigitStatsBarProps {
  digitStats: DigitStats;
  selectedDigit: number;
  onDigitSelect: (digit: number) => void;

  cursorDigit?: number;
  cursorColor?: 'green' | 'red';
}

export function DigitStatsBar({
  digitStats,
  selectedDigit,
  onDigitSelect,
  cursorDigit = selectedDigit,
  cursorColor = 'red',
}: DigitStatsBarProps) {
  const maxPct = Math.max(...digitStats.percentages);
  const minPct = Math.min(...digitStats.percentages);

  return (
    <div className="h-full flex flex-col min-h-0">
      <span className="text-xs sm:text-sm text-muted-foreground mb-3">
        Last Digit Prediction
      </span>

      <div className="grid grid-cols-5 gap-3 place-items-center">
        {digitStats.percentages.map((pct, digit) => {
          const isSelected = digit === selectedDigit;
          const showCursor = digit === cursorDigit;

          const isHighest =
            digitStats.totalTicks > 0 && pct === maxPct;

          const isLowest =
            digitStats.totalTicks > 0 && pct === minPct;

          return (
            <div
              key={digit}
              className="flex flex-col items-center gap-1"
            >
              <ChevronDown
                className={cn(
                  'w-5 h-5 animate-bounce transition-colors duration-300',
                  showCursor
                    ? cursorColor === 'green'
                      ? 'text-green-500'
                      : 'text-red-500'
                    : 'opacity-0'
                )}
              />

              <Button
                variant={isSelected ? 'default' : 'outline'}
                onClick={() => onDigitSelect(digit)}
                className={cn(
                  'w-12 h-12 rounded-full text-lg font-bold transition-all duration-300',
                  showCursor &&
                    cursorColor === 'green' &&
                    'ring-2 ring-green-500',
                  showCursor &&
                    cursorColor === 'red' &&
                    'ring-2 ring-red-500'
                )}
              >
                {digit}
              </Button>

              <span
                className={cn(
                  'text-xs font-mono',
                  isHighest && 'text-green-500 font-semibold',
                  isLowest && 'text-red-500 font-semibold',
                  !isHighest &&
                    !isLowest &&
                    'text-muted-foreground'
                )}
              >
                {pct.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
                }
