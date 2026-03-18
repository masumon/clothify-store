-- One-click cleanup script for Clothify smoke/test orders
-- Run in Supabase SQL Editor as a single query.

begin;

-- Step 1: Snapshot current matches (before delete)
select
  'before_delete' as stage,
  id,
  customer_name,
  phone,
  total_amount,
  bkash_trx_id
from orders
where id = 'def55eca-0ca0-48eb-9f8d-a73fbbda5753'
   or (
        customer_name = 'Smoke Test User'
    and phone = '01712345678'
    and total_amount = 499
   );

-- Step 2: Delete target smoke rows and return what was deleted
with deleted as (
  delete from orders
  where id = 'def55eca-0ca0-48eb-9f8d-a73fbbda5753'
     or (
          customer_name = 'Smoke Test User'
      and phone = '01712345678'
      and total_amount = 499
     )
  returning id, customer_name, phone, total_amount, bkash_trx_id
)
select
  'deleted_rows' as stage,
  id,
  customer_name,
  phone,
  total_amount,
  bkash_trx_id
from deleted
;

-- Step 3: Final verification (should return zero rows)
select
  'after_delete_check' as stage,
  id,
  customer_name,
  phone,
  total_amount,
  bkash_trx_id
from orders
where id = 'def55eca-0ca0-48eb-9f8d-a73fbbda5753'
   or (
        customer_name = 'Smoke Test User'
    and phone = '01712345678'
    and total_amount = 499
   );

commit;
