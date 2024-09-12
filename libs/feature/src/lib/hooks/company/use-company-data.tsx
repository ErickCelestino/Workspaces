import { useState, useCallback } from 'react';
import { ListCompanyRequest } from '../../services';
import {
  ListSimpleCompanyResponseDto,
  ErrorResponse,
} from '@workspaces/domain';
import axios, { AxiosError } from 'axios';
import { ValidationsError } from '../../shared';

interface CompanyDataProps {
  loggedUserId?: string;
  showAlert: (message: string, success: boolean) => void;
}

export const useCompanyData = (companyData: CompanyDataProps) => {
  const { showAlert, loggedUserId } = companyData;
  const [listCompany, setListCompany] = useState<
    ListSimpleCompanyResponseDto[]
  >([]);
  const [totalPage, setTotalPage] = useState<number>(1);

  const getData = useCallback(
    async (input?: string, skip?: number) => {
      if (!loggedUserId) return;
      try {
        const result = await ListCompanyRequest({
          loggedUserId,
          filter: input || '',
          skip: skip ? (skip - 1) * 6 : 0,
          take: 6,
        });
        if (result) {
          setListCompany(result.companies);
          setTotalPage(result.totalPages);
        }
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          const errors = ValidationsError(axiosError, 'Empresa');
          if (errors) {
            showAlert(errors, false);
          }
        }
      }
    },
    [showAlert, loggedUserId]
  );

  return { listCompany, totalPage, getData };
};
