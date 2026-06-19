import React from 'react';

export interface SectionHeaderProps {
  title: string;
  description?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description }) => {
  return (
    <div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
};
