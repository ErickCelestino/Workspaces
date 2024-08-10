import { Box, ListItem, ListItemText } from '@mui/material';
import { Scheduling } from '@workspaces/domain';
import { FC } from 'react';

interface SchedulingSimpleItemProps {
  scheduling: Scheduling;
}

export const SchedulingSimpleItem: FC<SchedulingSimpleItemProps> = ({
  scheduling,
}) => {
  return (
    <Box key={scheduling.id}>
      <ListItem>
        <ListItemText primary={scheduling.name} />
      </ListItem>
    </Box>
  );
};
