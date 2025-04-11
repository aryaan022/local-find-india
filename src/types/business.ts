
export type BusinessStatus = 'pending' | 'approved' | 'rejected';

export interface Business {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  category_id?: string;
  status: BusinessStatus;
  description?: string;
  address?: string;
  city: string;
  state: string;
  pincode?: string;
  phone?: string;
  email?: string;
  website?: string;
  opening_hours?: Record<string, any>;
  logo_url?: string;
  cover_url?: string;
  average_rating?: number;
  total_reviews?: number;
  created_at?: string;
  updated_at?: string;
}
