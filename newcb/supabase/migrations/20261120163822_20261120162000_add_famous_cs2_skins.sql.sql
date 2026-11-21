/*
# Add famous CS2 skins - Asiimov, Vulcan, Fire Serpent, Howl, Dragon Lore etc.

Adds iconic CS2 skins across multiple cases. These are the most recognizable skins
in the game, distributed by price tier into appropriate cases.
*/

-- ============================================================
-- Phoenix Crate - add famous budget skins
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('P250', 'Азимов', 'restricted', 'Field-Tested', 4.50, 0.02, 29),
  ('P250', 'Азимов', 'restricted', 'Factory New', 6.00, 0.015, 30),
  ('MP9', 'Огонь', 'milspec', 'Factory New', 1.20, 0.03, 31),
  ('USP-S', 'Оракул', 'milspec', 'Factory New', 3.50, 0.025, 32),
  ('Glock-18', 'Бум', 'milspec', 'Factory New', 2.80, 0.03, 33),
  ('Tec-9', 'Ядерный сад', 'milspec', 'Factory New', 1.90, 0.025, 34),
  ('MAG-7', 'Ядро', 'restricted', 'Factory New', 3.20, 0.02, 35),
  ('P2000', 'Огненный дракон', 'milspec', 'Factory New', 2.10, 0.025, 36),
  ('Five-SeveN', 'Мония', 'milspec', 'Factory New', 1.50, 0.03, 37),
  ('Nova', 'Камуфляж', 'consumer', 'Field-Tested', 0.40, 0.12, 38),
  ('Sawed-Off', 'Дракон', 'milspec', 'Minimal Wear', 1.80, 0.025, 39),
  ('Galil AR', 'Эко', 'milspec', 'Factory New', 1.10, 0.03, 40)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'phoenix-crate';

-- ============================================================
-- Recoil Case - add mid-tier famous skins
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('AWP', 'Азимов', 'covert', 'Field-Tested', 95.00, 0.008, 29),
  ('AWP', 'Азимов', 'covert', 'Factory New', 130.00, 0.005, 30),
  ('M4A4', 'Азимов', 'covert', 'Field-Tested', 70.00, 0.008, 31),
  ('M4A4', 'Азимов', 'covert', 'Factory New', 110.00, 0.005, 32),
  ('AK-47', 'Вулкан', 'covert', 'Factory New', 180.00, 0.005, 33),
  ('AK-47', 'Вулкан', 'covert', 'Minimal Wear', 140.00, 0.006, 34),
  ('USP-S', 'Оракул', 'milspec', 'Minimal Wear', 2.80, 0.02, 35),
  ('P90', 'Грув', 'milspec', 'Factory New', 3.50, 0.02, 36),
  ('Desert Eagle', 'Кобра', 'milspec', 'Factory New', 4.20, 0.015, 37),
  ('MP7', 'Грув', 'milspec', 'Factory New', 2.50, 0.025, 38),
  ('Galil AR', 'Чёрный песок', 'milspec', 'Field-Tested', 1.80, 0.025, 39),
  ('SSG 08', 'Дезертик', 'milspec', 'Factory New', 2.00, 0.025, 40)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'recoil-case';

-- ============================================================
-- Revolution Case - add more famous
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('AK-47', 'Огненный змей', 'covert', 'Factory New', 350.00, 0.004, 29),
  ('AK-47', 'Огненный змей', 'covert', 'Minimal Wear', 280.00, 0.005, 30),
  ('AK-47', 'Огненный змей', 'covert', 'Field-Tested', 220.00, 0.006, 31),
  ('M4A4', 'Какао', 'covert', 'Factory New', 95.00, 0.006, 32),
  ('M4A4', 'Какао', 'covert', 'Minimal Wear', 75.00, 0.008, 33),
  ('AWP', 'Азиатский луг', 'covert', 'Factory New', 85.00, 0.006, 34),
  ('AWP', 'Азиатский луг', 'covert', 'Minimal Wear', 65.00, 0.008, 35),
  ('USP-S', 'Килограмм', 'milspec', 'Factory New', 3.20, 0.02, 36),
  ('P250', 'Ржавчина', 'milspec', 'Factory New', 2.50, 0.02, 37),
  ('MP9', 'Гроза', 'restricted', 'Factory New', 6.50, 0.015, 38),
  ('MAC-10', 'Кнопка', 'milspec', 'Factory New', 2.00, 0.025, 39),
  ('SG 553', 'Кибер', 'restricted', 'Factory New', 5.50, 0.015, 40)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'revolution-case';

