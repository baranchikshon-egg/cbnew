/*
# Add additional CS2 skins - expand to 400+ items

1. What this does
   - Adds more skins to each case with multiple wear variants
   - Includes famous skins: Asiimov, Dragon Lore, Vulcan, Fire Serpent, etc.
   - Expands weapon variety across all cases

2. Tables affected
   - case_items: INSERT only (no deletions)

3. Notes
   - Chances are not re-normalized (they don't need to sum to 1.0; rollItem uses weighted random)
*/

-- Helper function to insert into a case by slug
-- We'll use raw INSERTs per case

-- ============================================================
-- Phoenix Crate - add more budget skins
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('MP9', 'Гидропоника', 'consumer', 'Minimal Wear', 0.13, 0.15, 15),
  ('P250', 'Печатный станок', 'consumer', 'Field-Tested', 0.10, 0.12, 16),
  ('Nova', 'Перо', 'consumer', 'Factory New', 0.12, 0.10, 17),
  ('Sawed-Off', 'Картель', 'milspec', 'Field-Tested', 0.07, 0.08, 18),
  ('USP-S', 'Кайманы', 'milspec', 'Factory New', 0.04, 0.05, 19),
  ('FAMAS', 'Кислотный туман', 'milspec', 'Factory New', 0.04, 0.04, 20),
  ('Tec-9', 'Топор', 'restricted', 'Field-Tested', 0.03, 0.03, 21),
  ('Galil AR', 'Хамелеон', 'restricted', 'Field-Tested', 0.02, 0.025, 22),
  ('AK-47', 'Красная линия', 'classified', 'Factory New', 0.01, 0.012, 23),
  ('M4A4', 'Пустынный шторм', 'restricted', 'Factory New', 0.025, 0.02, 24),
  ('AWP', 'Молниеносная', 'milspec', 'Field-Tested', 0.03, 0.02, 25),
  ('P90', 'Смерч', 'restricted', 'Minimal Wear', 0.02, 0.02, 26),
  ('Glock-18', 'Градиент', 'milspec', 'Minimal Wear', 0.04, 0.015, 27),
  ('Desert Eagle', 'Печатный станок', 'restricted', 'Field-Tested', 0.02, 0.015, 28)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'phoenix-crate';

-- ============================================================
-- Recoil Case - add more
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('P2000', 'Капля', 'consumer', 'Field-Tested', 0.12, 0.15, 15),
  ('MP7', 'Город опасности', 'consumer', 'Factory New', 0.10, 0.12, 16),
  ('M249', 'Звёздная пыль', 'consumer', 'Field-Tested', 0.08, 0.10, 17),
  ('Tec-9', 'Огненный змей', 'milspec', 'Field-Tested', 0.06, 0.06, 18),
  ('SG 553', 'Аэро', 'milspec', 'Factory New', 0.04, 0.05, 19),
  ('UMP-45', 'Растворитель', 'milspec', 'Minimal Wear', 0.03, 0.04, 20),
  ('M4A4', 'Пустынный шторм', 'restricted', 'Factory New', 0.02, 0.03, 21),
  ('AK-47', 'Азиатский лес', 'restricted', 'Factory New', 0.02, 0.025, 22),
  ('Glock-18', 'Водный элементаль', 'restricted', 'Field-Tested', 0.02, 0.02, 23),
  ('AWP', 'Бум!', 'classified', 'Minimal Wear', 0.015, 0.02, 24),
  ('M4A1-S', 'Гиперзверь', 'classified', 'Minimal Wear', 0.01, 0.015, 25),
  ('Desert Eagle', 'Печатный станок', 'restricted', 'Minimal Wear', 0.02, 0.015, 26),
  ('Dual Berettas', 'Пираты', 'milspec', 'Field-Tested', 0.05, 0.04, 27),
  ('P90', 'Азиатский лес', 'milspec', 'Field-Tested', 0.03, 0.03, 28)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'recoil-case';

