/*
# Clicker: secure click-power upgrade RPC

## Context
The clicker's "Сила клика" upgrade was previously purchased by writing the
player's `profiles.balance` directly from the browser. That lets any client
set its own balance to any value. This migration moves the purchase into a
SECURITY DEFINER function that recomputes the cost server-side and debits
the balance atomically.

## Changes
1. Drop the obsolete 1-argument `clicker_click(p_user_id uuid)` overload —
   the frontend now uses the 2-argument `clicker_click(p_user_id uuid,
   p_amount numeric)` form. Keeping the unused overload is confusing and
   grants the caller a free +1 balance without a level check.
2. Create `clicker_buy_click_upgrade(p_user_id uuid) RETURNS numeric`:
   - Verifies the caller via `auth.uid()` (never the parameter).
   - Looks up the current `click_level` from `clicker_state`.
   - Recomputes the cost as `round(25 * 1.6^(level-1), 2)` — the same
     formula the UI uses (`CLICK_BASE_COST=25`, `CLICK_GROWTH=1.6`).
   - Raises if the player cannot afford it (checked against the live
     `profiles.balance`, not a client-supplied value).
   - Atomically debits the balance and increments `click_level`.
   - Returns the new balance so the UI can update immediately.
3. Revoke EXECUTE from `anon` and grant it only to `authenticated`.

## Security
- SECURITY DEFINER with `SET search_path = public`.
- Actor derived from `auth.uid()`, not the parameter.
- Cost recomputed server-side; client-supplied values are not trusted.
- Affordability re-checked inside the transaction.
*/

DROP FUNCTION IF EXISTS public.clicker_click(p_user_id uuid);

CREATE OR REPLACE FUNCTION public.clicker_buy_click_upgrade(p_user_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_uid        uuid  := auth.uid();
  v_level      integer;
  v_cost       numeric;
  v_balance    numeric;
  v_new_balance numeric;
BEGIN
  IF v_uid IS NULL OR v_uid <> p_user_id THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT click_level INTO v_level
  FROM clicker_state
  WHERE user_id = v_uid
  FOR UPDATE;

  IF v_level IS NULL THEN
    RAISE EXCEPTION 'Clicker state not found';
  END IF;

  v_cost := round(25 * power(1.6, v_level - 1), 2);

  SELECT balance INTO v_balance
  FROM profiles
  WHERE id = v_uid
  FOR UPDATE;

  IF v_balance IS NULL THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  IF v_balance < v_cost THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  v_new_balance := v_balance - v_cost;

  UPDATE profiles SET balance = v_new_balance WHERE id = v_uid;
  UPDATE clicker_state SET click_level = v_level + 1 WHERE user_id = v_uid;

  RETURN v_new_balance;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.clicker_buy_click_upgrade(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.clicker_buy_click_upgrade(uuid) TO authenticated;
