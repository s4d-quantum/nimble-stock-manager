
import React from 'react';
import { Package, ShoppingCart, Users, Truck, TrendingUp, BarChart4 } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import DashboardCard from '../components/dashboard/DashboardCard';
import StatCard from '../components/dashboard/StatCard';
import RecentActivity from '../components/dashboard/RecentActivity';

// Mock data for chart
const salesData = [
  { name: 'Jan', value: 1200 },
  { name: 'Feb', value: 1900 },
  { name: 'Mar', value: 800 },
  { name: 'Apr', value: 1600 },
  { name: 'May', value: 2000 },
  { name: 'Jun', value: 2400 },
  { name: 'Jul', value: 2100 },
];

const inventoryData = [
  { name: 'Phones', value: 120 },
  { name: 'Laptops', value: 85 },
  { name: 'Tablets', value: 60 },
  { name: 'Accessories', value: 250 },
  { name: 'Wearables', value: 75 },
];

const Index = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your inventory management dashboard.</p>
      </div>
      
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value="1,254"
          change="12%"
          isPositive={true}
          icon={Package}
          iconColor="bg-blue-100"
        />
        <StatCard
          title="Recent Orders"
          value="145"
          change="8%"
          isPositive={true}
          icon={ShoppingCart}
          iconColor="bg-green-100"
        />
        <StatCard
          title="Customers"
          value="3,456"
          change="5%"
          isPositive={true}
          icon={Users}
          iconColor="bg-purple-100"
        />
        <StatCard
          title="Suppliers"
          value="72"
          change="0%"
          isPositive={false}
          icon={Truck}
          iconColor="bg-amber-100"
        />
      </div>
      
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <DashboardCard title="Sales Overview" className="md:col-span-1 lg:col-span-1">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickFormatter={value => `$${value}`}
                />
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <Tooltip
                  contentStyle={{ 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e7eb'
                  }}
                  formatter={(value) => [`$${value}`, 'Sales']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4f46e5" 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Inventory by Category" className="md:col-span-1 lg:col-span-1">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart4 className="w-full h-full text-muted-foreground/50" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-sm text-muted-foreground">Chart will be available soon</p>
              </div>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>
      
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <DashboardCard title="Recent Activity" className="md:col-span-2">
          <RecentActivity />
        </DashboardCard>
        
        <DashboardCard title="Low Stock Items" className="md:col-span-1">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">iPhone 13 Pro</p>
                  <p className="text-xs text-muted-foreground">128GB - Pacific Blue</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-red-500">3 left</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded bg-green-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Samsung Galaxy S22</p>
                  <p className="text-xs text-muted-foreground">256GB - Phantom Black</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-red-500">5 left</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded bg-purple-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">MacBook Pro</p>
                  <p className="text-xs text-muted-foreground">M1 - 16GB - 512GB</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-red-500">2 left</span>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default Index;
