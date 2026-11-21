/*
# Fix clicker_collect to transfer both coins_earned and unclaimed to balance

The previous version only transferred `unclaimed` (passive income) to the balance,
but click coins go into `coins_earned` and were never transferred out.
This fix makes `clicker_collect` transfer BOTH coins_earned + unclaimed to the
player's balance, then resets both to 0.
*/

CREATE OR REPLACE FUNCTION clicker_collect(p_user_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_click_amount numeric;
  v_passive_amount numeric;
  v_total numeric;
BEGIN
  PERFORM clicker_accrue(p_user_id);

  SELECT coins_earned, unclaimed INTO v_click_amount, v_passive_amount
  FROM clicker_state WHERE user_id = p_user_id;

  v_total := COALESCE(v_click_amount, 0) + COALESCE(v_passive_amount, 0);

  UPDATE clicker_state
  SET coins_earned = 0,
      unclaimed = 0
  WHERE user_id = p_user_id;

  IF v_total > 0 THEN
    UPDATE profiles
    SET balance = balance + v_total
    WHERE id = p_user_id;

    INSERT INTO transactions (user_id, type, amount, method, description)
    VALUES (p_user_id, 'clicker', v_total, 'clicker', 'Заработок в кликере');
  END IF;

  RETURN v_total;
END;
$$;
