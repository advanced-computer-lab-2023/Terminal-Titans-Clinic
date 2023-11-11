import axios from 'axios';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';  
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const { useState } = require("react");

const AptmntsList = () => { 

  const params=new URLSearchParams(window.location.search);

  const [aptmnts,setAptmnts] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState('');

  const getAptmnts = async () => {
    const response = await axios.post(
      `http://localhost:8000/patient/getAppointment`,
      { startDate, endDate, status },
      { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
    );
    if (response.status === 200) {
      const aptmnts = response.data;
      console.log(aptmnts);
      setAptmnts(aptmnts);
    }
  }

  return(
    <div className="UsersList">
      <Box sx={{marginBottom: 2}}>
        <Stack spacing={3} direction="row">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            {/* <DatePicker
              label="Select Start Date"
              value={startDate}
              onChange={(newValue) => {
                setStartDate(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="Select End Date"
              value={endDate}
              onChange={(newValue) => {
                setEndDate(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            /> */}
          </LocalizationProvider>
          <TextField
            select
            label="Select Status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
            }}
            helperText="Please select status"
          >
            <MenuItem value="cancelled">Cancelled</MenuItem>
            <MenuItem value="upcoming">Upcoming</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="rescheduled">Rescheduled</MenuItem>
          </TextField>
          <Button variant="contained" onClick={getAptmnts} margin="normal" padding="normal">Load Appointments</Button>
        </Stack>
        
        <input
            type="Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        <input
            type="Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Date</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Doctor</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {aptmnts.map((aptmnts) => (
              <TableRow
                hover
                sx={{
                  "&:hover":{
                    cursor: "pointer",
                    backgroundColor: "#f5f5f5",
                    width: "100%"
                  }
                }}
                onClick={() => window.location.href=`/filter?userId=${aptmnts._id}`}
                key={aptmnts._id}
              >
                <TableCell align="center">{aptmnts.Date}</TableCell>
                <TableCell align="center">{aptmnts.Status}</TableCell>
                <TableCell align="center">{aptmnts.Name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default AptmntsList;
