-- =====================================================================
-- FWANGSAT NEXUS — Database Schema
-- Real Estate + Swan Water unified operations platform
-- Run this in the Supabase SQL editor (or via `supabase db push`).
-- =====================================================================

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------------------
create type user_role as enum ('admin', 'agent', 'sales_rep');
create type property_purpose as enum ('sale', 'rent');
create type property_status as enum ('pending', 'approved', 'rejected');
create type property_availability as enum ('available', 'rented', 'sold');
create type media_kind as enum ('image', 'video');
create type inspection_status as enum ('new', 'assigned', 'completed', 'cancelled');
create type meeting_status as enum ('new', 'contacted', 'closed');
create type listing_source as enum ('agent', 'admin', 'public_user');
create type public_listing_status as enum (
  'submitted', 'assigned_for_verification', 'needs_edit', 'verified', 'rejected'
);
create type invoice_status as enum ('unpaid', 'paid', 'void');
create type business_unit as enum ('real_estate', 'water');

-- ---------------------------------------------------------------------
-- PROFILES  (extends auth.users — created for admin/agent/sales_rep only;
-- the public website never requires an account)
-- ---------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  phone text,
  role user_role not null default 'agent',
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- SETTINGS (single-row config editable by admin)
-- ---------------------------------------------------------------------
create table app_settings (
  id boolean primary key default true constraint single_row check (id),
  default_inspection_fee numeric(12, 2) not null default 15000,
  water_low_stock_threshold integer not null default 20,
  agent_commission_percent numeric(5, 2) not null default 5,
  updated_at timestamptz not null default now()
);
insert into app_settings (id) values (true);

