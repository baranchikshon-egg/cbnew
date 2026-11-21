/*
# Fix manual clicker collection ordering

1. Reads the earned amount before resetting it.
2. Transfers the exact amount to the authenticated user's balance.
3. Keeps the manual-only clicker behavior and secure authorization.
*/

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

  SELECT COALESCE(coins_earned, 0) + COALESCE(unclaimed, 0)
  INTO v_amount
  FROM clicker_state
  WHERE user_id = auth.uid()
  FOR UPDATE;

  v_amount := COALESCE(v_amount, 0);

  UPDATE clicker_state
  SET coins_earned = 0,
      unclaimed = 0,
      last_tick_at = now()
  WHERE user_id = auth.uid();

  IF v_amount > 0 THEN
    UPDATE profiles
    SET balance = balance + v_amount
    WHERE id = auth.uid();

    INSERT INTO transactions (user_id, type, amount, method, description)
    VALUES (auth.uid(), 'clicker', v_amount, 'clicker', 'Заработок кликами');
  END IF;

  RETURN v_amount;
END;
$$;

REVOKE EXECUTE ON FUNCTION clicker_collect(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION clicker_collect(uuid) TO authenticated;
