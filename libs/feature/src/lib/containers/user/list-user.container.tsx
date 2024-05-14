import { Box } from '@mui/material';
import { ListUser } from '../../components';
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

  return (
    <LayoutBase title="Listagem de Usuários">
      <Box width="100%" display="flex" justifyContent="center">
        <Box width="80%">
          {userList.map((user) => (
            <ListUser
              key={user.userId}
              image="teste"
              imageAlt={`image from ${user.name}`}
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
