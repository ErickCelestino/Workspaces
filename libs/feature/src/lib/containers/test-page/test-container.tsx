import { Button } from '@mui/material';
import { useAppIdContext, useLoggedUser } from '../../contexts';
import { LayoutBase } from '../../layout';
import { setItemLocalStorage } from '../../services';
import { ToolbarPureTV } from '../../components';

export const TestContainer = () => {
  const { appId } = useAppIdContext();
  const { loggedUser } = useLoggedUser();

  const onClicked = () => {
    setItemLocalStorage('1', 'di');
  };

  return (
    <LayoutBase title="Página Incial" toolBar={<ToolbarPureTV />}>
      <div>
        {`Nome do app: ${appId}`}
        <span>teste: {loggedUser?.id}</span>
        <Button onClick={onClicked}>teste</Button>
      </div>
    </LayoutBase>
  );
};
