/*
# Credit balance on every manual click

1. Each authenticated click adds exactly 1 coin to the user's balance.
2. The click total remains in clicker_state for the clicker statistics.
3. No passive income is generated or collected.
4. Authorization is derived from auth.uid() and the function is callable only by authenticated users.
*/

CREATE OR REPLACE FUNCTION clicker_click(p_user_id uuid)
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

  INSERT INTO clicker_state (user_id, click_level, auto_level, coins_earned, unclaimed, last_tick_at)
  VALUES (auth.uid(), 1, 0, 1, 0, now())
  ON CONFLICT (user_id) DO UPDATE
  SET coins_earned = clicker_state.coins_earned + 1;

  UPDATE profiles
  SET balance = balance + 1
  WHERE id = auth.uid();

  SELECT coins_earned INTO v_total
  FROM clicker_state
  WHERE user_id = auth.uid();

  RETURN v_total;
END;
$$;

REVOKE EXECUTE ON FUNCTION clicker_click(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION clicker_click(uuid) TO authenticated;
