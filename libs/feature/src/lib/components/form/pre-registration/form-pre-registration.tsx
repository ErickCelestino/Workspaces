import { Box, Button, TextField, useTheme } from '@mui/material';
import { FC, useState } from 'react';
import { CustomSelect } from '../../combo-box/select-custom';

interface FormPreRegistrationProps {
  nameLabel: string;
  textColor?: string;
  textLabelColor?: string;
  companyNameLabel: string;
  buttonTitle?: string;
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
  textColor = 'black',
  textLabelColor = '#fff',
  ladingpageUse,
  ladingPageemphasis,
  buttonTitle = 'Fale com consultor',
}) => {
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [ladingpageUseValue, setLadingpageUseValue] = useState('');
  const [ladingPageemphasisValue, setLadingPageemphasisValue] = useState('');
  const [customLadingpageUse, setCustomLadingpageUse] = useState('');
  const [customLadingPageemphasis, setCustomLadingPageemphasis] = useState('');

  const theme = useTheme();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = {
      name,
      companyName,
      ladingpageUse:
        ladingpageUseValue === 'Outros'
          ? customLadingpageUse
          : ladingpageUseValue,
      ladingPageemphasis:
        ladingPageemphasisValue === 'Outros'
          ? customLadingPageemphasis
          : ladingPageemphasisValue,
    };
    console.log('Dados do formulário:', formData);
  };

  return (
    <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
      <TextField
        label={nameLabel}
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        variant="outlined"
        sx={{ mb: 2, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1 }}
        InputLabelProps={{ style: { color: textColor } }}
        InputProps={{
          style: { color: textColor, fontSize: theme.spacing(1.8) },
        }}
      />
      <TextField
        label={companyNameLabel}
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        fullWidth
        variant="outlined"
        sx={{ mb: 2, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1 }}
        InputLabelProps={{ style: { color: textColor } }}
        InputProps={{
          style: { color: textColor, fontSize: theme.spacing(1.8) },
        }}
      />
      <CustomSelect
        label={ladingpageUse.ladingpageUseLabel}
        options={ladingpageUse.ladingpageUseList}
        value={ladingpageUseValue}
        onChange={setLadingpageUseValue}
        customInput={customLadingpageUse}
        setCustomInput={setCustomLadingpageUse}
        textColor={textColor}
        textLabelColor={textLabelColor}
      />
      <CustomSelect
        label={ladingPageemphasis.ladingPageemphasisLabel}
        options={ladingPageemphasis.ladingPageemphasisList}
        value={ladingPageemphasisValue}
        onChange={setLadingPageemphasisValue}
        customInput={customLadingPageemphasis}
        setCustomInput={setCustomLadingPageemphasis}
        textColor={textColor}
        textLabelColor={textLabelColor}
      />
      <Button
        type="submit"
        variant="outlined"
        color="inherit"
        sx={{
          borderRadius: theme.spacing(1),
          textTransform: 'none',
          mt: theme.spacing(2),
        }}
        fullWidth
      >
        {buttonTitle}
      </Button>
    </Box>
  );
};
