import { ReactElement } from 'react';

export interface IconMenuItem {
  icon: ReactElement;
  title: string;
  handleClick: () => void;
}