-- ---------------------------------------------------------------------
-- PROPERTIES
-- ---------------------------------------------------------------------
create table properties (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  purpose property_purpose not null,               -- sale | rent
  price numeric(14, 2) not null,
  inspection_fee numeric(12, 2) not null,
  location text not null,
  lat double precision,
  lng double precision,
  bedrooms int,
  bathrooms int,
  size_sqm numeric(10, 2),

  source listing_source not null default 'admin',   -- who created it
  created_by uuid references profiles (id),
  status property_status not null default 'pending', -- moderation state
  availability property_availability not null default 'available',

  -- rental lifecycle
  rent_months int,                 -- number of months rented for
  rent_started_at timestamptz,     -- countdown start
  rent_ends_at timestamptz,        -- computed on start (rent_started_at + rent_months)

  sold_at timestamptz,

  -- public-submitted listing agreement
  agreement_accepted boolean not null default false,
  submitter_name text,
  submitter_phone text,
  submitter_email text,
  public_listing_status public_listing_status,
  verification_agent_id uuid references profiles (id),
  verification_remark text,

  view_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table property_media (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references properties (id) on delete cascade,
  kind media_kind not null,
  url text not null,
  size_bytes bigint,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- INSPECTIONS (booked from the public website)
-- ---------------------------------------------------------------------
create table inspections (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references properties (id) on delete cascade,
  visitor_name text not null,
  visitor_phone text not null,
  preferred_date date not null,
  fee_amount numeric(12, 2) not null,
  fee_agreed boolean not null default true,
  status inspection_status not null default 'new',
  assigned_agent_id uuid references profiles (id),
  completion_remark text,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- MEETINGS (booked from the public website — general enquiries)
-- ---------------------------------------------------------------------
create table meetings (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  phone text not null,
  email text,
  preferred_date date not null,
  preferred_time text,
  topic text,
  status meeting_status not null default 'new',
  note text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- EXPENSES (per business unit — feeds profit & loss)
-- ---------------------------------------------------------------------
create table expenses (
  id uuid primary key default uuid_generate_v4(),
  business business_unit not null,
  title text not null,
  amount numeric(14, 2) not null,
  note text,
  incurred_on date not null default current_date,
  created_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- SWAN WATER — INVENTORY
-- ---------------------------------------------------------------------
create table water_products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,               -- e.g. "Swan Table Water 75cl (Carton of 24)"
  unit_price numeric(12, 2) not null,
  quantity_on_hand int not null default 0,
  reorder_level int,                -- overrides global threshold if set
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table stock_movements (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references water_products (id) on delete cascade,
  change int not null,               -- positive = stock in, negative = stock out
  reason text not null,              -- 'restock' | 'sale' | 'adjustment'
  reference_id uuid,                 -- links to invoice id when reason = 'sale'
  created_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- SWAN WATER — INVOICES / RECEIPTS
-- ---------------------------------------------------------------------
create table water_invoices (
  id uuid primary key default uuid_generate_v4(),
  invoice_no text not null unique,     -- e.g. SW-2026-00042
  customer_name text not null,
  customer_phone text,
  customer_address text,
  status invoice_status not null default 'unpaid',
  subtotal numeric(14, 2) not null default 0,
  discount numeric(14, 2) not null default 0,
  total numeric(14, 2) not null default 0,
  created_by uuid references profiles (id),
  paid_at timestamptz,
  receipt_no text unique,
  created_at timestamptz not null default now()
);

create table water_invoice_items (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid not null references water_invoices (id) on delete cascade,
  product_id uuid references water_products (id),
  description text not null,
  quantity int not null,
  unit_price numeric(12, 2) not null,
  line_total numeric(14, 2) not null
);

-- ---------------------------------------------------------------------
-- TASKS (generic assignment feed shown on Agent dashboards)
-- kind: 'inspection' | 'listing_verification'
-- ---------------------------------------------------------------------
create table tasks (
  id uuid primary key default uuid_generate_v4(),
  kind text not null,
  reference_id uuid not null,
  assigned_to uuid references profiles (id),
  title text not null,
  detail text,
  is_done boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- HELPER VIEWS
-- ---------------------------------------------------------------------
create view v_property_public as
  select p.*,
    (select count(*) from property_media m where m.property_id = p.id) as media_count
  from properties p
  where p.status = 'approved';

create view v_low_stock as
  select wp.*, coalesce(wp.reorder_level, s.water_low_stock_threshold) as effective_threshold
  from water_products wp, app_settings s
  where wp.quantity_on_hand <= coalesce(wp.reorder_level, s.water_low_stock_threshold);

-- ---------------------------------------------------------------------
-- FUNCTIONS / TRIGGERS
-- ---------------------------------------------------------------------

-- Auto compute rent_ends_at whenever a property is marked rented
create or replace function fn_set_rent_end()
returns trigger as $$
begin
  if new.availability = 'rented' and new.rent_months is not null then
    new.rent_started_at := coalesce(new.rent_started_at, now());
    new.rent_ends_at := new.rent_started_at + (new.rent_months || ' months')::interval;
  end if;
  if new.availability = 'available' then
    new.rent_started_at := null;
    new.rent_ends_at := null;
    new.rent_months := null;
  end if;
  if new.availability = 'sold' then
    new.sold_at := coalesce(new.sold_at, now());
  end if;
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

create trigger trg_property_rent
before update on properties
for each row execute function fn_set_rent_end();

-- Deduct stock + create movement row whenever an invoice item is inserted
-- (stock is only deducted once invoice is marked paid — handled in application
--  layer via RPC below, to keep this simple & explicit)

create or replace function fn_mark_invoice_paid(p_invoice_id uuid)
returns void as $$
declare
  item record;
begin
  update water_invoices
    set status = 'paid', paid_at = now(),
        receipt_no = 'RCT-' || to_char(now(), 'YYYY') || '-' || substr(p_invoice_id::text, 1, 8)
    where id = p_invoice_id and status <> 'paid';

  for item in select * from water_invoice_items where invoice_id = p_invoice_id loop
    if item.product_id is not null then
      update water_products
        set quantity_on_hand = quantity_on_hand - item.quantity,
            updated_at = now()
        where id = item.product_id;

      insert into stock_movements (product_id, change, reason, reference_id)
      values (item.product_id, -item.quantity, 'sale', p_invoice_id);
    end if;
  end loop;
end;
$$ language plpgsql security definer;

-- ---------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ---------------------------------------------------------------------
alter table profiles enable row level security;
alter table properties enable row level security;
alter table property_media enable row level security;
alter table inspections enable row level security;
alter table meetings enable row level security;
alter table expenses enable row level security;
alter table water_products enable row level security;
alter table stock_movements enable row level security;
alter table water_invoices enable row level security;
alter table water_invoice_items enable row level security;
alter table tasks enable row level security;
alter table app_settings enable row level security;

-- Public (anon) can read approved properties + their media, and insert
-- inspections / meetings / a public listing submission.
create policy "public read approved properties" on properties
  for select using (status = 'approved' or auth.role() = 'authenticated');

create policy "public read media of approved properties" on property_media
  for select using (
    exists (select 1 from properties p where p.id = property_media.property_id
      and (p.status = 'approved' or auth.role() = 'authenticated'))
  );

create policy "public can submit inspection" on inspections
  for insert with check (true);
create policy "staff read inspections" on inspections
  for select using (auth.role() = 'authenticated');
create policy "staff update inspections" on inspections
  for update using (auth.role() = 'authenticated');

create policy "public can submit meeting" on meetings
  for insert with check (true);
create policy "staff read meetings" on meetings
  for select using (auth.role() = 'authenticated');
create policy "staff update meetings" on meetings
  for update using (auth.role() = 'authenticated');

create policy "public can submit listing" on properties
  for insert with check (source = 'public_user' or auth.role() = 'authenticated');
create policy "staff update properties" on properties
  for update using (auth.role() = 'authenticated');
create policy "staff delete properties" on properties
  for delete using (auth.role() = 'authenticated');

create policy "staff manage media" on property_media
  for all using (auth.role() = 'authenticated');
create policy "public can attach media to a submission" on property_media
  for insert with check (true);

create policy "staff only profiles" on profiles
  for all using (auth.role() = 'authenticated');
create policy "staff only expenses" on expenses
  for all using (auth.role() = 'authenticated');
create policy "staff only products" on water_products
  for all using (auth.role() = 'authenticated');
create policy "staff only movements" on stock_movements
  for all using (auth.role() = 'authenticated');
create policy "staff only invoices" on water_invoices
  for all using (auth.role() = 'authenticated');
create policy "staff only invoice items" on water_invoice_items
  for all using (auth.role() = 'authenticated');
create policy "staff only tasks" on tasks
  for all using (auth.role() = 'authenticated');
create policy "staff only settings" on app_settings
  for all using (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------
-- STORAGE BUCKETS  (create via SQL — or Supabase dashboard)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit)
values ('property-media', 'property-media', true, 52428800) -- 50MB
on conflict (id) do nothing;

create policy "public read property media bucket" on storage.objects
  for select using (bucket_id = 'property-media');
create policy "staff upload property media bucket" on storage.objects
  for insert with check (bucket_id = 'property-media' and auth.role() = 'authenticated');
create policy "public upload property media bucket (user listings)" on storage.objects
  for insert with check (bucket_id = 'property-media');
