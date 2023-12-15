
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { OverviewTotalCustomers } from '../overview/overview-total-customers';
import { OverviewTotalSales } from '../overview/overview-total-sales';
import { OverviewOrdersProgress } from '../overview/overview-orders-progress';
import { OverviewSales } from '../overview/overview-sales';
import { OverviewLatestOrders } from '../overview/overview-latest-orders';
import { OverviewLatestMedicines } from '../overview/overview-latest-medicines';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const Item = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  height: '100%',
}));

const AdminHomePage = () => {

  const navigate = useNavigate();

  return (
    require('../Styles/Admin.css'),
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,

        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid
              item
              xs={12}
              sm={6}
              lg={3}
            >
              <Item>
                <OverviewTotalCustomers
                  item
                  positive={true}
                  sx={{ height: '100%' }}
                />
              </Item>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              lg={3}
            >
              <Item>
                <OverviewOrdersProgress
                  sx={{ height: '100%' }}
                  value={75.5}
                />
              </Item>
            </Grid>
            <Grid
              xs={12}
              sm={6}
              lg={3}
            >
              <Item>
                <OverviewTotalSales
                  sx={{ height: '100%' }}
                  value="$15k"
                />
              </Item>
            </Grid>

            <Grid
              xs={12}
              lg={8}
            >
              <OverviewSales
                salesType={'year'}
                sx={{ height: '100%' }}
              />
            </Grid>

            <Grid
              xs={12}
              md={6}
              lg={4}
            >
              <OverviewSales
                salesType={'week'}
                sx={{ height: '100%' }}
              />
            </Grid>

            <Grid
              xs={12}
              md={6}
              lg={4}
            >
              <OverviewLatestMedicines
                sx={{ height: '100%' }}
              />
            </Grid>

            <Grid
              xs={12}
              md={12}
              lg={8}
            >
              <OverviewLatestOrders
                orders={[
                  {
                    id: 'f69f88012978187a6c12897f',
                    ref: 'DEV1049',
                    amount: 30.5,
                    customer: {
                      name: 'Ekaterina Tankova'
                    },
                    createdAt: 1555016400000,
                    status: 'pending'
                  },
                  {
                    id: '9eaa1c7dd4433f413c308ce2',
                    ref: 'DEV1048',
                    amount: 25.1,
                    customer: {
                      name: 'Cao Yu'
                    },
                    createdAt: 1555016400000,
                    status: 'delivered'
                  },
                  {
                    id: '01a5230c811bd04996ce7c13',
                    ref: 'DEV1047',
                    amount: 10.99,
                    customer: {
                      name: 'Alexa Richardson'
                    },
                    createdAt: 1554930000000,
                    status: 'refunded'
                  },
                  {
                    id: '1f4e1bd0a87cea23cdb83d18',
                    ref: 'DEV1046',
                    amount: 96.43,
                    customer: {
                      name: 'Anje Keizer'
                    },
                    createdAt: 1554757200000,
                    status: 'pending'
                  },
                  {
                    id: '9f974f239d29ede969367103',
                    ref: 'DEV1045',
                    amount: 32.54,
                    customer: {
                      name: 'Clarke Gillebert'
                    },
                    createdAt: 1554670800000,
                    status: 'delivered'
                  },
                  {
                    id: 'ffc83c1560ec2f66a1c05596',
                    ref: 'DEV1044',
                    amount: 16.76,
                    customer: {
                      name: 'Adam Denisov'
                    },
                    createdAt: 1554670800000,
                    status: 'delivered'
                  }
                ]}
                sx={{ height: '100%' }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

    </>
  );
};

export default AdminHomePage;