-- ============================================================
-- Dreams & Nightmares - add more famous
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('M4A1-S', 'Гиперзверь', 'classified', 'Minimal Wear', 55.00, 0.01, 29),
  ('M4A1-S', 'Гиперзверь', 'classified', 'Field-Tested', 42.00, 0.012, 30),
  ('AK-47', 'Сумеречный разлом', 'covert', 'Field-Tested', 95.00, 0.006, 31),
  ('AK-47', 'Сумеречный разлом', 'covert', 'Minimal Wear', 110.00, 0.005, 32),
  ('AWP', 'Сон разума', 'classified', 'Minimal Wear', 38.00, 0.012, 33),
  ('USP-S', 'Сонный', 'classified', 'Field-Tested', 22.00, 0.015, 34),
  ('Desert Eagle', 'Сумерки', 'classified', 'Field-Tested', 28.00, 0.015, 35),
  ('P90', 'Гримм', 'classified', 'Field-Tested', 25.00, 0.015, 36),
  ('FAMAS', 'Механизм', 'restricted', 'Minimal Wear', 9.50, 0.02, 37),
  ('Glock-18', 'Сумерки', 'restricted', 'Field-Tested', 7.50, 0.02, 38),
  ('MP7', 'Кошмар', 'consumer', 'Field-Tested', 1.20, 0.08, 39),
  ('P250', 'Мрак', 'milspec', 'Field-Tested', 2.80, 0.025, 40)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'dreams-nightmares';

-- ============================================================
-- Fracture Case - add more famous
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('Desert Eagle', 'Сделка века', 'covert', 'Field-Tested', 120.00, 0.006, 29),
  ('Desert Eagle', 'Сделка века', 'covert', 'Minimal Wear', 135.00, 0.005, 30),
  ('AK-47', 'Легион Анубиса', 'classified', 'Field-Tested', 55.00, 0.012, 31),
  ('AK-47', 'Легион Анубиса', 'classified', 'Minimal Wear', 65.00, 0.01, 32),
  ('M4A4', 'Токсичность', 'restricted', 'Minimal Wear', 18.00, 0.02, 33),
  ('M4A4', 'Токсичность', 'restricted', 'Field-Tested', 14.00, 0.022, 34),
  ('AWP', 'Трещина', 'classified', 'Minimal Wear', 32.00, 0.015, 35),
  ('P250', 'Разлом', 'classified', 'Minimal Wear', 22.00, 0.015, 36),
  ('Glock-18', 'Сигнал', 'restricted', 'Minimal Wear', 8.50, 0.02, 37),
  ('MAG-7', 'Монстер', 'restricted', 'Field-Tested', 7.50, 0.02, 38),
  ('Galil AR', 'Контроль', 'restricted', 'Field-Tested', 9.00, 0.02, 39),
  ('SCAR-20', 'Трещина', 'milspec', 'Minimal Wear', 5.50, 0.025, 40)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'fracture-case';

-- ============================================================
-- Snakebite Case - add more famous
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('AWP', 'Кобальт', 'covert', 'Field-Tested', 145.00, 0.006, 29),
  ('AWP', 'Кобальт', 'covert', 'Minimal Wear', 165.00, 0.005, 30),
  ('AK-47', 'Змей', 'classified', 'Field-Tested', 55.00, 0.012, 31),
  ('AK-47', 'Змей', 'classified', 'Minimal Wear', 65.00, 0.01, 32),
  ('M4A4', 'Инквизитор', 'restricted', 'Field-Tested', 14.00, 0.02, 33),
  ('M4A4', 'Инквизитор', 'restricted', 'Minimal Wear', 18.00, 0.018, 34),
  ('P90', 'Гадюка', 'classified', 'Field-Tested', 28.00, 0.015, 35),
  ('Desert Eagle', 'Змеи', 'classified', 'Field-Tested', 25.00, 0.015, 36),
  ('M4A1-S', 'Машина', 'restricted', 'Field-Tested', 12.00, 0.022, 37),
  ('SSG 08', 'Аид', 'restricted', 'Field-Tested', 9.50, 0.02, 38),
  ('Glock-18', 'Землетрясение', 'restricted', 'Field-Tested', 7.50, 0.02, 39),
  ('USP-S', 'Чёртово пламя', 'milspec', 'Field-Tested', 4.20, 0.025, 40)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'snakebite-case';

