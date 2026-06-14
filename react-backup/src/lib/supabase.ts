import { createClient } from "@supabase/supabase-js";

// Main Database (Catalog, Products, Categories, Settings, etc.)
const CATALOG_DB_URL = "https://gnrswtpazngfbjdkeckz.supabase.co";
const CATALOG_DB_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImducnN3dHBhem5nZmJqZGtlY2t6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2OTY1MTAsImV4cCI6MjA5NDI3MjUxMH0.NquKPLezjQXZz4nRL61_6erm2wG8wTdgoOKnbItQG4k";

export const supabase = createClient(CATALOG_DB_URL, CATALOG_DB_ANON_KEY);

// Orders Database (Only for placing, querying, updating, and deleting orders)
const ORDERS_DB_URL = "https://drbpysumezfjbudxzxzj.supabase.co";
const ORDERS_DB_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyYnB5c3VtZXpmamJ1ZHh6eHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NzE0MzQsImV4cCI6MjA4ODU0NzQzNH0.Ki7U_uXoTxZ4B9x1ExBuYOnTBZwXS9acMkx7CzlT2sA";

export const supabaseOrders = createClient(ORDERS_DB_URL, ORDERS_DB_ANON_KEY);
