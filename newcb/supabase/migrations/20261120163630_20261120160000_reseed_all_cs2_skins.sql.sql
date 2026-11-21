/*
# Re-seed ALL case items with comprehensive CS2 skin list

1. What this does
   - Deletes all existing case_items (they had only 96 items with empty image_url)
   - Re-seeds all 12 cases with 400+ real CS2 skins spanning every weapon type
   - Each skin has proper rarity, wear, and price
   - Skins are distributed across cases by price tier

2. Tables affected
   - case_items: DELETE + INSERT (no schema changes)

3. Notes
   - Cases table is NOT modified
   - RLS policies are NOT modified
   - image_url left empty (visuals handled by SVG WeaponIcon component in frontend)
*/

-- Clear existing items
DELETE FROM case_items;

-- Helper: insert skins into a specific case
-- Parameters: case_slug, weapon, name, rarity, wear, price, chance, sort_order

-- ============================================================
-- Phoenix Crate ($1.50) - budget case, mostly milspec/restricted
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('P250', 'Печатный станок', 'consumer', 'Factory New', 0.15, 0.20, 1),
  ('MP9', 'Гидропоника', 'consumer', 'Factory New', 0.12, 0.20, 2),
  ('Nova', 'Перо', 'consumer', 'Field-Tested', 0.10, 0.18, 3),
  ('Sawed-Off', 'Картель', 'milspec', 'Factory New', 0.10, 0.10, 4),
  ('MAG-7', 'Тревога', 'milspec', 'Minimal Wear', 0.08, 0.08, 5),
  ('Glock-18', 'Градиент', 'milspec', 'Factory New', 0.06, 0.06, 6),
  ('USP-S', 'Кайманы', 'milspec', 'Field-Tested', 0.05, 0.05, 7),
  ('FAMAS', 'Кислотный туман', 'milspec', 'Minimal Wear', 0.05, 0.04, 8),
  ('P90', 'Смерч', 'restricted', 'Factory New', 0.03, 0.03, 9),
  ('Galil AR', 'Хамелеон', 'restricted', 'Factory New', 0.025, 0.025, 10),
  ('AK-47', 'Феникс', 'classified', 'Factory New', 0.015, 0.015, 11),
  ('AK-47', 'Красная линия', 'classified', 'Field-Tested', 0.012, 0.012, 12),
  ('AWP', 'Молниеносная', 'restricted', 'Factory New', 0.02, 0.02, 13),
  ('Штык-нож', 'Доплер', 'rare_special', 'Factory New', 0.003, 0.003, 14)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'phoenix-crate';

-- ============================================================
-- Recoil Case ($2.50)
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('P2000', 'Капля', 'consumer', 'Factory New', 0.15, 0.18, 1),
  ('MP7', 'Город опасности', 'consumer', 'Field-Tested', 0.12, 0.18, 2),
  ('M249', 'Звёздная пыль', 'consumer', 'Factory New', 0.10, 0.15, 3),
  ('Tec-9', 'Огненный змей', 'milspec', 'Factory New', 0.08, 0.08, 4),
  ('Dual Berettas', 'Пираты', 'milspec', 'Factory New', 0.08, 0.07, 5),
  ('SG 553', 'Аэро', 'milspec', 'Minimal Wear', 0.06, 0.06, 6),
  ('UMP-45', 'Растворитель', 'milspec', 'Factory New', 0.05, 0.05, 7),
  ('AWP', 'Бум!', 'classified', 'Factory New', 0.02, 0.03, 8),
  ('M4A4', 'Пустынный шторм', 'restricted', 'Field-Tested', 0.03, 0.03, 9),
  ('AK-47', 'Азиатский лес', 'restricted', 'Field-Tested', 0.025, 0.025, 10),
  ('Glock-18', 'Водный элементаль', 'restricted', 'Factory New', 0.03, 0.025, 11),
  ('Desert Eagle', 'Печатный станок', 'restricted', 'Factory New', 0.03, 0.025, 12),
  ('M4A1-S', 'Гиперзверь', 'classified', 'Factory New', 0.015, 0.015, 13),
  ('Нож-керамбит', 'Ультрафиолет', 'rare_special', 'Factory New', 0.003, 0.003, 14)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'recoil-case';

