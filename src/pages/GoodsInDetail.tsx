
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft,
  Package,
  Truck,
  Calendar,
  ClipboardList,
  Plus,
  Check,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddDeviceToOrder from '@/components/goods-in/AddDeviceToOrder';

interface PurchaseOrder {
  id: string;
  po_number: string;
  order_date: string;
  supplier_id: string;
  supplier: {
    name: string;
    supplier_code: string;
  };
  status: string;
  created_at: string;
}

interface PlannedDevice {
  id: string;
  quantity: number;
  manufacturer: {
    name: string;
  };
  model_name: string;
  storage_gb: number | null;
  color: string | null;
  grade: {
    grade: string;
    description: string | null;
  } | null;
  device_type: string;
}

interface ReceivedDevice {
  id: string;
  cellular_device: {
    id: string;
    imei: string;
    storage_gb: number | null;
    color: string | null;
    grade_id: number | null;
    grade?: {
      grade: string;
      description: string | null;
    };
    tac_id: string;
    tac?: {
      manufacturer: string;
      model_name: string;
    };
  };
}

const GoodsInDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [plannedDevices, setPlannedDevices] = useState<PlannedDevice[]>([]);
  const [receivedDevices, setReceivedDevices] = useState<ReceivedDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPurchaseOrder(id);
      fetchPlannedDevices(id);
      fetchReceivedDevices(id);
    }
  }, [id]);

  const fetchPurchaseOrder = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(`
          id, 
          po_number, 
          order_date, 
          supplier_id, 
          created_at,
          status,
          supplier:suppliers(name, supplier_code)
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setPurchaseOrder(data);
    } catch (error) {
      console.error('Error fetching purchase order:', error);
      toast({
        title: "Error",
        description: "Failed to load purchase order details.",
        variant: "destructive",
      });
    }
  };

  const fetchPlannedDevices = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('purchase_order_devices_planned')
        .select(`
          id,
          quantity,
          manufacturer:manufacturers(name),
          model_name,
          storage_gb,
          color,
          grade:product_grades(grade, description),
          device_type
        `)
        .eq('purchase_order_id', orderId);

      if (error) throw error;
      setPlannedDevices(data || []);
    } catch (error) {
      console.error('Error fetching planned devices:', error);
      toast({
        title: "Error",
        description: "Failed to load planned devices.",
        variant: "destructive",
      });
    }
  };

  const fetchReceivedDevices = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('purchase_order_devices')
        .select(`
          id,
          cellular_device:cellular_devices(
            id,
            imei,
            storage_gb,
            color,
            grade_id,
            grade:product_grades(grade, description),
            tac_id,
            tac:tac_codes(manufacturer, model_name)
          )
        `)
        .eq('purchase_order_id', orderId)
        .not('cellular_device_id', 'is', null);

      if (error) throw error;
      setReceivedDevices(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching received devices:', error);
      toast({
        title: "Error",
        description: "Failed to load received devices.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/goods-in');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading purchase order details...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Button variant="ghost" onClick={handleBack} className="mb-2">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Goods In
        </Button>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {purchaseOrder?.po_number}
            </h1>
            <p className="text-muted-foreground">
              Process incoming inventory for this purchase order
            </p>
          </div>
          
          <Button onClick={() => setIsAddDeviceModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Device
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="rounded-lg border p-4">
          <div className="flex items-start gap-3">
            <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Supplier</p>
              <p className="font-medium">{purchaseOrder?.supplier?.name}</p>
              <p className="text-sm text-muted-foreground">{purchaseOrder?.supplier?.supplier_code}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border p-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Order Date</p>
              <p className="font-medium">
                {purchaseOrder?.order_date 
                  ? format(new Date(purchaseOrder.order_date), 'PPP')
                  : '-'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border p-4">
          <div className="flex items-start gap-3">
            <ClipboardList className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Status</p>
              <div className="mt-1">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  purchaseOrder?.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                  purchaseOrder?.status === 'confirmed' ? 'bg-amber-100 text-amber-800' : 
                  purchaseOrder?.status === 'completed' ? 'bg-green-100 text-green-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {purchaseOrder?.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Created {purchaseOrder?.created_at 
                  ? format(new Date(purchaseOrder.created_at), 'MMM d, yyyy')
                  : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border">
        <Tabs defaultValue="expected">
          <div className="border-b px-3">
            <TabsList className="h-12">
              <TabsTrigger value="expected" className="relative h-full">
                Expected Devices
                {plannedDevices.length > 0 && (
                  <span className="ml-2 rounded-full bg-primary w-5 h-5 text-[10px] font-medium flex items-center justify-center text-primary-foreground">
                    {plannedDevices.reduce((total, device) => total + device.quantity, 0)}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="received" className="relative h-full">
                Received Devices
                {receivedDevices.length > 0 && (
                  <span className="ml-2 rounded-full bg-primary w-5 h-5 text-[10px] font-medium flex items-center justify-center text-primary-foreground">
                    {receivedDevices.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="expected" className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Storage</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Received</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plannedDevices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No devices planned for this order.
                      </TableCell>
                    </TableRow>
                  ) : (
                    plannedDevices.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell>{device.manufacturer?.name || '-'}</TableCell>
                        <TableCell>{device.model_name}</TableCell>
                        <TableCell>{device.storage_gb ? `${device.storage_gb}GB` : '-'}</TableCell>
                        <TableCell>{device.color || '-'}</TableCell>
                        <TableCell>{device.grade?.grade || '-'}</TableCell>
                        <TableCell className="text-center">{device.quantity}</TableCell>
                        <TableCell className="text-right">
                          {/* This would need a count per model, but we'll simplify for now */}
                          <span className="font-medium">
                            {0}/{device.quantity}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="received" className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IMEI</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Storage</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receivedDevices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <AlertTriangle className="h-8 w-8 text-amber-500" />
                          <p>No devices have been received yet.</p>
                          <Button variant="outline" size="sm" onClick={() => setIsAddDeviceModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add First Device
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    receivedDevices.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell className="font-medium">{device.cellular_device?.imei}</TableCell>
                        <TableCell>{device.cellular_device?.tac?.manufacturer || '-'}</TableCell>
                        <TableCell>{device.cellular_device?.tac?.model_name || '-'}</TableCell>
                        <TableCell>
                          {device.cellular_device?.storage_gb ? `${device.cellular_device.storage_gb}GB` : '-'}
                        </TableCell>
                        <TableCell>{device.cellular_device?.color || '-'}</TableCell>
                        <TableCell>{device.cellular_device?.grade?.grade || '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <Check className="mr-2 h-4 w-4" />
                              Verify
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AddDeviceToOrder 
        isOpen={isAddDeviceModalOpen} 
        onClose={() => setIsAddDeviceModalOpen(false)}
        purchaseOrderId={id || ''}
        onDeviceAdded={() => fetchReceivedDevices(id || '')}
      />
    </div>
  );
};

export default GoodsInDetail;
