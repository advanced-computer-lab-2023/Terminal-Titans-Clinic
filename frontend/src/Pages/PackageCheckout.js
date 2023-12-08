//checkout and payment will be done hereimport * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from 'react-bootstrap/Button'
import Typography from '@mui/material/Typography';
import { set } from 'lodash';
import axios from 'axios';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useEffect } from 'react';
import React, { useState } from 'react';

// Your component code here

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function PackageCheckout() {
    const params = new URLSearchParams(window.location.search);
    const packageId = params.get('packageId');
   
    const famId=params.get('famMemId');
    const [fees,setFees]=React.useState(0)
    const [packageName,setpackageName]=React.useState('');
    const [userName,setUserName]=React.useState('');
    const [wallet,setWallet]=React.useState(0);
    const [value, setValue] = React.useState('card');
   
    console.log(famId);
    console.log(packageId)
    const handleChange = (event) => {
      setValue(event.target.value);
    };

    const getPackage=async()=>{
    
        await axios.get(`http://localhost:8000/Patient/packageSubsInfo/${packageId}/${famId}`, 
            { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } }
          ).then(
            (res) => {
                
              const InfoData = res.data.result;
              console.log(InfoData);
              setFees(InfoData.fees);
              setpackageName(InfoData.healthPackage);
                setUserName(InfoData.user);
                setWallet(InfoData.wallet);
      
            }
          );
    }
    useEffect(() => {
        getPackage();
    }, [])
    const handlePayment = async () => {
      try {
        console.log(famId);
        const paymentMethod=value;
        const response = await axios.post(
            `http://localhost:8000/Patient/subscribeForPackage/`,
            {
              familyMember: {
                _id: famId
              },
              healthPackage: {
                _id: packageId
              }
            },
            {
              headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem("token") 
              },
              params: {
                userType: famId==null?"patient":"familyMember",
                paymentType: paymentMethod
              },
            }
          );
          if (response.status === 200) {
            if(paymentMethod==="card"){
  
              const url = response.data.url;
              window.location = url;
            }else{
              alert('Successfull payment');
              window.location.href = `/Health-Plus/packages`;
  
            }
          } else {
            //setErrorMessage(response.data.message);
            alert('Unsuccessfull payment');
          }
        
      } catch (error) {
        console.error('Error in payment:', error.message);
        alert('Unsuccessfull payment');
       // setErrorMessage(error.message);
      }
    };
  return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>

    <Card sx={{ minWidth: 275, width:'50%' }}>
      <CardContent>
       
        <Typography variant="h5" component="div">
         Package Subscribition Details
        </Typography>
        <Typography variant="h2" component="div" style={{textAlign:'center'}}>
         ${fees}
        </Typography>
        <Typography variant="h6" component="div">
         For Patient: {userName}
        </Typography>
        <Typography variant="h6" component="div">
         Package Name: {packageName}
        </Typography>
       
        <br/>
        <FormControl style={{width:'100%',textAlign:'left'}}>
            <FormLabel id="">Payment Method</FormLabel>
            <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={value}
                onChange={handleChange}
            >
                <FormControlLabel value="card" control={<Radio />} label="Card" />
                {wallet < fees ? (
                    <FormControlLabel
                        value="wallet"
                        disabled
                        control={<Radio />}
                        label={`Wallet ($${wallet})`}
                    />
                ) : (
                    <FormControlLabel
                    value="wallet"
                    control={<Radio />}
                    label={`Wallet ($${wallet})`}
                />
                )}
            </RadioGroup>
        </FormControl>
      </CardContent>
      
      <CardActions>
        <Button size="small" variant='dark' style={{marginLeft:'70%',width:'20%'}}
        onClick={handlePayment}
        >Proceed</Button>
      </CardActions>
    </Card>
    </div>
  );
}