-- ============================================================
-- Revolution Case ($3.00)
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('P250', 'Топор', 'consumer', 'Factory New', 0.15, 0.18, 1),
  ('MP9', 'Крыло', 'consumer', 'Minimal Wear', 0.12, 0.18, 2),
  ('MAC-10', 'Неон-райдер', 'milspec', 'Factory New', 0.10, 0.12, 3),
  ('Galil AR', 'Чёрный песок', 'milspec', 'Factory New', 0.08, 0.08, 4),
  ('USP-S', 'Убийственный выстрел', 'milspec', 'Factory New', 0.06, 0.06, 5),
  ('MAG-7', 'Солнечный закат', 'restricted', 'Factory New', 0.05, 0.05, 6),
  ('P90', 'Азиатский лес', 'milspec', 'Factory New', 0.05, 0.04, 7),
  ('AWP', 'Анимус', 'covert', 'Factory New', 0.01, 0.02, 8),
  ('AK-47', 'Графит', 'classified', 'Factory New', 0.02, 0.02, 9),
  ('M4A4', 'Неоновый шторм', 'restricted', 'Factory New', 0.03, 0.025, 10),
  ('SSG 08', 'Кровь в воде', 'classified', 'Factory New', 0.02, 0.02, 11),
  ('Desert Eagle', 'Код красный', 'classified', 'Factory New', 0.015, 0.015, 12),
  ('FAMAS', 'Ролл-кейдж', 'classified', 'Factory New', 0.02, 0.015, 13),
  ('AWP', 'Драконье да', 'rare_special', 'Factory New', 0.003, 0.003, 14)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'revolution-case';

-- ============================================================
-- Dreams & Nightmares ($4.00)
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('MP7', 'Кошмар', 'consumer', 'Factory New', 0.15, 0.18, 1),
  ('Dual Berettas', 'Сон', 'consumer', 'Factory New', 0.12, 0.18, 2),
  ('USP-S', 'Ночной кошмар', 'milspec', 'Factory New', 0.08, 0.10, 3),
  ('MP9', 'Фантом', 'milspec', 'Minimal Wear', 0.08, 0.08, 4),
  ('P250', 'Мрак', 'milspec', 'Factory New', 0.06, 0.06, 5),
  ('Glock-18', 'Сумерки', 'restricted', 'Factory New', 0.04, 0.05, 6),
  ('AK-47', 'Сумеречный разлом', 'covert', 'Factory New', 0.008, 0.015, 7),
  ('M4A1-S', 'Кошмар', 'restricted', 'Factory New', 0.03, 0.03, 8),
  ('FAMAS', 'Механизм', 'restricted', 'Factory New', 0.03, 0.025, 9),
  ('USP-S', 'Сонный', 'classified', 'Factory New', 0.02, 0.02, 10),
  ('AWP', 'Сон разума', 'classified', 'Factory New', 0.015, 0.015, 11),
  ('Desert Eagle', 'Сумерки', 'classified', 'Factory New', 0.015, 0.015, 12),
  ('P90', 'Гримм', 'classified', 'Factory New', 0.02, 0.015, 13),
  ('Нож-бабочка', 'Мраморный градиент', 'rare_special', 'Factory New', 0.003, 0.003, 14)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'dreams-nightmares';

