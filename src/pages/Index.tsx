import React from 'react';
import { BarChart3, PackageOpen, ArrowDownLeft, TestTube, RotateCcw, Boxes, CircleDollarSign, TrendingUp, Clock } from 'lucide-react';
import DashboardCard from '../components/dashboard/DashboardCard';
import StatCard from '../components/dashboard/StatCard';
import RecentActivity from '../components/dashboard/RecentActivity';

// Mock data for the dashboard
const statsData = [
  {
    title: 'IMEI Stock',
    value: '1,243',
    change: '+12%',
    trend: 'up',
    icon: PackageOpen,
    description: 'Total IMEI units in inventory'
  },
  {
    title: 'Booked Out/In',
    value: '652 / 873',
    change: '+5%',
    trend: 'up',
    icon: ArrowDownLeft,
    description: 'Units sent out vs added'
  },
  {
    title: 'IMEI Units Pending QC',
    value: '87',
    change: '+13',
    trend: 'up',
    icon: TestTube,
    description: 'Units awaiting quality control'
  },
  {
    title: 'IMEI Returns',
    value: '34',
    change: '-7',
    trend: 'down',
    icon: RotateCcw,
    description: 'Total units returned'
  },
];

const chartData = [
  { name: 'Jan', sales: 4000, purchases: 2400 },
  { name: 'Feb', sales: 3000, purchases: 1398 },
  { name: 'Mar', sales: 2000, purchases: 9800 },
  { name: 'Apr', sales: 2780, purchases: 3908 },
  { name: 'May', sales: 1890, purchases: 4800 },
  { name: 'Jun', sales: 2390, purchases: 3800 },
  { name: 'Jul', sales: 3490, purchases: 4300 },
];

const recentActivities = [
  {
    id: 1,
    type: 'order',
    title: 'New order #ORD-12345',
    description: 'John Smith ordered 3 items',
    time: '12 minutes ago',
  },
  {
    id: 2,
    type: 'stock',
    title: 'Low stock alert',
    description: 'iPhone 13 Pro (5 items remaining)',
    time: '45 minutes ago',
  },
  {
    id: 3,
    type: 'return',
    title: 'Return processed',
    description: 'Return #RTN-7890 processed successfully',
    time: '2 hours ago',
  },
  {
    id: 4,
    type: 'order',
    title: 'New order #ORD-12346',
    description: 'Emma Johnson ordered 1 item',
    time: '3 hours ago',
  },
  {
    id: 5,
    type: 'stock',
    title: 'Restock completed',
    description: 'Samsung Galaxy S22 (20 units added)',
    time: '5 hours ago',
  },
];

const Index = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your inventory management system.</p>
      </div>

      {/* Stats Section */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <StatCard 
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend === 'up'}
            icon={stat.icon}
            description={stat.description}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Sales Overview */}
        <DashboardCard title="Sales Overview" className="lg:col-span-2">
          <div className="h-[300px] w-full">
            {/* This is where a sales chart would go */}
            <div className="flex h-full items-center justify-center rounded-md border border-dashed">
              <div className="flex flex-col items-center gap-2 text-center">
                <BarChart3 className="h-10 w-10 text-muted-foreground" />
                <h3 className="text-lg font-medium">Sales Analytics</h3>
                <p className="text-sm text-muted-foreground px-8">
                  Sales and purchases data visualization would render here
                </p>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Recent Activity */}
        <DashboardCard title="Recent Activity">
          <RecentActivity />
        </DashboardCard>

        {/* Inventory Status */}
        <DashboardCard title="Inventory Status">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-sm">In Stock (85%)</span>
              </div>
              <span className="text-sm font-medium">1,054 items</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary">
              <div className="h-2 w-[85%] rounded-full bg-green-500"></div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                <span className="text-sm">Low Stock (10%)</span>
              </div>
              <span className="text-sm font-medium">124 items</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary">
              <div className="h-2 w-[10%] rounded-full bg-amber-500"></div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-sm">Out of Stock (5%)</span>
              </div>
              <span className="text-sm font-medium">65 items</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary">
              <div className="h-2 w-[5%] rounded-full bg-red-500"></div>
            </div>
          </div>
        </DashboardCard>

        {/* Pending Tasks */}
        <DashboardCard title="Pending Tasks">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Orders to Process</span>
              </div>
              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                12
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Items to Restock</span>
              </div>
              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                8
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Returns to Process</span>
              </div>
              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                3
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Deliveries to Confirm</span>
              </div>
              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                5
              </span>
            </div>
          </div>
        </DashboardCard>

        {/* Quick Actions */}
        <DashboardCard title="Quick Actions">
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center rounded-md border border-border p-4 hover:bg-accent transition-colors">
              <PackageOpen className="mb-2 h-6 w-6 text-primary" />
              <span className="text-sm font-medium">New Product</span>
            </button>
            
            <button className="flex flex-col items-center justify-center rounded-md border border-border p-4 hover:bg-accent transition-colors">
              <CircleDollarSign className="mb-2 h-6 w-6 text-primary" />
              <span className="text-sm font-medium">New Order</span>
            </button>
            
            <button className="flex flex-col items-center justify-center rounded-md border border-border p-4 hover:bg-accent transition-colors">
              <Boxes className="mb-2 h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Manage Stock</span>
            </button>
            
            <button className="flex flex-col items-center justify-center rounded-md border border-border p-4 hover:bg-accent transition-colors">
              <TrendingUp className="mb-2 h-6 w-6 text-primary" />
              <span className="text-sm font-medium">View Reports</span>
            </button>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default Index;
