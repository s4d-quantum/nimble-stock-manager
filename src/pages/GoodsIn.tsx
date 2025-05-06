
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  ArrowUpDown,
  Eye,
  Edit,
  PackageOpen
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface PurchaseOrder {
  id: string;
  po_number: string;
  order_date: string;
  supplier_id: string;
  supplier: {
    name: string;
    supplier_code: string;
  };
  device_count?: number;
  devices_confirmed?: number;
  created_at: string;
  status: string;
}

const GoodsIn = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch purchase orders with supplier information, filtering by relevant statuses
      const { data: poData, error: poError } = await supabase
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
        .in('status', ['processing', 'confirmed', 'completed'])
        .order('created_at', { ascending: false });

      if (poError) {
        throw poError;
      }

      // Get planned device counts for each purchase order
      const purchaseOrdersWithDevices = await Promise.all(
        (poData || []).map(async (po) => {
          // Get total planned devices
          const { count: plannedCount, error: plannedError } = await supabase
            .from('purchase_order_devices_planned')
            .select('id', { count: 'exact', head: true })
            .eq('purchase_order_id', po.id);

          if (plannedError) {
            console.error('Error fetching planned device count:', plannedError);
          }
          
          // Get total confirmed devices
          const { count: confirmedCount, error: confirmedError } = await supabase
            .from('purchase_order_devices')
            .select('id', { count: 'exact', head: true })
            .eq('purchase_order_id', po.id);
          
          if (confirmedError) {
            console.error('Error fetching confirmed device count:', confirmedError);
          }
          
          return { 
            ...po, 
            device_count: plannedCount || 0,
            devices_confirmed: confirmedCount || 0
          };
        })
      );

      setPurchaseOrders(purchaseOrdersWithDevices);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      toast({
        title: "Error",
        description: "Failed to load purchase orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-amber-100 text-amber-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPurchaseOrders = purchaseOrders.filter(po => 
    po.po_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.supplier?.supplier_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Goods In</h1>
        <p className="text-muted-foreground">Track and process incoming inventory from suppliers.</p>
      </div>
      
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center gap-2 sm:max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search purchase orders..."
              className="w-full rounded-md border border-input pl-8 pr-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
      </div>
      
      <div className="mt-6 rounded-lg border border-border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center gap-1">
                    PO Number
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Devices
                    <span className="text-xs text-muted-foreground">(received/total)</span>
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : filteredPurchaseOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPurchaseOrders.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell>
                      <Link to={`/goods-in/${po.id}`} className="hover:underline">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                            <FileText className="h-5 w-5" />
                          </div>
                          <span className="font-medium">{po.po_number}</span>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      {po.order_date ? format(new Date(po.order_date), 'MMM d, yyyy') : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{po.supplier?.name || '-'}</span>
                        <span className="text-xs text-muted-foreground">{po.supplier?.supplier_code || '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{po.devices_confirmed || 0}</span>
                      <span className="text-muted-foreground">/{po.device_count || 0}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        getStatusBadgeClass(po.status)
                      }`}>
                        {po.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/goods-in/${po.id}`}>
                          <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </Link>
                        <Link to={`/goods-in/${po.id}/edit`}>
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex items-center justify-between border-t border-border p-4">
          <div className="text-sm text-muted-foreground">
            Showing <strong>1-{filteredPurchaseOrders.length}</strong> of <strong>{purchaseOrders.length}</strong> orders
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={true}>Previous</Button>
            <Button variant="outline" size="sm" disabled={true}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoodsIn;
