import {
  Avatar,
  Box,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ContentFile } from '@workspaces/domain';
import { FC } from 'react';

interface ContentFileItemProps {
  contentFile: ContentFile;
}
export const ContentFileItem: FC<ContentFileItemProps> = ({ contentFile }) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box>
      <ListItem key={contentFile.id}>
        <ListItemAvatar>
          <Avatar
            alt={contentFile.originalName}
            src={contentFile.path}
            sx={{
              width: theme.spacing(8),
              height: theme.spacing(8),
              '& img': {
                objectFit: 'contain',
                objectPosition: 'center',
                maxHeight: '100%',
                maxWidth: '100%',
              },
            }}
          />
        </ListItemAvatar>

        <ListItemText
          sx={{
            marginLeft: theme.spacing(2),
            overflow: 'hidden',
            fontSize: smDown ? '8px' : '16px',
            textOverflow: 'ellipsis',
          }}
          primary={contentFile.originalName}
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </Box>
  );
};
