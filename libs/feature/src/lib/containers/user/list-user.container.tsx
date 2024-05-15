import { Box, Pagination, useTheme } from '@mui/material';
import { ListUser, SearchUser } from '../../components';
import { LayoutBase } from '../../layout';
import { useEffect, useState } from 'react';
import { ListUserRequest } from '../../services';
import { UserList } from '@workspaces/domain';

export const ListUserContainer = () => {
  const [userList, setUserList] = useState<UserList[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const theme = useTheme();

  useEffect(() => {
    const getData = async () => {
      const result = await ListUserRequest({ input: '' });
      setUserList(result.users);
      setTotalPage(result.totalPages);
    };
    getData();
  }, []);

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
    const result = await ListUserRequest({ input: text });
    setUserList(result.users);
  };

  return (
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
              <div>Sem Dados</div>
            )}
          </Box>
          <Box marginTop={theme.spacing(2)} display="flex" justifyContent="end">
            <Pagination
              count={totalPage}
              color="primary"
              onChange={handleChange}
            />
          </Box>
        </Box>
      </Box>
    </LayoutBase>
  );
};
