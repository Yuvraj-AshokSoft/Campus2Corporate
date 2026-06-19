import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ children, ...props }) => {
  return (
    <div {...props}>
      {children}
    </div>
  );
};
