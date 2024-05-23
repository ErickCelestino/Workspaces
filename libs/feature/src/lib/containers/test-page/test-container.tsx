import { useAppIdContext } from '../../contexts';
import { LayoutBase } from '../../layout';

export const TestContainer = () => {
  const { appId } = useAppIdContext();
  return (
    <LayoutBase title="Página Incial">{`Nome do app: ${appId}`}</LayoutBase>
  );
};
