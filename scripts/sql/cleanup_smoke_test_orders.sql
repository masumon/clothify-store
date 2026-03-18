-- Cleanup script for smoke-test/demo orders
-- Safe target: only deletes known smoke test order ID and marker fields.
-- Run this in Supabase SQL Editor (project -> SQL Editor -> New query).

begin;

-- 1) Preview what will be deleted
select id, customer_name, phone, total_amount, bkash_trx_id, created_at
from orders
where id = 'def55eca-0ca0-48eb-9f8d-a73fbbda5753'
   or (
        customer_name = 'Smoke Test User'
    and phone = '01712345678'
    and total_amount = 499
   )
order by created_at desc;

-- 2) Delete the matching smoke-test rows
with deleted as (
  delete from orders
  where id = 'def55eca-0ca0-48eb-9f8d-a73fbbda5753'
     or (
          customer_name = 'Smoke Test User'
      and phone = '01712345678'
      and total_amount = 499
     )
  returning id, customer_name, phone, total_amount, bkash_trx_id, created_at
)
select * from deleted order by created_at desc;

-- 3) Verify remaining rows (should return zero rows)
select id, customer_name, phone, total_amount, bkash_trx_id, created_at
from orders
where id = 'def55eca-0ca0-48eb-9f8d-a73fbbda5753'
   or (
        customer_name = 'Smoke Test User'
    and phone = '01712345678'
    and total_amount = 499
   );

commit;
