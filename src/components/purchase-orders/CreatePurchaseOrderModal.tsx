
import React, { useState, useEffect } from 'react';
import { X, Plus, Save, CheckCircle, Trash2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface CreatePurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: () => void;
}

interface Supplier {
  id: string;
  name: string;
  supplier_code: string;
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

interface OrderItem {
  id: string;
  quantity: number;
  manufacturer_id: string;
  model_name: string;
  storage_gb: number | null;
  color: string | null;
  grade_id: number | null;
  device_type: string;
}

const CreatePurchaseOrderModal: React.FC<CreatePurchaseOrderModalProps> = ({
  isOpen,
  onClose,
  onOrderCreated,
}) => {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [grades, setGrades] = useState<ProductGrade[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState<string | null>(null);
  const [selectedManufacturerName, setSelectedManufacturerName] = useState<string>('');
  const [poNumber, setPoNumber] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([{
    id: crypto.randomUUID(),
    quantity: 1,
    manufacturer_id: '',
    model_name: '',
    storage_gb: null,
    color: null,
    grade_id: null,
    device_type: 'cellular'
  }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSuppliers = async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .select('id, name, supplier_code')
        .order('name');

      if (error) {
        console.error('Error fetching suppliers:', error);
        toast({
          title: "Error",
          description: "Failed to load suppliers. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setSuppliers(data || []);
    };

    const fetchManufacturers = async () => {
      const { data, error } = await supabase
        .from('manufacturers')
        .select('id, name')
        .order('name');

      if (error) {
        console.error('Error fetching manufacturers:', error);
        toast({
          title: "Error",
          description: "Failed to load manufacturers. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setManufacturers(data || []);
    };

    const fetchGrades = async () => {
      const { data, error } = await supabase
        .from('product_grades')
        .select('id, grade, description')
        .order('id');

      if (error) {
        console.error('Error fetching grades:', error);
        toast({
          title: "Error",
          description: "Failed to load product grades. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setGrades(data || []);
    };

    if (isOpen) {
      fetchSuppliers();
      fetchManufacturers();
      fetchGrades();
      generatePoNumber();
    }
  }, [isOpen, toast]);

  useEffect(() => {
    const fetchModels = async () => {
      if (!selectedManufacturerName) {
        setModels([]);
        return;
      }

      try {
        // Use p_manufacturer_name instead of p_manufacturer to match the TypeScript type definition
        const { data, error } = await supabase
          .rpc('fn_search_models_by_manufacturer', {
            p_manufacturer_name: selectedManufacturerName
          });

        if (error) {
          throw error;
        }

        // Fix the type mismatch by extracting the model_name string from each object
        if (data && Array.isArray(data)) {
          const modelNames = data.map(item => item.model_name);
          setModels(modelNames);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
        toast({
          title: "Error",
          description: "Failed to load models. Please try again.",
          variant: "destructive",
        });
        setModels([]);
      }
    };

    fetchModels();
  }, [selectedManufacturerName, toast]);

  const generatePoNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 900) + 100;

    setPoNumber(`PO-${year}${month}${day}-${random}`);
  };

  const handleAddItem = () => {
    setOrderItems([...orderItems, {
      id: crypto.randomUUID(),
      quantity: 1,
      manufacturer_id: selectedManufacturer || '',
      model_name: '',
      storage_gb: null,
      color: null,
      grade_id: null,
      device_type: 'cellular'
    }]);
  };

  const handleRemoveItem = (id: string) => {
    if (orderItems.length === 1) {
      setOrderItems([{
        id: crypto.randomUUID(),
        quantity: 1,
        manufacturer_id: '',
        model_name: '',
        storage_gb: null,
        color: null,
        grade_id: null,
        device_type: 'cellular'
      }]);
    } else {
      setOrderItems(orderItems.filter(item => item.id !== id));
    }
  };

  const updateOrderItem = (id: string, field: keyof OrderItem, value: any) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === id) {
        if (field === 'manufacturer_id' && value) {
          const manufacturer = manufacturers.find(m => m.id === value);
          if (manufacturer) {
            setSelectedManufacturerName(manufacturer.name);
          }
        }
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleSave = async (finalize: boolean) => {
    if (!selectedSupplier) {
      toast({
        title: "Error",
        description: "Please select a supplier.",
        variant: "destructive",
      });
      return;
    }

    for (const item of orderItems) {
      if (!item.manufacturer_id || !item.model_name || item.quantity <= 0) {
        toast({
          title: "Error",
          description: "Please fill in all required fields for each item (Quantity, Manufacturer, Model).",
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);

    try {
      const { data: orderData, error: orderError } = await supabase
        .from('purchase_orders')
        .insert({
          po_number: poNumber,
          supplier_id: selectedSupplier,
          status: finalize ? 'processing' : 'draft'
        })
        .select('id')
        .single();

      if (orderError) {
        throw orderError;
      }

      if (!orderData) {
        throw new Error('No data returned from purchase order creation');
      }

      const purchaseOrderId = orderData.id;

      const plannedDevicesData = orderItems.map(item => ({
        purchase_order_id: purchaseOrderId,
        quantity: item.quantity,
        manufacturer_id: item.manufacturer_id,
        model_name: item.model_name,
        storage_gb: item.storage_gb,
        color: item.color,
        grade_id: item.grade_id,
        device_type: item.device_type,
        created_by: 'system',
        updated_by: 'system'
      }));

      const { error: devicesError } = await supabase
        .from('purchase_order_devices_planned')
        .upsert(plannedDevicesData);

      if (devicesError) {
        throw devicesError;
      }

      toast({
        title: "Success",
        description: finalize 
          ? "Purchase order has been created and finalized." 
          : "Purchase order has been saved as draft.",
      });

      onOrderCreated();
      onClose();
    } catch (error: any) {
      console.error('Error creating purchase order:', error);
      toast({
        title: "Error",
        description: `Failed to create purchase order: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
          <DialogDescription>
            Add a new purchase order with the devices you want to order from a supplier.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">PO Number</label>
              <Input 
                value={poNumber} 
                onChange={(e) => setPoNumber(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Supplier</label>
              <Select 
                value={selectedSupplier || ""} 
                onValueChange={setSelectedSupplier}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name} ({supplier.supplier_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedSupplier && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Order Items</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddItem}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Item
                  </Button>
                </div>

                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Manufacturer</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Storage (GB)</TableHead>
                        <TableHead>Color</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity || ""}
                              onChange={(e) => 
                                updateOrderItem(
                                  item.id, 
                                  'quantity', 
                                  parseInt(e.target.value) || 1
                                )
                              }
                              className="w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <Select 
                              value={item.manufacturer_id || ""} 
                              onValueChange={(value) => {
                                updateOrderItem(item.id, 'manufacturer_id', value);
                                setSelectedManufacturer(value);
                                
                                const manufacturer = manufacturers.find(m => m.id === value);
                                if (manufacturer) {
                                  setSelectedManufacturerName(manufacturer.name);
                                }
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {manufacturers.map((manufacturer) => (
                                  <SelectItem key={manufacturer.id} value={manufacturer.id}>
                                    {manufacturer.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select 
                              value={item.model_name || ""} 
                              onValueChange={(value) => 
                                updateOrderItem(item.id, 'model_name', value)
                              }
                              disabled={!item.manufacturer_id}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {models.map((model) => (
                                  <SelectItem key={model} value={model}>
                                    {model}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              max="9999"
                              value={item.storage_gb || ""}
                              onChange={(e) => 
                                updateOrderItem(
                                  item.id, 
                                  'storage_gb', 
                                  e.target.value ? parseInt(e.target.value) : null
                                )
                              }
                              className="w-full"
                              placeholder="Optional"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.color || ""}
                              onChange={(e) => 
                                updateOrderItem(item.id, 'color', e.target.value || null)
                              }
                              className="w-full"
                              placeholder="Optional"
                            />
                          </TableCell>
                          <TableCell>
                            <Select 
                              value={item.grade_id?.toString() || ""} 
                              onValueChange={(value) => 
                                updateOrderItem(
                                  item.id, 
                                  'grade_id', 
                                  value ? parseInt(value) : null
                                )
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Optional" />
                              </SelectTrigger>
                              <SelectContent>
                                {grades.map((grade) => (
                                  <SelectItem key={grade.id} value={grade.id.toString()}>
                                    {grade.grade} {grade.description ? `- ${grade.description}` : ''}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleSave(false)} 
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            Save as Draft
          </Button>
          <Button 
            onClick={() => handleSave(true)} 
            disabled={loading}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Finalize
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePurchaseOrderModal;
