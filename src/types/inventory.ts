
export interface CellularDevice {
  id: string;
  imei: string;
  storage_gb?: number | null;
  color?: string | null;
  status: 'in_stock' | 'sold' | 'returned' | 'repair' | 'qc_required' | 'quarantine' | 'qc_failed';
  grade_id?: number | null;
  supplier_id?: string | null;
  tac_id?: string | null;
}

export interface Supplier {
  id: string;
  name: string;
  supplier_code: string;
}

export interface ProductGrade {
  id: number;
  grade: string;
  description?: string;
}

export interface TacCode {
  id: string;
  tac_code: string;
  manufacturer: string;
  model_name: string;
  model_no?: string;
}

export interface DeviceWithDetails extends CellularDevice {
  supplier_name?: string;
  manufacturer?: string;
  model_name?: string;
  grade?: string;
}

export interface Customer {
  id: string;
  name: string;
  customer_code: string;
  email?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  postcode?: string;
  country?: string;
  vat_number?: string;
}

export interface SalesOrder {
  id: string;
  order_number: string;
  customer: Customer;
  customer_id: string;
  order_date: string;
  status: 'draft' | 'pending' | 'processing' | 'complete' | 'cancelled' | 'confirmed';
  tracking_number?: string;
  shipping_carrier?: string;
  total_boxes?: number;
  total_pallets?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  device_count?: number;
  created_by?: string;
  updated_by?: string;
}
