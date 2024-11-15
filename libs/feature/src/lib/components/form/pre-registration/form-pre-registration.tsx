import { Box, Button, useTheme } from '@mui/material';
import { FC, useState } from 'react';
import { CustomInput, CustomSelect } from '../../input';

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
      <CustomInput
        label={nameLabel}
        value={name}
        color={{
          textColor: 'black',
          backgroundInputColor: 'white',
        }}
        onChange={(e) => setName(e.target.value)}
      />
      <CustomInput
        label={companyNameLabel}
        value={companyName}
        color={{
          textColor: 'black',
          backgroundInputColor: 'white',
        }}
        onChange={(e) => setCompanyName(e.target.value)}
      />
      <CustomSelect
        label={ladingpageUse.ladingpageUseLabel}
        options={ladingpageUse.ladingpageUseList}
        value={ladingpageUseValue}
        onChange={setLadingpageUseValue}
        customInput={customLadingpageUse}
        setCustomInput={setCustomLadingpageUse}
        color={{
          textColor: textColor,
          labelColor: textLabelColor,
        }}
      />
      <CustomSelect
        label={ladingPageemphasis.ladingPageemphasisLabel}
        options={ladingPageemphasis.ladingPageemphasisList}
        value={ladingPageemphasisValue}
        onChange={setLadingPageemphasisValue}
        customInput={customLadingPageemphasis}
        setCustomInput={setCustomLadingPageemphasis}
        color={{
          textColor: textColor,
          labelColor: textLabelColor,
        }}
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