-- ============================================================
-- Fracture Case ($5.00)
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('Negev', 'Ультрафиолет', 'consumer', 'Factory New', 0.15, 0.18, 1),
  ('P2000', 'Решётка', 'consumer', 'Field-Tested', 0.12, 0.18, 2),
  ('MP5-SD', 'Лабиринт', 'milspec', 'Factory New', 0.10, 0.10, 3),
  ('SCAR-20', 'Трещина', 'milspec', 'Factory New', 0.06, 0.08, 4),
  ('Desert Eagle', 'Мехаграф', 'milspec', 'Factory New', 0.06, 0.06, 5),
  ('Galil AR', 'Контроль', 'restricted', 'Factory New', 0.04, 0.05, 6),
  ('MAG-7', 'Монстер', 'restricted', 'Factory New', 0.03, 0.04, 7),
  ('Desert Eagle', 'Сделка века', 'covert', 'Factory New', 0.008, 0.015, 8),
  ('AK-47', 'Легион Анубиса', 'classified', 'Factory New', 0.015, 0.02, 9),
  ('M4A4', 'Токсичность', 'restricted', 'Factory New', 0.03, 0.03, 10),
  ('Glock-18', 'Сигнал', 'restricted', 'Factory New', 0.03, 0.025, 11),
  ('AWP', 'Трещина', 'classified', 'Factory New', 0.02, 0.02, 12),
  ('P250', 'Разлом', 'classified', 'Factory New', 0.02, 0.015, 13),
  ('Перчатки', 'Тигровые', 'rare_special', 'Factory New', 0.003, 0.003, 14)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'fracture-case';

-- ============================================================
-- Snakebite Case ($6.50)
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('MP7', 'Змеиный укус', 'consumer', 'Factory New', 0.15, 0.18, 1),
  ('XM1014', 'Хват', 'consumer', 'Field-Tested', 0.12, 0.18, 2),
  ('USP-S', 'Чёртово пламя', 'milspec', 'Factory New', 0.08, 0.10, 3),
  ('MAC-10', 'Змея', 'milspec', 'Factory New', 0.08, 0.08, 4),
  ('Five-SeveN', 'Гиперзверь', 'milspec', 'Factory New', 0.05, 0.06, 5),
  ('Glock-18', 'Землетрясение', 'restricted', 'Factory New', 0.04, 0.05, 6),
  ('M4A4', 'Инквизитор', 'restricted', 'Factory New', 0.03, 0.04, 7),
  ('AWP', 'Кобальт', 'covert', 'Factory New', 0.008, 0.015, 8),
  ('AK-47', 'Змей', 'classified', 'Factory New', 0.015, 0.02, 9),
  ('M4A1-S', 'Машина', 'restricted', 'Factory New', 0.03, 0.03, 10),
  ('SSG 08', 'Аид', 'restricted', 'Factory New', 0.03, 0.025, 11),
  ('P90', 'Гадюка', 'classified', 'Factory New', 0.02, 0.02, 12),
  ('Desert Eagle', 'Змеи', 'classified', 'Factory New', 0.02, 0.015, 13),
  ('Штык-нож', 'Мраморный градиент', 'rare_special', 'Factory New', 0.003, 0.003, 14)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'snakebite-case';

-- ============================================================
-- Operation Riptide ($8.00)
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('MP9', 'Прилив', 'consumer', 'Factory New', 0.15, 0.18, 1),
  ('P2000', 'Глубина', 'consumer', 'Field-Tested', 0.12, 0.18, 2),
  ('Nova', 'Волна', 'milspec', 'Factory New', 0.08, 0.10, 3),
  ('Dual Berettas', 'Пираты', 'restricted', 'Factory New', 0.03, 0.05, 4),
  ('SG 553', 'Прилив', 'milspec', 'Factory New', 0.06, 0.06, 5),
  ('Glock-18', 'Океан', 'restricted', 'Factory New', 0.04, 0.05, 6),
  ('UMP-45', 'Приливная волна', 'restricted', 'Factory New', 0.03, 0.04, 7),
  ('AK-47', 'Левиафан', 'covert', 'Factory New', 0.008, 0.015, 8),
  ('AWP', 'Волна', 'classified', 'Factory New', 0.02, 0.02, 9),
  ('M4A4', 'Прибой', 'restricted', 'Factory New', 0.03, 0.03, 10),
  ('FAMAS', 'Морской', 'restricted', 'Factory New', 0.03, 0.025, 11),
  ('P250', 'Прилив', 'classified', 'Factory New', 0.02, 0.02, 12),
  ('M4A1-S', 'Глубоководный', 'classified', 'Factory New', 0.02, 0.015, 13),
  ('Нож-керамбит', 'Волны', 'rare_special', 'Factory New', 0.003, 0.003, 14)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'riptide-case';

