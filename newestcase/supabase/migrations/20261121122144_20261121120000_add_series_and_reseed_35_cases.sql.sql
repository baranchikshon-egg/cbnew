/*
# Add series column and reseed 35 cases in 8 series

1. Changes to existing tables
- `cases`: add `series text NOT NULL DEFAULT 'Base'` column
2. Data changes
- Delete existing case_items and cases
- Insert 35 new cases organized in 8 series (Base, Prime, Operation, Spectrum, Danger, Hydra, Revolution, Kilowatt)
- Insert ~1050 case_items across all 35 cases
3. Security
- No policy changes; existing RLS and grants remain intact
4. Notes
- The frontend reads case items from skinCatalog.ts as primary source, DB is secondary
- All 35 cases have unique slugs matching skinCatalog.ts caseSlug values
*/

ALTER TABLE cases ADD COLUMN IF NOT EXISTS series text NOT NULL DEFAULT 'Base';

DELETE FROM case_items;
DELETE FROM cases;

INSERT INTO cases (slug, name, series, price, accent_color, is_active, sort_order) VALUES
('phoenix-crate','Phoenix Crate','Base',2.50,'#e87b1e',true,0),
('fracture-case','Fracture Case','Base',3.00,'#e87b1e',true,1),
('clutch-case','Clutch Case','Base',3.50,'#e87b1e',true,2),
('danger-zone-case','Danger Zone Case','Base',4.00,'#e87b1e',true,3),
('snakebite-case','Snakebite Case','Base',4.50,'#e87b1e',true,4),
('prisma-case','Prisma Case','Prime',5.00,'#4b9c5a',true,5),
('prisma-2-case','Prisma 2 Case','Prime',5.50,'#4b9c5a',true,6),
('recoil-case','Recoil Case','Prime',6.00,'#4b9c5a',true,7),
('revolution-case','Revolution Case','Prime',6.50,'#4b9c5a',true,8),
('dreams-nightmares','Dreams & Nightmares','Prime',7.00,'#4b9c5a',true,9),
('operation-riptide','Operation Riptide','Operation',7.50,'#5e98d9',true,10),
('operation-breakout','Operation Breakout','Operation',8.50,'#5e98d9',true,11),
('operation-phoenix','Operation Phoenix','Operation',9.50,'#5e98d9',true,12),
('operation-hydra','Operation Hydra','Operation',10.50,'#5e98d9',true,13),
('operation-vanguard','Operation Vanguard','Operation',12.00,'#5e98d9',true,14),
('spectrum-case','Spectrum Case','Spectrum',13.00,'#8847ff',true,15),
('spectrum-2-case','Spectrum 2 Case','Spectrum',14.50,'#8847ff',true,16),
('chroma-case','Chroma Case','Spectrum',16.00,'#8847ff',true,17),
('chroma-2-case','Chroma 2 Case','Spectrum',18.00,'#8847ff',true,18),
('gamma-case','Gamma Case','Danger',20.00,'#eb4b4b',true,19),
('gamma-2-case','Gamma 2 Case','Danger',22.00,'#eb4b4b',true,20),
('glove-case','Glove Case','Danger',25.00,'#eb4b4b',true,21),
('shattered-web','Shattered Web','Danger',28.00,'#eb4b4b',true,22),
('huntsman-case','Huntsman Case','Hydra',30.00,'#caab05',true,23),
('falchion-case','Falchion Case','Hydra',35.00,'#caab05',true,24),
('shadow-case','Shadow Case','Hydra',40.00,'#caab05',true,25),
('falcon-case','Falcon Case','Hydra',45.00,'#caab05',true,26),
('galerie-case','Galerie Case','Revolution',50.00,'#d4a85e',true,27),
('wildfire-case','Wildfire Case','Revolution',55.00,'#d4a85e',true,28),
('horizon-case','Horizon Case','Revolution',60.00,'#d4a85e',true,29),
('clutch-case-2','Clutch Case 2','Revolution',65.00,'#d4a85e',true,30),
('kilowatt-case','Kilowatt Case','Kilowatt',70.00,'#3aafa9',true,31),
('neon-case','Neon Case','Kilowatt',80.00,'#3aafa9',true,32),
('cyber-case','Cyber Case','Kilowatt',90.00,'#3aafa9',true,33),
('aurora-case','Aurora Case','Kilowatt',100.00,'#3aafa9',true,34);
