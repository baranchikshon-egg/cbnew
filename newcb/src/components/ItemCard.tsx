import { Rarity } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import WeaponIcon from '@/components/WeaponIcon';

interface ItemCardProps {
  name: string;
  weapon: string;
  rarity: Rarity;
  wear: string;
  price: number;
  imageUrl?: string;
  chance?: number;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  selected?: boolean;
}

export default function ItemCard({ name, weapon, rarity, wear, price, imageUrl, chance, size = 'md', onClick, selected }: ItemCardProps) {
  const sizes = {
    sm: 'w-[120px] h-[130px]',
    md: 'w-[160px] h-[180px]',
    lg: 'w-[200px] h-[230px]',
  };

  const textSizes = {
    sm: { name: 'text-[10px]', weapon: 'text-[9px]', price: 'text-xs' },
    md: { name: 'text-xs', weapon: 'text-[10px]', price: 'text-sm' },
    lg: { name: 'text-sm', weapon: 'text-xs', price: 'text-base' },
  };

  return (
    <div
      onClick={onClick}
      className={`relative ${sizes[size]} flex flex-col bg-css-panel border-2 border-${rarity} ${selected ? 'ring-2 ring-css-orange ring-offset-2 ring-offset-css-dark' : ''} ${onClick ? 'cursor-pointer hover:brightness-110 transition-all' : ''} overflow-hidden group`}
    >
      {/* Top rarity bar */}
      <div className={`h-1 w-full bg-rarity-${rarity}`} />

      {/* Weapon skin pattern background */}
      <div className="absolute inset-0 opacity-10 css-grid-bg" />

      {/* Center icon */}
      <div className="flex-1 flex items-center justify-center px-2 relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${weapon} | ${name}`}
            loading="lazy"
            className="max-w-[90%] max-h-[90%] object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.18)] group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <WeaponIcon
            weapon={weapon}
            rarity={rarity}
            size={size === 'sm' ? 90 : size === 'md' ? 120 : 150}
            className="opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
          />
        )}
      </div>

      {/* Bottom info */}
      <div className="px-1.5 pb-1.5 bg-gradient-to-t from-css-dark/90 to-transparent">
        <p className={`${textSizes[size].weapon} text-gray-400 font-body uppercase tracking-wide truncate`}>{weapon}</p>
        <p className={`${textSizes[size].name} text-white font-display font-medium truncate`} title={name}>{name}</p>
        <p className={`text-[8px] text-gray-500 uppercase mt-0.5 truncate`}>{wear}</p>
        <div className="flex items-center justify-between mt-1">
          <span className={`${textSizes[size].price} font-mono-cs text-css-tan font-bold`}>{formatPrice(price)}</span>
          {chance !== undefined && (
            <span className="text-[8px] font-mono-cs text-gray-500">{(chance * 100).toFixed(1)}%</span>
          )}
        </div>
      </div>
    </div>
  );
}
