import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { useLiveDrops } from '@/lib/livedrops';
import type { UserItem, CaseItem, LiveDrop } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import ItemCard from '@/components/ItemCard';
import { TrendingUp, RefreshCw, AlertTriangle, Check, X, Dices, Zap, Flame, Target } from 'lucide-react';

interface UpgradePageProps {
  onNavigate: (page: string) => void;
}

type SpinMode = 'normal' | 'ludo';

interface Preset {
  label: string;
  multiplier: number;
}

const PRESETS: Preset[] = [
  { label: '2x', multiplier: 2 },
  { label: '3x', multiplier: 3 },
  { label: '5x', multiplier: 5 },
  { label: '75%', multiplier: 1 / 0.75 * 0.85 },
  { label: '50%', multiplier: 1 / 0.5 * 0.85 },
  { label: '25%', multiplier: 1 / 0.25 * 0.85 },
];

const MAX_INPUTS = 6;
const SPIN_DURATION = 7000;
const LUDO_MIN_MS = 5000;
const LUDO_MAX_MS = 9000;

export default function UpgradePage({ onNavigate }: UpgradePageProps) {
  const { session, profile, refreshProfile } = useAuth();
  const { addDrop } = useLiveDrops();
  const [inventory, setInventory] = useState<UserItem[]>([]);
  const [allItems, setAllItems] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInputs, setSelectedInputs] = useState<UserItem[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<CaseItem | null>(null);
  const [activePreset, setActivePreset] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [arrowRotation, setArrowRotation] = useState(0);
  const [spinMode, setSpinMode] = useState<SpinMode>('normal');
  const [result, setResult] = useState<'win' | 'lose' | null>(null);
  const [resultTarget, setResultTarget] = useState<CaseItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [streak, setStreak] = useState<{ type: 'win' | 'lose'; count: number } | null>(null);
  const [history, setHistory] = useState<boolean[]>([]);
  const arrowRef = useRef<HTMLDivElement>(null);
  const spinStartRef = useRef(0);
  const spinRafRef = useRef<number | null>(null);

  useEffect(() => {
    if (session) {
      supabase
        .from('user_items')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('status', 'inventory')
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data) setInventory(data as UserItem[]);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

    supabase
      .from('case_items')
      .select('*')
      .order('price', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setAllItems(data as CaseItem[]);
      });
  }, [session]);

  const inputTotal = selectedInputs.reduce((sum, i) => sum + i.price, 0);

  const chance = inputTotal > 0 && selectedTarget
    ? Math.min(0.95, Math.max(0.01, (inputTotal / selectedTarget.price) * 0.85))
    : 0;

  const winArcDeg = chance * 360;
  const winZoneStart = 180 - winArcDeg / 2;
  const winZoneEnd = 180 + winArcDeg / 2;
  const conicFrom = winZoneStart;

  const availableTargets = (() => {
    if (inputTotal <= 0) return allItems.filter((i) => i.price > 0.5);
    if (activePreset !== null) {
      const preset = PRESETS[activePreset];
      const desiredPrice = inputTotal * preset.multiplier;
      const minPrice = inputTotal * preset.multiplier * 0.75;
      const maxPrice = inputTotal * preset.multiplier * 1.25;
      return allItems
        .filter((i) => i.price >= minPrice && i.price <= maxPrice)
        .sort((a, b) => Math.abs(a.price - desiredPrice) - Math.abs(b.price - desiredPrice));
    }
    return allItems.filter((i) => i.price > inputTotal && i.price <= inputTotal * 20);
  })();

  function selectPreset(index: number) {
    if (spinning) return;
    setActivePreset(activePreset === index ? null : index);
    setSelectedTarget(null);
    setResult(null);
  }

  function toggleInput(item: UserItem) {
    if (spinning) return;
    setSelectedInputs((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) return prev.filter((i) => i.id !== item.id);
      if (prev.length >= MAX_INPUTS) return prev;
      return [...prev, item];
    });
    setSelectedTarget(null);
    setResult(null);
    setActivePreset(null);
  }

  function removeInput(item: UserItem) {
    setSelectedInputs((prev) => prev.filter((i) => i.id !== item.id));
  }

  function animateLudo(totalRotation: number, duration: number) {
    const peak = 0.35 + Math.random() * 0.4;
    const easeIn = 2 + Math.random() * 1.5;
    const easeOut = 2.2 + Math.random() * 2.3;
    spinStartRef.current = performance.now();

    const frame = (now: number) => {
      const t = Math.min(now - spinStartRef.current, duration);
      const p = t / duration;
      let eased: number;
      if (p < peak) {
        eased = Math.pow(p / peak, easeIn) * peak;
      } else {
        const q = (p - peak) / (1 - peak);
        eased = peak + (1 - peak) * (1 - Math.pow(1 - q, easeOut));
      }
      setArrowRotation(totalRotation * Math.min(1, eased));
      if (t < duration) {
        spinRafRef.current = requestAnimationFrame(frame);
      } else {
        spinRafRef.current = null;
      }
    };
    spinRafRef.current = requestAnimationFrame(frame);
  }

  function cancelLudo() {
    if (spinRafRef.current !== null) {
      cancelAnimationFrame(spinRafRef.current);
      spinRafRef.current = null;
    }
  }

  useEffect(() => () => cancelLudo(), []);

  function updateStreak(isWin: boolean) {
    setHistory((prev) => [...prev.slice(-9), isWin]);
    setStreak((prev) => {
      if (!prev || prev.type !== (isWin ? 'win' : 'lose')) {
        return { type: isWin ? 'win' : 'lose', count: 1 };
      }
      return { type: prev.type, count: prev.count + 1 };
    });
  }

  async function handleUpgrade() {
    if (!session || !profile || selectedInputs.length === 0 || !selectedTarget || spinning) return;
    setError(null);

    if (chance <= 0) {
      setError('Выбери предметы и цель');
      return;
    }

    setSpinning(true);
    setResult(null);
    setResultTarget(selectedTarget);

    const isWin = Math.random() < chance;

    let finalAngle: number;
    if (isWin) {
      finalAngle = winZoneStart + Math.random() * winArcDeg;
    } else {
      const loseArc = 360 - winArcDeg;
      finalAngle = winZoneEnd + Math.random() * loseArc;
    }

    const totalRotation = 360 * 5 + finalAngle;

    setArrowRotation(0);
    if (spinMode === 'ludo') {
      const duration = LUDO_MIN_MS + Math.random() * (LUDO_MAX_MS - LUDO_MIN_MS);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          animateLudo(totalRotation, duration);
        });
      });
      setTimeout(async () => {
        setSpinning(false);
        setResult(isWin ? 'win' : 'lose');
        updateStreak(isWin);
        await finishUpgrade(isWin, selectedInputs, selectedTarget, chance);
      }, duration + 200);
    } else {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setArrowRotation(totalRotation);
        });
      });
      setTimeout(async () => {
        setSpinning(false);
        setResult(isWin ? 'win' : 'lose');
        updateStreak(isWin);
        await finishUpgrade(isWin, selectedInputs, selectedTarget, chance);
      }, SPIN_DURATION);
    }
  }

  async function finishUpgrade(
    isWin: boolean,
    inputItems: UserItem[],
    targetItem: CaseItem,
    chance: number,
  ) {
    if (!session || !profile) return;

    for (const item of inputItems) {
      await supabase.from('user_items').delete().eq('id', item.id);
    }

    if (isWin) {
      const newItem: Omit<UserItem, 'id' | 'created_at'> = {
        user_id: profile.id,
        name: targetItem.name,
        weapon: targetItem.weapon,
        rarity: targetItem.rarity,
        wear: targetItem.wear,
        price: targetItem.price,
        image_url: targetItem.image_url,
        source: 'upgrade',
        status: 'inventory',
      };
      await supabase.from('user_items').insert(newItem);

      const liveDrop: Omit<LiveDrop, 'id' | 'created_at'> = {
        user_id: profile.id,
        username: profile.username,
        avatar_url: profile.avatar_url,
        case_name: 'Апгрейд',
        case_id: null,
        item_name: targetItem.name,
        item_image: targetItem.image_url,
        item_rarity: targetItem.rarity,
        item_price: targetItem.price,
        source: 'upgrade',
      };
      const { data: dropData } = await supabase.from('live_drops').insert(liveDrop).select().maybeSingle();
      if (dropData) addDrop(dropData as LiveDrop);
    }

    const inputName = inputItems.map((i) => i.name).join(', ');
    const inputPrice = inputItems.reduce((s, i) => s + i.price, 0);
    const inputImage = inputItems[0]?.image_url || '';

    await supabase.from('upgrades').insert({
      user_id: profile.id,
      input_item_name: inputName,
      input_item_price: inputPrice,
      input_item_image: inputImage,
      target_item_name: targetItem.name,
      target_item_price: targetItem.price,
      target_item_image: targetItem.image_url,
      chance,
      success: isWin,
    });

    const { data: invData } = await supabase
      .from('user_items')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('status', 'inventory')
      .order('created_at', { ascending: false });
    if (invData) setInventory(invData as UserItem[]);

    setSelectedInputs([]);
    setSelectedTarget(null);
    setActivePreset(null);
    await refreshProfile();
  }

  function reset() {
    cancelLudo();
    setSelectedInputs([]);
    setSelectedTarget(null);
    setActivePreset(null);
    setResult(null);
    setResultTarget(null);
    setError(null);
    setArrowRotation(0);
  }

  if (!session) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <TrendingUp size={48} className="text-gray-700 mx-auto mb-4" />
        <h1 className="font-display text-2xl uppercase tracking-wider text-white mb-2">Апгрейд</h1>
        <p className="text-gray-500 font-body mb-6">Войдите, чтобы использовать апгрейд</p>
        <button onClick={() => onNavigate('home')} className="text-css-orange hover:underline font-body">← На главную</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-wider text-white mb-2">Апгрейд</h1>
          <p className="text-gray-500 font-body">Выбери до 6 предметов и цель. Больше предметов — выше шанс</p>
        </div>

        {/* Streak + history */}
        <div className="flex items-center gap-4">
          {streak && (
            <div
              className={`flex items-center gap-2 px-4 py-2 border ${
                streak.type === 'win'
                  ? 'border-css-green text-css-green bg-css-green/10'
                  : 'border-css-red text-css-red bg-css-red/10'
              }`}
            >
              {streak.type === 'win' ? <Flame size={18} /> : <AlertTriangle size={18} />}
              <span className="font-display text-sm uppercase tracking-wider">
                {streak.type === 'win' ? 'Серия побед' : 'Серия поражений'}: {streak.count}
              </span>
            </div>
          )}
          {history.length > 0 && (
            <div className="flex gap-1">
              {history.map((h, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-sm ${h ? 'bg-css-green' : 'bg-css-red'}`}
                  title={h ? 'Победа' : 'Поражение'}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-css-red/20 border border-css-red text-css-red px-4 py-2 text-center font-body text-sm mb-6 animate-shake">
          {error}
        </div>
      )}

      {/* Upgrade interface */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 mb-8">
        {/* Input selection */}
        <div className="bg-css-panel border border-css-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-sm uppercase tracking-wider text-gray-400">Твои предметы</h3>
            <span className="font-mono-cs text-sm text-css-orange">
              {selectedInputs.length}/{MAX_INPUTS}
            </span>
          </div>

          {/* Selected items row — fixed height, no overlap */}
          {selectedInputs.length > 0 && (
            <div className="flex gap-2 mb-3 flex-wrap">
              {selectedInputs.map((item) => (
                <div key={item.id} className="relative shrink-0">
                  <div className="w-[110px]">
                    <ItemCard
                      name={item.name}
                      weapon={item.weapon}
                      rarity={item.rarity}
                      wear={item.wear}
                      price={item.price}
                      imageUrl={item.image_url}
                      size="sm"
                    />
                  </div>
                  <button
                    onClick={() => removeInput(item)}
                    disabled={spinning}
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-css-red text-white flex items-center justify-center hover:bg-red-600 z-10 disabled:opacity-40"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {inputTotal > 0 && (
            <div className="mb-3 text-center font-mono-cs text-sm text-gray-400">
              Сумма: <span className="text-css-tan font-bold">{formatPrice(inputTotal)}</span>
            </div>
          )}

          {/* Inventory grid */}
          {loading ? (
            <p className="text-gray-600 text-sm font-body py-8 text-center">Загрузка инвентаря...</p>
          ) : inventory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-sm font-body mb-3">Инвентарь пуст</p>
              <button onClick={() => onNavigate('cases')} className="text-css-orange hover:underline text-sm font-body">
                Открыть кейсы →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto css-scroll">
              {inventory.map((item) => {
                const isSelected = !!selectedInputs.find((i) => i.id === item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleInput(item)}
                    className={`cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-css-orange opacity-60' : 'hover:opacity-80'
                    }`}
                  >
                    <ItemCard
                      name={item.name}
                      weapon={item.weapon}
                      rarity={item.rarity}
                      wear={item.wear}
                      price={item.price}
                      imageUrl={item.image_url}
                      size="sm"
                      selected={isSelected}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Wheel + presets */}
        <div className="flex flex-col items-center justify-center">
          {/* Spin mode selector */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => !spinning && setSpinMode('normal')}
              disabled={spinning}
              className={`flex items-center gap-2 px-4 py-2 font-display text-xs uppercase tracking-wider border transition-colors disabled:opacity-40 ${
                spinMode === 'normal'
                  ? 'border-css-orange text-css-orange bg-css-orange/10'
                  : 'border-css-border text-gray-400 hover:text-white hover:border-gray-600'
              }`}
            >
              <Zap size={14} /> Обычная
            </button>
            <button
              onClick={() => !spinning && setSpinMode('ludo')}
              disabled={spinning}
              className={`flex items-center gap-2 px-4 py-2 font-display text-xs uppercase tracking-wider border transition-colors disabled:opacity-40 ${
                spinMode === 'ludo'
                  ? 'border-css-orange text-css-orange bg-css-orange/10'
                  : 'border-css-border text-gray-400 hover:text-white hover:border-gray-600'
              }`}
            >
              <Dices size={14} /> Лудо
            </button>
          </div>

          {/* Wheel */}
          <div className="relative w-[220px] h-[220px]">
            <div className="absolute inset-0 rounded-full border-4 border-css-border" />

            <div className="absolute inset-2 rounded-full overflow-hidden">
              {chance > 0 ? (
                <div
                  className="absolute inset-0"
                  style={{
                    background: `conic-gradient(from ${conicFrom}deg, #4b9c5a 0deg ${winArcDeg}deg, #3a1a1a ${winArcDeg}deg 360deg)`,
                  }}
                />
              ) : (
                <div className="absolute inset-0 bg-css-panel" />
              )}

              {chance > 0 && (
                <div className="absolute left-1/2 bottom-2 -translate-x-1/2">
                  <span className="text-[9px] font-display uppercase tracking-widest text-white/80 bg-black/40 px-1.5 py-0.5">
                    Выигрыш
                  </span>
                </div>
              )}

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-css-dark border-2 border-css-border flex items-center justify-center z-10">
                  <span className="font-mono-cs text-lg font-bold text-css-orange">
                    {(chance * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            <div
              ref={arrowRef}
              className="absolute inset-0"
              style={{
                transform: `rotate(${arrowRotation}deg)`,
                transition: spinning && spinMode === 'normal'
                  ? `transform ${SPIN_DURATION}ms cubic-bezier(0.12, 0.8, 0.18, 1)`
                  : 'none',
              }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                <div className="relative flex flex-col items-center" style={{ marginTop: '-6px' }}>
                  <div
                    className="w-1 bg-css-orange"
                    style={{ height: '18px', boxShadow: '0 0 8px rgba(232,123,30,0.8)' }}
                  />
                  <div
                    className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px]"
                    style={{ borderTopColor: '#e87b1e', filter: 'drop-shadow(0 0 4px rgba(232,123,30,0.9))' }}
                  />
                </div>
              </div>

              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-3 h-3 rounded-full bg-css-orange" style={{ boxShadow: '0 0 10px rgba(232,123,30,1)' }} />
              </div>
            </div>
          </div>

          {/* Chance display */}
          <div className="mt-4 text-center">
            <p className="font-display text-3xl font-bold text-css-orange">{(chance * 100).toFixed(1)}%</p>
            <p className="text-[10px] uppercase tracking-widest text-gray-600 font-body">шанс успеха</p>
          </div>

          {/* Preset buttons */}
          <div className="mt-3 flex flex-wrap gap-1.5 justify-center max-w-[240px]">
            {PRESETS.map((preset, i) => (
              <button
                key={preset.label}
                onClick={() => selectPreset(i)}
                disabled={spinning || inputTotal <= 0}
                className={`px-3 py-1.5 font-mono-cs text-xs font-bold border transition-colors disabled:opacity-30 ${
                  activePreset === i
                    ? 'bg-css-orange text-black border-css-orange'
                    : 'bg-css-dark text-gray-400 border-css-border hover:border-css-orange'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Target selection */}
        <div className="bg-css-panel border border-css-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target size={14} className="text-gray-400" />
            <h3 className="font-display text-sm uppercase tracking-wider text-gray-400">
              Целевой предмет
              {activePreset !== null && inputTotal > 0 && (
                <span className="text-css-orange ml-2">~{PRESETS[activePreset].label}</span>
              )}
            </h3>
          </div>

          {selectedTarget ? (
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-[160px]">
                <ItemCard
                  name={selectedTarget.name}
                  weapon={selectedTarget.weapon}
                  rarity={selectedTarget.rarity}
                  wear={selectedTarget.wear}
                  price={selectedTarget.price}
                  imageUrl={selectedTarget.image_url}
                  size="md"
                />
              </div>
              <button
                onClick={() => setSelectedTarget(null)}
                disabled={spinning}
                className="shrink-0 w-8 h-8 rounded-full bg-css-panel border border-css-border text-gray-400 hover:text-css-red hover:border-css-red flex items-center justify-center mt-1 disabled:opacity-40"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div>
              {inputTotal <= 0 ? (
                <p className="text-gray-600 text-sm font-body py-8 text-center">Сначала выбери предметы</p>
              ) : availableTargets.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-sm font-body mb-2">Нет целей для этого фильтра</p>
                  <button
                    onClick={() => setActivePreset(null)}
                    className="text-css-orange hover:underline text-xs font-body"
                  >
                    Сбросить фильтр
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto css-scroll">
                  {availableTargets.map((item) => (
                    <ItemCard
                      key={item.id}
                      name={item.name}
                      weapon={item.weapon}
                      rarity={item.rarity}
                      wear={item.wear}
                      price={item.price}
                      imageUrl={item.image_url}
                      size="sm"
                      onClick={() => { setSelectedTarget(item); setResult(null); }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action button */}
      <div className="flex justify-center gap-3 mb-8">
        <button
          onClick={handleUpgrade}
          disabled={spinning || selectedInputs.length === 0 || !selectedTarget}
          className="flex items-center gap-2 bg-css-orange hover:bg-css-orange-light disabled:opacity-30 text-black font-display font-bold uppercase tracking-wider px-8 py-3 transition-colors text-lg"
        >
          {spinning ? 'Крутится...' : <><TrendingUp size={20} /> Апгрейднуть</>}
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 bg-css-panel border border-css-border hover:border-css-orange text-white font-display uppercase tracking-wider px-6 py-3 transition-colors"
        >
          <RefreshCw size={18} /> Сброс
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in" onClick={reset}>
          <div className="text-center animate-scale-in" onClick={(e) => e.stopPropagation()}>
            {result === 'win' ? (
              <>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Check size={32} className="text-css-green" />
                  <p className="font-display text-4xl uppercase tracking-widest text-css-green">Успех!</p>
                  {streak && streak.type === 'win' && streak.count > 1 && (
                    <span className="flex items-center gap-1 text-css-orange font-display text-lg">
                      <Flame size={20} /> x{streak.count}
                    </span>
                  )}
                </div>
                <p className="text-gray-400 font-body mb-4">Ты получил:</p>
                {resultTarget && (
                  <div className={`glow-${resultTarget.rarity} inline-block`}>
                    <ItemCard
                      name={resultTarget.name}
                      weapon={resultTarget.weapon}
                      rarity={resultTarget.rarity}
                      wear={resultTarget.wear}
                      price={resultTarget.price}
                      imageUrl={resultTarget.image_url}
                      size="lg"
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <AlertTriangle size={32} className="text-css-red" />
                  <p className="font-display text-4xl uppercase tracking-widest text-css-red">Не повезло</p>
                  {streak && streak.type === 'lose' && streak.count > 1 && (
                    <span className="text-gray-500 font-display text-lg">x{streak.count}</span>
                  )}
                </div>
                <p className="text-gray-400 font-body mb-4">Предметы потеряны. Попробуй ещё раз!</p>
              </>
            )}
            <div className="mt-6">
              <button onClick={reset} className="px-6 py-2.5 bg-css-panel border border-css-border hover:border-css-orange text-white font-display uppercase tracking-wider text-sm transition-colors">
                Продолжить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
