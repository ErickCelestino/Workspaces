import { InputComponent } from '../../components';
import { useAuth } from '../../context/auth-provider/useAuth';
import { ValidateUserDto } from '@workspaces/domain';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LoginContainer: React.FC = () => {
  const [credentials, setCredentials] = useState<ValidateUserDto>({
    email: '',
    password: '',
  });

  const auth = useAuth();
  const history = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const onFinish = async () => {
    try {
      await auth.authenticate(credentials.email, credentials.password);
      history('/');
      console.log('passou no finish');
    } catch (error) {
      console.error('Invalid email or password');
    }
  };

  const handleLogin = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    await onFinish();
    console.log('Usuário:', credentials.email);
    console.log('Senha:', credentials.password);
  };

  return (
    <div className="App">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <InputComponent
          label="Digite seu e-mail"
          type="text"
          name="email"
          value={credentials.email}
          onChange={handleInputChange}
        />
        <br />
        <InputComponent
          label="Digite sua senha"
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleInputChange}
        />
        <br />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};
