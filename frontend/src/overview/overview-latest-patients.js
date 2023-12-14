import PropTypes from 'prop-types';
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
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Scrollbar } from './scrollbar';
import { SeverityPill } from './severity-pill';

const statusMap = {
  rescheduled: 'warning',
  upcoming: 'info',
  completed: 'success',
  cancelled: 'error'
};

export const OverviewLatestPatients = (props) => {
  const { sx } = props;

  const [patients, setPatients] = useState([]);

  useEffect(() => {
    getPatients();
  }, []);

  const getPatients = async () => {
    const response = await axios.get(
      `http://localhost:8000/doctor/getPatientsList2`,

      { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
    );
    if (response.status === 200) {
      const patient = response.data.Result;
      console.log(patient);
      setPatients(patient);
    }
  }

  return (
    <Card sx={sx}>
      <CardHeader title="Patient List" />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Gender
                </TableCell>
                <TableCell sortDirection="desc">
                  Date
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => {
                const date = new Date(patient.createdAt);
                const createdAt = date.toLocaleDateString("en-US");

                return (
                  <TableRow
                    hover
                    key={patient.id}
                  >
                    <TableCell>
                      {patient.Name}
                    </TableCell>
                    <TableCell>
                      {patient.Gender}
                    </TableCell>
                    <TableCell>
                      {createdAt}
                    </TableCell>
                    <TableCell>
                      <SeverityPill color={statusMap[patient.Status]}>
                        {patient.Status}
                      </SeverityPill>
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
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
};

OverviewLatestPatients.prototype = {
  sx: PropTypes.object
};
