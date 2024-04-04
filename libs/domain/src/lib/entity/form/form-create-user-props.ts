export interface FormCreateUserProps {
  buttonTitle?: string;
  nameLabel?: string;
  nicknameLabel?: string;
  birthDateLabel?: string;
  onData?: (stepPosition: number) => void;
}
