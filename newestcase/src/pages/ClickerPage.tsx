import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { formatPrice } from '@/lib/utils';
import { MousePointerClick, Coins, Zap } from 'lucide-react';

interface ClickerPageProps {
  onNavigate: (page: string) => void;
}

interface ClickerRow {
  user_id: string;
  click_level: number;
  coins_earned: number;
  unclaimed: number;
}

// Upgrade costs: level N costs base * growth^(N-1)
const CLICK_BASE_COST = 25;
const CLICK_GROWTH = 1.6;

function clickUpgradeCost(level: number): number {
  return Math.round(CLICK_BASE_COST * Math.pow(CLICK_GROWTH, level - 1) * 100) / 100;
}
export function coinsPerClick(level: number): number {
  return level;
}

interface FloatCoin {
  id: number;
  x: number;
  y: number;
  amount: number;
}

export default function ClickerPage({ onNavigate }: ClickerPageProps) {
  const { session, profile, refreshProfile } = useAuth();
  const [state, setState] = useState<ClickerRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [floatCoins, setFloatCoins] = useState<FloatCoin[]>([]);
  const [pulse, setPulse] = useState(false);
  const floatIdRef = useRef(0);

  const loadState = useCallback(async () => {
    if (!session) return;
    const { data } = await supabase
      .from('clicker_state')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (data) {
      setState(data as ClickerRow);
    } else {
      const { data: created } = await supabase
        .from('clicker_state')
        .insert({})
        .select('*')
        .maybeSingle();
      if (created) setState(created as ClickerRow);
    }
    setLoading(false);
  }, [session]);

  useEffect(() => {
    loadState();
  }, [loadState]);

  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (!session || !state) return;

    const amount = coinsPerClick(state.click_level);

    const { data, error } = await supabase.rpc('clicker_click', { p_user_id: session.user.id, p_amount: amount });
    if (error || data === null) return;
    setState({ ...state, coins_earned: Number(data) });
    await refreshProfile();
    setPulse(true);
    setTimeout(() => setPulse(false), 90);

    const rect = e.currentTarget.getBoundingClientRect();
    const id = ++floatIdRef.current;
    setFloatCoins((prev) => [
      ...prev.slice(-10),
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top, amount },
    ]);
    setTimeout(() => setFloatCoins((prev) => prev.filter((c) => c.id !== id)), 800);


  }

  async function buyClickUpgrade() {
    if (!session || !state) return;
    const cost = clickUpgradeCost(state.click_level);
    if (profile && profile.balance < cost) return;

    const { data, error } = await supabase.rpc('clicker_buy_click_upgrade', { p_user_id: session.user.id });
    if (error || data === null) return;

    setState({ ...state, click_level: state.click_level + 1 });
    await refreshProfile();
  }


  if (!session) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <MousePointerClick size={48} className="text-gray-700 mx-auto mb-4" />
        <h1 className="font-display text-2xl uppercase tracking-wider text-white mb-2">Фармилка</h1>
        <p className="text-gray-500 font-body mb-6">Войдите, чтобы зарабатывать монеты</p>
        <button onClick={() => onNavigate('home')} className="text-css-orange hover:underline font-body">← На главную</button>
      </div>
    );
  }

  if (loading || !state) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-600 font-body animate-pulse">Загрузка кликера...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="font-display text-4xl uppercase tracking-wider text-white mb-2">Фармилка</h1>
        <p className="text-gray-500 font-body">Кликай, качай прокачку и зарабатывай монеты для открытия кейсов</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-css-panel border border-css-border p-4 text-center">
          <Coins size={18} className="text-css-orange mx-auto mb-1" />
          <p className="font-mono-cs font-bold text-white text-lg">{formatPrice(profile?.balance || 0)}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-body">Баланс</p>
        </div>
        <div className="bg-css-panel border border-css-border p-4 text-center">
          <MousePointerClick size={18} className="text-css-orange mx-auto mb-1" />
          <p className="font-mono-cs font-bold text-white text-lg">{coinsPerClick(state.click_level)}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-body">За клик</p>
        </div>

      </div>

      {/* Clicker area */}
      <div className="flex flex-col items-center mb-8">
        <button
          onClick={handleClick}
          className={`relative w-44 h-44 rounded-full bg-gradient-to-br from-css-orange to-css-orange-dark border-4 border-css-orange-light shadow-[0_0_40px_rgba(232,123,30,0.4)] hover:shadow-[0_0_60px_rgba(232,123,30,0.6)] transition-all select-none ${
            pulse ? 'scale-90' : 'scale-100'
          } active:scale-75`}
        >
          <span className="font-display font-bold text-black text-xl uppercase tracking-wider pointer-events-none">
            Клик!
          </span>
          {floatCoins.map((c) => (
            <span
              key={c.id}
              className="absolute font-mono-cs font-bold text-css-orange text-lg pointer-events-none animate-float-up"
              style={{ left: c.x, top: c.y }}
            >
              +{c.amount}
            </span>
          ))}
        </button>

        <p className="text-gray-600 font-body text-xs mt-3">
          Всего заработано: <span className="text-css-tan font-mono-cs">{formatPrice(state.coins_earned)}</span>
        </p>

        {/* Click power upgrade — centered directly under the click button */}
        <div className="w-full max-w-sm mt-5 bg-css-panel border border-css-border p-5">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={18} className="text-css-orange" />
            <h3 className="font-display text-sm uppercase tracking-wider text-white">Сила клика</h3>
            <span className="ml-auto font-mono-cs text-css-orange font-bold">ур. {state.click_level}</span>
          </div>
          <p className="text-xs text-gray-500 font-body mb-4">
            +1 монета за каждый клик. Сейчас: {coinsPerClick(state.click_level)} за клик.
          </p>
          <button
            onClick={buyClickUpgrade}
            disabled={!profile || profile.balance < clickUpgradeCost(state.click_level)}
            className="w-full bg-css-orange hover:bg-css-orange-light disabled:opacity-40 text-black font-display font-bold uppercase tracking-wider py-2.5 transition-colors text-sm"
          >
            Улучшить за {formatPrice(clickUpgradeCost(state.click_level))}
          </button>
        </div>
      </div>

      <p className="text-center text-gray-600 font-body text-xs">
        Каждый клик сразу зачисляет монету на баланс. Улучшение увеличивает награду за следующий клик.
      </p>
    </div>
  );
}
