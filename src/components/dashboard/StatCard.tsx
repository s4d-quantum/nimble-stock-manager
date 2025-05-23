
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: boolean;
  description?: string;
  icon: LucideIcon;
  iconColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  trend = true,
  description,
  icon: Icon,
  iconColor = 'bg-primary/10'
}) => {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-subtle hover-lift animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          
          {change && (
            <p className={`text-xs font-medium mt-1 ${trend ? 'text-green-500' : 'text-red-500'}`}>
              {trend ? '↑' : '↓'} {change} from last month
            </p>
          )}
          
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        
        <div className={`rounded-full ${iconColor} p-2`}>
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
