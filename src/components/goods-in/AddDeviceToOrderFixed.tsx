
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

interface AddDeviceToOrderFixedProps {
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

interface PlannedDevice {
  id: string;
  manufacturer_id: string;
  manufacturer?: { name: string };
  model_name: string;
  storage_gb: number | null;
  color: string | null;
  grade_id: number | null;
}

interface TempScannedDevice {
  imei: string;
  manufacturer: string;
  model: string;
  tacId: string;
  storage?: string;
  color?: string;
  gradeId?: string;
}

const AddDeviceToOrderFixed: React.FC<AddDeviceToOrderFixedProps> = ({
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
  const [scannedDevices, setScannedDevices] = useState<TempScannedDevice[]>([]);

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
        const modelNames = (data || []).map((item: { model_name: string }) => item.model_name);
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
        setTacLoading(false);
        return;
      }

      if (data) {
        setTacId(data.id);
        
        // Validate the device against the planned devices
        const isValidDevice = validateDeviceAgainstPlanned(data.manufacturer, data.model_name);
        if (!isValidDevice) {
          setValidationError("This device does not match any planned devices on this purchase order");
          setTacLoading(false);
          return;
        }
        
        // Find and set the manufacturer
        const manufacturer = manufacturers.find(m => m.name.toLowerCase() === data.manufacturer.toLowerCase());
        if (manufacturer) {
          setSelectedManufacturer(manufacturer.id);
        }
        
        setModelName(data.model_name);

        // Add to scanned devices
        const newDevice: TempScannedDevice = {
          imei: imei,
          manufacturer: data.manufacturer,
          model: data.model_name,
          tacId: data.id,
          storage: storage || null,
          color: color || null,
          gradeId: selectedGrade || null
        };
        
        setScannedDevices(prev => [...prev, newDevice]);
        toast({
          title: "Device Added",
          description: `Added IMEI ${imei} to scan list`,
        });

        // Clear the IMEI input for next scan
        setImei('');
        
        // Focus back on the IMEI input field
        setTimeout(() => {
          document.getElementById('imei')?.focus();
        }, 100);
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

  const handleSubmitAll = async () => {
    if (scannedDevices.length === 0) {
      toast({
        title: "No Devices",
        description: "Please scan at least one device before submitting.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // For each scanned device, add it to the purchase order
      for (const device of scannedDevices) {
        // First, insert into purchase_order_devices table (without cellular_device_id yet)
        const { data: poDeviceData, error: poDeviceError } = await supabase
          .from('purchase_order_devices')
          .insert({
            purchase_order_id: purchaseOrderId,
            // We don't set cellular_device_id yet, it will be null
            created_by: '00000000-0000-0000-0000-000000000000', // Placeholder UUID
            updated_by: '00000000-0000-0000-0000-000000000000'  // Placeholder UUID
          })
          .select('id')
          .single();

        if (poDeviceError) {
          throw poDeviceError;
        }

        // Next, create a new cellular device record
        const { data: deviceData, error: deviceError } = await supabase
          .from('cellular_devices')
          .insert({
            imei: device.imei,
            tac_id: device.tacId,
            storage_gb: device.storage ? parseInt(device.storage) : null,
            color: device.color || null,
            grade_id: device.gradeId ? parseInt(device.gradeId) : null,
            status: 'in_stock'
          })
          .select('id')
          .single();

        if (deviceError) {
          throw deviceError;
        }

        // Now update the purchase_order_devices record with the cellular_device_id
        const { error: updateError } = await supabase
          .from('purchase_order_devices')
          .update({
            cellular_device_id: deviceData.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', poDeviceData.id);

        if (updateError) {
          throw updateError;
        }
      }

      toast({
        title: "Success",
        description: `Added ${scannedDevices.length} devices to the purchase order.`,
      });

      // Check if all planned devices have been fulfilled
      const { data: totalPlanned, error: totalError } = await supabase
        .from('purchase_order_devices_planned')
        .select('id, quantity', { count: 'exact' })
        .eq('purchase_order_id', purchaseOrderId);

      const { count: totalReceived, error: receivedError } = await supabase
        .from('purchase_order_devices')
        .select('id', { count: 'exact' })
        .eq('purchase_order_id', purchaseOrderId)
        .not('cellular_device_id', 'is', null);

      if (!totalError && !receivedError) {
        const totalPlannedCount = totalPlanned.reduce((sum, device) => sum + device.quantity, 0);
        
        // If all devices are received, ask if the user wants to mark the order as completed
        if (totalReceived >= totalPlannedCount) {
          // In a real implementation, you might show a confirmation dialog here
          console.log('All devices received. Order can be completed.');
        }
      }

      onDeviceAdded();
      setScannedDevices([]);
      
      if (!bulkMode) {
        resetForm();
        onClose();
      }
    } catch (error: any) {
      console.error('Error adding devices:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add devices to the order.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeScannedDevice = (index: number) => {
    setScannedDevices(prev => prev.filter((_, i) => i !== index));
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
    setScannedDevices([]);
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
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="scan">Scan Devices</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="queue">
              Queue
              {scannedDevices.length > 0 && (
                <span className="ml-2 rounded-full bg-primary w-5 h-5 text-[10px] font-medium flex items-center justify-center text-primary-foreground">
                  {scannedDevices.length}
                </span>
              )}
            </TabsTrigger>
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
          
          <TabsContent value="queue" className="py-4">
            {scannedDevices.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No devices scanned yet.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => handleTabChange("scan")}
                >
                  Start Scanning
                </Button>
              </div>
            ) : (
              <>
                <div className="max-h-60 overflow-y-auto border rounded-md">
                  <table className="min-w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground">IMEI</th>
                        <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground">Model</th>
                        <th className="py-2 px-3 text-right text-xs font-medium text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scannedDevices.map((device, index) => (
                        <tr key={index} className="border-t">
                          <td className="py-2 px-3 text-sm">{device.imei}</td>
                          <td className="py-2 px-3 text-sm">{device.model}</td>
                          <td className="py-2 px-3 text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeScannedDevice(index)}
                              className="h-8 px-2 text-destructive"
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-right">
                  <Button onClick={handleSubmitAll} disabled={loading}>
                    {loading ? "Processing..." : `Submit ${scannedDevices.length} Devices`}
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          {activeTab !== "queue" && (
            <Button 
              onClick={() => handleTabChange("queue")} 
              disabled={scannedDevices.length === 0}
            >
              Review Queue ({scannedDevices.length})
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeviceToOrderFixed;
