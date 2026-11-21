/*
# Seed catalog: 12 cases + CS2 skins

1. Purpose
- Fill empty catalog with double the original amount of cases (12 instead of 6).
- Each case gets 7-8 CS2 skins with rarity, wear, price and chance.
- Prices/chances sum to roughly 1.0 per case.

2. Tables
- `cases`: 12 rows inserted with stable slugs, idempotent on slug (no-op if exists).
- `case_items`: skins linked to cases by slug.

3. Security
- No policy changes; tables already have public read policies and grants.
*/

INSERT INTO cases (name, slug, price, image_url, accent_color, is_active, sort_order) VALUES
  ('Phoenix Crate', 'phoenix-crate', 1.50, '', '#e87b1e', true, 1),
  ('Recoil Case', 'recoil-case', 2.50, '', '#4b69ff', true, 2),
  ('Revolution Case', 'revolution-case', 3.00, '', '#8847ff', true, 3),
  ('Dreams & Nightmares', 'dreams-nightmares', 4.00, '', '#eb4b4b', true, 4),
  ('Fracture Case', 'fracture-case', 5.00, '', '#caab05', true, 5),
  ('Snakebite Case', 'snakebite-case', 6.50, '', '#4b9c5a', true, 6),
  ('Operation Riptide', 'riptide-case', 8.00, '', '#2ab7ca', true, 7),
  ('Clutch Case', 'clutch-case', 10.00, '', '#d35400', true, 8),
  ('Danger Zone Case', 'danger-zone-case', 14.00, '', '#c0392b', true, 9),
  ('Prisma 2 Case', 'prisma-2-case', 18.00, '', '#8e44ad', true, 10),
  ('Prisma Case', 'prisma-case', 24.00, '', '#16a085', true, 11),
  ('Kilowatt Case', 'kilowatt-case', 35.00, '', '#f1c40f', true, 12)
ON CONFLICT (slug) DO NOTHING;

