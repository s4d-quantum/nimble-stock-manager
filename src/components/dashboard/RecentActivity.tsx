
import React from 'react';
import { Package, ShoppingCart, Users, Clock } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'product',
    title: 'New product added',
    description: 'iPhone 13 Pro - 128GB',
    time: '10 minutes ago',
    icon: Package,
  },
  {
    id: 2,
    type: 'order',
    title: 'New order received',
    description: 'Order #12345 - $899',
    time: '25 minutes ago',
    icon: ShoppingCart,
  },
  {
    id: 3,
    type: 'customer',
    title: 'New customer registered',
    description: 'John Smith',
    time: '1 hour ago',
    icon: Users,
  },
  {
    id: 4,
    type: 'order',
    title: 'Order fulfilled',
    description: 'Order #12340 - $1299',
    time: '2 hours ago',
    icon: ShoppingCart,
  },
  {
    id: 5,
    type: 'product',
    title: 'Low stock alert',
    description: 'Samsung Galaxy S22 - 256GB',
    time: '3 hours ago',
    icon: Package,
  }
];

const getIconBg = (type: string) => {
  switch (type) {
    case 'product':
      return 'bg-blue-100 text-blue-600';
    case 'order':
      return 'bg-green-100 text-green-600';
    case 'customer':
      return 'bg-purple-100 text-purple-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const RecentActivity: React.FC = () => {
  return (
    <div className="space-y-6">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4 group animate-fade-in" style={{ animationDelay: `${activity.id * 100}ms` }}>
          <div className={`mt-1 rounded-full p-2 ${getIconBg(activity.type)}`}>
            <activity.icon className="h-4 w-4" />
          </div>
          
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{activity.title}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                {activity.time}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{activity.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;
