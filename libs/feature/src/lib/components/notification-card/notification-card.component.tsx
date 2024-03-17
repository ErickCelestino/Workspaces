import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { FC } from 'react';

interface NotificationCardProps {
  title: string;
  buttonText: string;
  onClick?: () => void;
  imageUrl?: string;
}

/*
import { Box, useMediaQuery, useTheme } from "@mui/material";
import React, { ReactNode } from "react";

interface ILayoutBaseNotificationLayout {
  children: ReactNode;
}

export const LayoutBaseNotificationLayout: React.FC<ILayoutBaseNotificationLayout> = ({
  children
}) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const mdDown = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      {children}
    </Box>
  )
}

*/

export const NotificationCardComponent: FC<NotificationCardProps> = ({
  buttonText = 'button text',
  title = 'title text',
  onClick,
  imageUrl,
}) => {
  return (
    <Box width="100%" height="100%" display="flex" flexDirection="column">
      <Card
        sx={{
          textAlign: 'center',
          marginTop: 30,
          width: '100%',
          height: imageUrl ? '100%' : '20%',
          maxHeight: 440,
          maxWidth: 600,
          minHeight: 240,
        }}
      >
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '90%',
          }}
        >
          <div>
            <Typography variant="h5" sx={{ marginTop: 2 }}>
              {title}
            </Typography>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="default"
                style={{ maxWidth: '100%', height: 250, margin: '20px 0' }}
              />
            )}
          </div>
          <Button variant="contained" onClick={onClick}>
            {buttonText}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};
