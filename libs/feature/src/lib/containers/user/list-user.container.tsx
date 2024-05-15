import { Box } from '@mui/material';
import { ListUser, SearchUser } from '../../components';
import { LayoutBase } from '../../layout';
import { useEffect, useState } from 'react';
import { ListUserRequest } from '../../services';
import { UserList } from '@workspaces/domain';

export const ListUserContainer = () => {
  const [userList, setUserList] = useState<UserList[]>([]);

  useEffect(() => {
    const getData = async () => {
      const result = await ListUserRequest('');
      setUserList(result);
    };
    getData();
  }, []);

  const handleData = async (text: string) => {
    const result = await ListUserRequest(text);
    setUserList(result);
  };

  return (
    <LayoutBase title="Listagem de Usuários">
      <Box display="flex" justifyContent="center">
        <Box width="70%">
          <SearchUser onSearch={handleData} placeholder="Pesquisar Usuário" />
          {userList.map((user) => (
            <ListUser
              key={user.userId}
              image="teste"
              imageAlt={`Image from ${user.name}`}
              name={`Nome: ${user.name}`}
              userId={`ID: ${user.userId}`}
              email={`Email: ${user.email}`}
              nickname={`Nickname: ${user.nickname}`}
            />
          ))}
        </Box>
      </Box>
    </LayoutBase>
  );
};
