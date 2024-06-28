import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { PlaylistCategory } from '@workspaces/domain';
import { FC } from 'react';
import { ScrollBox } from '../scroll';

interface ListPlaylistCategoryProps {
  list: PlaylistCategory[];
  titleDescription?: string;
}

export const ListPlaylistCategory: FC<ListPlaylistCategoryProps> = ({
  list,
  titleDescription = 'Descrição',
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Box>
        <ScrollBox maxHeight="100%">
          <List>
            {list.map((category) => (
              <Box key={category.id}>
                <ListItem>
                  <ListItemText
                    primary={category.name}
                    secondary={
                      <Box
                        component="span"
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {titleDescription}:
                        </Typography>
                        <Typography
                          sx={{ display: 'inline', marginLeft: '4px' }}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {category.description}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </Box>
            ))}
          </List>
        </ScrollBox>
      </Box>
    </Box>
  );
};
