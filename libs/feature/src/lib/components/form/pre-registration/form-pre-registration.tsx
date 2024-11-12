import { Box, Button, MenuItem, TextField } from '@mui/material';
import { FC, useState } from 'react';

interface FormPreRegistrationProps {
  nameLabel: string;
  companyNameLabel: string;
  ladingpageUse: {
    ladingpageUseLabel: string;
    ladingpageUseList: string[];
  };
  ladingPageemphasis: {
    ladingPageemphasisLabel: string;
    ladingPageemphasisList: string[];
  };
}

export const FormPreRegistration: FC<FormPreRegistrationProps> = ({
  nameLabel,
  companyNameLabel,
  ladingpageUse: { ladingpageUseLabel, ladingpageUseList },
  ladingPageemphasis: { ladingPageemphasisLabel, ladingPageemphasisList },
}) => {
  const [ladingpageUse, setLadingpageUse] = useState<string>('');
  const [ladingPageemphasis, setLadingPageemphasis] = useState<string>('');
  const [customLadingpageUse, setCustomLadingpageUse] = useState<string>('');
  const [customLadingPageemphasis, setCustomLadingPageemphasis] =
    useState<string>('');

  const handleSelectChange =
    (
      setter: React.Dispatch<React.SetStateAction<string>>,
      customSetter?: React.Dispatch<React.SetStateAction<string>>
    ) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setter(value);
      if (value === 'Outros') {
        customSetter && customSetter('');
      }
    };

  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField
        label={nameLabel}
        id={nameLabel}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TextField
        label={companyNameLabel}
        id={companyNameLabel}
        variant="outlined"
        fullWidth
        margin="normal"
      />

      <TextField
        fullWidth
        select
        value={ladingpageUse}
        margin="normal"
        InputLabelProps={{ shrink: true }}
        label={ladingpageUseLabel}
        onChange={handleSelectChange(setLadingpageUse, setCustomLadingpageUse)}
      >
        {ladingpageUseList.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
        <MenuItem value="Outros">Outros</MenuItem>
      </TextField>

      {ladingpageUse === 'Outros' && (
        <TextField
          label="Especifique o uso da landing page"
          value={customLadingpageUse}
          onChange={(e) => setCustomLadingpageUse(e.target.value)}
          fullWidth
          margin="normal"
        />
      )}

      <TextField
        fullWidth
        select
        value={ladingPageemphasis}
        margin="normal"
        InputLabelProps={{ shrink: true }}
        label={ladingPageemphasisLabel}
        onChange={handleSelectChange(
          setLadingPageemphasis,
          setCustomLadingPageemphasis
        )}
      >
        {ladingPageemphasisList.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
        <MenuItem value="Outros">Outros</MenuItem>
      </TextField>

      {ladingPageemphasis === 'Outros' && (
        <TextField
          label="Especifique o ênfase da landing page"
          value={customLadingPageemphasis}
          onChange={(e) => setCustomLadingPageemphasis(e.target.value)}
          fullWidth
          margin="normal"
        />
      )}

      <Button variant="contained" color="primary" fullWidth>
        Enviar
      </Button>
    </Box>
  );
};
