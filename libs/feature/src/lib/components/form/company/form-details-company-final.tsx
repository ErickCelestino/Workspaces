import { StepItem } from '@workspaces/domain';
import { FC, useEffect, useState } from 'react';
import { useLoggedUser } from '../../../contexts';
import { useFindCompanyAdressByIdData } from '../../../hooks';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { NavigationButton } from '../../buttom';

interface FormDetailsCompanyFinalProps {
  showAlert: (message: string, success: boolean) => void;
  buttonLeft: () => void;
  companyAddressId: string;
  companyResponsibleId: string;
  step: StepItem;
  companyCityTitle?: string;
  companyCountryTitle?: string;
  companyStateTitle?: string;
  companyDistrictTitle?: string;
  companyStreetTitle?: string;
  companyNumberTitle?: string;
  companyZipCodeTitle?: string;
  companyComplementTitle?: string;
}

export const FormDetailsCompanyFinal: FC<FormDetailsCompanyFinalProps> = ({
  buttonLeft,
  showAlert,
  companyAddressId,
  companyResponsibleId,
  companyCityTitle = 'Cidade',
  companyCountryTitle = 'País',
  companyStateTitle = 'Estado',
  companyDistrictTitle = 'Bairro',
  companyStreetTitle = 'Rua',
  companyNumberTitle = 'Número',
  companyZipCodeTitle = 'CEP',
  companyComplementTitle = 'Complemento',
  step: { stepPosition = 2, totalPositions },
}) => {
  const { loggedUser } = useLoggedUser();
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (Object.keys(companyAddressId ?? '').length < 1) {
      setDataLoaded(false);
    }
  }, [companyAddressId]);

  const { companyAddressById, getCompanyAddress } =
    useFindCompanyAdressByIdData({
      companyAddressId,
      loggedUserId: loggedUser?.id ?? '',
      showAlert,
    });

  useEffect(() => {
    if (companyAddressById && !dataLoaded) {
      getCompanyAddress();
    }
  }, [loggedUser, companyAddressById, dataLoaded]);

  return (
    <Box sx={{ mt: 2 }}>
      <Card variant="outlined" sx={{ p: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>{companyCountryTitle}: </strong>
                {companyAddressById.country ?? ''}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>{companyCityTitle}: </strong>
                {companyAddressById.city ?? ''}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>{companyStateTitle}: </strong>
                {companyAddressById.state ?? ''}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>{companyDistrictTitle}: </strong>
                {companyAddressById.district ?? ''}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>{companyStreetTitle}: </strong>
                {companyAddressById.street ?? ''}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>{companyNumberTitle}: </strong>
                {companyAddressById.number ?? ''}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>{companyZipCodeTitle}: </strong>
                {companyAddressById.zipcode ?? ''}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>{companyComplementTitle}: </strong>
                {companyAddressById.complement ?? ''}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Box mt="2rem" display="flex" justifyContent="center">
        <NavigationButton
          step={stepPosition}
          totalSteps={totalPositions}
          buttonLeft={buttonLeft}
        />
      </Box>
    </Box>
  );
};
