
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
