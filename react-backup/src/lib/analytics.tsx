export type AnalyticsEventName =
  | "view_item"
  | "add_to_cart"
  | "remove_from_cart"
  | "begin_checkout"
  | "add_shipping_info"
  | "purchase";

export type AnalyticsEventPayload = {
  order_id?: string;
  value?: number;
  shipping_cost?: number;
  shipping_zone?: string;
  customer_info?: {
    name: string;
    phone: string;
    address: string;
    shipping_zone: string;
    note: string;
  };
  user_data?: {
    phone_number: string;
    address: {
      first_name: string;
      street: string;
      city: string;
      country: string;
    };
  };
  items?: Array<{
    item_id: string;
    item_name: string;
    item_brand?: string;
    item_category?: string;
    item_variant?: string;
    price: number;
    quantity: number;
    [key: string]: any;
  }>;
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: any[];
    google_tag_manager?: any;
    isGtmConfigured?: boolean;
    userIp?: string;
  }
}

// In-memory cache to deduplicate events triggered within a short time window (e.g. React double mounts)
const lastFiredEvents: Record<string, number> = {};

export function trackEvent(name: AnalyticsEventName, payload: AnalyticsEventPayload = {}) {
  if (typeof window === "undefined") {
    return;
  }

  // 1. Deduplication logic: construct a unique stable signature for the event
  let dedupeKey = `${name}`;
  if (name === "purchase" && payload.order_id) {
    dedupeKey = `purchase_${payload.order_id}`;
  } else {
    // Generate unique key based on event name, value and item names (which are stable across hardcoded/DB objects)
    const itemsKey = payload.items ? payload.items.map(i => i.item_name || i.name).join("_") : "";
    dedupeKey = `${name}_${payload.value || 0}_${itemsKey}`;
  }

  const now = Date.now();
  const lastFiredTime = lastFiredEvents[dedupeKey];
  // Page load events (view_item, begin_checkout) get a 5-second window to block slow-database-load double fires.
  // Click-based events get a 1.5-second window.
  const timeLimit = (name === "view_item" || name === "begin_checkout") ? 5000 : 1500;

  if (lastFiredTime && (now - lastFiredTime < timeLimit)) {
    console.warn(`[Analytics] Duplicate event blocked: ${name}`);
    return;
  }

  // Update last fired timestamp
  lastFiredEvents[dedupeKey] = now;

  // Extra persistent check for purchase event to prevent re-fires on page reloads/refreshes
  if (name === "purchase" && payload.order_id) {
    const persistKey = `gtm_purchase_tracked_${payload.order_id}`;
    if (localStorage.getItem(persistKey)) {
      console.warn(`[Analytics] Purchase event already tracked persistently for GTM: ${payload.order_id}`);
      return;
    }
    localStorage.setItem(persistKey, "true");
  }

  // 2. Push event to Google Tag Manager (GTM) dataLayer
  const globalWindow = window as any;
  globalWindow.dataLayer = globalWindow.dataLayer || [];

  const gtmPayload: Record<string, any> = {
    event: name,
    ip_address: globalWindow.userIp || "",
    ecommerce: {
      currency: "BDT",
      value: payload.value,
      items: payload.items || [],
    }
  };

  if (name === "purchase") {
    gtmPayload.customer_info = payload.customer_info;
    gtmPayload.user_data = payload.user_data;
    gtmPayload.ecommerce.transaction_id = payload.order_id;
    gtmPayload.ecommerce.shipping = payload.shipping_cost;
  } else if (name === "add_shipping_info") {
    gtmPayload.ecommerce.shipping_tier = payload.shipping_zone;
  }

  globalWindow.dataLayer.push(gtmPayload);

  // 3. Fallback direct Google Analytics (gtag.js) call (only if GTM is NOT active on the page)
  // Check for GTM script container presence in multiple ways to prevent double pushing via gtag
  const isGtmActive = !!(
    globalWindow.google_tag_manager ||
    globalWindow.isGtmConfigured ||
    (globalWindow.dataLayer && globalWindow.dataLayer.some((e: any) => e && e.event === "gtm.js"))
  );

  if (!isGtmActive && globalWindow.gtag) {
    const gtagPayload: Record<string, any> = {
      currency: "BDT",
      value: payload.value,
      items: payload.items || [],
    };

    if (name === "purchase") {
      gtagPayload.transaction_id = payload.order_id;
      gtagPayload.shipping = payload.shipping_cost;
    } else if (name === "add_shipping_info") {
      gtagPayload.shipping_tier = payload.shipping_zone;
    }

    globalWindow.gtag("event", name, gtagPayload);
  }

  // 4. Meta Pixel (fbq) tracking
  const pixelNameMap: Record<AnalyticsEventName, string> = {
    view_item: "ViewContent",
    add_to_cart: "AddToCart",
    remove_from_cart: "Custom_RemoveFromCart",
    begin_checkout: "InitiateCheckout",
    add_shipping_info: "AddShippingInfo",
    purchase: "Purchase",
  };

  const pixelName = pixelNameMap[name];
  if (pixelName && globalWindow.fbq) {
    const pixelPayload: Record<string, any> = {
      value: payload.value,
      currency: "BDT",
    };

    if (payload.items && payload.items.length > 0) {
      pixelPayload.content_ids = payload.items.map((i: any) => i.item_id);
      pixelPayload.content_type = "product";
      pixelPayload.contents = payload.items.map((i: any) => ({
        id: i.item_id,
        quantity: i.quantity || 1,
        price: i.price,
      }));
    }

    if (name === "purchase" && payload.order_id) {
      pixelPayload.order_id = payload.order_id;
    }

    // Pass user details for advanced matching if available
    if (payload.user_data) {
      const advancedMatching: Record<string, any> = {
        ph: payload.user_data.phone_number?.replace(/\D/g, ""),
        fn: payload.user_data.address?.first_name?.trim().split(/\s+/)[0],
        ct: payload.user_data.address?.city?.toLowerCase(),
        co: "bd",
      };
      globalWindow.fbq("track", pixelName, pixelPayload, advancedMatching);
    } else {
      globalWindow.fbq("track", pixelName, pixelPayload);
    }
  }
}