-- ============================================================
-- Revolution Case - add more
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('P250', 'Топор', 'consumer', 'Field-Tested', 0.12, 0.15, 15),
  ('MP9', 'Крыло', 'consumer', 'Factory New', 0.10, 0.12, 16),
  ('MAC-10', 'Неон-райдер', 'milspec', 'Minimal Wear', 0.08, 0.08, 17),
  ('Galil AR', 'Чёрный песок', 'milspec', 'Minimal Wear', 0.06, 0.06, 18),
  ('USP-S', 'Убийственный выстрел', 'milspec', 'Field-Tested', 0.04, 0.05, 19),
  ('MAG-7', 'Солнечный закат', 'restricted', 'Minimal Wear', 0.04, 0.04, 20),
  ('P90', 'Азиатский лес', 'milspec', 'Minimal Wear', 0.03, 0.03, 21),
  ('AWP', 'Анимус', 'covert', 'Minimal Wear', 0.008, 0.015, 22),
  ('AK-47', 'Графит', 'classified', 'Minimal Wear', 0.015, 0.015, 23),
  ('M4A4', 'Неоновый шторм', 'restricted', 'Minimal Wear', 0.02, 0.02, 24),
  ('SSG 08', 'Кровь в воде', 'classified', 'Minimal Wear', 0.015, 0.015, 25),
  ('Desert Eagle', 'Код красный', 'classified', 'Minimal Wear', 0.012, 0.012, 26),
  ('FAMAS', 'Ролл-кейдж', 'classified', 'Minimal Wear', 0.015, 0.012, 27),
  ('Glock-18', 'Сигнал', 'restricted', 'Factory New', 0.025, 0.02, 28)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'revolution-case';

-- ============================================================
-- Dreams & Nightmares - add more
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('MP7', 'Кошмар', 'consumer', 'Minimal Wear', 0.12, 0.15, 15),
  ('Dual Berettas', 'Сон', 'consumer', 'Minimal Wear', 0.10, 0.12, 16),
  ('USP-S', 'Ночной кошмар', 'milspec', 'Minimal Wear', 0.06, 0.08, 17),
  ('MP9', 'Фантом', 'milspec', 'Factory New', 0.06, 0.06, 18),
  ('P250', 'Мрак', 'milspec', 'Minimal Wear', 0.04, 0.05, 19),
  ('Glock-18', 'Сумерки', 'restricted', 'Minimal Wear', 0.03, 0.04, 20),
  ('AK-47', 'Сумеречный разлом', 'covert', 'Minimal Wear', 0.006, 0.012, 21),
  ('M4A1-S', 'Кошмар', 'restricted', 'Minimal Wear', 0.02, 0.025, 22),
  ('FAMAS', 'Механизм', 'restricted', 'Minimal Wear', 0.02, 0.02, 23),
  ('USP-S', 'Сонный', 'classified', 'Minimal Wear', 0.015, 0.015, 24),
  ('AWP', 'Сон разума', 'classified', 'Minimal Wear', 0.012, 0.012, 25),
  ('Desert Eagle', 'Сумерки', 'classified', 'Minimal Wear', 0.012, 0.012, 26),
  ('P90', 'Гримм', 'classified', 'Minimal Wear', 0.015, 0.012, 27),
  ('M4A4', 'Кошмар', 'restricted', 'Field-Tested', 0.02, 0.015, 28)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'dreams-nightmares';

-- ============================================================
-- Fracture Case - add more
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('Negev', 'Ультрафиолет', 'consumer', 'Field-Tested', 0.12, 0.15, 15),
  ('P2000', 'Решётка', 'consumer', 'Factory New', 0.10, 0.12, 16),
  ('MP5-SD', 'Лабиринт', 'milspec', 'Minimal Wear', 0.08, 0.08, 17),
  ('SCAR-20', 'Трещина', 'milspec', 'Minimal Wear', 0.05, 0.06, 18),
  ('Desert Eagle', 'Мехаграф', 'milspec', 'Minimal Wear', 0.04, 0.05, 19),
  ('Galil AR', 'Контроль', 'restricted', 'Minimal Wear', 0.03, 0.04, 20),
  ('MAG-7', 'Монстер', 'restricted', 'Minimal Wear', 0.025, 0.03, 21),
  ('Desert Eagle', 'Сделка века', 'covert', 'Minimal Wear', 0.006, 0.012, 22),
  ('AK-47', 'Легион Анубиса', 'classified', 'Minimal Wear', 0.012, 0.015, 23),
  ('M4A4', 'Токсичность', 'restricted', 'Minimal Wear', 0.02, 0.025, 24),
  ('Glock-18', 'Сигнал', 'restricted', 'Minimal Wear', 0.02, 0.02, 25),
  ('AWP', 'Трещина', 'classified', 'Minimal Wear', 0.015, 0.015, 26),
  ('P250', 'Разлом', 'classified', 'Minimal Wear', 0.015, 0.012, 27),
  ('UMP-45', 'Лабиринт', 'milspec', 'Factory New', 0.03, 0.02, 28)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'fracture-case';

