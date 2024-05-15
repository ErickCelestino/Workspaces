import { Box, Icon, Pagination, Typography, useTheme } from '@mui/material';
import { ListUser, SearchUser } from '../../components';
import { LayoutBase } from '../../layout';
import { useEffect, useState } from 'react';
import { ListUserRequest } from '../../services';
import { ErrorResponse, UserList } from '@workspaces/domain';
import { useSnackbarAlert } from '../../hooks';
import axios, { AxiosError } from 'axios';
import { ConnectionError } from '../../shared';

export const ListUserContainer = () => {
  const [userList, setUserList] = useState<UserList[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const theme = useTheme();
  const { showSnackbarAlert, SnackbarAlert } = useSnackbarAlert();

  useEffect(() => {
    const getData = async () => {
      const result = await ListUserRequest({ input: '' });
      setUserList(result.users);
      setTotalPage(result.totalPages);
    };
    getData();
  }, []);

  const showErrorAlert = (message: string) => {
    showSnackbarAlert({
      message: message,
      severity: 'error',
    });
  };

  const handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    const result = await ListUserRequest({
      input: '',
      skip: (value - 1) * 4,
    });
    setUserList(result.users);
  };

  const handleData = async (text: string) => {
    try {
      const result = await ListUserRequest({ input: text });
      setUserList(result.users);
    } catch (error) {
      console.error((error as { message: string }).message);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        switch (axiosError.response?.data.error.name) {
          default:
            showErrorAlert(ConnectionError('PT-BR'));
            break;
        }
      }
    }
  };

  return (
    <>
      <LayoutBase title="Listagem de Usuários">
        <Box display="flex" justifyContent="center">
          <Box width="70%">
            <SearchUser onSearch={handleData} placeholder="Pesquisar Usuário" />
            <Box width="95%">
              {userList.length > 0 ? (
                userList.map((user) => (
                  <ListUser
                    key={user.userId}
                    image="teste"
                    imageAlt={`Image from ${user.name}`}
                    name={`Nome: ${user.name}`}
                    userId={`ID: ${user.userId}`}
                    email={`Email: ${user.email}`}
                    nickname={`Nickname: ${user.nickname}`}
                  />
                ))
              ) : (
                <Box
                  marginTop={theme.spacing(2)}
                  width="100%"
                  display="flex"
                  justifyContent="center"
                >
                  <Typography variant="h4">
                    Não foram encontrados registros
                  </Typography>
                </Box>
              )}
            </Box>
            <Box
              marginTop={theme.spacing(2)}
              display="flex"
              justifyContent="end"
            >
              <Pagination
                count={totalPage}
                color="primary"
                onChange={handleChange}
              />
            </Box>
          </Box>
        </Box>
      </LayoutBase>
      {SnackbarAlert}
    </>
  );
};
