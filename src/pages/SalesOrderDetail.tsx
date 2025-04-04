import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SalesOrder } from '@/types/inventory';
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  User, 
  Truck, 
  Plus,
  FileText,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';
import AddDeviceModal from '@/components/orders/AddDeviceModal';

// Status color mapping
const statusColors = {
  'draft': 'bg-gray-100 text-gray-800',
  'pending': 'bg-yellow-100 text-yellow-800',
  'processing': 'bg-blue-100 text-blue-800',
  'complete': 'bg-green-100 text-green-800',
  'cancelled': 'bg-red-100 text-red-800',
  'confirmed': 'bg-purple-100 text-purple-800',
};

interface DeviceWithDetails {
  id: string;
  imei?: string;
  serial_number?: string;
  manufacturer?: string;
  model_name?: string;
  color?: string;
  storage_gb?: number;
  grade?: string;
  supplier_name?: string;
}

const SalesOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<SalesOrder | null>(null);
  const [devices, setDevices] = useState<DeviceWithDetails[]>([]);
  const [deviceCount, setDeviceCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const itemsPerPage = 10;
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      loadOrderDetails();
      loadOrderDevices(1);
    }
  }, [id]);

  const loadOrderDetails = async () => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('sales_orders')
        .select(`
          *,
          customer:customers(
            id,
            name,
            customer_code,
            email,
            phone,
            address_line1,
            address_line2,
            city,
            postcode,
            country
          )
        `)
        .eq('id', id)
        .single();

      if (orderError) throw orderError;
      
      if (orderData) {
        setOrder(orderData as SalesOrder);
        setNotes(orderData.notes || '');
      }
      
      const { count, error: countError } = await supabase
        .from('sales_order_devices')
        .select('*', { count: 'exact', head: true })
        .eq('sales_order_id', id);
        
      if (countError) throw countError;
      
      if (count !== null) {
        setDeviceCount(count);
      }
    } catch (error) {
      console.error('Error loading order details:', error);
      toast({
        title: "Error",
        description: "Failed to load sales order details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadOrderDevices = async (page: number = 1) => {
    try {
      const { count, error: countError } = await supabase
        .from('sales_order_devices')
        .select('*', { count: 'exact', head: true })
        .eq('sales_order_id', id);
      
      if (countError) throw countError;
      
      if (count !== null) {
        setTotalPages(Math.ceil(count / itemsPerPage));
        setDeviceCount(count);
      }
      
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      const { data: orderDevicesData, error: devicesError } = await supabase
        .from('sales_order_devices')
        .select(`
          id,
          cellular_device_id,
          serial_device_id
        `)
        .eq('sales_order_id', id)
        .range(from, to);
      
      if (devicesError) throw devicesError;

      if (orderDevicesData && orderDevicesData.length > 0) {
        const deviceDetails: DeviceWithDetails[] = await Promise.all(
          orderDevicesData.map(async (orderDevice) => {
            if (orderDevice.cellular_device_id) {
              const { data: cellularData, error: cellularError } = await supabase
                .from('cellular_devices')
                .select(`
                  id,
                  imei,
                  color,
                  storage_gb,
                  grade_id,
                  supplier_id,
                  tac_id
                `)
                .eq('id', orderDevice.cellular_device_id)
                .single();
                
              if (cellularError) {
                console.error('Error fetching cellular device:', cellularError);
                return { id: orderDevice.id, imei: 'Error loading device' };
              }
              
              let manufacturer = '';
              let model_name = '';
              let grade = '';
              let supplier_name = '';

              if (cellularData.tac_id) {
                const { data: tacData } = await supabase
                  .from('tac_codes')
                  .select('manufacturer, model_name')
                  .eq('id', cellularData.tac_id)
                  .single();
                  
                if (tacData) {
                  manufacturer = tacData.manufacturer;
                  model_name = tacData.model_name;
                }
              }

              if (cellularData.grade_id) {
                const { data: gradeData } = await supabase
                  .from('product_grades')
                  .select('grade')
                  .eq('id', cellularData.grade_id)
                  .single();
                  
                if (gradeData) {
                  grade = gradeData.grade;
                }
              }

              if (cellularData.supplier_id) {
                const { data: supplierData } = await supabase
                  .from('suppliers')
                  .select('name')
                  .eq('id', cellularData.supplier_id)
                  .single();
                  
                if (supplierData) {
                  supplier_name = supplierData.name;
                }
              }

              return {
                id: orderDevice.id,
                imei: cellularData.imei,
                manufacturer,
                model_name,
                color: cellularData.color || '',
                storage_gb: cellularData.storage_gb,
                grade,
                supplier_name
              };
            } 
            else if (orderDevice.serial_device_id) {
              const { data: serialData, error: serialError } = await supabase
                .from('serial_devices')
                .select(`
                  id,
                  serial_number,
                  manufacturer_id,
                  model_name,
                  color,
                  grade_id,
                  supplier_id
                `)
                .eq('id', orderDevice.serial_device_id)
                .single();
                
              if (serialError) {
                console.error('Error fetching serial device:', serialError);
                return { id: orderDevice.id };
              }

              let manufacturer = '';
              let grade = '';
              let supplier_name = '';

              if (serialData.manufacturer_id) {
                const { data: manufacturerData } = await supabase
                  .from('manufacturers')
                  .select('name')
                  .eq('id', serialData.manufacturer_id)
                  .single();
                  
                if (manufacturerData) {
                  manufacturer = manufacturerData.name;
                }
              }

              if (serialData.grade_id) {
                const { data: gradeData } = await supabase
                  .from('product_grades')
                  .select('grade')
                  .eq('id', serialData.grade_id)
                  .single();
                  
                if (gradeData) {
                  grade = gradeData.grade;
                }
              }

              if (serialData.supplier_id) {
                const { data: supplierData } = await supabase
                  .from('suppliers')
                  .select('name')
                  .eq('id', serialData.supplier_id)
                  .single();
                  
                if (supplierData) {
                  supplier_name = supplierData.name;
                }
              }

              return {
                id: orderDevice.id,
                serial_number: serialData.serial_number,
                manufacturer,
                model_name: serialData.model_name,
                color: serialData.color || '',
                grade,
                supplier_name
              };
            }
            
            return { id: orderDevice.id };
          })
        );
        
        setDevices(deviceDetails);
      } else {
        setDevices([]);
      }
    } catch (error) {
      console.error('Error loading order devices:', error);
      toast({
        title: "Error",
        description: "Failed to load order devices",
        variant: "destructive"
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadOrderDevices(page);
  };

  const handleSaveNotes = async () => {
    if (!id) return;

    setSavingNotes(true);
    try {
      const { error } = await supabase
        .from('sales_orders')
        .update({ notes })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notes saved successfully",
      });
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: "Error",
        description: "Failed to save notes",
        variant: "destructive"
      });
    } finally {
      setSavingNotes(false);
    }
  };

  const handleFinalizeOrder = async () => {
    if (!id || !order) return;
    
    setSavingOrder(true);
    try {
      const { error } = await supabase
        .from('sales_orders')
        .update({ 
          status: 'processing',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setOrder({
        ...order,
        status: 'processing',
        updated_at: new Date().toISOString()
      });

      toast({
        title: "Order Finalized",
        description: "Order has been set to processing status",
      });
    } catch (error) {
      console.error('Error finalizing order:', error);
      toast({
        title: "Error",
        description: "Failed to finalize order",
        variant: "destructive"
      });
    } finally {
      setSavingOrder(false);
    }
  };

  const handleDevicesAdded = () => {
    loadOrderDevices(currentPage);
    loadOrderDetails();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading order details...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mt-6 text-center">
        <h2 className="text-xl font-semibold">Order Not Found</h2>
        <p className="text-muted-foreground mt-2">The requested sales order could not be found.</p>
        <Button asChild className="mt-4">
          <Link to="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Sales Order: {order.order_number}</h1>
          <Badge className={statusColors[order.status] || 'bg-gray-100'}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          {order.status === 'draft' && (
            <Button 
              onClick={handleFinalizeOrder} 
              disabled={savingOrder || deviceCount === 0}
              variant="default"
            >
              {savingOrder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <CheckCircle className="mr-2 h-4 w-4" /> Finalize Order
            </Button>
          )}
          <Button onClick={() => setIsAddDeviceModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Devices
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5 text-primary" /> Customer Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {order.customer ? (
              <div className="space-y-2">
                <div className="font-medium text-lg">{order.customer.name}</div>
                <div className="text-sm text-muted-foreground">{order.customer.customer_code}</div>
                {order.customer.email && (
                  <div className="text-sm">{order.customer.email}</div>
                )}
                {order.customer.phone && (
                  <div className="text-sm">{order.customer.phone}</div>
                )}
                {order.customer.address_line1 && (
                  <div className="text-sm">
                    {order.customer.address_line1}
                    {order.customer.address_line2 && <div>{order.customer.address_line2}</div>}
                    {order.customer.city && <span>{order.customer.city}, </span>}
                    {order.customer.postcode && <span>{order.customer.postcode}</span>}
                    {order.customer.country && <div>{order.customer.country}</div>}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-muted-foreground">No customer information available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" /> Order Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Number:</span>
                <span className="font-medium">{order.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span>{new Date(order.order_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(order.created_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{new Date(order.updated_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Devices:</span>
                <span className="font-medium">{deviceCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="mr-2 h-5 w-5 text-primary" /> Shipping Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {order.tracking_number ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Carrier:</span>
                  <span>{order.shipping_carrier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tracking:</span>
                  <span className="font-medium">{order.tracking_number}</span>
                </div>
                {order.total_boxes && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Boxes:</span>
                    <span>{order.total_boxes}</span>
                  </div>
                )}
                {order.total_pallets && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pallets:</span>
                    <span>{order.total_pallets}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-muted-foreground">No shipping information available</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Notes</h2>
        <div className="flex gap-2">
          <Textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            placeholder="Add notes about this order..."
            className="min-h-[100px]"
          />
          <Button 
            onClick={handleSaveNotes} 
            disabled={savingNotes}
            className="self-start"
          >
            {savingNotes && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Devices in Order</h2>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IMEI/Serial</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Storage</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Supplier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    No devices found in this order
                  </TableCell>
                </TableRow>
              ) : (
                devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>
                      {device.imei || device.serial_number || 'N/A'}
                    </TableCell>
                    <TableCell>{device.manufacturer || 'N/A'}</TableCell>
                    <TableCell>{device.model_name || 'N/A'}</TableCell>
                    <TableCell>{device.color || 'N/A'}</TableCell>
                    <TableCell>
                      {device.storage_gb ? `${device.storage_gb} GB` : 'N/A'}
                    </TableCell>
                    <TableCell>{device.grade || 'N/A'}</TableCell>
                    <TableCell>{device.supplier_name || 'N/A'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-center py-4 border-t">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))} 
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        isActive={currentPage === page}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>

      <AddDeviceModal 
        isOpen={isAddDeviceModalOpen} 
        onClose={() => setIsAddDeviceModalOpen(false)} 
        onDevicesAdded={handleDevicesAdded}
      />
    </div>
  );
};

export default SalesOrderDetail;
