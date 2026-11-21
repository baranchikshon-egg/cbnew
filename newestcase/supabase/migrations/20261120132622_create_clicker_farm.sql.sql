/*
# Clicker farm game: per-user clicker state

1. Purpose
- Replace direct balance deposits with a clicker mini-game.
- Each user earns coins by clicking; upgrades increase coins per click and add passive income.

2. New table: `clicker_state`
- `user_id` (uuid, PK, references auth.users, default auth.uid())
- `click_level` (int): upgrade level for coins-per-click, default 1
- `auto_level` (int): upgrade level for passive income, default 0 (no passive income)
- `coins_earned` (numeric): lifetime coins earned from the clicker
- `unclaimed` (numeric): coins accumulated from passive income since last collect
- `last_tick_at` (timestamptz): last passive-income accrual timestamp

3. Passive income accrual
- `clicker_accrue(p_user_id uuid)` SECURITY DEFINER function: computes unclaimed passive
  income from auto_level (auto_level coins per minute) since last_tick_at, stores it in
  unclaimed, updates last_tick_at. Accrual window capped at 8 hours.

4. Collect
- `clicker_collect(p_user_id uuid)`: SECURITY DEFINER, accrues, adds unclaimed to
  profiles.balance, records a transaction, resets unclaimed. Returns collected amount.
  Users never write profiles.balance directly.

5. Security
- RLS enabled; owner-scoped SELECT/INSERT/UPDATE for authenticated users.
- UPDATE is column-restricted (click_level, auto_level, unclaimed, coins_earned).
- Functions revoked from PUBLIC/anon, granted to authenticated + service_role.
*/

CREATE TABLE IF NOT EXISTS clicker_state (
  user_id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  click_level integer NOT NULL DEFAULT 1,
  auto_level integer NOT NULL DEFAULT 0,
  coins_earned numeric(14,2) NOT NULL DEFAULT 0.00,
  unclaimed numeric(14,2) NOT NULL DEFAULT 0.00,
  last_tick_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE clicker_state ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE (click_level, auto_level, unclaimed, coins_earned) ON clicker_state TO authenticated;

DROP POLICY IF EXISTS "select_own_clicker" ON clicker_state;
CREATE POLICY "select_own_clicker" ON clicker_state FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_clicker" ON clicker_state;
CREATE POLICY "insert_own_clicker" ON clicker_state FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_clicker" ON clicker_state;
CREATE POLICY "update_own_clicker" ON clicker_state FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION clicker_accrue(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row clicker_state;
  v_minutes numeric;
  v_income numeric;
BEGIN
  SELECT * INTO v_row FROM clicker_state WHERE user_id = p_user_id FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO clicker_state (user_id) VALUES (p_user_id)
    ON CONFLICT (user_id) DO NOTHING;
    SELECT * INTO v_row FROM clicker_state WHERE user_id = p_user_id FOR UPDATE;
  END IF;

  v_minutes := GREATEST(0, EXTRACT(EPOCH FROM (now() - v_row.last_tick_at)) / 60.0);
  v_minutes := LEAST(v_minutes, 480);
  v_income := v_minutes * v_row.auto_level;

  UPDATE clicker_state
  SET unclaimed = LEAST(unclaimed + v_income, 999999),
      last_tick_at = now()
  WHERE user_id = p_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION clicker_collect(p_user_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_amount numeric;
BEGIN
  PERFORM clicker_accrue(p_user_id);

  UPDATE clicker_state
  SET coins_earned = coins_earned + unclaimed
  WHERE user_id = p_user_id;

  SELECT unclaimed INTO v_amount FROM clicker_state WHERE user_id = p_user_id;

  UPDATE clicker_state SET unclaimed = 0 WHERE user_id = p_user_id;

  IF v_amount > 0 THEN
    UPDATE profiles
    SET balance = balance + v_amount
    WHERE id = p_user_id;

    INSERT INTO transactions (user_id, type, amount, method, description)
    VALUES (p_user_id, 'clicker', v_amount, 'clicker', 'Заработок в кликере');
  END IF;

  RETURN v_amount;
END;
$$;

REVOKE EXECUTE ON FUNCTION clicker_accrue(uuid), clicker_collect(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION clicker_accrue(uuid), clicker_collect(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION clicker_accrue(uuid), clicker_collect(uuid) TO service_role;