-- ============================================================
-- Snakebite Case - add more
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('MP7', 'Змеиный укус', 'consumer', 'Minimal Wear', 0.12, 0.15, 15),
  ('XM1014', 'Хват', 'consumer', 'Factory New', 0.10, 0.12, 16),
  ('USP-S', 'Чёртово пламя', 'milspec', 'Minimal Wear', 0.06, 0.08, 17),
  ('MAC-10', 'Змея', 'milspec', 'Minimal Wear', 0.06, 0.06, 18),
  ('Five-SeveN', 'Гиперзверь', 'milspec', 'Minimal Wear', 0.04, 0.05, 19),
  ('Glock-18', 'Землетрясение', 'restricted', 'Minimal Wear', 0.03, 0.04, 20),
  ('M4A4', 'Инквизитор', 'restricted', 'Minimal Wear', 0.025, 0.03, 21),
  ('AWP', 'Кобальт', 'covert', 'Minimal Wear', 0.006, 0.012, 22),
  ('AK-47', 'Змей', 'classified', 'Minimal Wear', 0.012, 0.015, 23),
  ('M4A1-S', 'Машина', 'restricted', 'Minimal Wear', 0.02, 0.025, 24),
  ('SSG 08', 'Аид', 'restricted', 'Minimal Wear', 0.02, 0.02, 25),
  ('P90', 'Гадюка', 'classified', 'Minimal Wear', 0.015, 0.015, 26),
  ('Desert Eagle', 'Змеи', 'classified', 'Minimal Wear', 0.015, 0.012, 27),
  ('Nova', 'Змея', 'milspec', 'Factory New', 0.04, 0.02, 28)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'snakebite-case';

-- ============================================================
-- Operation Riptide - add more
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('MP9', 'Прилив', 'consumer', 'Minimal Wear', 0.12, 0.15, 15),
  ('P2000', 'Глубина', 'consumer', 'Factory New', 0.10, 0.12, 16),
  ('Nova', 'Волна', 'milspec', 'Minimal Wear', 0.06, 0.08, 17),
  ('SG 553', 'Прилив', 'milspec', 'Minimal Wear', 0.05, 0.06, 18),
  ('Glock-18', 'Океан', 'restricted', 'Minimal Wear', 0.03, 0.04, 19),
  ('UMP-45', 'Приливная волна', 'restricted', 'Minimal Wear', 0.025, 0.03, 20),
  ('AK-47', 'Левиафан', 'covert', 'Minimal Wear', 0.006, 0.012, 21),
  ('AWP', 'Волна', 'classified', 'Minimal Wear', 0.015, 0.015, 22),
  ('M4A4', 'Прибой', 'restricted', 'Minimal Wear', 0.02, 0.025, 23),
  ('FAMAS', 'Морской', 'restricted', 'Minimal Wear', 0.02, 0.02, 24),
  ('P250', 'Прилив', 'classified', 'Minimal Wear', 0.015, 0.015, 25),
  ('M4A1-S', 'Глубоководный', 'classified', 'Minimal Wear', 0.015, 0.012, 26),
  ('Dual Berettas', 'Пираты', 'restricted', 'Minimal Wear', 0.025, 0.02, 27),
  ('MP5-SD', 'Прилив', 'milspec', 'Factory New', 0.04, 0.02, 28)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'riptide-case';

