
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Barcode, Check, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BookDevicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  salesOrderId: string;
  onDevicesBooked: () => void;
}

interface OrderDevice {
  id: string;
  imei?: string;
  cellular_device_id?: string;
  booked?: boolean;
}

const BookDevicesModal: React.FC<BookDevicesModalProps> = ({ 
  isOpen, 
  onClose,
  salesOrderId,
  onDevicesBooked
}) => {
  const [imei, setImei] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderDevices, setOrderDevices] = useState<OrderDevice[]>([]);
  const [totalDevices, setTotalDevices] = useState(0);
  const [bookedDevices, setBookedDevices] = useState(0);
  const [lastScannedImei, setLastScannedImei] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<'success' | 'error' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load devices in the order
  useEffect(() => {
    if (isOpen && salesOrderId) {
      loadOrderDevices();
    }
  }, [isOpen, salesOrderId]);

  // Auto-focus the input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Clear scan result after 2 seconds
  useEffect(() => {
    if (scanResult) {
      const timer = setTimeout(() => {
        setScanResult(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [scanResult]);

  const loadOrderDevices = async () => {
    setLoading(true);
    try {
      // Get all devices in the order
      const { data: orderDevicesData, error: orderDevicesError } = await supabase
        .from('sales_order_devices')
        .select(`
          id,
          cellular_device_id
        `)
        .eq('sales_order_id', salesOrderId);
      
      if (orderDevicesError) throw orderDevicesError;

      if (orderDevicesData) {
        setTotalDevices(orderDevicesData.length);
        
        // Get details for each device
        const devicesWithDetails = await Promise.all(
          orderDevicesData.map(async (orderDevice) => {
            if (orderDevice.cellular_device_id) {
              const { data: cellularData, error: cellularError } = await supabase
                .from('cellular_devices')
                .select('imei, status')
                .eq('id', orderDevice.cellular_device_id)
                .single();
                
              if (cellularError) {
                console.error('Error fetching cellular device:', cellularError);
                return { ...orderDevice, booked: false };
              }
              
              return { 
                ...orderDevice, 
                imei: cellularData.imei, 
                booked: cellularData.status === 'sold' 
              };
            }
            
            return { ...orderDevice, booked: false };
          })
        );
        
        setOrderDevices(devicesWithDetails);
        setBookedDevices(devicesWithDetails.filter(d => d.booked).length);
      }
    } catch (error) {
      console.error('Error loading order devices:', error);
      toast({
        title: "Error",
        description: "Failed to load devices for this order",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImeiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imei.trim()) return;
    
    const trimmedImei = imei.trim();
    setLastScannedImei(trimmedImei);
    
    // Check if IMEI is in the order
    const matchingDevice = orderDevices.find(d => d.imei === trimmedImei);
    
    if (!matchingDevice) {
      setScanResult('error');
      toast({
        title: "Device not found",
        description: `IMEI ${trimmedImei} is not in this order`,
        variant: "destructive"
      });
      setImei('');
      inputRef.current?.focus();
      return;
    }
    
    // Check if already booked
    if (matchingDevice.booked) {
      setScanResult('success');
      toast({
        title: "Already booked",
        description: `Device with IMEI ${trimmedImei} was already booked`,
      });
      setImei('');
      inputRef.current?.focus();
      return;
    }
    
    try {
      // Update the device status to 'sold' during the booking process
      const { error: updateError } = await supabase
        .from('cellular_devices')
        .update({ status: 'sold' })
        .eq('imei', trimmedImei);
        
      if (updateError) throw updateError;
      
      // Update local state
      setOrderDevices(prevDevices => 
        prevDevices.map(d => 
          d.imei === trimmedImei ? { ...d, booked: true } : d
        )
      );
      
      setBookedDevices(prev => prev + 1);
      setScanResult('success');
      
      toast({
        title: "Device booked",
        description: `IMEI ${trimmedImei} successfully booked`,
      });
    } catch (error) {
      console.error('Error booking device:', error);
      setScanResult('error');
      toast({
        title: "Error",
        description: "Failed to book device",
        variant: "destructive"
      });
    }
    
    setImei('');
    inputRef.current?.focus();
  };

  const handleComplete = async () => {
    // If all devices are booked, update order status to 'confirmed'
    if (bookedDevices === totalDevices && totalDevices > 0) {
      try {
        const { error } = await supabase
          .from('sales_orders')
          .update({ 
            status: 'confirmed',
            updated_at: new Date().toISOString()
          })
          .eq('id', salesOrderId);

        if (error) throw error;
        
        toast({
          title: "Order confirmed",
          description: "All devices have been booked and the order is now confirmed",
        });
        
        onDevicesBooked();
        onClose();
      } catch (error) {
        console.error('Error updating order status:', error);
        toast({
          title: "Error",
          description: "Failed to update order status",
          variant: "destructive"
        });
      }
    } else {
      onDevicesBooked();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book Devices for Shipping</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center justify-between mb-4 p-2 bg-muted rounded-md">
          <div>
            <div className="text-sm text-muted-foreground">Devices Booked</div>
            <div className="text-xl font-bold">{bookedDevices} / {totalDevices}</div>
          </div>
          
          <div className={`p-3 rounded-full ${
            scanResult === 'success' ? 'bg-green-500' : 
            scanResult === 'error' ? 'bg-red-500' : 
            'bg-gray-200'
          }`}>
            {scanResult === 'success' ? (
              <Check className="h-6 w-6 text-white" />
            ) : scanResult === 'error' ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Barcode className="h-6 w-6 text-gray-500" />
            )}
          </div>
        </div>
        
        {lastScannedImei && (
          <div className={`text-center mb-4 font-mono ${
            scanResult === 'success' ? 'text-green-600' : 
            scanResult === 'error' ? 'text-red-600' : 
            'text-gray-600'
          }`}>
            {lastScannedImei}
          </div>
        )}
        
        <form onSubmit={handleImeiSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            <Barcode className="h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={imei}
              onChange={(e) => setImei(e.target.value)}
              placeholder="Scan IMEI barcode..."
              className="flex-1"
              autoFocus
            />
          </div>
          
          <p className="text-sm text-muted-foreground">
            Scan each device's IMEI barcode to confirm it for shipping. Press Enter after each scan.
          </p>
        </form>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleComplete}
            className={bookedDevices === totalDevices && totalDevices > 0 ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {bookedDevices === totalDevices && totalDevices > 0 ? 'Complete & Confirm Order' : 'Complete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookDevicesModal;
