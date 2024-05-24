import { useAppIdContext, useLoggedUser } from '../../contexts';
import { LayoutBase } from '../../layout';

export const TestContainer = () => {
  const { appId } = useAppIdContext();
  const { loggedUser } = useLoggedUser();
  return (
    <LayoutBase title="Página Incial">
      <div>
        {`Nome do app: ${appId}`}
        <span>teste: {loggedUser?.id}</span>
      </div>
    </LayoutBase>
  );
};
