import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { useLiveDrops } from '@/lib/livedrops';
import type { Case, CaseItem, UserItem, LiveDrop } from '@/lib/types';
import { rollItem, generateReel, formatPrice } from '@/lib/utils';
import ItemCard from '@/components/ItemCard';
import { ArrowLeft, Zap, X, Dices, Minus, Plus } from 'lucide-react';

interface CaseOpenPageProps {
  caseData: Case;
  items: CaseItem[];
  onBack: () => void;
  onNavigate: (page: string) => void;
}

type ReelItem = CaseItem;
type SpinMode = 'normal' | 'ludo';

const MAX_MULTI = 10;

export default function CaseOpenPage({ caseData, items, onBack, onNavigate }: CaseOpenPageProps) {
  const { session, profile, refreshProfile } = useAuth();
  const { addDrop } = useLiveDrops();
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState<ReelItem[][]>([]);
  const [reelOffsets, setReelOffsets] = useState<number[]>([]);
  const [results, setResults] = useState<CaseItem[] | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fastMode, setFastMode] = useState(false);
  const [spinMode, setSpinMode] = useState<SpinMode>('normal');
  const [multiCount, setMultiCount] = useState(1);
  const reelRef = useRef<HTMLDivElement>(null);
  const animFramesRef = useRef<number[]>([]);
  const itemWidth = 140;

  const sortedItems = [...items].sort((a, b) => a.sort_order - b.sort_order);
  const totalCost = caseData.price * multiCount;
  const maxAffordable = Math.max(1, Math.min(MAX_MULTI, Math.floor((profile?.balance || 0) / caseData.price)));

  const cancelAnims = useCallback(() => {
    animFramesRef.current.forEach((f) => cancelAnimationFrame(f));
    animFramesRef.current = [];
  }, []);

  useEffect(() => () => cancelAnims(), [cancelAnims]);

  // Ludo spin: starts slow, smoothly accelerates to a random peak, then smoothly
  // brakes. Curve shape is randomized per spin; duration is 5-9 seconds.
  function animateLudoSingle(
    targetOffset: number,
    duration: number,
    onFrame: (offset: number) => void,
  ) {
    const peak = 0.35 + Math.random() * 0.4;
    const easeIn = 2 + Math.random() * 1.5;
    const easeOut = 2.2 + Math.random() * 2.3;
    const startTime = performance.now();

    const frame = (now: number) => {
      const t = Math.min(now - startTime, duration);
      const p = t / duration;
      let eased: number;
      if (p < peak) {
        eased = Math.pow(p / peak, easeIn) * peak;
      } else {
        const q = (p - peak) / (1 - peak);
        eased = peak + (1 - peak) * (1 - Math.pow(1 - q, easeOut));
      }
      onFrame(targetOffset * Math.min(1, eased));
      if (t < duration) {
        animFramesRef.current.push(requestAnimationFrame(frame));
      }
    };
    animFramesRef.current.push(requestAnimationFrame(frame));
  }

  async function handleOpen() {
    if (spinning) return;
    setError(null);
    cancelAnims();

    if (!session || !profile) {
      setError('Войдите, чтобы открыть кейс');
      return;
    }

    if (profile.balance < totalCost) {
      setError('Недостаточно средств на балансе');
      return;
    }

    const newBalance = profile.balance - totalCost;
    const { error: balanceError } = await supabase
      .from('profiles')
      .update({ balance: newBalance, cases_opened: profile.cases_opened + multiCount })
      .eq('id', profile.id);

    if (balanceError) {
      setError('Ошибка списания средств');
      return;
    }

    const { error: txError } = await supabase.from('transactions').insert({
      user_id: profile.id,
      type: 'case_open',
      amount: -totalCost,
      method: 'balance',
      description: `Открытие кейса "${caseData.name}" x${multiCount}`,
    });
    if (txError) {
      // non-fatal
    }

    // Roll a winner for each case and build a reel for each
    const winners: CaseItem[] = [];
    const newReels: ReelItem[][] = [];
    const reelLength = 60;
    for (let i = 0; i < multiCount; i++) {
      const winner = rollItem(items);
      winners.push(winner);
      newReels.push(generateReel(items, winner, reelLength));
    }

    setReels(newReels);
    setResults(winners);
    setShowResult(false);
    setSpinning(true);
    setReelOffsets(new Array(multiCount).fill(0));

    const containerWidth = reelRef.current?.offsetWidth || 800;
    const centerOffset = containerWidth / 2 - itemWidth / 2;
    const winnerIndex = reelLength - 5;

    let maxDuration = 0;
    if (spinMode === 'ludo') {
      for (let i = 0; i < multiCount; i++) {
        const targetOffset = -(winnerIndex * itemWidth) + centerOffset;
        // Each reel gets its own random duration and curve (5-9s), all finish smoothly
        const duration = 5000 + Math.random() * 4000;
        maxDuration = Math.max(maxDuration, duration);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            animateLudoSingle(targetOffset, duration, (offset) => {
              setReelOffsets((prev) => {
                const next = [...prev];
                next[i] = offset;
                return next;
              });
            });
          });
        });
      }
    } else {
      maxDuration = fastMode ? 2500 : 6000;
      const duration = maxDuration;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          for (let i = 0; i < multiCount; i++) {
            const targetOffset = -(winnerIndex * itemWidth) + centerOffset;
            setReelOffsets((prev) => {
              const next = [...prev];
              next[i] = targetOffset;
              return next;
            });
          }
        });
      });
    }

    setTimeout(async () => {
      setSpinning(false);
      setShowResult(true);
      cancelAnims();

      // Save all items + live drops
      for (const winner of winners) {
        const userItem: Omit<UserItem, 'id' | 'created_at'> = {
          user_id: profile.id,
          name: winner.name,
          weapon: winner.weapon,
          rarity: winner.rarity,
          wear: winner.wear,
          price: winner.price,
          image_url: winner.image_url,
          source: 'case',
          status: 'inventory',
        };
        await supabase.from('user_items').insert(userItem);

        const liveDrop: Omit<LiveDrop, 'id' | 'created_at'> = {
          user_id: profile.id,
          username: profile.username,
          avatar_url: profile.avatar_url,
          case_name: caseData.name,
          case_id: caseData.id,
          item_name: winner.name,
          item_image: winner.image_url,
          item_rarity: winner.rarity,
          item_price: winner.price,
          source: 'case',
        };
        const { data: dropData } = await supabase.from('live_drops').insert(liveDrop).select().maybeSingle();
        if (dropData) {
          addDrop(dropData as LiveDrop);
        }
      }

      await refreshProfile();
    }, maxDuration + 200);
  }

  function closeResult() {
    setShowResult(false);
    setResults(null);
    setReels([]);
    setReelOffsets([]);
  }

  function changeCount(delta: number) {
    const next = Math.min(multiCount + delta, maxAffordable, MAX_MULTI);
    if (!spinning && next >= 1) setMultiCount(next);
  }

  return (
    <div className="min-h-[calc(100vh-200px)] py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-css-orange transition-colors mb-6 font-body text-sm"
        >
          <ArrowLeft size={16} /> Назад к кейсам
        </button>

        {/* Case header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white uppercase tracking-wider">
            {caseData.name}
          </h1>
          <p className="text-gray-500 font-body mt-1">
            {sortedItems.length} предметов · Шанс на лучший: {(sortedItems[sortedItems.length - 1]?.chance * 100).toFixed(2)}%
          </p>
        </div>

        {/* Spin mode selector */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => !spinning && setSpinMode('normal')}
            disabled={spinning}
            className={`flex items-center gap-2 px-5 py-2.5 font-display text-sm uppercase tracking-wider border transition-colors disabled:opacity-40 ${
              spinMode === 'normal'
                ? 'border-css-orange text-css-orange bg-css-orange/10'
                : 'border-css-border text-gray-400 hover:text-white hover:border-gray-600'
            }`}
          >
            <Zap size={16} /> Обычная
          </button>
          <button
            onClick={() => !spinning && setSpinMode('ludo')}
            disabled={spinning}
            className={`flex items-center gap-2 px-5 py-2.5 font-display text-sm uppercase tracking-wider border transition-colors disabled:opacity-40 ${
              spinMode === 'ludo'
                ? 'border-css-orange text-css-orange bg-css-orange/10'
                : 'border-css-border text-gray-400 hover:text-white hover:border-gray-600'
            }`}
          >
            <Dices size={16} /> Лудо
          </button>
        </div>

        {/* Reel(s) */}
        <div className="space-y-3 mb-6">
          {reels.length > 0 ? (
            reels.map((reel, reelIdx) => (
              <div key={reelIdx} className="relative bg-css-darker border-2 border-css-border overflow-hidden h-[110px]">
                {/* Center marker */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-css-orange z-20 pointer-events-none" />

                {/* Gradient edges */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-css-darker to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-css-darker to-transparent z-10 pointer-events-none" />

                <div className="h-full overflow-hidden">
                  <div
                    className="flex gap-2 h-full items-center px-2"
                    style={{
                      transform: `translateX(${reelOffsets[reelIdx] || 0}px)`,
                      transition: spinMode === 'normal' && spinning
                        ? `transform ${fastMode ? '2.5s' : '6s'} cubic-bezier(0.12, 0.8, 0.18, 1)`
                        : 'none',
                    }}
                  >
                    {reel.map((item, i) => (
                      <div key={i} className="flex-shrink-0" style={{ width: `${itemWidth - 8}px` }}>
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
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="relative bg-css-darker border-2 border-css-border overflow-hidden h-[200px]">
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-display font-bold text-css-orange/20 mb-2">{caseData.name.slice(0, 2).toUpperCase()}</div>
                  <p className="text-gray-600 font-body text-sm uppercase tracking-widest">Нажмите открыть</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-4 mb-8">
          {/* Multi-open selector */}
          <div className="flex items-center gap-3 bg-css-panel border border-css-border p-2">
            <button
              onClick={() => changeCount(-1)}
              disabled={spinning || multiCount <= 1}
              className="w-8 h-8 flex items-center justify-center bg-css-dark border border-css-border hover:border-css-orange disabled:opacity-30 text-white transition-colors"
            >
              <Minus size={14} />
            </button>
            <div className="text-center min-w-[100px]">
              <span className="font-display font-bold text-white text-lg">{multiCount}x</span>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest block font-body">
                {formatPrice(totalCost)}
              </span>
            </div>
            <button
              onClick={() => changeCount(1)}
              disabled={spinning || multiCount >= MAX_MULTI || multiCount >= maxAffordable}
              className="w-8 h-8 flex items-center justify-center bg-css-dark border border-css-border hover:border-css-orange disabled:opacity-30 text-white transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleOpen}
              disabled={spinning || multiCount > maxAffordable}
              className="flex items-center gap-2 bg-css-orange hover:bg-css-orange-light disabled:opacity-40 text-black font-display font-bold uppercase tracking-wider px-8 py-3 transition-colors text-lg"
            >
              {spinning ? 'Открытие...' : multiCount > 1 ? `Открыть x${multiCount} за ${formatPrice(totalCost)}` : `Открыть за ${formatPrice(caseData.price)}`}
            </button>

            {spinMode === 'normal' && (
              <button
                onClick={() => setFastMode(!fastMode)}
                disabled={spinning}
                className={`flex items-center gap-2 border px-4 py-3 font-display text-sm uppercase tracking-wider transition-colors disabled:opacity-40 ${
                  fastMode ? 'border-css-orange text-css-orange bg-css-orange/10' : 'border-css-border text-gray-400 hover:text-white'
                }`}
              >
                <Zap size={16} /> Быстро
              </button>
            )}
          </div>
        </div>

        {/* Ludo description */}
        {spinMode === 'ludo' && (
          <p className="text-center text-gray-600 font-body text-xs mb-6">
            Плавный разгон, случайная длительность 5-9 секунд и мягкое торможение в конце
          </p>
        )}

        {error && (
          <div className="max-w-md mx-auto bg-css-red/20 border border-css-red text-css-red px-4 py-2 text-center font-body text-sm mb-6 animate-shake">
            {error}
          </div>
        )}

        {/* Contents grid */}
        <div className="border-t border-css-border pt-6">
          <h2 className="font-display text-xl uppercase tracking-wider text-white mb-4">Содержимое кейса</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {sortedItems.map((item) => (
              <ItemCard
                key={item.id}
                name={item.name}
                weapon={item.weapon}
                rarity={item.rarity}
                wear={item.wear}
                price={item.price}
                imageUrl={item.image_url}
                chance={item.chance}
                size="md"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Result modal */}
      {showResult && results && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in p-4" onClick={closeResult}>
          <div className="relative animate-scale-in max-w-3xl w-full text-center" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeResult} className="absolute -top-10 right-0 text-gray-500 hover:text-white">
              <X size={24} />
            </button>
            <div className="mb-4">
              <p className="font-display text-2xl uppercase tracking-widest text-css-orange">
                {results.length > 1 ? `Ваши ${results.length} дропа!` : 'Поздравляем!'}
              </p>
              {results.length > 1 && (
                <p className="text-gray-400 font-body text-sm">
                  Итого: {formatPrice(results.reduce((s, i) => s + i.price, 0))}
                </p>
              )}
            </div>
            <div className={`grid gap-3 justify-center ${results.length === 1 ? 'grid-cols-1 max-w-[240px] mx-auto' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'}`}>
              {results.map((item, i) => (
                <div key={i} className={`glow-${item.rarity} inline-block`}>
                  <ItemCard
                    name={item.name}
                    weapon={item.weapon}
                    rarity={item.rarity}
                    wear={item.wear}
                    price={item.price}
                    imageUrl={item.image_url}
                    size={results.length === 1 ? 'lg' : 'md'}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6 justify-center">
              <button
                onClick={closeResult}
                className="px-6 py-2.5 bg-css-panel border border-css-border hover:border-css-orange text-white font-display uppercase tracking-wider text-sm transition-colors"
              >
                Забрать
              </button>
              <button
                onClick={() => { closeResult(); onNavigate('upgrade'); }}
                className="px-6 py-2.5 bg-css-orange hover:bg-css-orange-light text-black font-display uppercase tracking-wider text-sm transition-colors"
              >
                Апгрейд
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