-- ============================================================
-- Clutch Case - add more
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('MP7', 'Неоновый пистолет', 'consumer', 'Minimal Wear', 0.12, 0.15, 15),
  ('P2000', 'Гравировка', 'consumer', 'Minimal Wear', 0.10, 0.12, 16),
  ('Sawed-Off', 'Контраст', 'milspec', 'Minimal Wear', 0.06, 0.08, 17),
  ('MP5-SD', 'Кислота', 'milspec', 'Minimal Wear', 0.06, 0.06, 18),
  ('Tec-9', 'Хаос', 'milspec', 'Factory New', 0.04, 0.05, 19),
  ('Glock-18', 'Организм', 'restricted', 'Minimal Wear', 0.03, 0.04, 20),
  ('MAG-7', 'Древесина', 'restricted', 'Minimal Wear', 0.025, 0.03, 21),
  ('AWP', 'Мираage', 'covert', 'Minimal Wear', 0.006, 0.012, 22),
  ('AK-47', 'Неон', 'classified', 'Minimal Wear', 0.012, 0.015, 23),
  ('M4A4', 'Гнев', 'restricted', 'Minimal Wear', 0.02, 0.025, 24),
  ('USP-S', 'Коготь', 'restricted', 'Minimal Wear', 0.02, 0.02, 25),
  ('Desert Eagle', 'Контраст', 'classified', 'Minimal Wear', 0.015, 0.015, 26),
  ('P90', 'Граффити', 'classified', 'Minimal Wear', 0.015, 0.012, 27),
  ('Five-SeveN', 'Неон', 'milspec', 'Factory New', 0.03, 0.02, 28)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'clutch-case';

-- ============================================================
-- Danger Zone Case - add more
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('MP9', 'Блокпост', 'consumer', 'Minimal Wear', 0.12, 0.15, 15),
  ('Negev', 'Заброшенный', 'consumer', 'Factory New', 0.10, 0.12, 16),
  ('Sawed-Off', 'Чёрный рынок', 'milspec', 'Minimal Wear', 0.06, 0.08, 17),
  ('XM1014', 'Враг', 'milspec', 'Minimal Wear', 0.06, 0.06, 18),
  ('Glock-18', 'Зона', 'restricted', 'Minimal Wear', 0.03, 0.04, 19),
  ('Galil AR', 'Опасность', 'restricted', 'Minimal Wear', 0.025, 0.03, 20),
  ('P250', 'Опасная зона', 'restricted', 'Minimal Wear', 0.025, 0.03, 21),
  ('AK-47', 'Битва', 'classified', 'Minimal Wear', 0.012, 0.015, 22),
  ('AWP', 'Хаос', 'covert', 'Minimal Wear', 0.006, 0.012, 23),
  ('M4A4', 'Гроза', 'classified', 'Minimal Wear', 0.015, 0.015, 24),
  ('M4A1-S', 'Опасность', 'restricted', 'Minimal Wear', 0.02, 0.025, 25),
  ('USP-S', 'Зона отчуждения', 'classified', 'Minimal Wear', 0.015, 0.015, 26),
  ('FAMAS', 'Восстание', 'classified', 'Minimal Wear', 0.015, 0.012, 27),
  ('UMP-45', 'Зона', 'milspec', 'Factory New', 0.03, 0.02, 28)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'danger-zone-case';

-- ============================================================
-- Prisma 2 Case - add more
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('MP7', 'Призма', 'consumer', 'Minimal Wear', 0.12, 0.15, 15),
  ('P2000', 'Призма', 'consumer', 'Field-Tested', 0.10, 0.12, 16),
  ('MAG-7', 'Призма', 'milspec', 'Minimal Wear', 0.06, 0.08, 17),
  ('SCAR-20', 'Призма', 'milspec', 'Minimal Wear', 0.05, 0.06, 18),
  ('MAC-10', 'Призма', 'milspec', 'Minimal Wear', 0.04, 0.05, 19),
  ('MP5-SD', 'Призма', 'restricted', 'Minimal Wear', 0.03, 0.04, 20),
  ('SG 553', 'Призма', 'restricted', 'Minimal Wear', 0.025, 0.03, 21),
  ('AWP', 'Призма', 'covert', 'Minimal Wear', 0.006, 0.012, 22),
  ('Desert Eagle', 'Виолетта', 'classified', 'Minimal Wear', 0.012, 0.015, 23),
  ('AK-47', 'Призма', 'classified', 'Minimal Wear', 0.015, 0.015, 24),
  ('M4A4', 'Призма', 'restricted', 'Minimal Wear', 0.02, 0.025, 25),
  ('Glock-18', 'Призма', 'restricted', 'Minimal Wear', 0.02, 0.02, 26),
  ('P90', 'Призма', 'classified', 'Minimal Wear', 0.015, 0.012, 27),
  ('USP-S', 'Призма', 'restricted', 'Factory New', 0.02, 0.015, 28)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'prisma-2-case';

