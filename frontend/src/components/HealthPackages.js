import * as React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Button } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function createData(
  patientId,
  name,
  packageType,
  subscriptionFee,
  medicineDiscount,
  familyDiscount,
  doctorDiscount,
  statusHealthPackage,
) {
  return {
    patientId,
    name,
    packageType,
    subscriptionFee,
    medicineDiscount,
    familyDiscount,
    doctorDiscount,
    history: statusHealthPackage,
  };
}

// function alertCancel(){
//   AlertDialog();
// }

function Row(props) {
  const { row, fetchHealthPackageData } = props;
  const [open, setOpen] = React.useState(false);
  const [show, setShow] = useState(false);

  const [openDialogue, setOpenDialogue] = React.useState(false);
  const [patientSelected, setPatientSelected] = React.useState('');

  const handleClickOpen = (id) => {
    setPatientSelected(id);
    setOpenDialogue(true);
  };

  const handleClose = () => {
    setPatientSelected('');
    setOpenDialogue(false);
  };

  const handleAgree = () => {
    axios({
      method: 'put',
      url: 'http://localhost:8000/patient/cancelMySub',
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token')
      },
      data: {
        patientId: patientSelected
      },
    }).then((response) => {
      console.log(response);
      setShow(true);
      fetchHealthPackageData();
    }).catch((error) => {
      alert(error.response.data.message)
    });
    setOpenDialogue(false);
  }

  return (
    <React.Fragment>
      <ToastContainer
        className="p-3"
        position='top-end'
        style={{ zIndex: 1 }}
      >
        <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Successfull</strong>
          </Toast.Header>
          <Toast.Body>Cancelled Health Package Successfully</Toast.Body>
        </Toast>
      </ToastContainer>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {row.name}
        </TableCell>
        {row.packageType ? (
          <React.Fragment>
            <TableCell align="center">{row.packageType}</TableCell>
            <TableCell align="center">{row.subscriptionFee}</TableCell>
            <TableCell align="center">{row.medicineDiscount}</TableCell>
            <TableCell align="center">{row.familyDiscount}</TableCell>
            <TableCell align="center">{row.doctorDiscount}</TableCell>
            <TableCell align="center">
              <Button variant="outlined" startIcon={<CancelIcon />} color="error" onClick={() => handleClickOpen(row.patientId)}>
                Cancel
              </Button>
            </TableCell>
          </React.Fragment>
        ) : (
          <TableCell colSpan="6" align="center"><Alert className='justify-content-center' severity="error">HAS NO CURRENT SUBSCRIPTION</Alert></TableCell>
        )}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              {
                row.history?.length !== 0 ? (
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell>End Date</TableCell>
                        <TableCell align="right">Renewal Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.history.map((historyRow) => (
                        <TableRow key={historyRow.status}>
                          <TableCell component="th" scope="row">
                            {historyRow.status}
                          </TableCell>
                          <TableCell>{historyRow.endDate}</TableCell>
                          <TableCell align="right">{historyRow.renewalDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Alert className='justify-content-center' severity="error">HAS NO HISTORY</Alert>
                )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <Dialog
        open={openDialogue}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to cancel?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You will be cancelling this user Health Package!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleAgree} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}


export default function CollapsibleTable() {
  const [rows, setRows] = useState([]);
  async function fetchHealthPackageData() {
    try {
      const responseViewSubs = await axios.get("http://localhost:8000/patient/viewSubscriptions", {
        headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token') }
      });
      const responseViewSubsStatus = await axios.get("http://localhost:8000/patient/viewSubscriptionStatus", {
        headers: { Authorization: 'Bearer ' + sessionStorage.getItem('token') }
      });

      const result = responseViewSubs.data.result;
      const resultStatus = responseViewSubsStatus.data.result;
      let temp = [];
      temp.push(createData(result.myUser.PatientId, result.myUser.Name,
        result.myUser?.healthPackage?.packageType, result.myUser?.healthPackage?.subsriptionFeesInEGP,
        result.myUser?.healthPackage?.medicinDiscountInPercentage,
        result.myUser?.healthPackage?.familyDiscountInPercentage,
        result.myUser?.healthPackage?.doctorDiscountInPercentage, resultStatus.myUser));

      console.log(resultStatus?.familyMembers);
      for (let i = 0; i < result.familyMembers.length; i++) {
        temp.push(createData(result.familyMembers[i].PatientId, result.familyMembers[i].Name,
          result.familyMembers[i].packageType, result.familyMembers[i].subsriptionFeesInEGP,
          result.familyMembers[i].medicinDiscountInPercentage, result.familyMembers[i].familyDiscountInPercentage,
          result.familyMembers[i].doctorDiscountInPercentage, resultStatus?.familyMembers));
      }
      setRows(temp);
      // setPatientHealthPackageData(result.myUser);
      // setFamilyHealthPackageData(result.familyMembers);
    } catch (error) {
      console.error('Error fetching health package data:', error.message);
    }
  }
  useEffect(() => {
    fetchHealthPackageData();
  }, []);
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell align="center">Patient Name</TableCell>
            <TableCell align="center">Package Type</TableCell>
            <TableCell align="center">Subscription Fee</TableCell>
            <TableCell align="center">Medicine Discount</TableCell>
            <TableCell align="center">Family Discount</TableCell>
            <TableCell align="center">Doctor Discount</TableCell>
            <TableCell align="center">Cancel Subscription</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} fetchHealthPackageData={fetchHealthPackageData} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}











// const HealthPackageSubscriptionPage = () => {
//   const [patientHealthPackageData, setPatientHealthPackageData] = useState({});
//   const [familyHealthPackageData, setFamilyHealthPackageData] = useState([]);

//   const [patientHealthPackageStatus, setPatientHealthPackageStatus] = useState([]);
//   const [familyHealthPackageStatus, setfamilyHealthPackageStatus] = useState([]);

//   const [patientHealthPackageCancel, setPatientHealthPackageCancel] = useState({});
//   const [familyHealthPackageCancel, setfamilyHealthPackageCancel] = useState([]);

//   const fetchHealthPackageData = async () => {
//     try {
//       const response = await axios.get("http://localhost:8000/patient/viewSubscriptions", {
//         headers: {
//           Authorization: 'Bearer ' + sessionStorage.getItem('token')
//         }
//       });

//       const result = response.data.result;
//       setPatientHealthPackageData(result.myUser);
//       setFamilyHealthPackageData(result.familyMembers);

//     } catch (error) {
//       console.error('Error fetching health package data:', error.message);
//     }
//   };

//   const fetchHealthPackageStatus = async () => {
//     try {
//       const response = await axios.get("http://localhost:8000/patient/viewSubscriptionStatus", {
//         headers: {
//           Authorization: 'Bearer ' + sessionStorage.getItem('token')
//         }
//       });

//       const result = response.data.result;
//       console.log(result);
//       setPatientHealthPackageStatus(result.myUser);
//       console.log(result.myUser);
//       setfamilyHealthPackageStatus(result.familyMembers);

//     } catch (error) {
//       console.error('Error fetching health package status:', error.message);
//     }
//   };

//   const cancelHeathPackage = async () => {
//     try {
//       const response = await axios({
//         method: 'put',
//         url: 'http://localhost:8000/patient/cancelSub',
//         headers: {
//           Authorization: 'Bearer ' + sessionStorage.getItem('token')
//         }
//       }).then((response) => {
//         console.log(response);
//         alert(response.data.message + " Please refresh the page to see the changes")
//       }).catch((error) => {
//         alert(error.response.data.message)
//       });

//       const result = response.data.result;
//       setPatientHealthPackageCancel(result.myUser);
//       setfamilyHealthPackageCancel(result.familyMembers);

//     } catch (error) {
//       console.error('Error cancelling health package:', error.message);
//     }
//   };

//   return (
//     <div>
//       <button
//         style={{ background: 'green', color: 'white', padding: '8px', cursor: 'pointer' }}
//         onClick={fetchHealthPackageData}>
//         View Subscribed HealthPackages
//       </button>
//       {/* subscribed health package front */}
//       <div style={{ marginTop: '20px' }}>
//         <h4>Patient HealthPackage Data:</h4>
//         <table style={{ borderCollapse: 'collapse', width: '100%' }}>
//           <thead>
//             <tr>
//               <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Package Type</th>
//               <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Subscription Fees</th>
//               <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Medicine Discount</th>
//               <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Family Discount</th>
//               <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Doctor Discount</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{patientHealthPackageData.packageType || 'No sub'}</td>
//               <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{patientHealthPackageData.subsriptionFeesInEGP || 'No sub'} EGP</td>
//               <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{patientHealthPackageData.medicinDiscountInPercentage || 'No sub'}%</td>
//               <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{patientHealthPackageData.familyDiscountInPercentage || 'No sub'}%</td>
//               <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{patientHealthPackageData.doctorDiscountInPercentage || 'No sub'}%</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//       {/*status patient front  */}
//       <div style={{ marginTop: '20px' }}>
//         <h4>FamilyMembers HealthPackage Data:</h4>
//         <table style={{ borderCollapse: 'collapse', width: '100%' }}>
//           <thead>
//             <tr>
//               <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Name</th>
//               <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Email</th>
//               <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Package Type</th>
//               <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Subscription Fees</th>
//               <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Medicine Discount</th>
//               <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Family Discount</th>
//               <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Doctor Discount</th>
//             </tr>
//           </thead>
//           <tbody>
//             {familyHealthPackageData.map((familyMember, index) => (
//               <tr key={index}>
//                 <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{familyMember.Name}</td>
//                 <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{familyMember.Email}</td>
//                 <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{familyMember.packageType || 'No sub'}</td>
//                 <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{familyMember.subsriptionFeesInEGP || 'No sub'} EGP</td>
//                 <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{familyMember.medicinDiscountInPercentage || 'No sub'}%</td>
//                 <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{familyMember.familyDiscountInPercentage || 'No sub'}%</td>
//                 <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{familyMember.doctorDiscountInPercentage || 'No sub'}%</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {/* family members status front */}
//       <div style={{ marginTop: '20px' }}>
//         <button
//           style={{ background: 'green', color: 'white', padding: '8px', cursor: 'pointer' }}
//           onClick={fetchHealthPackageStatus}>
//           View HealthPackages Status
//         </button>

//         <div style={{ marginTop: '20px' }}>
//           <h4>Patient HealthPackage Status:</h4>
//           {/* {patientHealthPackageStatus[0].status} */}
//           <table style={{ borderCollapse: 'collapse', width: '100%' }}>
//             <thead>
//               <tr>
//                 <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Status</th>
//                 <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Renewal Date</th>
//                 <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>End Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {
//                 patientHealthPackageStatus.map((packageUser, index) => (
//                   <tr key={index}>
//                     <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{packageUser.status}</td>
//                     <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{packageUser.renewalDate || 'Nothing'}</td>
//                     <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{packageUser.endDate || 'Nothing'}</td>
//                   </tr>
//                 ))
//               }
//             </tbody>
//           </table>
//         </div>

//         <div style={{ marginTop: '20px' }}>
//           <h4>FamilyMembers HealthPackage Status:</h4>
//           <table style={{ borderCollapse: 'collapse', width: '100%' }}>
//             <thead>
//               <tr>
//                 <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Relation</th>
//                 <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Status</th>
//                 <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>Renewal Date</th>
//                 <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>End Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {familyHealthPackageStatus.map((familyMembers, index) => (
//                 <tr key={index}>
//                   <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{familyMembers.Relation}</td>
//                   <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{familyMembers.status}</td>
//                   <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{familyMembers.renewalDate || 'Nothing'}</td>
//                   <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '5px' }}>{familyMembers.endDate || 'Nothing'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* cancellation front */}
//       <div style={{ marginTop: '20px' }}>
//         <button
//           style={{ background: 'red', color: 'white', padding: '8px', cursor: 'pointer' }}
//           onClick={cancelHeathPackage}>
//           Cancel Subscription
//         </button>
//       </div>
//     </div>
//   );
// };

// export default HealthPackageSubscriptionPage;
