import React, { useState, forwardRef } from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { MaskType } from '@workspaces/domain';
import { formatValueMask } from '../../shared';

interface MaskedInputProps extends Omit<TextFieldProps, 'variant'> {
  maskType: MaskType;
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ maskType, ...props }, ref) => {
    const [value, setValue] = useState<string>('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(formatValueMask(event.target.value, maskType));
    };

    return (
      <TextField
        {...props}
        value={value}
        onChange={handleChange}
        fullWidth
        inputRef={ref}
      />
    );
  }
);