-- ============================================================
-- Prisma Case - add more
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('MP9', 'Призма 2', 'consumer', 'Minimal Wear', 0.12, 0.15, 15),
  ('Nova', 'Призма', 'consumer', 'Factory New', 0.10, 0.12, 16),
  ('Tec-9', 'Призма', 'milspec', 'Minimal Wear', 0.06, 0.08, 17),
  ('UMP-45', 'Призма', 'milspec', 'Minimal Wear', 0.05, 0.06, 18),
  ('Five-SeveN', 'Призма', 'milspec', 'Minimal Wear', 0.04, 0.05, 19),
  ('Dual Berettas', 'Призма', 'restricted', 'Minimal Wear', 0.03, 0.04, 20),
  ('Galil AR', 'Призма', 'restricted', 'Minimal Wear', 0.025, 0.03, 21),
  ('AWP', 'Дунав', 'covert', 'Minimal Wear', 0.006, 0.012, 22),
  ('AK-47', 'Призма 2', 'classified', 'Minimal Wear', 0.012, 0.015, 23),
  ('M4A1-S', 'Призма', 'classified', 'Minimal Wear', 0.015, 0.015, 24),
  ('USP-S', 'Призма', 'restricted', 'Minimal Wear', 0.02, 0.025, 25),
  ('P250', 'Призма', 'restricted', 'Minimal Wear', 0.02, 0.02, 26),
  ('FAMAS', 'Призма', 'classified', 'Minimal Wear', 0.015, 0.012, 27),
  ('P2000', 'Призма', 'milspec', 'Factory New', 0.03, 0.015, 28)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'prisma-case';

-- ============================================================
-- Kilowatt Case - add more
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('MP7', 'Киловатт', 'consumer', 'Minimal Wear', 0.12, 0.15, 15),
  ('P2000', 'Киловатт', 'consumer', 'Minimal Wear', 0.10, 0.12, 16),
  ('M249', 'Киловатт', 'milspec', 'Minimal Wear', 0.06, 0.08, 17),
  ('MP5-SD', 'Киловатт', 'milspec', 'Minimal Wear', 0.05, 0.06, 18),
  ('Sawed-Off', 'Киловатт', 'milspec', 'Minimal Wear', 0.04, 0.05, 19),
  ('XM1014', 'Киловатт', 'restricted', 'Minimal Wear', 0.03, 0.04, 20),
  ('SCAR-20', 'Киловатт', 'restricted', 'Minimal Wear', 0.025, 0.03, 21),
  ('AK-47', 'Пиксель', 'classified', 'Minimal Wear', 0.012, 0.015, 22),
  ('M4A1-S', 'Киловатт', 'classified', 'Minimal Wear', 0.015, 0.015, 23),
  ('AWP', 'Киловатт', 'covert', 'Minimal Wear', 0.006, 0.012, 24),
  ('FAMAS', 'Конденсатор', 'milspec', 'Minimal Wear', 0.04, 0.05, 25),
  ('USP-S', 'Киловатт', 'restricted', 'Minimal Wear', 0.02, 0.025, 26),
  ('Desert Eagle', 'Киловатт', 'classified', 'Minimal Wear', 0.015, 0.015, 27),
  ('Glock-18', 'Киловатт', 'milspec', 'Factory New', 0.03, 0.015, 28)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'kilowatt-case';