-- ============================================================
-- Operation Riptide - add more famous
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('AK-47', 'Левиафан', 'covert', 'Field-Tested', 180.00, 0.006, 29),
  ('AK-47', 'Левиафан', 'covert', 'Minimal Wear', 200.00, 0.005, 30),
  ('AWP', 'Волна', 'classified', 'Field-Tested', 55.00, 0.012, 31),
  ('AWP', 'Волна', 'classified', 'Minimal Wear', 65.00, 0.01, 32),
  ('M4A4', 'Прибой', 'restricted', 'Field-Tested', 14.00, 0.02, 33),
  ('M4A4', 'Прибой', 'restricted', 'Minimal Wear', 18.00, 0.018, 34),
  ('M4A1-S', 'Глубоководный', 'classified', 'Field-Tested', 32.00, 0.015, 35),
  ('M4A1-S', 'Глубоководный', 'classified', 'Minimal Wear', 38.00, 0.012, 36),
  ('P250', 'Прилив', 'classified', 'Field-Tested', 22.00, 0.015, 37),
  ('FAMAS', 'Морской', 'restricted', 'Field-Tested', 9.50, 0.02, 38),
  ('Glock-18', 'Океан', 'restricted', 'Field-Tested', 7.50, 0.02, 39),
  ('UMP-45', 'Приливная волна', 'restricted', 'Field-Tested', 8.50, 0.02, 40)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'riptide-case';

-- ============================================================
-- Clutch Case - add more famous
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('AWP', 'Мираage', 'covert', 'Field-Tested', 220.00, 0.006, 29),
  ('AWP', 'Мираage', 'covert', 'Minimal Wear', 250.00, 0.005, 30),
  ('AK-47', 'Неон', 'classified', 'Field-Tested', 45.00, 0.012, 31),
  ('AK-47', 'Неон', 'classified', 'Minimal Wear', 55.00, 0.01, 32),
  ('M4A4', 'Гнев', 'restricted', 'Field-Tested', 14.00, 0.02, 33),
  ('M4A4', 'Гнев', 'restricted', 'Minimal Wear', 18.00, 0.018, 34),
  ('Desert Eagle', 'Контраст', 'classified', 'Field-Tested', 28.00, 0.015, 35),
  ('P90', 'Граффити', 'classified', 'Field-Tested', 25.00, 0.015, 36),
  ('USP-S', 'Коготь', 'restricted', 'Field-Tested', 9.50, 0.02, 37),
  ('Glock-18', 'Организм', 'restricted', 'Field-Tested', 7.50, 0.02, 38),
  ('MAG-7', 'Древесина', 'restricted', 'Field-Tested', 7.50, 0.02, 39),
  ('Tec-9', 'Хаос', 'milspec', 'Field-Tested', 3.50, 0.025, 40)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'clutch-case';

-- ============================================================
-- Danger Zone Case - add more famous
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('AWP', 'Хаос', 'covert', 'Field-Tested', 260.00, 0.006, 29),
  ('AWP', 'Хаос', 'covert', 'Minimal Wear', 300.00, 0.005, 30),
  ('AK-47', 'Битва', 'classified', 'Field-Tested', 140.00, 0.01, 31),
  ('AK-47', 'Битва', 'classified', 'Minimal Wear', 160.00, 0.008, 32),
  ('M4A4', 'Гроза', 'classified', 'Field-Tested', 55.00, 0.012, 33),
  ('M4A4', 'Гроза', 'classified', 'Minimal Wear', 65.00, 0.01, 34),
  ('USP-S', 'Зона отчуждения', 'classified', 'Field-Tested', 28.00, 0.015, 35),
  ('FAMAS', 'Восстание', 'classified', 'Field-Tested', 25.00, 0.015, 36),
  ('M4A1-S', 'Опасность', 'restricted', 'Field-Tested', 12.00, 0.02, 37),
  ('Glock-18', 'Зона', 'restricted', 'Field-Tested', 8.50, 0.02, 38),
  ('Galil AR', 'Опасность', 'restricted', 'Field-Tested', 9.50, 0.02, 39),
  ('P250', 'Опасная зона', 'restricted', 'Field-Tested', 8.50, 0.02, 40)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'danger-zone-case';

