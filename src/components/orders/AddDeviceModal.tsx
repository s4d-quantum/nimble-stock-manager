
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { 
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Supplier {
  id: string;
  name: string;
}

interface Device {
  id: string;
  imei: string;
  tac_id: string;
  storage_gb: number | null;
  color: string | null;
  grade: string | null;
  manufacturer: string;
  model_name: string;
  status: string;
  selected?: boolean;
}

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDevicesAdded: () => void;
  salesOrderId: string;
}

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ 
  isOpen, 
  onClose,
  onDevicesAdded,
  salesOrderId
}) => {
  const { id: salesOrderIdParam } = useParams<{ id: string }>();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [manufacturers, setManufacturers] = useState<string[]>([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('');
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [savingDevices, setSavingDevices] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 10;
  
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadSuppliers();
      setSelectedSupplier('');
      setDevices([]);
      setFilteredDevices([]);
      setSelectedManufacturer('');
      setSelectedModel('');
      setSearchQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedSupplier) {
      loadDevices(selectedSupplier);
    } else {
      setDevices([]);
      setFilteredDevices([]);
    }
  }, [selectedSupplier]);

  useEffect(() => {
    applyFilters();
  }, [devices, searchQuery, selectedManufacturer, selectedModel]);

  const loadSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('id, name')
        .order('name');

      if (error) throw error;

      if (data) {
        setSuppliers(data);
      }
    } catch (error) {
      console.error('Error loading suppliers:', error);
      toast({
        title: "Error",
        description: "Failed to load suppliers",
        variant: "destructive"
      });
    }
  };

  const loadDevices = async (supplierId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cellular_devices')
        .select(`
          id,
          imei,
          storage_gb,
          color,
          status,
          grade_id,
          tac_id,
          tac_codes:tac_id (
            manufacturer,
            model_name
          ),
          product_grades:grade_id (
            grade
          )
        `)
        .eq('supplier_id', supplierId)
        .eq('status', 'in_stock');

      if (error) throw error;

      if (data) {
        const formattedDevices: Device[] = data.map(device => ({
          id: device.id,
          imei: device.imei,
          tac_id: device.tac_id,
          storage_gb: device.storage_gb,
          color: device.color,
          status: device.status,
          manufacturer: device.tac_codes?.manufacturer || 'Unknown',
          model_name: device.tac_codes?.model_name || 'Unknown',
          grade: device.product_grades?.grade || 'Unknown',
          selected: false
        }));

        setDevices(formattedDevices);
        setFilteredDevices(formattedDevices);

        const uniqueManufacturers = Array.from(new Set(formattedDevices.map(d => d.manufacturer))).sort();
        setManufacturers(uniqueManufacturers);

        const uniqueModels = Array.from(new Set(formattedDevices.map(d => d.model_name))).sort();
        setModels(uniqueModels);
        
        setTotalPages(Math.max(1, Math.ceil(formattedDevices.length / itemsPerPage)));
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error loading devices:', error);
      toast({
        title: "Error",
        description: "Failed to load devices",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...devices];

    if (selectedManufacturer && selectedManufacturer !== '_all') {
      filtered = filtered.filter(device => device.manufacturer === selectedManufacturer);
    }

    if (selectedModel && selectedModel !== '_all') {
      filtered = filtered.filter(device => device.model_name === selectedModel);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(device =>
        device.imei.toLowerCase().includes(query) ||
        device.manufacturer.toLowerCase().includes(query) ||
        device.model_name.toLowerCase().includes(query)
      );
    }

    setFilteredDevices(filtered);
    setTotalPages(Math.max(1, Math.ceil(filtered.length / itemsPerPage)));
    setCurrentPage(1);
  };

  const toggleDeviceSelection = (id: string) => {
    setFilteredDevices(prev => 
      prev.map(device => 
        device.id === id 
          ? { ...device, selected: !device.selected } 
          : device
      )
    );

    setDevices(prev => 
      prev.map(device => 
        device.id === id 
          ? { ...device, selected: !device.selected } 
          : device
      )
    );
  };

  const handleSaveDevices = async () => {
    if (!salesOrderId) {
      toast({
        title: "Error",
        description: "Sales order ID is missing",
        variant: "destructive"
      });
      return;
    }

    const selectedDevices = devices.filter(device => device.selected);
    
    if (selectedDevices.length === 0) {
      toast({
        title: "No devices selected",
        description: "Please select at least one device to add to the order",
        variant: "destructive"
      });
      return;
    }

    setSavingDevices(true);
    try {
      const deviceIds = selectedDevices.map(device => device.id);
      
      const { error } = await supabase.rpc('add_devices_to_sales_order', {
        p_sales_order_id: salesOrderId,
        p_device_ids: deviceIds
      });
      
      if (error) {
        console.error('Error calling add_devices_to_sales_order:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: `Added ${selectedDevices.length} devices to the sales order`,
      });

      onDevicesAdded();
      
      onClose();
    } catch (error) {
      console.error('Error saving devices:', error);
      
      toast({
        title: "Error",
        description: "Failed to add devices to the order",
        variant: "destructive"
      });
    } finally {
      setSavingDevices(false);
    }
  };

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredDevices.slice(startIndex, endIndex);
  };

  const resetFilters = () => {
    setSelectedManufacturer('');
    setSelectedModel('');
    setSearchQuery('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Devices to Sales Order</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select Supplier</label>
            <Select 
              value={selectedSupplier} 
              onValueChange={setSelectedSupplier}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map(supplier => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSupplier && (
            <>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search devices..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select 
                  value={selectedManufacturer} 
                  onValueChange={setSelectedManufacturer}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Manufacturer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Manufacturers</SelectItem>
                    {manufacturers.map(manufacturer => (
                      <SelectItem key={manufacturer} value={manufacturer}>
                        {manufacturer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select 
                  value={selectedModel} 
                  onValueChange={setSelectedModel}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Models</SelectItem>
                    {models.map(model => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  <Filter className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>IMEI</TableHead>
                      <TableHead>Manufacturer</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Storage</TableHead>
                      <TableHead>Color</TableHead>
                      <TableHead>Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                            <span>Loading devices...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredDevices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <AlertCircle className="h-6 w-6 mb-2" />
                            <span>No devices found</span>
                            <span className="text-sm">Try changing your filters or select a different supplier</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      getCurrentPageItems().map(device => (
                        <TableRow key={device.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell>
                            <Checkbox
                              checked={device.selected}
                              onCheckedChange={() => toggleDeviceSelection(device.id)}
                            />
                          </TableCell>
                          <TableCell>{device.imei}</TableCell>
                          <TableCell>{device.manufacturer}</TableCell>
                          <TableCell>{device.model_name}</TableCell>
                          <TableCell>{device.storage_gb ? `${device.storage_gb} GB` : 'N/A'}</TableCell>
                          <TableCell>{device.color || 'N/A'}</TableCell>
                          <TableCell>{device.grade || 'N/A'}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                {filteredDevices.length > 0 && (
                  <div className="flex items-center justify-between p-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Showing <strong>{Math.min((currentPage - 1) * itemsPerPage + 1, filteredDevices.length)}-{Math.min(currentPage * itemsPerPage, filteredDevices.length)}</strong> of <strong>{filteredDevices.length}</strong> devices
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      
                      <span className="text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSaveDevices} 
            disabled={loading || savingDevices || devices.filter(d => d.selected).length === 0}
          >
            {savingDevices && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save & Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeviceModal;
