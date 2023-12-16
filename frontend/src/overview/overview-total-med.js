import PropTypes from 'prop-types';
import CurrencyDollarIcon from '@heroicons/react/24/solid/CurrencyDollarIcon';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';
import MedicationIcon from '@mui/icons-material/Medication';

export const OverviewTotalProfit = (props) => {
  const { sx } = props;

  const [wltAmnt, setWltAmnt] = useState([]);

  useEffect(() => {
    fetchwltAmnt();
  }, []);

  const fetchwltAmnt = async () => {
    try {
      const response = await axios.get("http://localhost:8000/patient/getNmberOfMed", {
       
      });

      let result = response.data.Amount;
      // get only 2 digits after decimal
     
      setWltAmnt(result);


    } catch (error) {
      console.error('Error fetching wallet data:', error.message);
    }
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
                Number of Medications
            </Typography>
            <Typography variant="h4">
              {wltAmnt}
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
              <MedicationIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewTotalProfit.propTypes = {
  value: PropTypes.string,
  sx: PropTypes.object
};
