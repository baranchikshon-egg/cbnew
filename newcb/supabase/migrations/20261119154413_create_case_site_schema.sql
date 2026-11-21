/*
# Case Site Schema (CS:Source style)

## Tables
- profiles: user account linked to auth, with balance and steam info
- cases: loot boxes with price and contents
- case_items: items that can drop from a case, with rarity and chance
- user_items: items won by users (inventory)
- transactions: balance history (deposits, withdrawals, case purchases)
- live_drops: recent wins shown in the live feed
- upgrades: record of upgrade attempts

## Security
- RLS enabled on every table
- profiles: owner can read/update own profile
- cases, case_items, live_drops: public read (anon + authenticated)
- user_items, transactions, upgrades: owner-scoped CRUD
- service_role granted on all for edge functions
*/

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL DEFAULT '',
  avatar_url text DEFAULT '',
  steam_id text DEFAULT '',
  balance numeric(12,2) NOT NULL DEFAULT 0.00,
  total_deposited numeric(12,2) NOT NULL DEFAULT 0.00,
  total_withdrawn numeric(12,2) NOT NULL DEFAULT 0.00,
  cases_opened integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, UPDATE ON profiles TO authenticated;
GRANT SELECT ON profiles TO anon;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "anon_read_profiles" ON profiles;
CREATE POLICY "anon_read_profiles" ON profiles FOR SELECT
  TO anon USING (true);

-- CASES
CREATE TABLE IF NOT EXISTS cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  price numeric(12,2) NOT NULL DEFAULT 0.00,
  image_url text DEFAULT '',
  accent_color text DEFAULT '#f59e0b',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON cases TO anon, authenticated;

DROP POLICY IF EXISTS "read_cases" ON cases;
CREATE POLICY "read_cases" ON cases FOR SELECT
  TO anon, authenticated USING (true);

-- CASE_ITEMS (items inside a case)
CREATE TABLE IF NOT EXISTS case_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  name text NOT NULL,
  weapon text NOT NULL DEFAULT '',
  rarity text NOT NULL DEFAULT 'consumer',
  wear text NOT NULL DEFAULT 'Factory New',
  price numeric(12,2) NOT NULL DEFAULT 0.00,
  image_url text DEFAULT '',
  chance numeric(6,4) NOT NULL DEFAULT 0.0001,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE case_items ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON case_items TO anon, authenticated;

DROP POLICY IF EXISTS "read_case_items" ON case_items;
CREATE POLICY "read_case_items" ON case_items FOR SELECT
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_case_items_case_id ON case_items(case_id);

-- USER_ITEMS (inventory)
CREATE TABLE IF NOT EXISTS user_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  weapon text NOT NULL DEFAULT '',
  rarity text NOT NULL DEFAULT 'consumer',
  wear text NOT NULL DEFAULT 'Factory New',
  price numeric(12,2) NOT NULL DEFAULT 0.00,
  image_url text DEFAULT '',
  source text NOT NULL DEFAULT 'case',
  status text NOT NULL DEFAULT 'inventory',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_items ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON user_items TO authenticated;

DROP POLICY IF EXISTS "select_own_items" ON user_items;
CREATE POLICY "select_own_items" ON user_items FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_items" ON user_items;
CREATE POLICY "insert_own_items" ON user_items FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_items" ON user_items;
CREATE POLICY "update_own_items" ON user_items FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_items" ON user_items;
CREATE POLICY "delete_own_items" ON user_items FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_items_user_id ON user_items(user_id);

-- TRANSACTIONS (balance history)
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  amount numeric(12,2) NOT NULL DEFAULT 0.00,
  status text NOT NULL DEFAULT 'completed',
  method text DEFAULT '',
  description text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON transactions TO authenticated;

DROP POLICY IF EXISTS "select_own_transactions" ON transactions;
CREATE POLICY "select_own_transactions" ON transactions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_transactions" ON transactions;
CREATE POLICY "insert_own_transactions" ON transactions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

-- LIVE_DROPS (public feed of recent wins)
CREATE TABLE IF NOT EXISTS live_drops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  username text NOT NULL DEFAULT 'Player',
  avatar_url text DEFAULT '',
  case_name text NOT NULL DEFAULT '',
  case_id uuid REFERENCES cases(id) ON DELETE SET NULL,
  item_name text NOT NULL,
  item_image text DEFAULT '',
  item_rarity text NOT NULL DEFAULT 'consumer',
  item_price numeric(12,2) NOT NULL DEFAULT 0.00,
  source text NOT NULL DEFAULT 'case',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE live_drops ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON live_drops TO anon, authenticated;

DROP POLICY IF EXISTS "read_live_drops" ON live_drops;
CREATE POLICY "read_live_drops" ON live_drops FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_live_drops" ON live_drops;
CREATE POLICY "insert_live_drops" ON live_drops FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_live_drops_created ON live_drops(created_at DESC);

-- UPGRADES (attempt history)
CREATE TABLE IF NOT EXISTS upgrades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  input_item_name text NOT NULL,
  input_item_price numeric(12,2) NOT NULL DEFAULT 0.00,
  input_item_image text DEFAULT '',
  target_item_name text NOT NULL,
  target_item_price numeric(12,2) NOT NULL DEFAULT 0.00,
  target_item_image text DEFAULT '',
  chance numeric(6,4) NOT NULL DEFAULT 0.0001,
  success boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE upgrades ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON upgrades TO authenticated;

DROP POLICY IF EXISTS "select_own_upgrades" ON upgrades;
CREATE POLICY "select_own_upgrades" ON upgrades FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_upgrades" ON upgrades;
CREATE POLICY "insert_own_upgrades" ON upgrades FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_upgrades_user_id ON upgrades(user_id);

-- service_role for edge functions
GRANT SELECT, INSERT, UPDATE, DELETE ON profiles, cases, case_items, user_items, transactions, live_drops, upgrades TO service_role;
