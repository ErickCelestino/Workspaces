import { ValidateUserDto } from '@workspaces/domain';
import React, { ChangeEvent, FormEvent } from 'react';
import { InputComponent } from '../../components';

export class LoginContainer extends React.Component<object, ValidateUserDto> {
  constructor(props: object) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    this.setState({ [name]: value } as Pick<
      ValidateUserDto,
      keyof ValidateUserDto
    >);
  };

  handleLogin = (e: FormEvent): void => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica de autenticação
    console.log('Usuário:', this.state.email);
    console.log('Senha:', this.state.password);
    // Adicione sua lógica de autenticação aqui
  };

  render() {
    return (
      <div className="App">
        <h1>Login</h1>
        <form onSubmit={this.handleLogin}>
          <InputComponent
            label="Digite seu e-mail"
            type="text"
            name="email"
            value={this.state.email}
            onChange={this.handleInputChange}
          />
          <br />
          <InputComponent
            label="Digite sua senha"
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleInputChange}
          />
          <br />
          <button type="submit">Entrar</button>
        </form>
      </div>
    );
  }
}
