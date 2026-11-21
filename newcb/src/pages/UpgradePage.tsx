import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { useLiveDrops } from '@/lib/livedrops';
import type { UserItem, CaseItem, LiveDrop } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import ItemCard from '@/components/ItemCard';
import { TrendingUp, RefreshCw, AlertTriangle, Check, X, Dices, Zap } from 'lucide-react';

interface UpgradePageProps {
  onNavigate: (page: string) => void;
}

type SpinMode = 'normal' | 'ludo';

interface Preset {
  label: string;
  multiplier: number; // target_price / input_price
}

const PRESETS: Preset[] = [
  { label: '2x', multiplier: 2 },
  { label: '3x', multiplier: 3 },
  { label: '5x', multiplier: 5 },
  { label: '75%', multiplier: 1 / 0.75 * 0.85 },
  { label: '50%', multiplier: 1 / 0.5 * 0.85 },
  { label: '25%', multiplier: 1 / 0.25 * 0.85 },
];

const SPIN_DURATION = 7000;
// Ludo spin duration: random between 5 and 9 seconds
const LUDO_MIN_MS = 5000;
const LUDO_MAX_MS = 9000;

export default function UpgradePage({ onNavigate }: UpgradePageProps) {
  const { session, profile, refreshProfile } = useAuth();
  const { addDrop } = useLiveDrops();
  const [inventory, setInventory] = useState<UserItem[]>([]);
  const [allItems, setAllItems] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInput, setSelectedInput] = useState<UserItem | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<CaseItem | null>(null);
  const [activePreset, setActivePreset] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [arrowRotation, setArrowRotation] = useState(0);
  const [spinMode, setSpinMode] = useState<SpinMode>('normal');
  const [result, setResult] = useState<'win' | 'lose' | null>(null);
  const [resultTarget, setResultTarget] = useState<CaseItem | null>(null);
  const [error, setError] = useState<string | null>(null);
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
        if (data) setAllItems(data as CaseItem[]);
      });
  }, [session]);

  const chance = selectedInput && selectedTarget
    ? Math.min(0.95, Math.max(0.01, (selectedInput.price / selectedTarget.price) * 0.85))
    : 0;

  // Win zone centered at bottom (180°), spanning chance * 360°
  const winArcDeg = chance * 360;
  const winZoneStart = 180 - winArcDeg / 2;
  const winZoneEnd = 180 + winArcDeg / 2;
  const conicFrom = winZoneStart;

  // Filter targets based on preset or price
  const availableTargets = (() => {
    if (!selectedInput) return allItems.filter((i) => i.price > 0.5);
    if (activePreset !== null) {
      const preset = PRESETS[activePreset];
      const desiredPrice = selectedInput.price * preset.multiplier;
      // Show items within ±25% of desired multiplier
      const minPrice = selectedInput.price * preset.multiplier * 0.75;
      const maxPrice = selectedInput.price * preset.multiplier * 1.25;
      const filtered = allItems.filter((i) => i.price >= minPrice && i.price <= maxPrice);
      // Sort by closeness to desired price
      return filtered.sort((a, b) => Math.abs(a.price - desiredPrice) - Math.abs(b.price - desiredPrice));
    }
    return allItems.filter((i) => i.price > selectedInput.price && i.price <= selectedInput.price * 20);
  })();

  function selectPreset(index: number) {
    if (spinning) return;
    setActivePreset(activePreset === index ? null : index);
    setSelectedTarget(null);
    setResult(null);
  }

  function selectInput(item: UserItem) {
    setSelectedInput(item);
    setSelectedTarget(null);
    setResult(null);
    setActivePreset(null);
  }

  // Ludo spin: starts slow, smoothly accelerates, then decelerates to a stop.
  // Duration is random (5-9s), easing curve is randomized per spin, no speed jumps.
  function animateLudo(totalRotation: number, duration: number) {
    // Random shape of the speed curve: where peak speed happens (mid-to-late spin)
    // and how hard the final slowdown is.
    const peak = 0.35 + Math.random() * 0.4; // peak position in [0.35, 0.75]
    const easeIn = 2 + Math.random() * 1.5; // slow, gradual start
    const easeOut = 2.2 + Math.random() * 2.3; // soft, smooth braking (stronger or lighter)
    spinStartRef.current = performance.now();

    const frame = (now: number) => {
      const t = Math.min(now - spinStartRef.current, duration);
      const p = t / duration;
      let eased: number;
      if (p < peak) {
        // accelerate: progress^(easeIn) scaled over the accelerate phase
        eased = Math.pow(p / peak, easeIn) * peak;
      } else {
        // decelerate smoothly to exactly 1
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

  async function handleUpgrade() {
    if (!session || !profile || !selectedInput || !selectedTarget || spinning) return;
    setError(null);

    if (chance <= 0) {
      setError('Выберите предмет для апгрейда и цель');
      return;
    }

    setSpinning(true);
    setResult(null);
    setResultTarget(selectedTarget);

    // Determine win/lose
    const isWin = Math.random() < chance;

    // Calculate final arrow angle (where it lands)
    let finalAngle: number;
    if (isWin) {
      // Land within win zone (centered at 180°)
      finalAngle = winZoneStart + Math.random() * winArcDeg;
    } else {
      // Land in lose zone (everything outside win zone)
      // Lose zone goes from winZoneEnd to winZoneStart + 360
      const loseArc = 360 - winArcDeg;
      finalAngle = winZoneEnd + Math.random() * loseArc;
    }

    // Add several full rotations for effect
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
        await finishUpgrade(isWin, selectedInput, selectedTarget, chance);
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
        await finishUpgrade(isWin, selectedInput, selectedTarget, chance);
      }, SPIN_DURATION);
    }
  }

  async function finishUpgrade(
    isWin: boolean,
    inputItem: UserItem,
    targetItem: CaseItem,
    chance: number,
  ) {
    if (!session || !profile) return;
    // Remove input item from inventory
    await supabase.from('user_items').delete().eq('id', inputItem.id);

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

    await supabase.from('upgrades').insert({
      user_id: profile.id,
      input_item_name: inputItem.name,
      input_item_price: inputItem.price,
      input_item_image: inputItem.image_url,
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

    setSelectedInput(null);
    setSelectedTarget(null);
    setActivePreset(null);
    await refreshProfile();
  }

  function reset() {
    cancelLudo();
    setSelectedInput(null);
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
      <div className="mb-8">
        <h1 className="font-display text-4xl uppercase tracking-wider text-white mb-2">Апгрейд</h1>
        <p className="text-gray-500 font-body">Выбери скин из инвентаря и цель. Чем дороже цель, тем меньше шанс.</p>
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
          <h3 className="font-display text-sm uppercase tracking-wider text-gray-400 mb-3">Твой предмет</h3>
          {selectedInput ? (
            <div className="flex items-center gap-3">
              <ItemCard
                name={selectedInput.name}
                weapon={selectedInput.weapon}
                rarity={selectedInput.rarity}
                wear={selectedInput.wear}
                price={selectedInput.price}
                imageUrl={selectedInput.image_url}
                size="md"
              />
              <button onClick={() => { setSelectedInput(null); setSelectedTarget(null); setActivePreset(null); }} className="text-gray-500 hover:text-css-red">
                <X size={20} />
              </button>
            </div>
          ) : (
            <div>
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
                  {inventory.map((item) => (
                    <ItemCard
                      key={item.id}
                      name={item.name}
                      weapon={item.weapon}
                      rarity={item.rarity}
                      wear={item.wear}
                      price={item.price}
                      imageUrl={item.image_url}
                      size="sm"
                      onClick={() => selectInput(item)}
                    />
                  ))}
                </div>
              )}
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
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-css-border" />

            {/* Static wheel with win/lose zones */}
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

              {/* Bottom marker label */}
              {chance > 0 && (
                <div className="absolute left-1/2 bottom-2 -translate-x-1/2">
                  <span className="text-[9px] font-display uppercase tracking-widest text-white/80 bg-black/40 px-1.5 py-0.5">
                    Выигрыш
                  </span>
                </div>
              )}

              {/* Center hub */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-css-dark border-2 border-css-border flex items-center justify-center z-10">
                  <span className="font-mono-cs text-lg font-bold text-css-orange">
                    {(chance * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Rotating arrow — points inward (tip toward center) */}
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
              {/* Arrow positioned at top, tip pointing down (inward) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                {/* The arrow: a triangle pointing down (inward) + a line stem */}
                <div className="relative flex flex-col items-center" style={{ marginTop: '-6px' }}>
                  {/* Stem line from rim inward */}
                  <div
                    className="w-1 bg-css-orange"
                    style={{ height: '18px', boxShadow: '0 0 8px rgba(232,123,30,0.8)' }}
                  />
                  {/* Arrowhead pointing inward (down) */}
                  <div
                    className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px]"
                    style={{ borderTopColor: '#e87b1e', filter: 'drop-shadow(0 0 4px rgba(232,123,30,0.9))' }}
                  />
                </div>
              </div>

              {/* Small circle on the orbit at the arrow base */}
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
                disabled={spinning || !selectedInput}
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
          <h3 className="font-display text-sm uppercase tracking-wider text-gray-400 mb-3">
            Целевой предмет
            {activePreset !== null && selectedInput && (
              <span className="text-css-orange ml-2">~{PRESETS[activePreset].label}</span>
            )}
          </h3>
          {selectedTarget ? (
            <div className="flex items-center gap-3">
              <ItemCard
                name={selectedTarget.name}
                weapon={selectedTarget.weapon}
                rarity={selectedTarget.rarity}
                wear={selectedTarget.wear}
                price={selectedTarget.price}
                imageUrl={selectedTarget.image_url}
                size="md"
              />
              <button onClick={() => setSelectedTarget(null)} className="text-gray-500 hover:text-css-red">
                <X size={20} />
              </button>
            </div>
          ) : (
            <div>
              {!selectedInput ? (
                <p className="text-gray-600 text-sm font-body py-8 text-center">Сначала выбери свой предмет</p>
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
          disabled={spinning || !selectedInput || !selectedTarget}
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
                </div>
                <p className="text-gray-400 font-body mb-4">Предмет потерян. Попробуй ещё раз!</p>
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
