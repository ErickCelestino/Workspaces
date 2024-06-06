import { Box, Card, useTheme } from '@mui/material';
import { LayoutBase } from '../../layout';
import { FilesUpload } from '../../components';
import { getItemLocalStorage } from '../../services';

export const FilesContainer = () => {
  const theme = useTheme();

  return (
    <LayoutBase title="Arquivos">
      <Box display="flex" justifyContent="center">
        <Card
          component="span"
          sx={{
            height: theme.spacing(90),
            width: theme.spacing(100),
          }}
        >
          <FilesUpload
            directoryId={getItemLocalStorage('di')}
            width={theme.spacing(100)}
            height={theme.spacing(30)}
          />
        </Card>
      </Box>
    </LayoutBase>
  );
};
