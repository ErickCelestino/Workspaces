import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FC } from 'react';

interface ListContentFilesProps {
  fileImage: string;
  name: string;
  fileImageName: string;
}

export const ListContentFiles: FC<ListContentFilesProps> = ({
  fileImage,
  name,
  fileImageName,
}) => {
  const theme = useTheme();
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));
  const xlDown = useMediaQuery(theme.breakpoints.down('xl'));

  return (
    <Card
      sx={{
        width: mdDown
          ? theme.spacing(30)
          : xlDown
          ? theme.spacing(32)
          : theme.spacing(40),
        height: theme.spacing(25),
        margin: theme.spacing(2),
      }}
    >
      <CardMedia
        component="img"
        image={fileImage}
        title={fileImageName}
        sx={{
          height: theme.spacing(15),
        }}
      />
      <CardContent>
        <Typography variant="h5">{name}</Typography>
      </CardContent>
    </Card>
  );
};