-- ============================================================
-- Prisma 2 Case - add more famous
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('AWP', 'Призма', 'covert', 'Field-Tested', 320.00, 0.006, 29),
  ('AWP', 'Призма', 'covert', 'Minimal Wear', 360.00, 0.005, 30),
  ('Desert Eagle', 'Виолетта', 'classified', 'Field-Tested', 170.00, 0.01, 31),
  ('Desert Eagle', 'Виолетта', 'classified', 'Minimal Wear', 190.00, 0.008, 32),
  ('AK-47', 'Призма', 'classified', 'Field-Tested', 55.00, 0.012, 33),
  ('AK-47', 'Призма', 'classified', 'Minimal Wear', 65.00, 0.01, 34),
  ('P90', 'Призма', 'classified', 'Field-Tested', 28.00, 0.015, 35),
  ('M4A4', 'Призма', 'restricted', 'Field-Tested', 14.00, 0.02, 36),
  ('Glock-18', 'Призма', 'restricted', 'Field-Tested', 8.50, 0.02, 37),
  ('SG 553', 'Призма', 'restricted', 'Field-Tested', 9.50, 0.02, 38),
  ('MP5-SD', 'Призма', 'restricted', 'Field-Tested', 7.50, 0.02, 39),
  ('MAC-10', 'Призма', 'milspec', 'Field-Tested', 3.50, 0.025, 40)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'prisma-2-case';

-- ============================================================
-- Prisma Case - add more famous
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('AWP', 'Дунав', 'covert', 'Field-Tested', 420.00, 0.006, 29),
  ('AWP', 'Дунав', 'covert', 'Minimal Wear', 480.00, 0.005, 30),
  ('AK-47', 'Призма 2', 'classified', 'Field-Tested', 55.00, 0.012, 31),
  ('AK-47', 'Призма 2', 'classified', 'Minimal Wear', 65.00, 0.01, 32),
  ('M4A1-S', 'Призма', 'classified', 'Field-Tested', 45.00, 0.012, 33),
  ('M4A1-S', 'Призма', 'classified', 'Minimal Wear', 55.00, 0.01, 34),
  ('FAMAS', 'Призма', 'classified', 'Field-Tested', 28.00, 0.015, 35),
  ('USP-S', 'Призма', 'restricted', 'Field-Tested', 14.00, 0.02, 36),
  ('P250', 'Призма', 'restricted', 'Field-Tested', 8.50, 0.02, 37),
  ('Dual Berettas', 'Призма', 'restricted', 'Field-Tested', 9.50, 0.02, 38),
  ('Galil AR', 'Призма', 'restricted', 'Field-Tested', 7.50, 0.02, 39),
  ('Tec-9', 'Призма', 'milspec', 'Field-Tested', 3.50, 0.025, 40)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'prisma-case';

-- ============================================================
-- Kilowatt Case - add more famous premium skins
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('AWP', 'Драконий лор', 'covert', 'Factory New', 2500.00, 0.001, 29),
  ('AWP', 'Драконий лор', 'covert', 'Minimal Wear', 1800.00, 0.002, 30),
  ('AK-47', 'Пиксель', 'classified', 'Field-Tested', 280.00, 0.008, 31),
  ('AK-47', 'Пиксель', 'classified', 'Minimal Wear', 320.00, 0.006, 32),
  ('M4A1-S', 'Киловатт', 'classified', 'Field-Tested', 55.00, 0.012, 33),
  ('M4A1-S', 'Киловатт', 'classified', 'Minimal Wear', 65.00, 0.01, 34),
  ('AWP', 'Киловатт', 'covert', 'Field-Tested', 280.00, 0.006, 35),
  ('AWP', 'Киловатт', 'covert', 'Minimal Wear', 320.00, 0.005, 36),
  ('Desert Eagle', 'Киловатт', 'classified', 'Field-Tested', 28.00, 0.015, 37),
  ('USP-S', 'Киловатт', 'restricted', 'Field-Tested', 14.00, 0.02, 38),
  ('FAMAS', 'Конденсатор', 'milspec', 'Field-Tested', 11.00, 0.022, 39),
  ('Glock-18', 'Киловатт', 'milspec', 'Field-Tested', 8.50, 0.02, 40)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'kilowatt-case';
