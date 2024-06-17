import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
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
  return (
    <Card
      sx={{
        width: theme.spacing(40),
      }}
    >
      <CardMedia component="img" image={fileImage} title={fileImageName} />
      <CardContent>
        <Typography variant="h5">{name}</Typography>
      </CardContent>
    </Card>
  );
};