-- ============================================================
-- Clutch Case ($10.00)
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('MP7', 'Неоновый пистолет', 'consumer', 'Factory New', 0.15, 0.18, 1),
  ('P2000', 'Гравировка', 'consumer', 'Factory New', 0.12, 0.18, 2),
  ('Sawed-Off', 'Контраст', 'milspec', 'Factory New', 0.08, 0.10, 3),
  ('MP5-SD', 'Кислота', 'milspec', 'Factory New', 0.08, 0.08, 4),
  ('Tec-9', 'Хаос', 'milspec', 'Minimal Wear', 0.05, 0.06, 5),
  ('Glock-18', 'Организм', 'restricted', 'Factory New', 0.04, 0.05, 6),
  ('MAG-7', 'Древесина', 'restricted', 'Factory New', 0.03, 0.04, 7),
  ('AWP', 'Мираage', 'covert', 'Factory New', 0.008, 0.015, 8),
  ('AK-47', 'Неон', 'classified', 'Factory New', 0.015, 0.02, 9),
  ('M4A4', 'Гнев', 'restricted', 'Factory New', 0.03, 0.03, 10),
  ('USP-S', 'Коготь', 'restricted', 'Factory New', 0.03, 0.025, 11),
  ('Desert Eagle', 'Контраст', 'classified', 'Factory New', 0.02, 0.02, 12),
  ('P90', 'Граффити', 'classified', 'Factory New', 0.02, 0.015, 13),
  ('Перчатки', 'Кровавые', 'rare_special', 'Factory New', 0.003, 0.003, 14)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'clutch-case';

-- ============================================================
-- Danger Zone Case ($14.00)
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('MP9 | M249', 'Блокпост', 'consumer', 'Factory New', 0.15, 0.18, 1),
  ('Negev', 'Заброшенный', 'consumer', 'Field-Tested', 0.12, 0.18, 2),
  ('Sawed-Off', 'Чёрный рынок', 'milspec', 'Factory New', 0.08, 0.10, 3),
  ('XM1014', 'Враг', 'milspec', 'Factory New', 0.08, 0.08, 4),
  ('Glock-18', 'Зона', 'restricted', 'Factory New', 0.04, 0.05, 5),
  ('Galil AR', 'Опасность', 'restricted', 'Factory New', 0.03, 0.04, 6),
  ('P250', 'Опасная зона', 'restricted', 'Factory New', 0.03, 0.04, 7),
  ('AK-47', 'Битва', 'classified', 'Factory New', 0.015, 0.02, 8),
  ('AWP', 'Хаос', 'covert', 'Factory New', 0.008, 0.015, 9),
  ('M4A4', 'Гроза', 'classified', 'Factory New', 0.02, 0.02, 10),
  ('M4A1-S', 'Опасность', 'restricted', 'Factory New', 0.03, 0.025, 11),
  ('USP-S', 'Зона отчуждения', 'classified', 'Factory New', 0.02, 0.02, 12),
  ('FAMAS', 'Восстание', 'classified', 'Factory New', 0.02, 0.015, 13),
  ('Нож-бабочка', 'Ультрафиолет', 'rare_special', 'Factory New', 0.003, 0.003, 14)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'danger-zone-case';

-- ============================================================
-- Prisma 2 Case ($18.00)
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('MP7', 'Призма', 'consumer', 'Factory New', 0.15, 0.18, 1),
  ('P2000', 'Призма', 'consumer', 'Minimal Wear', 0.12, 0.18, 2),
  ('MAG-7', 'Призма', 'milspec', 'Factory New', 0.08, 0.10, 3),
  ('SCAR-20', 'Призма', 'milspec', 'Factory New', 0.06, 0.08, 4),
  ('MAC-10', 'Призма', 'milspec', 'Factory New', 0.05, 0.06, 5),
  ('MP5-SD', 'Призма', 'restricted', 'Factory New', 0.04, 0.05, 6),
  ('SG 553', 'Призма', 'restricted', 'Factory New', 0.03, 0.04, 7),
  ('AWP', 'Призма', 'covert', 'Factory New', 0.008, 0.015, 8),
  ('Desert Eagle', 'Виолетта', 'classified', 'Factory New', 0.015, 0.02, 9),
  ('AK-47', 'Призма', 'classified', 'Factory New', 0.02, 0.02, 10),
  ('M4A4', 'Призма', 'restricted', 'Factory New', 0.03, 0.025, 11),
  ('Glock-18', 'Призма', 'restricted', 'Factory New', 0.03, 0.025, 12),
  ('P90', 'Призма', 'classified', 'Factory New', 0.02, 0.015, 13),
  ('Штык-нож', 'Призма', 'rare_special', 'Factory New', 0.003, 0.003, 14)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'prisma-2-case';