-- Phoenix Crate: cheap skins
INSERT INTO case_items (case_id, name, weapon, rarity, wear, price, image_url, chance, sort_order)
SELECT c.id, v.name, v.weapon, v.rarity, v.wear, v.price, '', v.chance, v.sort_order
FROM cases c, (VALUES
  ('Ржавый', 'P250', 'consumer', 'Field-Tested', 0.15, 0.35, 1),
  ('Карбон', 'Glock-18', 'consumer', 'Minimal Wear', 0.30, 0.25, 2),
  ('Песчаный', 'MP9', 'milspec', 'Field-Tested', 0.80, 0.18, 3),
  ('Хищник', 'Nova', 'milspec', 'Well-Worn', 1.20, 0.10, 4),
  ('Легион', 'MAC-10', 'restricted', 'Factory New', 3.50, 0.07, 5),
  ('Анодированная', 'Five-SeveN', 'restricted', 'Minimal Wear', 5.00, 0.035, 6),
  ('Феникс', 'AK-47', 'classified', 'Factory New', 22.00, 0.012, 7),
  ('Молот феникса', 'M4A1-S', 'covert', 'Factory New', 65.00, 0.003, 8)
) AS v(name, weapon, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'phoenix-crate'
AND NOT EXISTS (SELECT 1 FROM case_items ci WHERE ci.case_id = c.id AND ci.name = v.name AND ci.weapon = v.weapon);

-- Recoil Case
INSERT INTO case_items (case_id, name, weapon, rarity, wear, price, image_url, chance, sort_order)
SELECT c.id, v.name, v.weapon, v.rarity, v.wear, v.price, '', v.chance, v.sort_order
FROM cases c, (VALUES
  ('Сойка', 'P2000', 'consumer', 'Factory New', 0.40, 0.35, 1),
  ('Дрога', 'Glock-18', 'consumer', 'Field-Tested', 0.60, 0.25, 2),
  ('Снежный шторм', 'SG 553', 'milspec', 'Factory New', 1.50, 0.18, 3),
  ('Кислотный туман', 'FAMAS', 'milspec', 'Minimal Wear', 2.20, 0.10, 4),
  ('Улар', 'USP-S', 'restricted', 'Factory New', 4.50, 0.07, 5),
  ('Ракета', 'SCAR-20', 'restricted', 'Factory New', 6.00, 0.035, 6),
  ('Бум!', 'AWP', 'classified', 'Factory New', 45.00, 0.012, 7),
  ('Сисье', 'M4A4', 'covert', 'Factory New', 80.00, 0.003, 8)
) AS v(name, weapon, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'recoil-case'
AND NOT EXISTS (SELECT 1 FROM case_items ci WHERE ci.case_id = c.id AND ci.name = v.name AND ci.weapon = v.weapon);

-- Revolution Case
INSERT INTO case_items (case_id, name, weapon, rarity, wear, price, image_url, chance, sort_order)
SELECT c.id, v.name, v.weapon, v.rarity, v.wear, v.price, '', v.chance, v.sort_order
FROM cases c, (VALUES
  ('Оружейник', 'R8 Revolver', 'consumer', 'Factory New', 0.50, 0.35, 1),
  ('Вендетта', 'MP5-SD', 'consumer', 'Minimal Wear', 0.80, 0.25, 2),
  ('Капитан', 'MP7', 'milspec', 'Factory New', 1.80, 0.18, 3),
  ('Стилет', 'P90', 'milspec', 'Factory New', 2.80, 0.10, 4),
  ('Гламур', 'Glock-18', 'restricted', 'Factory New', 5.50, 0.07, 5),
  ('Реквием', 'SSG 08', 'restricted', 'Factory New', 7.50, 0.035, 6),
  ('Фаворит', 'M4A4', 'classified', 'Factory New', 55.00, 0.012, 7),
  ('Анимус', 'AWP', 'covert', 'Factory New', 95.00, 0.003, 8)
) AS v(name, weapon, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'revolution-case'
AND NOT EXISTS (SELECT 1 FROM case_items ci WHERE ci.case_id = c.id AND ci.name = v.name AND ci.weapon = v.weapon);

-- Dreams & Nightmares
INSERT INTO case_items (case_id, name, weapon, rarity, wear, price, image_url, chance, sort_order)
SELECT c.id, v.name, v.weapon, v.rarity, v.wear, v.price, '', v.chance, v.sort_order
FROM cases c, (VALUES
  ('Сон', 'Dual Berettas', 'consumer', 'Factory New', 0.60, 0.35, 1),
  ('Кошмар', 'MP5-SD', 'consumer', 'Field-Tested', 0.90, 0.25, 2),
  ('Джентльмен', 'XM1014', 'milspec', 'Factory New', 2.00, 0.18, 3),
  ('Танцор', 'MAC-10', 'milspec', 'Factory New', 3.00, 0.10, 4),
  ('Ночная граница', 'Glock-18', 'restricted', 'Factory New', 6.50, 0.07, 5),
  ('Мечтатель', 'USP-S', 'restricted', 'Factory New', 8.50, 0.035, 6),
  ('Ночной кошмар', 'MP9', 'classified', 'Factory New', 60.00, 0.012, 7),
  ('Сумеречный разлом', 'AK-47', 'covert', 'Factory New', 120.00, 0.003, 8)
) AS v(name, weapon, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'dreams-nightmares'
AND NOT EXISTS (SELECT 1 FROM case_items ci WHERE ci.case_id = c.id AND ci.name = v.name AND ci.weapon = v.weapon);

-- Fracture Case
INSERT INTO case_items (case_id, name, weapon, rarity, wear, price, image_url, chance, sort_order)
SELECT c.id, v.name, v.weapon, v.rarity, v.wear, v.price, '', v.chance, v.sort_order
FROM cases c, (VALUES
  ('Кельт', 'SSG 08', 'consumer', 'Factory New', 0.70, 0.35, 1),
  ('Легенда', 'P250', 'consumer', 'Minimal Wear', 1.00, 0.25, 2),
  ('Мехаграф', 'Desert Eagle', 'milspec', 'Factory New', 2.50, 0.18, 3),
  ('Саламандра', 'Nova', 'milspec', 'Factory New', 3.50, 0.10, 4),
  ('Дикий ребёнок', 'Galil AR', 'restricted', 'Factory New', 8.00, 0.07, 5),
  ('Точка кипения', 'M249', 'restricted', 'Factory New', 10.00, 0.035, 6),
  ('Кузнец', 'P90', 'classified', 'Factory New', 70.00, 0.012, 7),
  ('Сделка века', 'Desert Eagle', 'covert', 'Factory New', 150.00, 0.003, 8)
) AS v(name, weapon, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'fracture-case'
AND NOT EXISTS (SELECT 1 FROM case_items ci WHERE ci.case_id = c.id AND ci.name = v.name AND ci.weapon = v.weapon);

-- Snakebite Case
INSERT INTO case_items (case_id, name, weapon, rarity, wear, price, image_url, chance, sort_order)
SELECT c.id, v.name, v.weapon, v.rarity, v.wear, v.price, '', v.chance, v.sort_order
FROM cases c, (VALUES
  ('Сливки', 'UMP-45', 'consumer', 'Factory New', 0.90, 0.35, 1),
  ('Гадюка', 'Glock-18', 'consumer', 'Factory New', 1.20, 0.25, 2),
  ('Логово', 'Nova', 'milspec', 'Factory New', 3.00, 0.18, 3),
  ('Тень кобры', 'MAG-7', 'milspec', 'Factory New', 4.20, 0.10, 4),
  ('Пропасть', 'G3SG1', 'restricted', 'Factory New', 9.50, 0.07, 5),
  ('Механоид', 'P250', 'restricted', 'Factory New', 12.00, 0.035, 6),
  ('Змеиный укус', 'MAC-10', 'classified', 'Factory New', 85.00, 0.012, 7),
  ('Кобальт', 'AWP', 'covert', 'Factory New', 180.00, 0.003, 8)
) AS v(name, weapon, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'snakebite-case'
AND NOT EXISTS (SELECT 1 FROM case_items ci WHERE ci.case_id = c.id AND ci.name = v.name AND ci.weapon = v.weapon);

-- Operation Riptide
INSERT INTO case_items (case_id, name, weapon, rarity, wear, price, image_url, chance, sort_order)
SELECT c.id, v.name, v.weapon, v.rarity, v.wear, v.price, '', v.chance, v.sort_order
FROM cases c, (VALUES
  ('Прибой', 'Five-SeveN', 'consumer', 'Factory New', 1.10, 0.35, 1),
  ('Абиссаль', 'P2000', 'consumer', 'Factory New', 1.40, 0.25, 2),
  ('Русалка', 'MP7', 'milspec', 'Factory New', 3.50, 0.18, 3),
  ('Тайфун', 'FAMAS', 'milspec', 'Factory New', 5.00, 0.10, 4),
  ('Пираты', 'Dual Berettas', 'restricted', 'Factory New', 11.00, 0.07, 5),
  ('Чёрный флаг', 'M4A4', 'restricted', 'Minimal Wear', 15.00, 0.035, 6),
  ('Волна', 'AWP', 'classified', 'Factory New', 110.00, 0.012, 7),
  ('Левиафан', 'AK-47', 'covert', 'Factory New', 220.00, 0.003, 8)
) AS v(name, weapon, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'riptide-case'
AND NOT EXISTS (SELECT 1 FROM case_items ci WHERE ci.case_id = c.id AND ci.name = v.name AND ci.weapon = v.weapon);

-- Clutch Case
INSERT INTO case_items (case_id, name, weapon, rarity, wear, price, image_url, chance, sort_order)
SELECT c.id, v.name, v.weapon, v.rarity, v.wear, v.price, '', v.chance, v.sort_order
FROM cases c, (VALUES
  ('Глоу', 'Glock-18', 'consumer', 'Factory New', 1.30, 0.35, 1),
  ('Неон', 'MP9', 'consumer', 'Factory New', 1.70, 0.25, 2),
  ('Асфальт', 'MAG-7', 'milspec', 'Factory New', 4.00, 0.18, 3),
  ('Вентилятор', 'P90', 'milspec', 'Factory New', 6.00, 0.10, 4),
  ('Морпех', 'XM1014', 'restricted', 'Factory New', 13.00, 0.07, 5),
  ('Гибрид', 'M249', 'restricted', 'Factory New', 18.00, 0.035, 6),
  ('Кобальт', 'M4A1-S', 'classified', 'Factory New', 140.00, 0.012, 7),
  ('Мираage', 'AWP', 'covert', 'Factory New', 280.00, 0.003, 8)
) AS v(name, weapon, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'clutch-case'
AND NOT EXISTS (SELECT 1 FROM case_items ci WHERE ci.case_id = c.id AND ci.name = v.name AND ci.weapon = v.weapon);

-- Danger Zone Case
INSERT INTO case_items (case_id, name, weapon, rarity, wear, price, image_url, chance, sort_order)
SELECT c.id, v.name, v.weapon, v.rarity, v.wear, v.price, '', v.chance, v.sort_order
FROM cases c, (VALUES
  ('Свалка', 'Tec-9', 'consumer', 'Factory New', 1.60, 0.35, 1),
  ('Камуфляж', 'MP5-SD', 'consumer', 'Factory New', 2.00, 0.25, 2),
  ('Пепел', 'Nova', 'milspec', 'Factory New', 5.00, 0.18, 3),
  ('Мина', 'UMP-45', 'milspec', 'Factory New', 7.50, 0.10, 4),
  ('Азарт', 'Five-SeveN', 'restricted', 'Factory New', 16.00, 0.07, 5),
  ('Ярость', 'SG 553', 'restricted', 'Factory New', 22.00, 0.035, 6),
  ('Битва', 'AK-47', 'classified', 'Factory New', 170.00, 0.012, 7),
  ('Хаос', 'AWP', 'covert', 'Factory New', 340.00, 0.003, 8)
) AS v(name, weapon, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'danger-zone-case'
AND NOT EXISTS (SELECT 1 FROM case_items ci WHERE ci.case_id = c.id AND ci.name = v.name AND ci.weapon = v.weapon);

-- Prisma 2 Case
INSERT INTO case_items (case_id, name, weapon, rarity, wear, price, image_url, chance, sort_order)
SELECT c.id, v.name, v.weapon, v.rarity, v.wear, v.price, '', v.chance, v.sort_order
FROM cases c, (VALUES
  ('Праздник', 'Negev', 'consumer', 'Factory New', 2.00, 0.35, 1),
  ('Огни', 'Glock-18', 'consumer', 'Factory New', 2.60, 0.25, 2),
  ('Пальцы', 'MAC-10', 'milspec', 'Factory New', 6.00, 0.18, 3),
  ('Клинок', 'Five-SeveN', 'milspec', 'Factory New', 9.00, 0.10, 4),
  ('Беглец', 'Sawed-Off', 'restricted', 'Factory New', 20.00, 0.07, 5),
  ('Волчонок', 'M4A4', 'restricted', 'Factory New', 28.00, 0.035, 6),
  ('Виолетта', 'Desert Eagle', 'classified', 'Factory New', 210.00, 0.012, 7),
  ('Призма', 'AWP', 'covert', 'Factory New', 420.00, 0.003, 8)
) AS v(name, weapon, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'prisma-2-case'
AND NOT EXISTS (SELECT 1 FROM case_items ci WHERE ci.case_id = c.id AND ci.name = v.name AND ci.weapon = v.weapon);

-- Prisma Case
INSERT INTO case_items (case_id, name, weapon, rarity, wear, price, image_url, chance, sort_order)
SELECT c.id, v.name, v.weapon, v.rarity, v.wear, v.price, '', v.chance, v.sort_order
FROM cases c, (VALUES
  ('Плазма', 'XM1014', 'consumer', 'Factory New', 2.40, 0.35, 1),
  ('Аврора', 'P250', 'consumer', 'Factory New', 3.00, 0.25, 2),
  ('Линзы', 'MAC-10', 'milspec', 'Factory New', 7.00, 0.18, 3),
  ('Гиперзверь', 'MAG-7', 'milspec', 'Factory New', 11.00, 0.10, 4),
  ('Акиба', 'Tec-9', 'restricted', 'Factory New', 24.00, 0.07, 5),
  ('Панорама', 'MP5-SD', 'restricted', 'Factory New', 34.00, 0.035, 6),
  ('Мастер', 'M4A1-S', 'classified', 'Factory New', 260.00, 0.012, 7),
  ('Дунав', 'AWP', 'covert', 'Factory New', 520.00, 0.003, 8)
) AS v(name, weapon, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'prisma-case'
AND NOT EXISTS (SELECT 1 FROM case_items ci WHERE ci.case_id = c.id AND ci.name = v.name AND ci.weapon = v.weapon);

-- Kilowatt Case
INSERT INTO case_items (case_id, name, weapon, rarity, wear, price, image_url, chance, sort_order)
SELECT c.id, v.name, v.weapon, v.rarity, v.wear, v.price, '', v.chance, v.sort_order
FROM cases c, (VALUES
  ('Заряд', 'Nova', 'consumer', 'Factory New', 3.00, 0.35, 1),
  ('Искра', 'Glock-18', 'consumer', 'Factory New', 3.80, 0.25, 2),
  ('Вольтаж', 'MP7', 'milspec', 'Factory New', 9.00, 0.18, 3),
  ('Конденсатор', 'FAMAS', 'milspec', 'Factory New', 14.00, 0.10, 4),
  ('Провод', 'Tec-9', 'restricted', 'Factory New', 30.00, 0.07, 5),
  ('Реактор', 'SSG 08', 'restricted', 'Factory New', 45.00, 0.035, 6),
  ('Пиксель', 'AK-47', 'classified', 'Factory New', 350.00, 0.012, 7),
  ('Кайл', 'M4A1-S', 'covert', 'Factory New', 700.00, 0.003, 8)
) AS v(name, weapon, rarity, wear, price, chance, sort_order)
WHERE c.slug = 'kilowatt-case'
AND NOT EXISTS (SELECT 1 FROM case_items ci WHERE ci.case_id = c.id AND ci.name = v.name AND ci.weapon = v.weapon);
