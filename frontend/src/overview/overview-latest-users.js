import { format } from 'date-fns';
import PropTypes from 'prop-types';
import axios from 'axios';
import React from 'react';
import { Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { Scrollbar } from './scrollbar';
import { SeverityPill } from './severity-pill';

const statusMap = {
  pending: 'warning',
  active: 'success',
};

export const OverviewLatestUsers = (props) => {
  const { sx } = props;

  const [userList, setUserList] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/admin/getAllUsers/1`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      console.log(response.data.Result);
      setUserList(response.data.Result);
    } catch (error) {
      setUserList([]);
    }
  };

  return (
    <Card sx={sx}>
      <CardHeader title="List of Users" />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  User Name
                </TableCell>
                <TableCell sortDirection="desc">
                  Joined At
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList.map((user,index) => {
                const inputDate = new Date(user.createdAt);
                if(user.__t !='patient' && user.__t != 'Admin' && user.__t !='Doctor' && user.__t !='Pharmacist'){
                  return null;
                }
                if(index > 5)
                  return null;
                const day = String(inputDate.getDate()).padStart(2, '0');
                const month = String(inputDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                const year = inputDate.getFullYear();

                const formattedDate = `${day}/${month}/${year}`;

                return (
                  <TableRow
                    hover
                    key={user.id}
                  >
                    <TableCell>
                      {user.Name}
                    </TableCell>
                    <TableCell>
                      {user.Username}
                    </TableCell>
                    <TableCell>
                      {formattedDate}
                    </TableCell>
                    <TableCell>
                      {user.__t === 'patient' ? <Chip label={user.__t} color="success" style={{ minWidth: '100px' }} /> :
                        user.__t === 'Doctor' ? <Chip label={user.__t} color="secondary" style={{ minWidth: '100px' }} /> :
                          <Chip label={user.__t} color="primary" style={{ minWidth: '100px' }} />}

                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={(
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          )}
          size="small"
          variant="text"
          onClick={() => { window.location.href = 'http://localhost:3000/Health-Plus/manageUsers' }}
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
};

OverviewLatestUsers.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object
};
