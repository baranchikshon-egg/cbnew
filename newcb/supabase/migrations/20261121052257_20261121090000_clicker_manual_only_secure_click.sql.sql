/*
# Make clicker manual-only and secure balance collection

1. Changes
- Adds `clicker_click(p_user_id)` to increment only the authenticated user's click total.
- Replaces `clicker_collect(p_user_id)` so it collects manual click earnings only.
- Passive income is no longer accrued or transferred.

2. Security
- Both SECURITY DEFINER functions derive authorization from auth.uid().
- Anonymous execution is revoked; authenticated execution is granted.
- The client cannot set the balance directly through these functions.

3. Compatibility
- Existing auto_level data is retained for data safety but is no longer used by the app.
*/

CREATE OR REPLACE FUNCTION clicker_click(p_user_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_amount numeric;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE clicker_state
  SET coins_earned = coins_earned + 1
  WHERE user_id = auth.uid();

  IF NOT FOUND THEN
    INSERT INTO clicker_state (user_id, coins_earned)
    VALUES (auth.uid(), 1)
    ON CONFLICT (user_id) DO UPDATE
    SET coins_earned = clicker_state.coins_earned + 1;
  END IF;

  SELECT coins_earned INTO v_amount
  FROM clicker_state
  WHERE user_id = auth.uid();

  RETURN v_amount;
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
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE clicker_state
  SET coins_earned = 0,
      unclaimed = 0,
      last_tick_at = now()
  WHERE user_id = auth.uid()
  RETURNING coins_earned INTO v_amount;

  SELECT COALESCE(coins_earned, 0) + COALESCE(unclaimed, 0)
  INTO v_amount
  FROM clicker_state
  WHERE user_id = auth.uid();

  UPDATE clicker_state
  SET coins_earned = 0,
      unclaimed = 0,
      last_tick_at = now()
  WHERE user_id = auth.uid();

  IF COALESCE(v_amount, 0) > 0 THEN
    UPDATE profiles
    SET balance = balance + v_amount
    WHERE id = auth.uid();

    INSERT INTO transactions (user_id, type, amount, method, description)
    VALUES (auth.uid(), 'clicker', v_amount, 'clicker', 'Заработок кликами');
  END IF;

  RETURN COALESCE(v_amount, 0);
END;
$$;

REVOKE EXECUTE ON FUNCTION clicker_click(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION clicker_click(uuid) TO authenticated;
REVOKE EXECUTE ON FUNCTION clicker_collect(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION clicker_collect(uuid) TO authenticated;
