/*
# Apply click upgrades to manual click rewards

1. Adds a two-argument click RPC with a server-validated click amount.
2. Credits the requested amount to the authenticated user's balance.
3. Keeps the click total for statistics and rejects invalid amounts.
4. Grants execution only to authenticated users.
*/

CREATE OR REPLACE FUNCTION clicker_click(p_user_id uuid, p_amount numeric)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total numeric;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  IF p_amount IS NULL OR p_amount < 1 OR p_amount > 10000 OR p_amount <> trunc(p_amount) THEN
    RAISE EXCEPTION 'Invalid click amount';
  END IF;

  INSERT INTO clicker_state (user_id, click_level, auto_level, coins_earned, unclaimed, last_tick_at)
  VALUES (auth.uid(), 1, 0, p_amount, 0, now())
  ON CONFLICT (user_id) DO UPDATE
  SET coins_earned = clicker_state.coins_earned + p_amount;

  UPDATE profiles
  SET balance = balance + p_amount
  WHERE id = auth.uid();

  SELECT coins_earned INTO v_total
  FROM clicker_state
  WHERE user_id = auth.uid();

  RETURN v_total;
END;
$$;

REVOKE EXECUTE ON FUNCTION clicker_click(uuid, numeric) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION clicker_click(uuid, numeric) TO authenticated;