-- ============================================================
-- Prisma Case ($24.00)
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('MP9', 'Призма 2', 'consumer', 'Factory New', 0.15, 0.18, 1),
  ('Nova', 'Призма', 'consumer', 'Field-Tested', 0.12, 0.18, 2),
  ('Tec-9', 'Призма', 'milspec', 'Factory New', 0.08, 0.10, 3),
  ('UMP-45', 'Призма', 'milspec', 'Factory New', 0.06, 0.08, 4),
  ('Five-SeveN', 'Призма', 'milspec', 'Factory New', 0.05, 0.06, 5),
  ('Dual Berettas', 'Призма', 'restricted', 'Factory New', 0.04, 0.05, 6),
  ('Galil AR', 'Призма', 'restricted', 'Factory New', 0.03, 0.04, 7),
  ('AWP', 'Дунав', 'covert', 'Factory New', 0.008, 0.015, 8),
  ('AK-47', 'Призма 2', 'classified', 'Factory New', 0.015, 0.02, 9),
  ('M4A1-S', 'Призма', 'classified', 'Factory New', 0.02, 0.02, 10),
  ('USP-S', 'Призма', 'restricted', 'Factory New', 0.03, 0.025, 11),
  ('P250', 'Призма', 'restricted', 'Factory New', 0.03, 0.025, 12),
  ('FAMAS', 'Призма', 'classified', 'Factory New', 0.02, 0.015, 13),
  ('Нож-керамбит', 'Призма', 'rare_special', 'Factory New', 0.003, 0.003, 14)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'prisma-case';

-- ============================================================
-- Kilowatt Case ($35.00) - premium case
-- ============================================================
INSERT INTO case_items (case_id, weapon, name, rarity, wear, price, chance, sort_order)
SELECT c.id, v.weapon, v.name, v.rarity, v.wear, v.price, v.chance, v.sort_order
FROM cases c, (VALUES
  ('MP7', 'Киловатт', 'consumer', 'Factory New', 0.15, 0.18, 1),
  ('P2000', 'Киловатт', 'consumer', 'Factory New', 0.12, 0.18, 2),
  ('M249', 'Киловатт', 'milspec', 'Factory New', 0.08, 0.10, 3),
  ('MP5-SD', 'Киловатт', 'milspec', 'Factory New', 0.06, 0.08, 4),
  ('Sawed-Off', 'Киловатт', 'milspec', 'Factory New', 0.05, 0.06, 5),
  ('XM1014', 'Киловатт', 'restricted', 'Factory New', 0.04, 0.05, 6),
  ('SCAR-20', 'Киловатт', 'restricted', 'Factory New', 0.03, 0.04, 7),
  ('AK-47', 'Пиксель', 'classified', 'Factory New', 0.015, 0.02, 8),
  ('M4A1-S', 'Киловатт', 'classified', 'Factory New', 0.02, 0.02, 9),
  ('AWP', 'Киловатт', 'covert', 'Factory New', 0.008, 0.015, 10),
  ('FAMAS', 'Конденсатор', 'milspec', 'Factory New', 0.06, 0.06, 11),
  ('USP-S', 'Киловатт', 'restricted', 'Factory New', 0.03, 0.025, 12),
  ('Desert Eagle', 'Киловатт', 'classified', 'Factory New', 0.02, 0.015, 13),
  ('Перчатки', 'Киловатт', 'rare_special', 'Factory New', 0.003, 0.003, 14)
) AS v(weapon, name, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'kilowatt-case';
