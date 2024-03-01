import { ChangeEvent, FC } from 'react';

interface InputProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const InputComponent: FC<InputProps> = ({
  label = 'label',
  name = 'name',
  onChange,
  value = '',
  type = '',
}) => {
  return (
    <div>
      <label>{label}</label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
