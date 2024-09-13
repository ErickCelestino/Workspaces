import { useState, useCallback } from 'react';
import { ListDirectoryRequest } from '../../services';
import { ErrorResponse, Device, Directory } from '@workspaces/domain';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../shared';

interface DirectoryDataProps {
  companyId?: string;
  loggedUserId?: string;
  showAlert: (message: string, success: boolean) => void;
}

export const useDirectoryData = (data: DirectoryDataProps) => {
  const { showAlert, loggedUserId, companyId } = data;
  const [listDirectory, setListDirectory] = useState<Directory[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);

  const getData = useCallback(
    async (input?: string, skip?: number) => {
      if (!loggedUserId) return;
      if (!companyId) return;
      try {
        const result = await ListDirectoryRequest({
          loggedUserId,
          companyId,
          skip: skip ? (skip - 1) * 6 : 0,
          userInput: input || '',
        });
        if (result) {
          setListDirectory(result.directories);
          setTotalPage(result.totalPages);
        }
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errors = ValidationsError(axiosError, 'Diretórios');
          if (errors) {
            showAlert(errors, false);
          }
        }
      }
    },
    [showAlert, loggedUserId]
  );

  return { listDirectory, totalPage, getData };
};
