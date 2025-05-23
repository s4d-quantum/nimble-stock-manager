
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SalesOrder } from '@/types/inventory';
import {
  ArrowUpDown,
  CheckCircle2,
  Filter,
  Package,
  RefreshCw,
  Search,
  Truck,
  Eye,
  Package2,
  AlertTriangle,
  Barcode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";

const GoodsOut: React.FC = () => {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('order_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [carrierName, setCarrierName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [totalBoxes, setTotalBoxes] = useState<number | undefined>(undefined);
  const [totalPallets, setTotalPallets] = useState<number | undefined>(undefined);
  const [savingShipment, setSavingShipment] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
  }, [sortField, sortDirection]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sales_orders')
        .select(`
          *,
          customer:customers(
            id,
            name,
            customer_code
          ),
          device_count:sales_order_devices(count)
        `)
        .in('status', ['processing', 'confirmed', 'complete'])
        .order(sortField, { ascending: sortDirection === 'asc' });

      if (error) throw error;

      const ordersWithCount = data?.map(order => ({
        ...order,
        device_count: order.device_count?.[0]?.count || 0,
        status: order.status as SalesOrder['status']
      })) as SalesOrder[] || [];

      setOrders(ordersWithCount);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: "Error",
        description: "Failed to load sales orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getPriorityBadge = (priority: number | null | undefined) => {
    if (!priority) return null;
    
    switch(priority) {
      case 1:
        return <Badge className="bg-red-500">Urgent</Badge>;
      case 2:
        return <Badge className="bg-orange-500">High</Badge>;
      case 3:
        return <Badge className="bg-blue-500">Normal</Badge>;
      case 4:
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'processing':
        return <Badge className="bg-blue-500">Processing</Badge>;
      case 'confirmed':
        return <Badge className="bg-purple-500">Confirmed</Badge>;
      case 'complete':
        return <Badge className="bg-green-500">Complete</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const openShippingModal = (order: SalesOrder) => {
    setSelectedOrder(order);
    setCarrierName(order.shipping_carrier || '');
    setTrackingNumber(order.tracking_number || '');
    setTotalBoxes(order.total_boxes);
    setTotalPallets(order.total_pallets);
    setIsShippingModalOpen(true);
  };

  const handleShipOrder = async () => {
    if (!selectedOrder) return;
    
    setSavingShipment(true);
    try {
      const { error } = await supabase
        .from('sales_orders')
        .update({ 
          status: 'complete',
          shipping_carrier: carrierName,
          tracking_number: trackingNumber,
          total_boxes: totalBoxes,
          total_pallets: totalPallets,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedOrder.id);

      if (error) throw error;

      toast({
        title: "Order Shipped",
        description: `Order ${selectedOrder.order_number} has been marked as shipped`,
      });
      
      setIsShippingModalOpen(false);
      loadOrders();
    } catch (error) {
      console.error('Error shipping order:', error);
      toast({
        title: "Error",
        description: "Failed to update shipping information",
        variant: "destructive"
      });
    } finally {
      setSavingShipment(false);
    }
  };

  const goToScanDevices = (order: SalesOrder) => {
    navigate(`/sales/${order.id}`);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
      (order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
      (order.customer?.customer_code?.toLowerCase().includes(searchQuery.toLowerCase()) || '');

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Goods Out</h1>
        <p className="text-muted-foreground">Manage and process outgoing shipments</p>
      </div>

      {orders.length === 0 && !loading ? (
        <Alert className="mt-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No orders ready for dispatch</AlertTitle>
          <AlertDescription>
            There are currently no sales orders in processing, confirmed or complete status.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full items-center gap-2 sm:max-w-sm">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search orders..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1" 
                onClick={loadOrders}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => toggleSort('order_number')}
                  >
                    <div className="flex items-center gap-1">
                      Order
                      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => toggleSort('customer_id')}
                  >
                    <div className="flex items-center gap-1">
                      Customer
                      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => toggleSort('order_date')}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Devices</TableHead>
                  <TableHead className="text-center">Shipping</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        Loading orders...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Package2 className="h-8 w-8 text-muted-foreground mb-2" />
                        <p>No matching orders found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-medium">
                          <Link 
                            to={`/sales/${order.id}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {order.order_number}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{order.customer?.name}</div>
                        <div className="text-xs text-muted-foreground">{order.customer?.customer_code}</div>
                      </TableCell>
                      <TableCell>
                        {new Date(order.order_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(order.priority)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.status)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          <Package className="h-4 w-4 text-muted-foreground mr-1" />
                          {order.device_count || 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.tracking_number ? (
                          <div className="flex items-center">
                            <Truck className="h-4 w-4 text-blue-500 mr-1" />
                            <div>
                              <div>{order.shipping_carrier}</div>
                              <div className="text-xs">{order.tracking_number}</div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Not shipped</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/sales/${order.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          
                          {order.status === 'processing' && (
                            <Button 
                              size="sm" 
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => goToScanDevices(order)}
                            >
                              <Barcode className="h-4 w-4 mr-1" />
                              Scan
                            </Button>
                          )}
                          
                          {order.status === 'confirmed' && (
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => openShippingModal(order)}
                            >
                              <Truck className="h-4 w-4 mr-1" />
                              Ship
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            
            <div className="flex items-center justify-between border-t border-border p-4">
              <div className="text-sm text-muted-foreground">
                Showing <strong>{filteredOrders.length}</strong> of <strong>{orders.length}</strong> orders
              </div>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </>
      )}

      {/* Shipping Information Modal */}
      <Dialog open={isShippingModalOpen} onOpenChange={setIsShippingModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ship Order: {selectedOrder?.order_number}</DialogTitle>
            <DialogDescription>
              Enter shipping details to complete this order
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="carrier" className="text-sm font-medium">Carrier Name</label>
              <Input
                id="carrier"
                value={carrierName}
                onChange={(e) => setCarrierName(e.target.value)}
                placeholder="e.g. DHL, FedEx, UPS"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="tracking" className="text-sm font-medium">Tracking Number</label>
              <Input
                id="tracking"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="boxes" className="text-sm font-medium">Number of Boxes</label>
                <Input
                  id="boxes"
                  type="number"
                  min="0"
                  value={totalBoxes !== undefined ? totalBoxes : ''}
                  onChange={(e) => setTotalBoxes(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="pallets" className="text-sm font-medium">Number of Pallets</label>
                <Input
                  id="pallets"
                  type="number"
                  min="0"
                  value={totalPallets !== undefined ? totalPallets : ''}
                  onChange={(e) => setTotalPallets(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsShippingModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              disabled={!carrierName || !trackingNumber || savingShipment}
              onClick={handleShipOrder}
            >
              {savingShipment && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
              Complete Shipment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GoodsOut;
