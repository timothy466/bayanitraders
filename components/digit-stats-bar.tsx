'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import type { DigitStats } from '../lib/types';

interface DigitStatsBarProps {
  digitStats: DigitStats;
  selectedDigit: number;
  onDigitSelect: (digit: number) => void;

  // Optional animation props
  cursorDigit?: number;
  result?: 'win' | 'loss' | null;
}

export function DigitStatsBar({
  digitStats,
  selectedDigit,
  onDigitSelect,
  cursorDigit = selectedDigit,
  result = null,
}: DigitStatsBarProps) {
  const maxPct = Math.max(...digitStats.percentages);
  const minPct = Math.min(...digitStats.percentages);

  return (
    <div className="h-full flex flex-col min-h-0">
      <span className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
        Last digit prediction
      </span>

      <div className="flex-1 flex items-center min-h-0">
        <div className="grid grid-cols-5 gap-1.5 sm:gap-3 place-items-center w-full">
          {digitStats.percentages.map((pct, digit) => {
            const isSelected = digit === selectedDigit;
            const isHighest =
              digitStats.totalTicks > 0 && pct === maxPct;
            const isLowest =
              digitStats.totalTicks > 0 && pct === minPct;

            const showCursor = digit === cursorDigit;

            return (
              <div
                key={digit}
                className="flex flex-col items-center gap-1 sm:gap-1.5"
              >
                {showCursor && (
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 animate-bounce",
                      result === "win" && "text-green-500",
                      result === "loss" && "text-red-500",
                      result === null && "text-blue-500"
                    )}
                  />
                )}

                <Button
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => onDigitSelect(digit)}
                  className={cn(
                    "w-11 h-11 sm:w-14 sm:h-14 text-base sm:text-xl font-semibold rounded-lg p-0 transition-all duration-300",
                    !isSelected &&
                      "bg-muted/50 border-muted-foreground/20",
                    result === "win" &&
                      showCursor &&
                      "ring-2 ring-green-500",
                    result === "loss" &&
                      showCursor &&
                      "ring-2 ring-red-500"
                  )}
                >
                  {digit}
                </Button>

                <span
                  className={cn(
                    "text-xs font-mono",
                    isHighest && "text-green-500 font-semibold",
                    isLowest && "text-red-500 font-semibold",
                    !isHighest &&
                      !isLowest &&
                      "text-muted-foreground"
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
