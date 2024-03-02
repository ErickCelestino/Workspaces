import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context';
import { NotificationCardComponent } from '../notification-card';

export const ProtectedLayout = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();
  const navigate = useNavigate();

  const redirectLogin = () => {
    navigate('/login');
  };

  if (!auth.email) {
    return (
      <NotificationCardComponent
        title="Você não tem acesso a esta página"
        buttonText="Fazer Login"
        imageUrl="/assets/svg/denied-access.svg"
        onClick={redirectLogin}
      />
    );
  }

  return children;
};
