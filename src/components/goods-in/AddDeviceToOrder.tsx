
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddDeviceToOrderProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseOrderId: string;
  onDeviceAdded: () => void;
}

interface Manufacturer {
  id: string;
  name: string;
}

interface ProductGrade {
  id: number;
  grade: string;
  description: string | null;
}

interface ModelData {
  model_name: string;
}

const AddDeviceToOrder: React.FC<AddDeviceToOrderProps> = ({
  isOpen,
  onClose,
  purchaseOrderId,
  onDeviceAdded
}) => {
  const { toast } = useToast();
  const [imei, setImei] = useState('');
  const [modelName, setModelName] = useState<string>('');
  const [storage, setStorage] = useState<string>('');
  const [color, setColor] = useState('');
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('');
  const [models, setModels] = useState<string[]>([]);
  const [grades, setGrades] = useState<ProductGrade[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [tacId, setTacId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [tacLoading, setTacLoading] = useState(false);
  const [tacError, setTacError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchManufacturers();
      fetchGrades();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedManufacturer) {
      fetchModels(selectedManufacturer);
    } else {
      setModels([]);
    }
  }, [selectedManufacturer]);

  const fetchManufacturers = async () => {
    try {
      const { data, error } = await supabase
        .from('manufacturers')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setManufacturers(data || []);
    } catch (error) {
      console.error('Error fetching manufacturers:', error);
      toast({
        title: "Error",
        description: "Failed to load manufacturers.",
        variant: "destructive",
      });
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
      toast({
        title: "Error",
        description: "Failed to load product grades.",
        variant: "destructive",
      });
    }
  };

  const fetchModels = async (manufacturerId: string) => {
    try {
      const { data: manufacturerData, error: manufacturerError } = await supabase
        .from('manufacturers')
        .select('name')
        .eq('id', manufacturerId)
        .single();

      if (manufacturerError) throw manufacturerError;

      const manufacturerName = manufacturerData?.name;

      if (manufacturerName) {
        const { data, error } = await supabase
          .rpc('fn_search_models_by_manufacturer', {
            p_manufacturer: manufacturerName
          });

        if (error) throw error;
        
        // Convert array of model_name strings to array of strings
        setModels(data || []);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      toast({
        title: "Error",
        description: "Failed to load models.",
        variant: "destructive",
      });
    }
  };

  const lookupDeviceInfo = async () => {
    if (!imei || imei.length < 8) {
      setTacError("IMEI must be at least 8 digits");
      return;
    }

    setTacLoading(true);
    setTacError(null);

    try {
      // Extract TAC code (first 8 digits of IMEI)
      const tacCode = imei.substring(0, 8);
      
      const { data, error } = await supabase
        .from('tac_codes')
        .select('*')
        .eq('tac_code', tacCode)
        .single();

      if (error) {
        console.error('TAC lookup error:', error);
        setTacError("No device found with this IMEI prefix");
        return;
      }

      if (data) {
        setTacId(data.id);
        
        // Find and set the manufacturer
        const manufacturer = manufacturers.find(m => m.name.toLowerCase() === data.manufacturer.toLowerCase());
        if (manufacturer) {
          setSelectedManufacturer(manufacturer.id);
        }
        
        setModelName(data.model_name);
      }
    } catch (error) {
      console.error('Error in device lookup:', error);
      setTacError("Failed to retrieve device information");
    } finally {
      setTacLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!imei.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide an IMEI number.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Create a new cellular device
      const { data: deviceData, error: deviceError } = await supabase
        .from('cellular_devices')
        .insert({
          imei: imei.trim(),
          tac_id: tacId || null,
          storage_gb: storage ? parseInt(storage) : null,
          color: color || null,
          grade_id: selectedGrade ? parseInt(selectedGrade) : null,
          status: 'in_stock'
        })
        .select('id')
        .single();

      if (deviceError) throw deviceError;

      // Associate the device with the purchase order
      const { error: poDeviceError } = await supabase
        .from('purchase_order_devices')
        .insert({
          purchase_order_id: purchaseOrderId,
          cellular_device_id: deviceData.id,
          created_by: '00000000-0000-0000-0000-000000000000', // Placeholder UUID for now
          updated_by: '00000000-0000-0000-0000-000000000000'  // Placeholder UUID for now
        });

      if (poDeviceError) throw poDeviceError;

      toast({
        title: "Device Added",
        description: "The device has been successfully added to the order.",
      });

      onDeviceAdded();
      resetForm();
      onClose();
    } catch (error: any) {
      console.error('Error adding device:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add the device. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setImei('');
    setSelectedManufacturer('');
    setModelName('');
    setStorage('');
    setColor('');
    setSelectedGrade('');
    setTacId('');
    setTacError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Device to Order</DialogTitle>
          <DialogDescription>
            Enter the device details to add it to this purchase order.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="imei">IMEI Number</Label>
            <div className="flex space-x-2">
              <Input
                id="imei"
                value={imei}
                onChange={(e) => setImei(e.target.value)}
                placeholder="Enter device IMEI"
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={lookupDeviceInfo}
                disabled={tacLoading || !imei}
              >
                Lookup
              </Button>
            </div>
            {tacError && (
              <p className="text-sm text-red-500">{tacError}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Select value={selectedManufacturer} onValueChange={setSelectedManufacturer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select manufacturer" />
                </SelectTrigger>
                <SelectContent>
                  {manufacturers.map((manufacturer) => (
                    <SelectItem key={manufacturer.id} value={manufacturer.id}>
                      {manufacturer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select value={modelName} onValueChange={setModelName} disabled={models.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storage">Storage (GB)</Label>
              <Input
                id="storage"
                type="number"
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                placeholder="e.g., 64"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g., Black"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">Grade</Label>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((grade) => (
                  <SelectItem key={grade.id} value={grade.id.toString()}>
                    {grade.grade} {grade.description ? `- ${grade.description}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            Add Device
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeviceToOrder;
