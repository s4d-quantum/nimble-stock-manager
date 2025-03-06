
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  RefreshCw,
  Clock,
  Smartphone,
  Tag,
  Truck
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { DeviceWithDetails, Supplier, ProductGrade } from '@/types/inventory';
import { useToast } from '@/hooks/use-toast';

const statusOptions = [
  { value: 'in_stock', label: 'In Stock' },
  { value: 'sold', label: 'Sold' },
  { value: 'returned', label: 'Returned' },
  { value: 'repair', label: 'Repair' },
  { value: 'qc_required', label: 'QC Required' },
  { value: 'quarantine', label: 'Quarantine' },
  { value: 'qc_failed', label: 'QC Failed' }
];

const statusColors = {
  'in_stock': 'bg-green-100 text-green-800',
  'sold': 'bg-blue-100 text-blue-800',
  'returned': 'bg-purple-100 text-purple-800',
  'repair': 'bg-yellow-100 text-yellow-800',
  'qc_required': 'bg-red-100 text-red-800',
  'quarantine': 'bg-orange-100 text-orange-800',
  'qc_failed': 'bg-red-500 text-white',
};

interface Transaction {
  id: string;
  transaction_type: string;
  previous_status: string | null;
  new_status: string;
  notes: string | null;
  created_at: string;
  created_by: string;
}

const DeviceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [device, setDevice] = useState<DeviceWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [grades, setGrades] = useState<ProductGrade[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Form state
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [gradeId, setGradeId] = useState<number | null>(null);
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [storageGb, setStorageGb] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all required data
        await Promise.all([
          fetchDevice(),
          fetchSuppliers(),
          fetchGrades(),
          fetchTransactions()
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load device data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const fetchDevice = async () => {
    if (!id) return;
    
    try {
      // Get device data
      const { data: deviceData, error: deviceError } = await supabase
        .from('cellular_devices')
        .select(`
          id, 
          imei, 
          storage_gb, 
          color, 
          status, 
          grade_id, 
          supplier_id, 
          tac_id,
          qc_comments
        `)
        .eq('id', id)
        .single();
      
      if (deviceError) throw deviceError;
      
      // Get TAC code details
      const { data: tacData, error: tacError } = await supabase
        .from('tac_codes')
        .select('manufacturer, model_name, model_no')
        .eq('id', deviceData.tac_id)
        .single();
      
      if (tacError) throw tacError;
      
      // Get supplier name if supplier_id exists
      let supplierName = null;
      if (deviceData.supplier_id) {
        const { data: supplierData, error: supplierError } = await supabase
          .from('suppliers')
          .select('name')
          .eq('id', deviceData.supplier_id)
          .single();
        
        if (!supplierError) {
          supplierName = supplierData.name;
        }
      }
      
      // Get grade if grade_id exists
      let grade = null;
      if (deviceData.grade_id !== null) {
        const { data: gradeData, error: gradeError } = await supabase
          .from('product_grades')
          .select('grade')
          .eq('id', deviceData.grade_id)
          .single();
        
        if (!gradeError) {
          grade = gradeData.grade;
        }
      }
      
      // Combine all data
      const enrichedDevice: DeviceWithDetails = {
        ...deviceData,
        manufacturer: tacData.manufacturer,
        model_name: tacData.model_name,
        supplier_name: supplierName,
        grade: grade
      };
      
      setDevice(enrichedDevice);
      
      // Set form state
      setStatus(enrichedDevice.status);
      setGradeId(enrichedDevice.grade_id);
      setSupplierId(enrichedDevice.supplier_id);
      setColor(enrichedDevice.color);
      setStorageGb(enrichedDevice.storage_gb);
      
    } catch (error) {
      console.error('Error fetching device:', error);
      toast({
        title: 'Error',
        description: 'Failed to load device data',
        variant: 'destructive',
      });
    }
  };
  
  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('id, name, supplier_code')
        .order('name');
      
      if (error) throw error;
      setSuppliers(data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };
  
  const fetchGrades = async () => {
    try {
      const { data, error } = await supabase
        .from('product_grades')
        .select('id, grade, description')
        .order('id');
      
      if (error) throw error;
      setGrades(data || []);
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };
  
  const fetchTransactions = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('cellular_device_transactions')
        .select(`
          id,
          transaction_type,
          previous_status,
          new_status,
          notes,
          created_at,
          created_by
        `)
        .eq('device_id', id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };
  
  const handleSave = async () => {
    if (!id || !device) return;
    
    setSaving(true);
    try {
      const updates = {
        status,
        grade_id: gradeId,
        supplier_id: supplierId,
        color,
        storage_gb: storageGb,
        updated_at: new Date(),
      };
      
      const { error } = await supabase
        .from('cellular_devices')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Device updated successfully',
      });
      
      // Refresh device data
      await fetchDevice();
      await fetchTransactions();
      
    } catch (error) {
      console.error('Error updating device:', error);
      toast({
        title: 'Error',
        description: 'Failed to update device',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };
  
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const formatTransactionType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading device details...</p>
      </div>
    );
  }
  
  if (!device) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <p className="text-muted-foreground">Device not found</p>
        <button 
          onClick={() => navigate('/products')}
          className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Inventory
        </button>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/products')}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Device Details</h1>
          <p className="text-muted-foreground">IMEI: {device.imei}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="rounded-lg border border-border bg-card">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Device Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    IMEI
                  </label>
                  <div className="px-3 py-2 rounded-md border border-input bg-muted/20 text-sm">
                    {device.imei}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Manufacturer
                  </label>
                  <div className="px-3 py-2 rounded-md border border-input bg-muted/20 text-sm">
                    {device.manufacturer || 'Unknown'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Model
                  </label>
                  <div className="px-3 py-2 rounded-md border border-input bg-muted/20 text-sm">
                    {device.model_name || 'Unknown'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Storage (GB)
                  </label>
                  <input
                    type="number"
                    value={storageGb || ''}
                    onChange={(e) => setStorageGb(e.target.value ? Number(e.target.value) : null)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Color
                  </label>
                  <input
                    type="text"
                    value={color || ''}
                    onChange={(e) => setColor(e.target.value || null)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Grade
                  </label>
                  <select
                    value={gradeId || ''}
                    onChange={(e) => setGradeId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Not graded</option>
                    {grades.map(grade => (
                      <option key={grade.id} value={grade.id}>
                        {grade.grade} - {grade.description || ''}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Supplier
                  </label>
                  <select
                    value={supplierId || ''}
                    onChange={(e) => setSupplierId(e.target.value || null)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">No supplier</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name} ({supplier.supplier_code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add engineering notes here..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px]"
                />
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="rounded-lg border border-border bg-card">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Device Status</h2>
              
              <div className="space-y-4">
                <div className="rounded-md p-3 bg-muted/30">
                  <h3 className="text-sm font-medium mb-2">Current Status</h3>
                  <div className="flex items-center">
                    <span 
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[device.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}
                    >
                      {device.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                </div>
                
                <div className="rounded-md p-3 bg-muted/30">
                  <h3 className="text-sm font-medium mb-2">Associated Information</h3>
                  <ul className="space-y-2">
                    {device.supplier_name && (
                      <li className="flex items-center text-sm">
                        <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Supplier: {device.supplier_name}</span>
                      </li>
                    )}
                    {device.grade && (
                      <li className="flex items-center text-sm">
                        <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Grade: {device.grade}</span>
                      </li>
                    )}
                    <li className="flex items-center text-sm">
                      <Smartphone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{device.manufacturer} {device.model_name}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="rounded-lg border border-border bg-card">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
            
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No transaction history found</p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute top-0 bottom-0 left-6 w-px bg-muted/70" />
                <ul className="space-y-4">
                  {transactions.map((transaction) => (
                    <li key={transaction.id} className="relative pl-12">
                      <div className="absolute left-[22px] top-1 h-2 w-2 rounded-full bg-primary" />
                      <div className="rounded-lg border border-border p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex rounded-full px-2 py-1 text-xs font-medium bg-muted/50">
                              {formatTransactionType(transaction.transaction_type)}
                            </span>
                            
                            {transaction.previous_status && transaction.new_status && (
                              <span className="text-sm">
                                Status changed from{' '}
                                <span className="font-medium">
                                  {transaction.previous_status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>{' '}
                                to{' '}
                                <span className="font-medium">
                                  {transaction.new_status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDateTime(transaction.created_at)}
                          </div>
                        </div>
                        
                        {transaction.notes && (
                          <p className="text-sm bg-muted/30 p-2 rounded">
                            {transaction.notes}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetail;
