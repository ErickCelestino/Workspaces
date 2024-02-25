import React, { ChangeEvent } from 'react';
import styles from './input.module.scss';

interface InputProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export class InputComponent extends React.Component<InputProps> {
  render() {
    const { label, type, name, value, onChange } = this.props;

    return (
      <div className={styles['input-container']}>
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
  }
}
