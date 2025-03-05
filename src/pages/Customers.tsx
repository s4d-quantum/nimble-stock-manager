
import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Edit,
  Trash 
} from 'lucide-react';

const mockCustomers = [
  { 
    id: 1, 
    name: 'John Smith', 
    email: 'john.smith@example.com', 
    phone: '(555) 123-4567', 
    orders: 8, 
    spent: 5899.92, 
    joined: '2023-01-15' 
  },
  { 
    id: 2, 
    name: 'Emma Johnson', 
    email: 'emma.j@example.com', 
    phone: '(555) 234-5678', 
    orders: 4, 
    spent: 2499.96, 
    joined: '2023-02-20' 
  },
  { 
    id: 3, 
    name: 'Michael Brown', 
    email: 'michael.b@example.com', 
    phone: '(555) 345-6789', 
    orders: 12, 
    spent: 9749.88, 
    joined: '2022-11-05' 
  },
  { 
    id: 4, 
    name: 'Sophia Williams', 
    email: 'sophia.w@example.com', 
    phone: '(555) 456-7890', 
    orders: 6, 
    spent: 4199.94, 
    joined: '2023-03-10' 
  },
  { 
    id: 5, 
    name: 'James Davis', 
    email: 'james.d@example.com', 
    phone: '(555) 567-8901', 
    orders: 3, 
    spent: 1499.97, 
    joined: '2023-04-25' 
  },
  { 
    id: 6, 
    name: 'Olivia Miller', 
    email: 'olivia.m@example.com', 
    phone: '(555) 678-9012', 
    orders: 9, 
    spent: 6299.91, 
    joined: '2022-10-15' 
  },
  { 
    id: 7, 
    name: 'Daniel Wilson', 
    email: 'daniel.w@example.com', 
    phone: '(555) 789-0123', 
    orders: 2, 
    spent: 999.98, 
    joined: '2023-05-18' 
  },
  { 
    id: 8, 
    name: 'Ava Moore', 
    email: 'ava.m@example.com', 
    phone: '(555) 890-1234', 
    orders: 5, 
    spent: 3499.95, 
    joined: '2023-01-30' 
  },
  { 
    id: 9, 
    name: 'Ethan Taylor', 
    email: 'ethan.t@example.com', 
    phone: '(555) 901-2345', 
    orders: 7, 
    spent: 4899.93, 
    joined: '2022-12-08' 
  },
  { 
    id: 10, 
    name: 'Isabella Anderson', 
    email: 'isabella.a@example.com', 
    phone: '(555) 012-3456', 
    orders: 1, 
    spent: 299.99, 
    joined: '2023-06-05' 
  },
];

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = mockCustomers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">View and manage customer information.</p>
      </div>
      
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center gap-2 sm:max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search customers..."
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
          Add Customer
        </button>
      </div>
      
      <div className="mt-6 rounded-lg border border-border">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="py-3 px-4 text-left font-medium">
                  <div className="flex items-center gap-1">
                    Customer
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </th>
                <th className="py-3 px-4 text-left font-medium">Email</th>
                <th className="py-3 px-4 text-left font-medium">Phone</th>
                <th className="py-3 px-4 text-center font-medium">
                  <div className="flex items-center justify-center gap-1">
                    Orders
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right font-medium">
                  <div className="flex items-center justify-end gap-1">
                    Spent
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center font-medium">
                  <div className="flex items-center justify-center gap-1">
                    Joined
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr 
                  key={customer.id} 
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium">{customer.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{customer.email}</td>
                  <td className="py-3 px-4">{customer.phone}</td>
                  <td className="py-3 px-4 text-center">{customer.orders}</td>
                  <td className="py-3 px-4 text-right">${customer.spent.toFixed(2)}</td>
                  <td className="py-3 px-4 text-center">{customer.joined}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-accent hover:text-accent-foreground">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-accent hover:text-accent-foreground">
                        <Edit className="h-4 w-4" />
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
            Showing <strong>1-{filteredCustomers.length}</strong> of <strong>{mockCustomers.length}</strong> customers
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

export default Customers;
