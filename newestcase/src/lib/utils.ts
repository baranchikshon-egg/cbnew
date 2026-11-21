import { Rarity } from './types';

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function formatChance(chance: number): string {
  const pct = (chance * 100).toFixed(2);
  return `${pct}%`;
}

export function rarityClass(rarity: Rarity): string {
  return `border-${rarity}`;
}

export function rarityGlow(rarity: Rarity): string {
  return `glow-${rarity}`;
}

export function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}с назад`;
  if (diff < 3600) return `${Math.floor(diff / 60)}м назад`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}ч назад`;
  return `${Math.floor(diff / 86400)}д назад`;
}

// Weighted random selection of a case item based on chance
export function rollItem<T extends { chance: number }>(items: T[]): T {
  const total = items.reduce((sum, i) => sum + i.chance, 0);
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= item.chance;
    if (roll <= 0) return item;
  }
  return items[items.length - 1];
}

// Generate a reel array for the case opening animation
export function generateReel<T>(items: T[], winner: T, length: number = 60): T[] {
  const reel: T[] = [];
  for (let i = 0; i < length; i++) {
    reel.push(items[Math.floor(Math.random() * items.length)]);
  }
  // Place winner near the end (position length-5 for centering)
  reel[length - 5] = winner;
  return reel;
}
