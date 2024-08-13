import { FC, ReactNode, useState } from 'react';
import { FileModalContext } from './file-modal-context';

export const FileModalProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [directoryId, setDirectoryId] = useState<string | undefined>(undefined);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <FileModalContext.Provider
      value={{ open, handleOpen, handleClose, setDirectoryId, directoryId }}
    >
      {children}
    </FileModalContext.Provider>
  );
};
