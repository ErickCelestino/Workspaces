import { createContext } from 'react';

interface FileModalContextProps {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
}

export const FileModalContext = createContext<
  FileModalContextProps | undefined
>(undefined);
