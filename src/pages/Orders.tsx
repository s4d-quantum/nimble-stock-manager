
import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Download,
  FileDown
} from 'lucide-react';

const mockOrders = [
  { 
    id: 'ORD-12345', 
    customer: 'John Smith', 
    date: '2023-07-15', 
    items: 3, 
    total: 1299.99, 
    status: 'Completed' 
  },
  { 
    id: 'ORD-12346', 
    customer: 'Emma Johnson', 
    date: '2023-07-18', 
    items: 1, 
    total: 899.99, 
    status: 'Processing' 
  },
  { 
    id: 'ORD-12347', 
    customer: 'Michael Brown', 
    date: '2023-07-20', 
    items: 2, 
    total: 749.98, 
    status: 'Shipped' 
  },
  { 
    id: 'ORD-12348', 
    customer: 'Sophia Williams', 
    date: '2023-07-22', 
    items: 4, 
    total: 1599.96, 
    status: 'Processing' 
  },
  { 
    id: 'ORD-12349', 
    customer: 'James Davis', 
    date: '2023-07-25', 
    items: 2, 
    total: 299.98, 
    status: 'Completed' 
  },
  { 
    id: 'ORD-12350', 
    customer: 'Olivia Miller', 
    date: '2023-07-26', 
    items: 1, 
    total: 1999.99, 
    status: 'Completed' 
  },
  { 
    id: 'ORD-12351', 
    customer: 'Daniel Wilson', 
    date: '2023-07-28', 
    items: 3, 
    total: 849.97, 
    status: 'Canceled' 
  },
  { 
    id: 'ORD-12352', 
    customer: 'Ava Moore', 
    date: '2023-07-30', 
    items: 2, 
    total: 649.98, 
    status: 'Shipped' 
  },
  { 
    id: 'ORD-12353', 
    customer: 'Ethan Taylor', 
    date: '2023-08-01', 
    items: 5, 
    total: 1799.95, 
    status: 'Processing' 
  },
  { 
    id: 'ORD-12354', 
    customer: 'Isabella Anderson', 
    date: '2023-08-03', 
    items: 1, 
    total: 249.99, 
    status: 'Completed' 
  },
];

const statusColors = {
  'Completed': 'bg-green-100 text-green-800',
  'Processing': 'bg-blue-100 text-blue-800',
  'Shipped': 'bg-purple-100 text-purple-800',
  'Canceled': 'bg-red-100 text-red-800',
};

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = mockOrders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Sales Orders</h1>
        <p className="text-muted-foreground">View and manage customer orders.</p>
      </div>
      
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center gap-2 sm:max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search orders..."
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
        
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </button>
          
          <button className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </button>
        </div>
      </div>
      
      <div className="mt-6 rounded-lg border border-border">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="py-3 px-4 text-left font-medium">
                  <div className="flex items-center gap-1">
                    Order ID
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </th>
                <th className="py-3 px-4 text-left font-medium">
                  <div className="flex items-center gap-1">
                    Customer
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </th>
                <th className="py-3 px-4 text-left font-medium">
                  <div className="flex items-center gap-1">
                    Date
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center font-medium">Items</th>
                <th className="py-3 px-4 text-right font-medium">
                  <div className="flex items-center justify-end gap-1">
                    Total
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center font-medium">Status</th>
                <th className="py-3 px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <span className="font-medium">{order.id}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{order.customer}</td>
                  <td className="py-3 px-4">{order.date}</td>
                  <td className="py-3 px-4 text-center">{order.items}</td>
                  <td className="py-3 px-4 text-right">${order.total.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[order.status as keyof typeof statusColors]}`}>
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-accent hover:text-accent-foreground">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-accent hover:text-accent-foreground">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-accent hover:text-accent-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between border-t border-border p-4">
          <div className="text-sm text-muted-foreground">
            Showing <strong>1-{filteredOrders.length}</strong> of <strong>{mockOrders.length}</strong> orders
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

export default Orders;
