import { useLiveDrops } from '@/lib/livedrops';
import { formatPrice, timeAgo } from '@/lib/utils';
import type { Rarity } from '@/lib/types';

export default function LiveDropsTicker() {
  const { drops } = useLiveDrops();

  if (drops.length === 0) {
    return (
      <div className="w-full bg-css-darker border-y border-css-border py-2 overflow-hidden">
        <div className="text-center text-xs text-gray-600 font-body uppercase tracking-widest">Лента дропов загрузка...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-css-darker border-y border-css-border py-2 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-css-darker to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-css-darker to-transparent z-10 pointer-events-none" />

      <div className="flex gap-2 animate-[scroll_30s_linear_infinite] hover:[animation-play-state:paused] whitespace-nowrap px-4">
        {drops.map((drop) => (
          <div
            key={drop.id}
            className={`flex items-center gap-2 bg-css-panel border-l-2 border-${drop.item_rarity} px-3 py-1.5 min-w-[220px] flex-shrink-0`}
          >
            <div className={`w-8 h-8 flex items-center justify-center bg-rarity-${drop.item_rarity} bg-opacity-20`}>
              <span className={`text-rarity-${drop.item_rarity} text-[10px] font-display font-bold`}>
                {drop.item_name.split('|')[0]?.trim().slice(0, 3).toUpperCase() || 'SKN'}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-gray-500 truncate">{drop.username}</span>
              <span className="text-[11px] text-white font-body truncate max-w-[120px]">{drop.item_name}</span>
            </div>
            <span className={`text-xs font-mono-cs font-bold text-rarity-${drop.item_rarity} ml-auto`}>
              {formatPrice(drop.item_price)}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
