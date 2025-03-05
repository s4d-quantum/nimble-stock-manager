
import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Trash,
  FileDown
} from 'lucide-react';

const mockProducts = [
  { id: 1, name: 'iPhone 13 Pro', category: 'Phones', sku: 'IP-13P-128', stock: 25, price: 999.99, status: 'In Stock' },
  { id: 2, name: 'Samsung Galaxy S22', category: 'Phones', sku: 'SG-S22-256', stock: 5, price: 899.99, status: 'Low Stock' },
  { id: 3, name: 'MacBook Pro M1', category: 'Laptops', sku: 'MB-M1-16-512', stock: 12, price: 1999.99, status: 'In Stock' },
  { id: 4, name: 'iPad Air', category: 'Tablets', sku: 'IP-AIR-64', stock: 18, price: 599.99, status: 'In Stock' },
  { id: 5, name: 'AirPods Pro', category: 'Accessories', sku: 'AP-PRO-2', stock: 32, price: 249.99, status: 'In Stock' },
  { id: 6, name: 'Apple Watch Series 7', category: 'Wearables', sku: 'AW-S7-45', stock: 0, price: 399.99, status: 'Out of Stock' },
  { id: 7, name: 'Google Pixel 6', category: 'Phones', sku: 'GP-6-128', stock: 7, price: 749.99, status: 'In Stock' },
  { id: 8, name: 'Dell XPS 13', category: 'Laptops', sku: 'DL-XPS13-512', stock: 4, price: 1499.99, status: 'Low Stock' },
  { id: 9, name: 'Samsung Tab S8', category: 'Tablets', sku: 'ST-S8-256', stock: 9, price: 849.99, status: 'In Stock' },
  { id: 10, name: 'Bose QC45', category: 'Accessories', sku: 'BQC-45', stock: 0, price: 329.99, status: 'Out of Stock' },
];

const statusColors = {
  'In Stock': 'bg-green-100 text-green-800',
  'Low Stock': 'bg-amber-100 text-amber-800',
  'Out of Stock': 'bg-red-100 text-red-800',
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = mockProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">Manage your product inventory.</p>
      </div>
      
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center gap-2 sm:max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search products..."
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
            Add Product
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
                    Product
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </th>
                <th className="py-3 px-4 text-left font-medium">
                  <div className="flex items-center gap-1">
                    Category
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </th>
                <th className="py-3 px-4 text-left font-medium">SKU</th>
                <th className="py-3 px-4 text-right font-medium">
                  <div className="flex items-center justify-end gap-1">
                    Stock
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right font-medium">
                  <div className="flex items-center justify-end gap-1">
                    Price
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center font-medium">Status</th>
                <th className="py-3 px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr 
                  key={product.id} 
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{product.category}</td>
                  <td className="py-3 px-4 font-mono text-xs">{product.sku}</td>
                  <td className="py-3 px-4 text-right">{product.stock}</td>
                  <td className="py-3 px-4 text-right">${product.price.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[product.status as keyof typeof statusColors]}`}>
                        {product.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-accent hover:text-accent-foreground">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-accent hover:text-accent-foreground">
                        <Trash className="h-4 w-4" />
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
            Showing <strong>1-{filteredProducts.length}</strong> of <strong>{mockProducts.length}</strong> products
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
