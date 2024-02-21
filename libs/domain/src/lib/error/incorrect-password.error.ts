import { UseCaseError } from '../base/use-case-error';

export class IncorrectPassword extends Error implements UseCaseError {
  constructor() {
    super('The password provided is icorrect');
    this.name = 'IncorrectPassword';
  }
}
