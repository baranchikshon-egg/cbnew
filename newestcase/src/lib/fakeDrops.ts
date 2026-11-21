import { Rarity } from './types';

// Fake feed data for the live-drops ticker: player names + skins.
// Real drops from the database are merged in alongside these.

const FAKE_USERNAMES = [
  's1mple_fan', 'KpoT_228', 'AWP_Master', 'ТоляНеБойся', 'rush_b_no_stop',
  'KeNT_4Life', 'Пельмень', 'flashbang_hero', 'CT_ne_boyus', 'ДядяВова',
  'smoke_mid', 'MrKrug', 'molotov_enjoyer', 'Скворец', 'eco_round_god',
  'Zeus_x27', 'ПивоИКс2', 'clutch_or_kick', 'ЛёхаАк47', 'ninja_defuse',
];

export interface FakeSkinDef {
  weapon: string;
  name: string;
  rarity: Rarity;
  price: number;
}

export const FAKE_SKINS: FakeSkinDef[] = [
  { weapon: 'AK-47', name: 'Красная линия', rarity: 'classified', price: 42 },
  { weapon: 'AK-47', name: 'Азиатский лес', rarity: 'restricted', price: 9 },
  { weapon: 'AK-47', name: 'Слайн', rarity: 'covert', price: 310 },
  { weapon: 'M4A4', name: 'Пустынный шторм', rarity: 'restricted', price: 12 },
  { weapon: 'M4A4', name: 'Пожарный змей', rarity: 'covert', price: 240 },
  { weapon: 'M4A1-S', name: 'Гиперзверь', rarity: 'classified', price: 65 },
  { weapon: 'AWP', name: 'Азимов', rarity: 'covert', price: 185 },
  { weapon: 'AWP', name: 'Молниеносная', rarity: 'milspec', price: 4.5 },
  { weapon: 'AWP', name: 'Драконье да', rarity: 'rare_special', price: 1250 },
  { weapon: 'Desert Eagle', name: 'Код красный', rarity: 'classified', price: 38 },
  { weapon: 'Desert Eagle', name: 'Печатный станок', rarity: 'restricted', price: 7 },
  { weapon: 'Glock-18', name: 'Водный элементаль', rarity: 'restricted', price: 5 },
  { weapon: 'Glock-18', name: 'Градиент', rarity: 'classified', price: 21 },
  { weapon: 'USP-S', name: 'Кайманы', rarity: 'restricted', price: 11 },
  { weapon: 'USP-S', name: 'Убийственный выстрел', rarity: 'milspec', price: 3 },
  { weapon: 'P250', name: 'Азимов', rarity: 'restricted', price: 6 },
  { weapon: 'FAMAS', name: 'Ролл-кейдж', rarity: 'classified', price: 15 },
  { weapon: 'P90', name: 'Азиатский лес', rarity: 'milspec', price: 2.5 },
  { weapon: 'Нож-бабочка', name: 'Мраморный градиент', rarity: 'rare_special', price: 2100 },
  { weapon: 'Штык-нож', name: 'Доплер', rarity: 'rare_special', price: 780 },
  { weapon: 'Нож-керамбит', name: 'Ультрафиолет', rarity: 'rare_special', price: 940 },
  { weapon: 'Перчатки', name: 'Тигровые', rarity: 'rare_special', price: 480 },
  { weapon: 'MP9', name: 'Гидропоника', rarity: 'milspec', price: 1.8 },
  { weapon: 'Tec-9', name: 'Топор', rarity: 'restricted', price: 4 },
  { weapon: 'SSG 08', name: 'Кровь в воде', rarity: 'classified', price: 27 },
  { weapon: 'Galil AR', name: 'Хамелео', rarity: 'restricted', price: 8 },
  { weapon: 'MAC-10', name: 'Неон-райдер', rarity: 'classified', price: 18 },
  { weapon: 'Zeus x27', name: 'Олимп', rarity: 'milspec', price: 2 },
];

export interface FakeDrop {
  id: string;
  username: string;
  caseName: string;
  weapon: string;
  skin: FakeSkinDef;
}

export const FAKE_CASE_NAMES = [
  'Kilowatt Case',
  'Revolution Case',
  'Dreams & Nightmares',
  'Recoil Case',
  'Fracture Case',
  'Prisma 2 Case',
  'Clutch Case',
  'Danger Zone Case',
  'Snakebite Case',
  'Operation Riptide',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function makeFakeDrops(count: number, seedOffset = 0): FakeDrop[] {
  const drops: FakeDrop[] = [];
  for (let i = 0; i < count; i++) {
    const idNum = (seedOffset + i) % (FAKE_SKINS.length * FAKE_USERNAMES.length);
    const username = FAKE_USERNAMES[idNum % FAKE_USERNAMES.length];
    const skin = FAKE_SKINS[(idNum * 7 + seedOffset) % FAKE_SKINS.length];
    const caseName = FAKE_CASE_NAMES[(idNum * 3 + seedOffset) % FAKE_CASE_NAMES.length];
    drops.push({
      id: `fake-${seedOffset}-${i}`,
      username,
      caseName,
      weapon: skin.weapon,
      skin,
    });
  }
  return drops;
}

export function randomFakeDrop(): FakeDrop {
  return {
    id: `fake-r-${Math.random().toString(36).slice(2)}`,
    username: pick(FAKE_USERNAMES),
    caseName: pick(FAKE_CASE_NAMES),
    weapon: '',
    skin: pick(FAKE_SKINS),
  };
}
