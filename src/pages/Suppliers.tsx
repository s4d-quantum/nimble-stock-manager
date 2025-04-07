
import React, { useState, useEffect } from 'react';
import { 
  Building, 
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

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('suppliers')
        .select('*');

      if (error) {
        throw error;
      }

      setSuppliers(data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast({
        title: "Error",
        description: "Failed to load suppliers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone?.includes(searchTerm) ||
    supplier.supplier_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
        <p className="text-muted-foreground">View and manage supplier information.</p>
      </div>
      
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center gap-2 sm:max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search suppliers..."
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
          Add Supplier
        </button>
      </div>
      
      <div className="mt-6 rounded-lg border border-border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Supplier
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>
                  <div className="flex items-center justify-end gap-1">
                    Created
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Loading suppliers...
                  </TableCell>
                </TableRow>
              ) : filteredSuppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No suppliers found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                          <Building className="h-5 w-5" />
                        </div>
                        <span className="font-medium">{supplier.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{supplier.supplier_code}</TableCell>
                    <TableCell>{supplier.email || '-'}</TableCell>
                    <TableCell>{supplier.phone || '-'}</TableCell>
                    <TableCell>
                      {supplier.city || supplier.country ? 
                        `${supplier.city || ''} ${supplier.country ? (supplier.city ? ', ' : '') + supplier.country : ''}` 
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {supplier.created_at ? format(new Date(supplier.created_at), 'MMM d, yyyy') : '-'}
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
            Showing <strong>1-{filteredSuppliers.length}</strong> of <strong>{suppliers.length}</strong> suppliers
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

export default Suppliers;
