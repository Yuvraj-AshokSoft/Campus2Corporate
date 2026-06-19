import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const Badge: React.FC<BadgeProps> = ({ children, ...props }) => {
  return (
    <span {...props}>
      {children}
    </span>
  );
};
