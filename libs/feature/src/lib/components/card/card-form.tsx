import { FC, ReactNode } from 'react';

interface CardFormProps {
  children: ReactNode;
}

export const CardForm: FC<CardFormProps> = ({ children }) => {
  return <div>{children}</div>;
};
