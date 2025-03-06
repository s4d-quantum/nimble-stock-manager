import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  FileDown,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { CellularDevice, Supplier, ProductGrade, DeviceWithDetails } from '@/types/inventory';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  'in_stock': 'bg-green-100 text-green-800',
  'low_stock': 'bg-amber-100 text-amber-800',
  'sold': 'bg-blue-100 text-blue-800',
  'returned': 'bg-purple-100 text-purple-800',
  'repair': 'bg-yellow-100 text-yellow-800',
  'qc_required': 'bg-red-100 text-red-800',
  'quarantine': 'bg-orange-100 text-orange-800',
  'qc_failed': 'bg-red-500 text-white',
};

const Products = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [devices, setDevices] = useState<DeviceWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [grades, setGrades] = useState<ProductGrade[]>([]);
  const [manufacturers, setManufacturers] = useState<string[]>([]);
  
  const [supplierFilter, setSupplierFilter] = useState<string>('');
  const [manufacturerFilter, setManufacturerFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: supplierData, error: supplierError } = await supabase
          .from('suppliers')
          .select('id, name, supplier_code');
        
        if (supplierError) throw supplierError;
        setSuppliers(supplierData);
        
        const { data: gradeData, error: gradeError } = await supabase
          .from('product_grades')
          .select('id, grade, description');
        
        if (gradeError) throw gradeError;
        setGrades(gradeData);

        const { data: manufacturerData, error: manufacturerError } = await supabase
          .from('tac_codes')
          .select('manufacturer')
          .order('manufacturer');
        
        if (manufacturerError) throw manufacturerError;
        const uniqueManufacturers = Array.from(new Set(manufacturerData.map(item => item.manufacturer)));
        setManufacturers(uniqueManufacturers);

        await fetchDevices();

      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load inventory data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const { data: deviceData, error: deviceError } = await supabase
        .from('cellular_devices')
        .select(`
          id, 
          imei, 
          storage_gb, 
          color, 
          status, 
          grade_id, 
          supplier_id, 
          tac_id
        `);
      
      if (deviceError) throw deviceError;

      const enrichedDevices = await Promise.all(deviceData.map(async (device) => {
        const enrichedDevice: DeviceWithDetails = { ...device };
        
        if (device.supplier_id) {
          const supplier = suppliers.find(s => s.id === device.supplier_id);
          enrichedDevice.supplier_name = supplier?.name || '';
        }
        
        if (device.grade_id !== null && device.grade_id !== undefined) {
          const grade = grades.find(g => g.id === device.grade_id);
          enrichedDevice.grade = grade?.grade || '';
        }
        
        if (device.imei) {
          const tacCode = device.imei.substring(0, 8);
          const { data: tacData, error: tacError } = await supabase.rpc('get_device_details_by_tac', {
            tac_code: tacCode
          });
          
          if (!tacError && tacData && tacData.length > 0) {
            enrichedDevice.manufacturer = tacData[0].manufacturer;
            enrichedDevice.model_name = tacData[0].model_name;
          }
        }
        
        return enrichedDevice;
      }));
      
      setDevices(enrichedDevices);
    } catch (error) {
      console.error('Error fetching devices:', error);
      toast({
        title: 'Error',
        description: 'Failed to load device data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditDevice = (deviceId: string) => {
    navigate(`/device/${deviceId}`);
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch = 
      device.imei?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.model_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSupplier = supplierFilter ? device.supplier_id === supplierFilter : true;
    
    const matchesManufacturer = manufacturerFilter ? device.manufacturer === manufacturerFilter : true;
    
    const matchesStatus = statusFilter ? device.status === statusFilter : true;
    
    return matchesSearch && matchesSupplier && matchesManufacturer && matchesStatus;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
        <p className="text-muted-foreground">Manage your device inventory.</p>
      </div>
      
      <div className="mt-6 flex flex-wrap gap-4">
        <div className="flex w-full items-center gap-2 sm:max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search by IMEI, manufacturer, model..."
              className="w-full rounded-md border border-input pl-8 pr-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
          >
            <option value="">All Suppliers</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
            ))}
          </select>
          
          <select
            className="rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={manufacturerFilter}
            onChange={(e) => setManufacturerFilter(e.target.value)}
          >
            <option value="">All Manufacturers</option>
            {manufacturers.map(manufacturer => (
              <option key={manufacturer} value={manufacturer}>{manufacturer}</option>
            ))}
          </select>
          
          <select
            className="rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="in_stock">In Stock</option>
            <option value="sold">Sold</option>
            <option value="returned">Returned</option>
            <option value="repair">Repair</option>
            <option value="qc_required">QC Required</option>
            <option value="quarantine">Quarantine</option>
            <option value="qc_failed">QC Failed</option>
          </select>

          <button 
            onClick={() => fetchDevices()} 
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          
          <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>
      
      <div className="mt-6 rounded-lg border border-border">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="py-3 px-4 text-left font-medium">IMEI</th>
                <th className="py-3 px-4 text-left font-medium">Manufacturer</th>
                <th className="py-3 px-4 text-left font-medium">Model</th>
                <th className="py-3 px-4 text-left font-medium">Storage (GB)</th>
                <th className="py-3 px-4 text-left font-medium">Colour</th>
                <th className="py-3 px-4 text-left font-medium">Grade</th>
                <th className="py-3 px-4 text-left font-medium">Supplier</th>
                <th className="py-3 px-4 text-center font-medium">Status</th>
                <th className="py-3 px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center">
                    <div className="flex justify-center">
                      <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">Loading inventory data...</div>
                  </td>
                </tr>
              ) : filteredDevices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center">
                    <div className="text-sm text-muted-foreground">No devices found matching your search criteria.</div>
                  </td>
                </tr>
              ) : (
                filteredDevices.map((device) => (
                  <tr 
                    key={device.id} 
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-xs">{device.imei}</td>
                    <td className="py-3 px-4">{device.manufacturer || 'Unknown'}</td>
                    <td className="py-3 px-4">{device.model_name || 'Unknown'}</td>
                    <td className="py-3 px-4">{device.storage_gb || 'N/A'}</td>
                    <td className="py-3 px-4">{device.color || 'N/A'}</td>
                    <td className="py-3 px-4">{device.grade || 'N/A'}</td>
                    <td className="py-3 px-4">{device.supplier_name || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[device.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                          {device.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditDevice(device.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-accent hover:text-accent-foreground"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-accent hover:text-accent-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
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
            Showing <strong>1-{filteredDevices.length}</strong> of <strong>{devices.length}</strong> devices
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

export default Products;
