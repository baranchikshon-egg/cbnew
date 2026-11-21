export type Rarity = 'consumer' | 'milspec' | 'restricted' | 'classified' | 'covert' | 'rare_special';

export const RARITY_ORDER: Rarity[] = ['consumer', 'milspec', 'restricted', 'classified', 'covert', 'rare_special'];

export const RARITY_LABELS: Record<Rarity, string> = {
  consumer: 'Ширпотреб',
  milspec: 'Армейское',
  restricted: 'Запрещённое',
  classified: 'Засекреченное',
  covert: 'Тайное',
  rare_special: '★ Редкое',
};

export interface Case {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  accent_color: string;
  is_active: boolean;
  sort_order: number;
}

export interface CaseItem {
  id: string;
  case_id: string;
  name: string;
  weapon: string;
  rarity: Rarity;
  wear: string;
  price: number;
  image_url: string;
  chance: number;
  sort_order: number;
}

export interface UserItem {
  id: string;
  user_id: string;
  name: string;
  weapon: string;
  rarity: Rarity;
  wear: string;
  price: number;
  image_url: string;
  source: string;
  status: string;
  created_at: string;
}

export interface LiveDrop {
  id: string;
  user_id: string | null;
  username: string;
  avatar_url: string;
  case_name: string;
  case_id: string | null;
  item_name: string;
  item_image: string;
  item_rarity: Rarity;
  item_price: number;
  source: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  status: string;
  method: string;
  description: string;
  created_at: string;
}

export interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  steam_id: string;
  balance: number;
  total_deposited: number;
  total_withdrawn: number;
  cases_opened: number;
}

export interface UpgradeRecord {
  id: string;
  user_id: string;
  input_item_name: string;
  input_item_price: number;
  target_item_name: string;
  target_item_price: number;
  chance: number;
  success: boolean;
  created_at: string;
}
