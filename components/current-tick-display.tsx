'use client';

import { cn } from '@/lib/utils';
import type { Tick } from '../lib/types';
import type { ActiveSymbol } from '../lib/types';

interface CurrentTickDisplayProps {
  tick: Tick | null;
  lastDigit: number | null;
  activeSymbol: ActiveSymbol | null;
  pipSize: number;

  // Animation state
  tradeResult?: 'win' | 'loss' | null;
}

export function CurrentTickDisplay({
  tick,
  lastDigit,
  activeSymbol,
  pipSize,
  tradeResult = null,
}: CurrentTickDisplayProps) {
  if (!tick || !activeSymbol) {
    return (
      <div className="text-center py-3 sm:py-6">
        <div className="text-xl sm:text-2xl font-mono text-muted-foreground">
          ---
        </div>
      </div>
    );
  }

  const priceStr = tick.quote.toFixed(pipSize);
  const priceWithoutLast = priceStr.slice(0, -1);
  const lastDigitStr = priceStr.slice(-1);

  return (
    <div className="text-center py-2 sm:py-4">
      <div className="text-2xl sm:text-3xl font-mono font-bold tracking-wide transition-all duration-300">
        <span className="text-foreground">
          {priceWithoutLast}
        </span>

        <span
          className={cn(
            "text-3xl sm:text-4xl transition-all duration-300",
            tradeResult === "win"
              ? "text-green-500 scale-125"
              : tradeResult === "loss"
              ? "text-red-500 scale-125"
              : "text-primary"
          )}
        >
          {lastDigitStr}
        </span>
      </div>

      <div className="mt-2 inline-flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          Last Digit
        </span>

        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300",
            tradeResult === "win"
              ? "bg-green-500 text-white"
              : tradeResult === "loss"
              ? "bg-red-500 text-white"
              : "bg-primary text-primary-foreground"
          )}
        >
          {lastDigit}
        </div>
      </div>
    </div>
  );
}
