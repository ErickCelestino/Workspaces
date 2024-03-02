import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { FC } from 'react';

interface NotificationCardProps {
  title: string;
  buttonText: string;
  onClick?: () => void;
  imageUrl?: string;
}

export const NotificationCardComponent: FC<NotificationCardProps> = ({
  buttonText = 'button text',
  title = 'title text',
  onClick,
  imageUrl,
}) => {
  return (
    <Grid container justifyContent="center" sx={{ height: '100vh' }}>
      <Grid item xs={12} sm={8} md={6} lg={4} xl={3}>
        <Card
          sx={{
            textAlign: 'center',
            marginTop: 30,
            width: '100%',
            height: imageUrl ? '100%' : '20%',
            maxHeight: 440,
            maxWidth: 800,
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
                  alt="de"
                  style={{ maxWidth: '100%', height: 250, margin: '20px 0' }}
                />
              )}
            </div>
            <Button variant="contained" onClick={onClick}>
              {buttonText}
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
