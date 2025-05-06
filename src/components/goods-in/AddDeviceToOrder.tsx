
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

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

interface PlannedDevice {
  id: string;
  manufacturer_id: string;
  manufacturer?: { name: string };
  model_name: string;
  storage_gb: number | null;
  color: string | null;
  grade_id: number | null;
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
  const [validationError, setValidationError] = useState<string | null>(null);
  const [bulkMode, setBulkMode] = useState(true);
  const [applySettingsToAll, setApplySettingsToAll] = useState(true);
  const [plannedDevices, setPlannedDevices] = useState<PlannedDevice[]>([]);
  const [activeTab, setActiveTab] = useState<string>("scan");

  useEffect(() => {
    if (isOpen) {
      fetchManufacturers();
      fetchGrades();
      fetchPlannedDevices();
    }
  }, [isOpen, purchaseOrderId]);

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

  const fetchPlannedDevices = async () => {
    try {
      const { data, error } = await supabase
        .from('purchase_order_devices_planned')
        .select(`
          id,
          manufacturer_id,
          manufacturer:manufacturers(name),
          model_name,
          storage_gb,
          color,
          grade_id
        `)
        .eq('purchase_order_id', purchaseOrderId);

      if (error) throw error;
      setPlannedDevices(data || []);
    } catch (error) {
      console.error('Error fetching planned devices:', error);
      toast({
        title: "Error",
        description: "Failed to load planned devices for this order.",
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
        
        // Extract model_name values from the returned objects and convert to string array
        const modelNames = (data || []).map((item: ModelData) => item.model_name);
        setModels(modelNames);
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
    setValidationError(null);

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
        
        // Validate the device against the planned devices
        const isValidDevice = validateDeviceAgainstPlanned(data.manufacturer, data.model_name);
        if (!isValidDevice) {
          setValidationError("This device does not match any planned devices on this purchase order");
          return;
        }
        
        // Find and set the manufacturer
        const manufacturer = manufacturers.find(m => m.name.toLowerCase() === data.manufacturer.toLowerCase());
        if (manufacturer) {
          setSelectedManufacturer(manufacturer.id);
        }
        
        setModelName(data.model_name);

        // If in bulk mode and device is valid, submit it automatically
        if (bulkMode && applySettingsToAll) {
          await handleSubmit();
          setImei(''); // Clear IMEI for next scan
        }
      }
    } catch (error) {
      console.error('Error in device lookup:', error);
      setTacError("Failed to retrieve device information");
    } finally {
      setTacLoading(false);
    }
  };

  const validateDeviceAgainstPlanned = (manufacturer: string, model: string): boolean => {
    // If there are no planned devices, allow any device (more permissive)
    if (plannedDevices.length === 0) return true;
    
    return plannedDevices.some(device => {
      const manufacturerName = device.manufacturer?.name || '';
      // Case-insensitive comparison
      return manufacturerName.toLowerCase() === manufacturer.toLowerCase() && 
             device.model_name.toLowerCase() === model.toLowerCase();
    });
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

    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
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

      // Associate the device with the purchase order - only include required fields
      const { error: poDeviceError } = await supabase
        .from('purchase_order_devices')
        .insert({
          purchase_order_id: purchaseOrderId,
          cellular_device_id: deviceData.id,
          created_by: '00000000-0000-0000-0000-000000000000', // Placeholder UUID
          updated_by: '00000000-0000-0000-0000-000000000000'  // Placeholder UUID
        });

      if (poDeviceError) throw poDeviceError;

      toast({
        title: "Device Added",
        description: "The device has been successfully added to the order.",
      });

      onDeviceAdded();
      
      if (!bulkMode) {
        resetForm();
        onClose();
      } else {
        // In bulk mode, just clear the IMEI and leave other settings
        setImei('');
        setTacId('');
        setTacError(null);
        setValidationError(null);
        // Focus back on IMEI field for next scan
        document.getElementById('imei')?.focus();
      }
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
    setValidationError(null);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "scan") {
      // When switching to scan tab, focus on IMEI input
      setTimeout(() => {
        document.getElementById('imei')?.focus();
      }, 100);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Device to Order</DialogTitle>
          <DialogDescription>
            {bulkMode 
              ? "Quickly scan multiple devices with the same specifications." 
              : "Enter the device details to add it to this purchase order."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="scan">Scan Devices</TabsTrigger>
            <TabsTrigger value="settings">Device Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scan" className="space-y-4 py-4">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox 
                id="bulkMode" 
                checked={bulkMode} 
                onCheckedChange={(checked) => setBulkMode(checked as boolean)} 
              />
              <label 
                htmlFor="bulkMode" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Bulk scanning mode
              </label>
            </div>
            
            {validationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="imei">IMEI Number</Label>
              <div className="flex space-x-2">
                <Input
                  id="imei"
                  value={imei}
                  onChange={(e) => setImei(e.target.value)}
                  placeholder="Scan or enter device IMEI"
                  className="flex-1"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      lookupDeviceInfo();
                    }
                  }}
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
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4 py-4">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox 
                id="applyToAll" 
                checked={applySettingsToAll} 
                onCheckedChange={(checked) => setApplySettingsToAll(checked as boolean)} 
              />
              <label 
                htmlFor="applyToAll" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Apply these settings to all scanned devices
              </label>
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
          </TabsContent>
        </Tabs>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {bulkMode ? "Done" : "Cancel"}
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !imei.trim()}>
            {bulkMode ? "Add Device & Continue" : "Add Device"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeviceToOrder;
