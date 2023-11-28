import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid  ,
    GridToolbar,getGridStringOperators} from '@mui/x-data-grid';
import axios from 'axios';
import { useState, useEffect } from 'react';



const   PatientList = () => { 
    const [patients,setPatients] = useState([]);
    const [filterButtonEl, setFilterButtonEl] = React.useState(null);

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

const columns = [
  { field: 'id', headerName: 'ID', width: 90 ,
  filterable: false},
  {
    field: 'Name',
    headerName: 'Name',
    width: 250,
    filterOperators: getGridStringOperators().filter(
        (operator) => operator.value === 'contains' ,
      ),
    
  },
  {
    field: 'upcoming',
    headerName: 'upcoming',
    width: 150,
    editable: true,
    type:'boolean'
  },
  {
    field: 'Gender',
    headerName: 'Gender',
    width: 200,
    editable: true,
    filterable: false
  },
  {
    field: 'Mobile',
    headerName: 'Mobile',
    width: 200,
    editable: true,
    filterable: false
  },
  {
    field: 'Email',
    headerName: 'Email',
    width: 300,
    editable: true,
    filterable: false
  },
  {
    field: 'DateOfBirth',
    headerName: 'DateOfBirth',
    width: 300,
    editable: true,
    filterable: false
  },
];
const columnVisibilityModel = React.useMemo(() => {
    
    return {
      upcoming: false,
      id: false,
    };
  }, []);

useEffect(() => {
    getPatients();
  }, []);

  return (
    <div>
    <h1>Patients List</h1>
    <Box sx={{ height: 1000, width: '100%' }}>
      <DataGrid
        rows={patients}
        columns={columns}
        columnVisibilityModel={columnVisibilityModel}
        slots={{ toolbar: GridToolbar }}
        pageSizeOptions={[5]}
        
      />
    </Box>
    </div>
  );
}

export default PatientList;
