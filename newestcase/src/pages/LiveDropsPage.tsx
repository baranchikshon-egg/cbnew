import { useLiveDrops } from '@/lib/livedrops';
import { formatPrice, timeAgo } from '@/lib/utils';
import type { Rarity } from '@/lib/types';
import { Radio } from 'lucide-react';

const RARITY_TEXT: Record<Rarity, string> = {
  consumer: 'text-gray-400',
  milspec: 'text-blue-400',
  restricted: 'text-blue-300',
  classified: 'text-purple-400',
  covert: 'text-red-400',
  rare_special: 'text-yellow-400',
};

export default function LiveDropsPage() {
  const { drops } = useLiveDrops();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Radio size={28} className="text-css-orange" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-css-red rounded-full animate-pulse-glow" />
        </div>
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wider text-white">Лента живых дропов</h1>
          <p className="text-gray-500 font-body text-sm">Последние выигрыши игроков в реальном времени</p>
        </div>
      </div>

      {drops.length === 0 ? (
        <div className="text-center py-20">
          <Radio size={48} className="text-gray-700 mx-auto mb-4" />
          <p className="text-gray-600 font-body">Пока нет дропов. Открой первый кейс!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {drops.map((drop) => (
            <div
              key={drop.id}
              className="flex items-center gap-3 bg-css-panel border-l-4 border-${drop.item_rarity} p-3 animate-slide-up"
              style={{ borderLeftColor: getRarityColor(drop.item_rarity) }}
            >
              {/* Item icon */}
              <div
                className="w-14 h-14 flex items-center justify-center flex-shrink-0 border"
                style={{
                  background: getRarityBg(drop.item_rarity),
                  borderColor: getRarityColor(drop.item_rarity),
                }}
              >
                <span className="font-display font-bold text-sm text-white">
                  {drop.item_name.split('|')[0]?.trim().slice(0, 3).toUpperCase() || 'SKN'}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-500 font-body uppercase tracking-wide truncate">
                  {drop.source === 'upgrade' ? 'Апгрейд' : drop.case_name}
                </p>
                <p className="text-sm text-white font-body truncate">{drop.item_name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-gray-600 font-body">{drop.username}</span>
                  <span className="text-[9px] text-gray-700">·</span>
                  <span className="text-[9px] text-gray-600 font-body">{timeAgo(drop.created_at)}</span>
                </div>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <p className={`font-mono-cs font-bold text-sm ${RARITY_TEXT[drop.item_rarity]}`}>
                  {formatPrice(drop.item_price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getRarityColor(rarity: Rarity): string {
  const colors: Record<Rarity, string> = {
    consumer: '#b0b0b0',
    milspec: '#5e98d9',
    restricted: '#4b69ff',
    classified: '#8847ff',
    covert: '#eb4b4b',
    rare_special: '#caab05',
  };
  return colors[rarity];
}

function getRarityBg(rarity: Rarity): string {
  const colors: Record<Rarity, string> = {
    consumer: 'rgba(176,176,176,0.15)',
    milspec: 'rgba(94,152,217,0.15)',
    restricted: 'rgba(75,105,255,0.15)',
    classified: 'rgba(136,71,255,0.15)',
    covert: 'rgba(235,75,75,0.15)',
    rare_special: 'rgba(202,171,5,0.15)',
  };
  return colors[rarity];
}
