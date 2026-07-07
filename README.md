# Fwangsat Nexus

A unified operations platform for **Fwangsat Ventures** — real estate (sales, rentals, inspections,
public listings) and **Swan Water** (inventory, invoicing, receipts) — built as one Next.js app with
three staff roles (Admin, Agent, Sales Rep) and a public marketing website.

---

## 1. Tech stack

| Layer            | Choice                                                              |
|-------------------|----------------------------------------------------------------------|
| Framework         | Next.js 14 (App Router, Server Components + Server Actions-friendly) |
| Language          | TypeScript                                                            |
| Styling           | Tailwind CSS (custom "Nexus" design system — see `tailwind.config.ts`)|
| Backend / DB      | Supabase (Postgres, Auth, Storage, Row Level Security)                |
| Charts            | Recharts                                                              |
| Animation         | Framer Motion                                                         |
| PNG export        | html-to-image (client-side, for invoices & receipts)                  |
| Icons             | lucide-react                                                          |

No separate backend server is needed — Supabase provides Postgres, authentication, file storage and
row-level security policies; Next.js Route Handlers cover the few actions that need a service-role key
(creating staff logins).

---

## 2. Project structure

```
src/
  app/
    page.tsx                 → public homepage
    properties/               → public property listing + detail + inspection booking
    water/                    → public Swan Water product page
    list-property/            → public "list your property" submission + agreement
    book-meeting/              → public meeting booking form
    login/                     → staff sign-in
    admin/                     → Admin dashboard (properties, listings, inspections,
                                 meetings, team, water inventory, invoices, expenses, reports)
    agent/                     → Agent dashboard (tasks, listing verification, add property)
    sales/                     → Sales Rep dashboard (inventory, invoices, receipts)
    api/                       → Route handlers (staff creation, CSV reports)
  components/
    ui/                        → Button/Badge/Modal/StatCard/CountdownRing primitives
    layout/                    → Site + dashboard chrome
    properties/                → Property cards, forms, moderation tables
    water/                     → Inventory manager, invoice builder & template
    forms/                     → Public forms + admin management tables
    charts/                    → Recharts wrapper
  lib/
    supabase/                  → browser/server/middleware/admin Supabase clients
    types.ts, utils.ts, stats.ts, constants.ts, auth.ts
supabase/
  schema.sql                   → full database schema, RLS policies, triggers, storage bucket
```

---

## 3. Setting up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the entire contents of `supabase/schema.sql`. This creates:
   - all tables, enums, views and triggers
   - Row Level Security policies (public can read approved properties & submit
     inspections/meetings/listings; only signed-in staff can manage everything else)
   - the `property-media` Storage bucket (public read, 50MB file limit for videos)
3. Under **Project Settings → API**, copy your `Project URL`, `anon public` key and
   `service_role` key into `.env.local` (see `.env.example`).
4. Create your **first Admin** account:
   - In Supabase Studio → **Authentication → Users → Add user**, create yourself with an email + password.
   - In **Table Editor → profiles**, insert a row: `id` = the new user's UUID, `full_name`, `role = admin`.
   - You can now sign in at `/login` — the admin account creates every other Agent / Sales Rep login
     from **Admin → Team**, so no one else needs Studio access.

---

## 4. Running locally

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase keys
npm run dev
```

Visit `http://localhost:3000` for the public site, and `/login` for staff sign-in.

---

## 5. How each role's workflow maps to the brief

**Public website (no login required)**
- Browse approved properties, filter by sale/rent.
- Book an inspection (name, phone, date, agrees to the inspection fee set on the listing).
- Book a general meeting.
- Submit a property to be listed, with photos/videos (≤50MB each) and the agent-commission agreement.

**Admin**
- Add a property → goes live immediately.
- Approve / reject Agent- or publicly-submitted properties before they appear on the site.
- Mark a property **Rented** (enter the number of months — a live countdown ring starts immediately)
  or **Sold** (removes it from bookable inventory); toggle rented ⇄ vacant any time.
- Assign inspection requests to an Agent; assign public listing submissions to an Agent for
  on-site verification (with the submitter's phone number visible for a direct call).
- Approve/reject a listing once the Agent has verified (or improved) its content.
- Manage Swan Water inventory: add products, restock, set a global or per-product low-stock
  threshold — a popup alert appears the moment any product is at/under that level.
- Log expenses per business unit; the Overview and Reports pages compute revenue, expenses and
  net profit/loss for both Real Estate and Swan Water, plus current stock value.
- Download monthly or annual CSV reports for either business from **Admin → Reports**.
- Create/disable Agent and Sales Rep logins from **Admin → Team**.

**Agent**
- **Tasks**: inspections assigned by the admin — call the visitor, then mark completed with a remark.
- **Listing verification**: submissions assigned by the admin — edit weak photos/description in
  place, then record a verification remark and mark it verified (or flag it as not qualifying).
- **Add property**: agent-submitted listings are sent to the admin for approval before going live.

**Sales Rep (Swan Water)**
- Manage inventory (add products, restock, view stock value).
- Generate an invoice with multiple line items; mark it **sold/paid**, which deducts the sold
  quantities from stock automatically and issues a receipt number.
- Download any invoice or receipt as a `.png` file.
- All paid invoices roll up into the Admin's Swan Water revenue and reports automatically.

---

## 6. Design system

The palette is drawn directly from the Fwangsat Ventures brand marks (the emerald house glyph and
the acid-lime textured banner on the company letterhead): a near-black base (`ink`), an emerald
primary, an acid-lime **signal** accent used for primary actions and the tenancy countdown ring, and
a cyan **water** accent that visually separates the Swan Water module from Real Estate throughout the
dashboards. Typography pairs Space Grotesk (display) with Inter (body) and JetBrains Mono for figures,
invoice numbers and countdowns.

The signature interactive element is the **CountdownRing** (`components/ui/CountdownRing.tsx`) — every
rented property wears a live ring showing the fraction of its lease remaining, tying the platform's
visual identity directly to its core rental-tracking feature.

---

## 7. Things to configure before going live

- **Email/SMS notifications** are not wired up. The schema and UI are ready for a Resend/Twilio hook —
  the natural place is inside the Route Handlers and Supabase Database Webhooks (e.g. on `inspections`
  insert, on `properties` status change).
- **Inspection fees** are collected in person by the agent, matching the brief ("agrees to pay the
  inspection fee") — no payment gateway is wired in. If you want online prepayment, Paystack is a
  natural fit given the rest of Fwangsat's stack.
- **Storage limits**: the `property-media` bucket enforces 50MB per file at the Supabase level in
  addition to the client-side check in `MediaUploader`.
- Update `src/lib/constants.ts` with any change of contact details, and `app_settings` (via the
  Admin → Water page, or SQL) for the default inspection fee / low-stock threshold / agent commission.

---

## 8. Brand assets

`public/logo-icon.png` and `public/logo-full.png` are cropped directly from the supplied Fwangsat
Ventures letterhead. Swap them for vector originals whenever available for crisper rendering at large
sizes.
