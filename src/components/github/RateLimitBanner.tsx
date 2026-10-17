import { useState } from 'react';
import { ShieldAlert, Key, Check, RefreshCw } from 'lucide-react';
import type { RateLimitInfo } from '../../types/github.ts';
import { getStoredToken, setStoredToken } from '../../services/githubApi.ts';
import { Button } from '../common/Button.tsx';

interface RateLimitBannerProps {
  rateLimit: RateLimitInfo;
  isRateLimited: boolean;
  onRetry: () => void;
}

export function RateLimitBanner({ rateLimit, isRateLimited, onRetry }: RateLimitBannerProps) {
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [tokenInput, setTokenInput] = useState(getStoredToken() || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const resetMinutes = Math.max(1, Math.ceil((rateLimit.resetTime * 1000 - Date.now()) / 60000));

  const handleSaveToken = () => {
    setStoredToken(tokenInput.trim() ? tokenInput.trim() : null);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowTokenInput(false);
      onRetry();
    }, 800);
  };

  if (!isRateLimited && rateLimit.remaining > 10 && !showTokenInput) {
    return null;
  }

  return (
    <div className="mb-8 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-bold text-amber-300">
              {isRateLimited
                ? 'GitHub Public API Rate Limit Reached'
                : `GitHub Rate Limit Low: ${rateLimit.remaining} remaining`}
            </div>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              GitHub allows 60 public unauthenticated requests per hour. Resets in ~{resetMinutes}{' '}
              minute{resetMinutes > 1 ? 's' : ''}. Provide an optional read-only personal token to
              increase limit to 5,000/hr, or switch to Demo Mode.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowTokenInput(!showTokenInput)}
            leftIcon={<Key className="w-3.5 h-3.5" />}
          >
            {showTokenInput ? 'Close' : 'Add Token (Optional)'}
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Retry
          </Button>
        </div>
      </div>

      {showTokenInput && (
        <div className="mt-4 pt-4 border-t border-amber-500/20 flex flex-col sm:flex-row items-center gap-2">
          <input
            type="password"
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (stored only in browser)"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="flex-1 w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
          <Button
            size="sm"
            variant="primary"
            onClick={handleSaveToken}
            leftIcon={savedSuccess ? <Check className="w-3.5 h-3.5 text-black" /> : undefined}
          >
            {savedSuccess ? 'Saved!' : 'Save Token'}
          </Button>
          {tokenInput && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setTokenInput('');
                setStoredToken(null);
                onRetry();
              }}
            >
              Clear
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
