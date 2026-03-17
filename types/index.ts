export type StoreSettings = {
  id: number;
  store_name: string;
  slogan: string;
  logo_url: string | null;
  address: string | null;
  contact_phone: string | null;
  whatsapp_number: string | null;
  bkash_number: string | null;
  bkash_qr_url: string | null;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  category: string;
  sizes: string[];
  image_url: string;
  is_published?: boolean;
  stock_quantity?: number;
  is_featured?: boolean;
  campaign_badge?: string | null;
  has_video?: boolean;
  video_url?: string | null;
  created_at: string;
};

export type Order = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  delivery_method: string;
  total_amount: number;
  bkash_trx_id: string;
  status: string;
  created_at?: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  selectedSize: string;
  quantity: number;
};
