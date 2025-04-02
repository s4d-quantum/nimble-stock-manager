import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SalesOrder } from '@/types/inventory';
import {
  Plus,
  FileText,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  Package,
  ArrowUpDown,
  Truck,
  ShoppingCart,
  Eye,
  MoreHorizontal,
  Download
} from 'lucide-react';
import CreateSalesOrder from '@/components/orders/CreateSalesOrder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const statusColors = {
  'draft': 'bg-gray-100 text-gray-800',
  'pending': 'bg-yellow-100 text-yellow-800',
  'processing': 'bg-blue-100 text-blue-800',
  'complete': 'bg-green-100 text-green-800',
  'cancelled': 'bg-red-100 text-red-800',
  'Completed': 'bg-green-100 text-green-800',
  'Processing': 'bg-blue-100 text-blue-800',
  'Shipped': 'bg-purple-100 text-purple-800',
  'Canceled': 'bg-red-100 text-red-800',
};

const Orders = () => {
  const location = useLocation();
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('order_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
    
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [sortField, sortDirection, location.state]);

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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
      (order.customer?.customer_code?.toLowerCase().includes(searchQuery.toLowerCase()) || '');

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const mockOrders = [
    { 
      id: 'ORD-12345', 
      customer: { name: 'John Smith', customer_code: 'JS001', id: '1' },
      order_date: '2023-07-15', 
      device_count: 3, 
      total: 1299.99, 
      status: 'Completed' as any
    },
    { 
      id: 'ORD-12346', 
      customer: { name: 'Emma Johnson', customer_code: 'EJ002', id: '2' },
      order_date: '2023-07-18', 
      device_count: 1, 
      total: 899.99, 
      status: 'Processing' as any
    },
    { 
      id: 'ORD-12347', 
      customer: { name: 'Michael Brown', customer_code: 'MB003', id: '3' },
      order_date: '2023-07-20', 
      device_count: 2, 
      total: 749.98, 
      status: 'Shipped' as any
    },
  ];

  const displayOrders = filteredOrders.length > 0 ? filteredOrders : mockOrders;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Sales Orders</h1>
        <p className="text-muted-foreground">Manage sales orders and handle device shipments</p>
      </div>

      {successMessage && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md flex items-center">
          <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" />
          {successMessage}
        </div>
      )}
      
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
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={loadOrders}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          
          <Button 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-border">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="py-3 px-4 text-left font-medium">
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('order_number')}>
                    Order Number
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </th>
                <th className="py-3 px-4 text-left font-medium">
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('customer_id')}>
                    Customer
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </th>
                <th className="py-3 px-4 text-left font-medium">
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => toggleSort('order_date')}>
                    Date
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center font-medium">Status</th>
                <th className="py-3 px-4 text-center font-medium">Devices</th>
                <th className="py-3 px-4 text-center font-medium">Shipping</th>
                <th className="py-3 px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-4 px-4 text-center text-muted-foreground">
                    Loading orders...
                  </td>
                </tr>
              ) : displayOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-4 px-4 text-center text-muted-foreground">
                    No sales orders found
                  </td>
                </tr>
              ) : (
                displayOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center">
                          <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <Link 
                          to={`/sales/${order.id}`}
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          {order.order_number}
                        </Link>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{order.customer?.name}</div>
                      <div className="text-xs text-muted-foreground">{order.customer?.customer_code}</div>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(order.order_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[order.status]}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <Package className="h-4 w-4 text-muted-foreground mr-1" />
                        {order.device_count || 0}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {order.tracking_number ? (
                        <div className="flex items-center justify-center">
                          <Truck className="h-4 w-4 text-blue-500 mr-1" />
                          <div>
                            <div>{order.shipping_carrier}</div>
                            <div className="text-xs">{order.tracking_number}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Not shipped</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Link to={`/sales/${order.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between border-t border-border p-4">
          <div className="text-sm text-muted-foreground">
            Showing <strong>1-{displayOrders.length}</strong> of <strong>{displayOrders.length}</strong> orders
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
      
      <CreateSalesOrder
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onOrderCreated={loadOrders}
      />
    </div>
  );
};

export default Orders;
