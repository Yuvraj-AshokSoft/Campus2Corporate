import React from 'react';

export interface PageWrapperProps {
  children: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};
