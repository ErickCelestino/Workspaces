import { useState, useCallback } from 'react';
import { ListUserRequest } from '../../services';
import { ErrorResponse, UserList } from '@workspaces/domain';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../shared';

interface UserDataProps {
  loggedUserId?: string;
  showAlert: (message: string, success: boolean) => void;
}

export const useUserData = (data: UserDataProps) => {
  const { showAlert, loggedUserId } = data;
  const [listUsers, setListUsers] = useState<UserList[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);

  const getData = useCallback(
    async (input?: string, skip?: number) => {
      if (!loggedUserId) return;
      try {
        const result = await ListUserRequest({
          loggedUserId,
          skip: skip ? (skip - 1) * 8 : 0,
          filter: input || '',
        });
        if (result) {
          setListUsers(result.users);
          setTotalPage(result.totalPages);
        }
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errors = ValidationsError(axiosError, 'Usuário');
          if (errors) {
            showAlert(errors, false);
          }
        }
      }
    },
    [showAlert, loggedUserId]
  );

  return { listUsers, totalPage, getData };
};
