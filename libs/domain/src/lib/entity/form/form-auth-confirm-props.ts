export interface AuthConfirmProps {
  emailLabel?: string;
  passwordLabel?: string;
  confirmPasswordLabel?: string;
  buttonTitle?: string;
  showAlert?: (message: string) => void;
}
