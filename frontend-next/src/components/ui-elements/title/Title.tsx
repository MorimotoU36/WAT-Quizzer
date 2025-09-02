import React from 'react';

interface TitleProps {
  label: string;
}

export const Title = ({ ...props }: TitleProps) => {
  return <h1 className="text-2xl font-bold text-gray-900 mb-4">{props.label}</h1>;
};
