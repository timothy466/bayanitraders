'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/custom/footer';
import { Header } from '@/components/custom/header';
import { Skeleton } from '@/components/ui/skeleton';
import { CurrentTickDisplay } from './current-tick-display';
import { DigitStatsBar } from './digit-stats-bar';
import { TradeControls } from './trade-controls';
import { TradeTypeChips } from '@/components/custom/trade-type-chips';
import { SymbolSelector } from '@/components/custom/symbol-selector';
import { ThemeToggle } from '@/components/custom/theme-toggle';

import type {
  AuthState,
  DerivAccount,
  ActiveSymbol,
  Tick,
  ProposalInfo,
  DurationLimits,
  BuyResult,
} from '@deriv/core';

import type { ContractMode, TradeType, DigitStats } from '../lib/types';
import type { OpenPosition } from '@/hooks/use-open-positions';
import type { ClosedPosition } from '@/hooks/use-closed-positions';

const DIGIT_TRADE_TYPE_OPTIONS: { value: TradeType; label: string }[] = [
  { value: 'matches-differs', label: 'Matches/Differs' },
  { value: 'over-under', label: 'Over/Under' },
  { value: 'even-odd', label: 'Even/Odd' },
];

export interface DigitsViewProps {
  authState: AuthState;
  accounts: DerivAccount[];
  activeAccount: DerivAccount | null;
  onLogin: () => Promise<void>;
  onSignUp: () => Promise<void>;
  onLogout: () => void;
  onSwitchAccount: (accountId: string) => Promise<void>;

  isConnected: boolean;
  isLoading: boolean;
  error: string | null;

  symbols: ActiveSymbol[];
  activeSymbol: ActiveSymbol | null;
  selectSymbol: (symbol: string) => void;

  currentTick: Tick | null;
  lastDigit: number | null;
  digitStats: DigitStats;
  pipSize: number;

  tradeType: TradeType;
  setTradeType: (type: TradeType) => void;

  contractMode: ContractMode;
  setContractMode: (mode: ContractMode) => void;

  selectedDigit: number;
  setSelectedDigit: (digit: number) => void;

  stake: string;
  setStake: (value: string) => void;

  duration: number;
  setDuration: (value: number) => void;

  durationLimits: DurationLimits;
  proposal: ProposalInfo | null;
  isProposalLoading: boolean;

  buyContract: () => Promise<void>;
  isBuying: boolean;
  buyResult: BuyResult | null;
  buyError: string | null;
  clearBuyResult: () => void;

  // pass positions through so TradeControls can react to closes
  openPositions: OpenPosition[];
  closedPositions: ClosedPosition[];

  logoSrc?: string;
  appName?: string;
}

export function DigitsView(props: DigitsViewProps) {
  const {
    authState,
    accounts,
    activeAccount,
    onLogin,
    onSignUp,
    onLogout,
    onSwitchAccount,
    isConnected,
    isLoading,
    error,
    symbols,
    activeSymbol,
    selectSymbol,
    currentTick,
    lastDigit,
    digitStats,
    pipSize,
    tradeType,
    setTradeType,
    contractMode,
    setContractMode,
    selectedDigit,
    setSelectedDigit,
    stake,
    setStake,
    duration,
    setDuration,
    durationLimits,
    proposal,
    isProposalLoading,
    buyContract,
    isBuying,
    buyResult,
    buyError,
    clearBuyResult,
    openPositions,
    closedPositions,
    logoSrc,
    appName,
  } = props;

  if (error) {
    return (
      <main className="flex flex-col bg-background items-center justify-center px-4 min-h-dvh">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-destructive">
              Connection Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  // ✅ WIN/LOSS DETECTION (safe fallback)
  const cursorColor = useMemo(() => {
    if (!buyResult) return 'red';

    const result: any = buyResult;

    if (result?.profit > 0 || result?.status === 'won') {
      return 'green';
    }

    return 'red';
  }, [buyResult]);

  return (
    <main className="flex flex-col bg-background max-lg:h-dvh">
      <Header
        authState={authState}
        accounts={accounts}
        activeAccount={activeAccount}
        onLogin={onLogin}
        onSignUp={onSignUp}
        onLogout={onLogout}
        onSwitchAccount={onSwitchAccount}
        logoSrc={logoSrc}
        appName={appName}
        actions={<ThemeToggle />}
      />

      <div
        className={
          authState === 'authenticated'
            ? 'h-[76px] shrink-0'
            : 'h-[66px] shrink-0'
        }
      />

      <div className="flex w-full max-w-7xl mx-auto flex-col px-3 py-2 gap-2 pb-10">
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-[420px]" />
          </>
        ) : (
          <>
            <TradeTypeChips
              value={tradeType}
              options={DIGIT_TRADE_TYPE_OPTIONS}
              onValueChange={setTradeType}
            />

            <Card>
              <CardContent className="p-4 flex flex-col gap-4">
                <SymbolSelector
                  symbols={symbols}
                  activeSymbol={activeSymbol}
                  onSymbolChange={selectSymbol}
                />

                <CurrentTickDisplay
                  tick={currentTick}
                  lastDigit={lastDigit}
                  activeSymbol={activeSymbol}
                  pipSize={pipSize}
                />

                {/* ✅ HERE IS THE LINK TO ARROW COLOR */}
                <DigitStatsBar
                  digitStats={digitStats}
                  selectedDigit={selectedDigit}
                  onDigitSelect={setSelectedDigit}
                  cursorColor={cursorColor}
                />

                <TradeControls
                  tradeType={tradeType}
                  contractMode={contractMode}
                  onContractModeChange={setContractMode}
                  selectedDigit={selectedDigit}
                  isConnected={isConnected}
                  stake={stake}
                  onStakeChange={setStake}
                  duration={duration}
                  onDurationChange={setDuration}
                  durationLimits={durationLimits}
                  proposal={proposal}
                  isProposalLoading={isProposalLoading}
                  onBuy={buyContract}
                  isBuying={isBuying}
                  buyResult={buyResult}
                  buyError={buyError}
                  onClearBuyResult={clearBuyResult}
                  isAuthenticated={authState === 'authenticated'}
                  openPositions={openPositions}
                  closedPositions={closedPositions}
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 text-center bg-background/80">
        <Footer />
      </div>
    </main>
  );
}
