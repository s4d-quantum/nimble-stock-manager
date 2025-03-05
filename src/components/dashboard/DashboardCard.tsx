
import React, { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  children,
  className = ''
}) => {
  return (
    <div className={`rounded-lg border border-border bg-card p-5 shadow-subtle hover-lift animate-fade-in ${className}`}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
};

export default DashboardCard;
