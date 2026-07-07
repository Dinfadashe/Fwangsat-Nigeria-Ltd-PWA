// =====================================================================
// Shared domain types — mirrors supabase/schema.sql
// =====================================================================

export type UserRole = "admin" | "agent" | "sales_rep";

export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

export type PropertyPurpose = "sale" | "rent";
export type PropertyStatus = "pending" | "approved" | "rejected";
export type PropertyAvailability = "available" | "rented" | "sold";
export type ListingSource = "agent" | "admin" | "public_user";
export type PublicListingStatus =
  | "submitted"
  | "assigned_for_verification"
  | "needs_edit"
  | "verified"
  | "rejected";

export interface PropertyMedia {
  id: string;
  property_id: string;
  kind: "image" | "video";
  url: string;
  size_bytes: number | null;
  sort_order: number;
}

export interface Property {
  id: string;
  title: string;
  description: string | null;
  purpose: PropertyPurpose;
  price: number;
  inspection_fee: number;
  location: string;
  lat: number | null;
  lng: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  size_sqm: number | null;
  source: ListingSource;
  created_by: string | null;
  status: PropertyStatus;
  availability: PropertyAvailability;
  rent_months: number | null;
  rent_started_at: string | null;
  rent_ends_at: string | null;
  sold_at: string | null;
  agreement_accepted: boolean;
  submitter_name: string | null;
  submitter_phone: string | null;
  submitter_email: string | null;
  public_listing_status: PublicListingStatus | null;
  verification_agent_id: string | null;
  verification_remark: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
  property_media?: PropertyMedia[];
}

export type InspectionStatus = "new" | "assigned" | "completed" | "cancelled";

export interface Inspection {
  id: string;
  property_id: string;
  visitor_name: string;
  visitor_phone: string;
  preferred_date: string;
  fee_amount: number;
  fee_agreed: boolean;
  status: InspectionStatus;
  assigned_agent_id: string | null;
  completion_remark: string | null;
  completed_at: string | null;
  created_at: string;
  properties?: Property;
  profiles?: Profile;
}

export type MeetingStatus = "new" | "contacted" | "closed";

export interface Meeting {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  preferred_date: string;
  preferred_time: string | null;
  topic: string | null;
  status: MeetingStatus;
  note: string | null;
  created_at: string;
}

export type BusinessUnit = "real_estate" | "water";

export interface Expense {
  id: string;
  business: BusinessUnit;
  title: string;
  amount: number;
  note: string | null;
  incurred_on: string;
  created_by: string | null;
  created_at: string;
}

export interface WaterProduct {
  id: string;
  name: string;
  unit_price: number;
  quantity_on_hand: number;
  reorder_level: number | null;
  created_at: string;
  updated_at: string;
}

export type InvoiceStatus = "unpaid" | "paid" | "void";

export interface WaterInvoiceItem {
  id: string;
  invoice_id: string;
  product_id: string | null;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface WaterInvoice {
  id: string;
  invoice_no: string;
  customer_name: string;
  customer_phone: string | null;
  customer_address: string | null;
  status: InvoiceStatus;
  subtotal: number;
  discount: number;
  total: number;
  created_by: string | null;
  paid_at: string | null;
  receipt_no: string | null;
  created_at: string;
  water_invoice_items?: WaterInvoiceItem[];
}

export interface Task {
  id: string;
  kind: "inspection" | "listing_verification";
  reference_id: string;
  assigned_to: string | null;
  title: string;
  detail: string | null;
  is_done: boolean;
  created_at: string;
}

export interface AppSettings {
  default_inspection_fee: number;
  water_low_stock_threshold: number;
  agent_commission_percent: number;
}
