
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown,
  Eye,
  Edit,
  Trash 
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  created_at: string;
  status: string;
}

const PurchaseOrders = () => {
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
      
      // Fetch purchase orders with supplier information
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
        .order('created_at', { ascending: false });

      if (poError) {
        throw poError;
      }

      // Get device counts for each purchase order
      const purchaseOrdersWithDevices = await Promise.all(
        (poData || []).map(async (po) => {
          const { count, error: countError } = await supabase
            .from('purchase_order_devices')
            .select('id', { count: 'exact', head: true })
            .eq('purchase_order_id', po.id);
          
          if (countError) {
            console.error('Error fetching device count:', countError);
            return { ...po, device_count: 0 };
          }
          
          return { ...po, device_count: count || 0 };
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

  const filteredPurchaseOrders = purchaseOrders.filter(po => 
    po.po_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.supplier?.supplier_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Purchase Orders</h1>
        <p className="text-muted-foreground">View and manage purchase orders from suppliers.</p>
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
          
          <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
        
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <Plus className="h-4 w-4 mr-2" />
          Create Purchase Order
        </button>
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
                <TableHead>Devices</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Loading purchase orders...
                  </TableCell>
                </TableRow>
              ) : filteredPurchaseOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No purchase orders found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPurchaseOrders.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                          <FileText className="h-5 w-5" />
                        </div>
                        <span className="font-medium">{po.po_number}</span>
                      </div>
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
                    <TableCell>{po.device_count || 0}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        po.status === 'completed' ? 'bg-green-100 text-green-800' :
                        po.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        po.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {po.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-accent hover:text-accent-foreground">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-accent hover:text-accent-foreground">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-accent hover:text-accent-foreground">
                          <Trash className="h-4 w-4" />
                        </button>
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
            Showing <strong>1-{filteredPurchaseOrders.length}</strong> of <strong>{purchaseOrders.length}</strong> purchase orders
          </div>
          
          <div className="flex items-center gap-2">
            <button className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
              Previous
            </button>
            <button className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrders;
