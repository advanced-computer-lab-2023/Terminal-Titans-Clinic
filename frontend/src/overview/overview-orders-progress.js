import PropTypes from 'prop-types';
import ListBulletIcon from '@heroicons/react/24/solid/ListBulletIcon';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  SvgIcon,
  Typography
} from '@mui/material';

export const OverviewOrdersProgress = (props) => {
  const { sx } = props;

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    getProgress();
  }, []);

  const getProgress = async () => {
    let response = await axios.get('http://localhost:8000/admin/getOrderProgress', {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token')
      }
    });

    let sales = response.data.totalSales;

    let totalQuantity = response.data.totalQuantity;

    let progress = (sales / totalQuantity) * 100;

    setProgress(progress.toFixed(2));
  };

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              color="text.secondary"
              gutterBottom
              variant="overline"
            >
              Order Progress
            </Typography>
            <Typography variant="h4">
              {progress}%
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'warning.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              <ListBulletIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
        <Box sx={{ mt: 3 }}>
          <LinearProgress
            value={progress}
            variant="determinate"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

OverviewOrdersProgress.propTypes = {
  sx: PropTypes.object
};
