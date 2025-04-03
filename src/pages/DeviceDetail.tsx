import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  CellularDevice, 
  Supplier, 
  ProductGrade 
} from '@/types/inventory';
import { 
  AlertCircle, 
  CheckCircle, 
  Loader2, 
  Save, 
  ArrowLeft,
  Edit,
  XCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const DeviceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [device, setDevice] = useState<CellularDevice | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [grades, setGrades] = useState<ProductGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceStatus, setDeviceStatus] = useState<CellularDevice['status']>('in_stock');
  const [gradeId, setGradeId] = useState<string>('');
  const [supplierId, setSupplierId] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [storageGB, setStorageGB] = useState<string>('');
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      loadDevice(id);
      loadSuppliers();
      loadGrades();
    }
  }, [id]);

  const loadDevice = async (deviceId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cellular_devices')
        .select('*')
        .eq('id', deviceId)
        .single();

      if (error) throw error;
      setDevice(data);
      setDeviceStatus(data.status);
      setGradeId(data.grade_id ? data.grade_id.toString() : '');
      setSupplierId(data.supplier_id || '');
      setColor(data.color || '');
      setStorageGB(data.storage_gb ? data.storage_gb.toString() : '');
    } catch (error: any) {
      console.error('Error loading device:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load device details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('id, name, supplier_code');

      if (error) throw error;
      setSuppliers(data || []);
    } catch (error: any) {
      console.error('Error loading suppliers:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load suppliers",
        variant: "destructive"
      });
    }
  };

  const loadGrades = async () => {
    try {
      const { data, error } = await supabase
        .from('product_grades')
        .select('id, grade');

      if (error) throw error;
      setGrades(data || []);
    } catch (error: any) {
      console.error('Error loading grades:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load grades",
        variant: "destructive"
      });
    }
  };

  const handleUpdateDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!device) return;
    
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('cellular_devices')
        .update({
          status: deviceStatus as "in_stock" | "sold" | "returned" | "repair" | "qc_required" | "quarantine" | "qc_failed",
          grade_id: parseInt(gradeId),
          supplier_id: supplierId,
          color: color || null,
          storage_gb: storageGB ? parseInt(storageGB) : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Device details updated successfully",
        variant: "default"
      });
      setIsEditing(false);
      loadDevice(id);
    } catch (error: any) {
      console.error('Error updating device:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update device details",
        variant: "destructive"
      });
      setError(error.message || 'Failed to update device details');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
        Loading device details...
      </div>
    );
  }

  if (!device) {
    return (
      <div className="flex items-center justify-center h-full">
        <AlertCircle className="w-6 h-6 mr-2 text-red-500" />
        Device not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 animate-fade-in">
      <div className="mb-4">
        <Link to="/products" className="text-blue-500 hover:underline flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Products
        </Link>
      </div>

      <div className="rounded-md border border-border p-4">
        <h1 className="text-2xl font-bold mb-4">
          Device Details
          {!isEditing && (
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="float-right"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleUpdateDevice} className="grid gap-4">
          <div>
            <Label htmlFor="imei">IMEI</Label>
            <Input type="text" id="imei" value={device.imei} readOnly />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={deviceStatus} 
              onValueChange={(value) => setDeviceStatus(value as CellularDevice['status'])}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
                <SelectItem value="repair">Repair</SelectItem>
                <SelectItem value="qc_required">QC Required</SelectItem>
                <SelectItem value="quarantine">Quarantine</SelectItem>
                <SelectItem value="qc_failed">QC Failed</SelectItem>
                <SelectItem value="allocated">Allocated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="grade">Grade</Label>
            <Select 
              value={gradeId} 
              onValueChange={setGradeId}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((grade) => (
                  <SelectItem key={grade.id} value={grade.id.toString()}>
                    {grade.grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="supplier">Supplier</Label>
            <Select 
              value={supplierId} 
              onValueChange={setSupplierId}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="color">Color</Label>
            <Input
              type="text"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div>
            <Label htmlFor="storage_gb">Storage (GB)</Label>
            <Input
              type="number"
              id="storage_gb"
              value={storageGB}
              onChange={(e) => setStorageGB(e.target.value)}
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <div className="flex justify-end gap-2">
              <Button 
                variant="ghost"
                onClick={() => {
                  setIsEditing(false);
                  setDeviceStatus(device.status);
                  setGradeId(device.grade_id ? device.grade_id.toString() : '');
                  setSupplierId(device.supplier_id || '');
                  setColor(device.color || '');
                  setStorageGB(device.storage_gb ? device.storage_gb.toString() : '');
                }}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={updating}>
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Device
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default DeviceDetail;
