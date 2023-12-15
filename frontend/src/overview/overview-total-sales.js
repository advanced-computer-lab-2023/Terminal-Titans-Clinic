import PropTypes from 'prop-types';
import CurrencyDollarIcon from '@heroicons/react/24/solid/CurrencyDollarIcon';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';

export const OverviewTotalSales = (props) => {
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

    setProgress(sales);
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
              variant="overline"
            >
              Total Sales
            </Typography>
            <Typography variant="h4">
              {progress}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'primary.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              <CurrencyDollarIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewTotalSales.propTypes = {
  value: PropTypes.string,
  sx: PropTypes.object
};
