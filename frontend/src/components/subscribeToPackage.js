import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../Styles/LoginForm.css";
import "../Styles/Appointments.css";
import "../Styles/Packages.css";
import axios from 'axios';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const PackagesTab = () => {
  const [packages, setPackages] = useState([]);
  const [regFamily, setRegFamily] = useState([]);
  const [unregFamily, setunRegFamily] = useState([]);
  const [famMemId, setFamMemId] = useState(null);
  const [selectedFam, setSelectedFam] = React.useState('');

  useEffect(() => {
    fetchHealthPackages();
    fetchData();
  }, []);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/patient/viewFamMem`, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });
      const data = response.data;
      setRegFamily(data.Result.registered);
      setunRegFamily(data.Result.unregistered);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert(error.response.data.message)
    }
  };
  const subscribe=async(id)=>{
        console.log(famMemId);
        console.log(id)
        if(famMemId && famMemId!=='myself'){
          console.log("fam")
        try {
          const response = await axios.get(`http://localhost:8000/patient/checkSub/${famMemId}`, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });
          const data = response.data.result;

          if(!data)
          navigate( 'usePackageCheckout?packageId=${id}&famMemId=${famMemId}');
          else
          alert("You are already subscribed to a package");
          
        } catch (error) {
          console.error('Error fetching data:', error);
          alert(error.response.data.message)
        }
      }
      else{
        console.log("myself")
        try {
          const response = await axios.get(`http://localhost:8000/patient/checkMySub`, { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });
          const data = response.data.result;
          console.log(data)
          if(!data)
          window.location.href = `/Health-Plus/PackageCheckout?packageId=${id}`;
          else
          alert("You are already subscribed to a package");
          
        } catch (error) {
          //console.error('Error fetching data:', error);
          alert(error.response.data.message)
        }
      }

   

}

  // const handleFamilyChange = (event) => {
  //   setSelectedFam(event.target.value);
  //   console.log(regFamily[(event.target.selectedIndex) - 1]._id);
  //   if (event.target.value !== 'myself')
  //     setFamMemId(regFamily[(event.target.selectedIndex) - 1]._id);
  //   else
  //     setFamMemId(null);
  // };

  const handleFamilyChange = (event) => {
    setSelectedFam(event.target.value);
  
    if (event.target.value !== 'myself') {
      const selectedRegFamilyMember = regFamily.find((famMem) => famMem.Name === event.target.value);
      if (selectedRegFamilyMember) {
        console.log(selectedRegFamilyMember._id);
        setFamMemId(selectedRegFamilyMember._id);
      } else {
        const selectedUnregFamilyMember = unregFamily.find((famMem) => famMem.Name === event.target.value);
  
        if (selectedUnregFamilyMember) {
          console.log(selectedUnregFamilyMember._id);
          setFamMemId(selectedUnregFamilyMember._id);
        } else {
          //law mal2etosh fe both arrays
          setFamMemId(null);
        }
      }
    } else {
      // be null law myself
      setFamMemId(null);
    }
  };
  

  const fetchHealthPackages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/patient/viewHealthCarePackages', { headers: { Authorization: 'Bearer ' + sessionStorage.getItem("token") } });
      const data = response.data;
      setPackages(data.Result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', fontStyle: 'italic', color: '#004080', margin: '20px 0' }}>Discover Our Exclusive Health Packages</h1>

      <p style={{ textAlign: 'center', marginBottom: '10px' }}>Please select the family member for whom you want to subscribe:</p>

      <div style={{ textAlign: 'center' }}>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-select-small-label">Member</InputLabel>
          <Select
            value={selectedFam}
            label="Member"
            onChange={handleFamilyChange}
          >
            <MenuItem value="" disabled>
              {selectedFam === '' ? 'Member' : ''}
            </MenuItem>
            <MenuItem value="myself">Myself</MenuItem>
            {regFamily.map((famMem) => (
              <MenuItem key={famMem._id} value={famMem.Name}>
                {famMem.Name}
              </MenuItem>
            ))}
            
           {/* {unregFamily.map((famMem) => (
              <MenuItem key={famMem._id} value={famMem.Name}>
                {famMem.Name}
              </MenuItem>
            ))} */}

          </Select>
        </FormControl>
      </div>

      <div id="packageList" style={{ display: 'flex', justifyContent: 'space-around' }}>
        {packages.length > 0 ? (
          packages.map((packageS) => (
            <div key={packageS.packageType} className="package-column">
              <div className="package-item" style={{ marginBottom: '20px', marginTop: '30px', textAlign: 'center', width: '450px', height: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <h2 style={{ color: '#004080', marginBottom: '10px', textAlign: 'center' }}>Package Type: {packageS.packageType}</h2>
                <p style={{ textAlign: 'center' }}>Subscription Fees (EGP): {packageS.subsriptionFeesInEGP}</p>
                <p style={{ textAlign: 'center' }}>Doctor Discount (%): {packageS.doctorDiscountInPercentage}</p>
                <p style={{ textAlign: 'center' }}>Medicine Discount (%): {packageS.medicinDiscountInPercentage}</p>
                <p style={{ textAlign: 'center' }}>Family Discount (%): {packageS.familyDiscountInPercentage}</p>
                <Link >
                  <Button variant="contained" style={{ backgroundColor: '#004080', color: 'white', margin: 'auto', marginBottom: '20px' }}
                   onClick={()=>subscribe(packageS._id)}>
                    Subscribe
                  </Button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#555' }}>No health packages available.</p>
        )}
      </div>
    </div>
  );
};

export default PackagesTab;
