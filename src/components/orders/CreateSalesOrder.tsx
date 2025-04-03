
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '@/types/inventory';
import { Plus, Loader2 } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import CreateCustomerModal from './CreateCustomerModal';

interface CreateSalesOrderProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: () => void;
}

const CreateSalesOrder: React.FC<CreateSalesOrderProps> = ({ 
  isOpen, 
  onClose, 
  onOrderCreated 
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
    }
  }, [isOpen]);

  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      console.log("Fetching customers...");
      
      const { data, error } = await supabase
        .from('customers')
        .select('id, name, customer_code');
      
      if (error) {
        console.error("Supabase error details:", error);
        throw error;
      }
      
      console.log("Customers data:", data);
      
      if (data && data.length > 0) {
        setCustomers(data as Customer[]);
      } else {
        console.log("No customers found or data is empty");
        setCustomers([]);
        
        // Simple check if table exists without using count(*)
        const { error: tableError } = await supabase
          .from('customers')
          .select('id')
          .limit(1);
          
        if (tableError) {
          console.error("Table check error:", tableError);
        } else {
          console.log("Table exists but returned no data");
        }
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error",
        description: "Failed to load customers",
        variant: "destructive"
      });
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleCreateCustomer = () => {
    setIsCustomerModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !orderDate) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Get the last SO number
      const { data: lastOrder } = await supabase
        .from('sales_orders')
        .select('order_number')
        .order('order_number', { ascending: false })
        .limit(1);

      // Generate new SO number
      let newOrderNumber = 1;
      if (lastOrder && lastOrder.length > 0) {
        const lastNumber = parseInt(lastOrder[0].order_number.split('-')[1] || '0');
        newOrderNumber = lastNumber + 1;
      }
      const orderNumber = `SO-${String(newOrderNumber).padStart(6, '0')}`;

      const { data, error } = await supabase
        .from('sales_orders')
        .insert({
          customer_id: customerId,
          order_number: orderNumber,
          order_date: orderDate,
          notes,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sales order created successfully",
        variant: "default"
      });
      
      onOrderCreated();
      onClose();
      if (data) {
        navigate(`/sales/${data.id}`, { 
          state: { message: `Sales order ${orderNumber} created successfully` } 
        });
      }
    } catch (error: any) {
      console.error('Error creating sales order:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create sales order",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCustomerId('');
    setOrderDate(new Date().toISOString().split('T')[0]);
    setNotes('');
  };

  const handleCloseDialog = () => {
    resetForm();
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Sales Order</DialogTitle>
            <DialogDescription>
              Enter the details for the new sales order below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer *</Label>
                {loadingCustomers ? (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading customers...
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Select value={customerId} onValueChange={setCustomerId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.length > 0 ? (
                          customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name} {customer.customer_code ? `(${customer.customer_code})` : ''}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-customers" disabled>
                            No customers found
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <Button 
                      type="button" 
                      variant="link" 
                      className="h-auto p-0 text-blue-600"
                      onClick={handleCreateCustomer}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add New Customer
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="orderDate">Order Date *</Label>
                <Input
                  id="orderDate"
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes or special instructions"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || loadingCustomers}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Order'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <CreateCustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onCustomerCreated={fetchCustomers}
      />
    </>
  );
};

export default CreateSalesOrder;
