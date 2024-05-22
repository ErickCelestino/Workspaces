import { useAppNameContext } from '../../contexts';
import { LayoutBase } from '../../layout';

export const TestContainer = () => {
  const { appName } = useAppNameContext();
  return (
    <LayoutBase title="Página Incial">{`Nome do app: ${appName}`}</LayoutBase>
  );
};
