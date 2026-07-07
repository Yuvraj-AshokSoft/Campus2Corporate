import React from 'react';
import { cn } from '../../lib/utils';

export interface DashboardLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn('dashboard-layout', className)} {...props}>
      {children}
    </div>
  );
};
