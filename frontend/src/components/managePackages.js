

import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Nav from "../components/Admin-NavBar.js";


function ManagePackages() {
  const [isEditFormValid, setIsEditFormValid] = useState(false);

  const [packageList, setPackageList] = useState([]);
  const [editPackage, setEditPackage] = useState(null);
  const [editedPackage, setEditedPackage] = useState({
    packageType: '',
    subscriptionFees: '',
    doctorDiscount: '',
    medicineDiscount: '',
    familyDiscount: '',
  });

  useEffect(() => {
    const isEditFormValid =
      editedPackage.packageType !== '' &&
      editedPackage.subscriptionFees !== '' &&
      editedPackage.doctorDiscount !== '' &&
      editedPackage.medicineDiscount !== '' &&
      editedPackage.familyDiscount !== '';
  
    setIsEditFormValid(isEditFormValid);
  }, [editedPackage]);
  

  const [newPackage, setNewPackage] = useState({
    packageType: '',
    subscriptionFees: '',
    doctorDiscount: '',
    medicineDiscount: '',
    familyDiscount: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);


  const handleAddPackage = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveModal = async () => {
    // Extract values from the newPackage state
    const {
      packageType,
      subscriptionFees,
      doctorDiscount,
      medicineDiscount,
      familyDiscount,
    } = newPackage;

    const newPackageData = {
      healthPackage: {
        packageType,
        subsriptionFeesInEGP: subscriptionFees,
        doctorDiscountInPercentage: doctorDiscount,
        medicinDiscountInPercentage: medicineDiscount,
        familyDiscountInPercentage: familyDiscount,
      }
    };
    
      if(isFormValid){

        try {
          const response = await axios.post('http://localhost:8000/admin/addHealthPackage', newPackageData, {
            headers: {
              Authorization: 'Bearer ' + sessionStorage.getItem("token")
            }
          });
    
          const data = response.data;
    
          if (data.success) {
            alert('Health package added successfully.');
            fetchHealthPackages(); // Reload the health packages after adding
            setShowModal(false); // Close the modal
          } else {
            alert('Failed to add health package: ' + data.message);
          }
        } catch (error) {
          console.error('Error:', error);
          alert('An error occurred while adding the health package: ' + error.message);
        }
      }else {
        alert('Please fill in all fields before saving.');
      }

  };

  const fetchHealthPackages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/admin/viewHealthPackages', {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem("token")
        }
      });

      setPackageList(response.data.packages);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while fetching health packages: ' + error.message);
    }
  };

  useEffect(() => {
    const isFormValid =
      newPackage.packageType !== '' &&
      newPackage.subscriptionFees !== '' &&
      newPackage.doctorDiscount !== '' &&
      newPackage.medicineDiscount !== '' &&
      newPackage.familyDiscount !== '';

    setIsFormValid(isFormValid);
  }, [newPackage]);


  useEffect(() => {
    fetchHealthPackages();
  }, []);

  const deleteHealthPackage = async (packageType) => {
    try {
      const response = await axios.delete('http://localhost:8000/admin/deleteHealthPackage', {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem("token")
        },
        data: {
          packageType: packageType
        }
      });

      const data = response.data;

      if (data.success) {
        alert('Health package successfully deleted.');
        fetchHealthPackages(); // Refresh the health packages after deletion
      } else {
        alert('Failed to delete health package: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while deleting the health package: ' + error.message);
    }
  };

  const handleEdit = (packageItem) => {
    setEditPackage(packageItem);
    setEditedPackage({
      packageType: packageItem.packageType,
      subscriptionFees: packageItem.subsriptionFeesInEGP.toString(),
      doctorDiscount: packageItem.doctorDiscountInPercentage.toString(),
      medicineDiscount: packageItem.medicinDiscountInPercentage.toString(),
      familyDiscount: packageItem.familyDiscountInPercentage.toString(),
    });
  };

  const handleCancelEdit = () => {
    setEditPackage(null);
  };

  const handleSaveEdit = async () => {
    // Extract values from the editedPackage state
    const {
      packageType,
      subscriptionFees,
      doctorDiscount,
      medicineDiscount,
      familyDiscount,
    } = editedPackage;

    const updatedPackage = {
      healthPackage: {
        packageType,
        subsriptionFeesInEGP: parseFloat(subscriptionFees),
        doctorDiscountInPercentage: parseFloat(doctorDiscount),
        medicinDiscountInPercentage: parseFloat(medicineDiscount),
        familyDiscountInPercentage: parseFloat(familyDiscount),
      }
    };

    try {
      const response = await axios.put('http://localhost:8000/admin/updateHealthPackage', updatedPackage, {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem("token")
        }
      });

      const data = response.data;

      if (data.success) {
        alert('Health package updated successfully.');
        fetchHealthPackages();
        setEditPackage(null); // Reset edit mode
      } else {
        alert('Failed to update health package: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the health package: ' + error.message);
    }
  };

  // const handleAddPackage = async () => {
  //   const packageType = prompt('Enter package type:');
  //   const subscriptionFees = parseFloat(prompt('Enter subscription fees (EGP):'));
  //   const doctorDiscount = parseFloat(prompt('Enter doctor discount (%):'));
  //   const medicineDiscount = parseFloat(prompt('Enter medicine discount (%):'));
  //   const familyDiscount = parseFloat(prompt('Enter family discount (%):'));

  //   const newPackage = {
  //     healthPackage: {
  //       packageType,
  //       subsriptionFeesInEGP: subscriptionFees,
  //       doctorDiscountInPercentage: doctorDiscount,
  //       medicinDiscountInPercentage: medicineDiscount,
  //       familyDiscountInPercentage: familyDiscount
  //     }
  //   };

  //   try {
  //     const response = await axios.post('/admin/addHealthPackage', newPackage, {
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     const data = response.data;

  //     if (data.success) {
  //       alert('Health package added successfully.');
  //       fetchHealthPackages(); // Reload the health packages after adding
  //     } else {
  //       alert('Failed to add health package: ' + data.message);
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     alert('An error occurred while adding the health package: ' + error.message);
  //   }
  // };

  return (
    <div>
      <Nav/>
    <div style={{ padding: '20px' }}>
      <h1>Health Packages</h1>
      <Button variant="success" style={{ width: '100%' }} onClick={handleAddPackage}>
        Add Health Package
      </Button>

      {/* Modal for adding a new package */}
      <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header className='admin-header' closeButton>
            <Modal.Title>Add Health Package</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Add form fields inline */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
                <label style={{ flex: '1' }}>Package Type</label>
                <input
                  type="text"
                  value={newPackage.packageType}
                  placeholder='Enter Package Type'
                  onChange={(e) => setNewPackage({ ...newPackage, packageType: e.target.value })}
                  style={{ flex: '1' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
                <label style={{ flex: '1' }}>Subscription Fees (EGP)</label>
                <input
                  type="number"
                  value={newPackage.subscriptionFees}
                  placeholder='Enter Subscription Fees (EGP)'
                  onChange={(e) => setNewPackage({ ...newPackage, subscriptionFees: e.target.value })}
                  style={{ flex: '1' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
                <label style={{ flex: '1' }}>Doctor Discount (%)</label>
                <input
                  type="number"
                  value={newPackage.doctorDiscount}
                  placeholder='Enter Doctor Discount (%)'
                  onChange={(e) => setNewPackage({ ...newPackage, doctorDiscount: e.target.value })}
                  style={{ flex: '1' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
                <label style={{ flex: '1' }}>Medicine Discount (%)</label>
                <input
                  type="number"
                  value={newPackage.medicineDiscount}
                  placeholder='Enter Medicine Discount (%)'
                  onChange={(e) => setNewPackage({ ...newPackage, medicineDiscount: e.target.value })}
                  style={{ flex: '1' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <label style={{ flex: '1' }}>Family Discount (%)</label>
                <input
                  type="number"
                  value={newPackage.familyDiscount}
                  placeholder='Enter Family Discount (%)'
                  onChange={(e) => setNewPackage({ ...newPackage, familyDiscount: e.target.value })}
                  style={{ flex: '1' }}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={handleSaveModal} disabled={!isFormValid}>
              Save
            </Button>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      <div id="packageList">
        {packageList.length > 0 ? (
          packageList.map((packageItem) => (
            <div key={packageItem.packageType} className="package-item">
              {editPackage === packageItem ? (
                <div>
                  {/* Edit mode */}
                  {/* Label Input */}
                  <input 
                    type="text" 
                    id="packageTypeLabel" 
                    style={{ width: "50%", border: "0px", padding: '8px' }} 
                    value='Package Type' readOnly 
                  />
                  <input
                    type="text"
                    id="packageTypeValue"
                    style={{ width: "50%", border: "0px", padding: '8px' }}
                    placeholder='Enter Package Type'
                    onChange={(e) => setEditedPackage({ ...editedPackage, packageType: e.target.value })}
                  />
                  {/* For subscriptionFeesInEGP */}
                  <input
                    type="text"
                    id="subscriptionFeesLabel"
                    style={{ width: "50%", border: "0px", padding: '8px' }}
                    value='Subscription Fees (EGP)'
                    readOnly
                  />
                  <input
                    type="number"
                    id="subscriptionFeesValue"
                    style={{ width: "50%", border: "0px", padding: '8px' }}
                    placeholder='Enter Subscription Fees (EGP)'
                    onChange={(e) => setEditedPackage({ ...editedPackage, subscriptionFees: e.target.value })}
                  />
                  {/* For doctorDiscountInPercentage */}
                  <input
                    type="text"
                    id="doctorDiscountLabel"
                    style={{ width: "50%", border: "0px", padding: '8px' }}
                    value='Doctor Discount (%)'
                    readOnly
                  />
                  <input
                    type="number"
                    id="doctorDiscountValue"
                    style={{ width: "50%", border: "0px", padding: '8px' }}
                    placeholder='Enter Doctor Discount (%)'
                    onChange={(e) => setEditedPackage({ ...editedPackage, doctorDiscount: e.target.value })}
                  />
                  {/* For medicinDiscountInPercentage */}
                  <input
                    type="text"
                    id="medicinDiscountLabel"
                    style={{ width: "50%", border: "0px", padding: '8px' }}
                    value='Medicin Discount (%)'
                    readOnly
                  />
                  <input
                    type="number"
                    id="medicinDiscountValue"
                    style={{ width: "50%", border: "0px", padding: '8px' }}
                    placeholder="Enter Medicin Discount (%)"
                    onChange={(e) => setEditedPackage({ ...editedPackage, medicineDiscount: e.target.value })}
                  />
                  {/* For familyDiscountInPercentage */}
                  <input
                    type="text"
                    id="familyDiscountLabel"
                    style={{ width: "50%", border: "0px", padding: '8px' }}
                    value='Family Discount (%)'
                    readOnly
                  />
                  <input
                    type="number"
                    id="familyDiscountValue"
                    style={{ width: "50%", border: "0px", padding: '8px' }}
                    placeholder='Enter Family Discount (%)'
                    onChange={(e) => setEditedPackage({ ...editedPackage, familyDiscount: e.target.value })}
                  />
                  <Button
                    variant="success"
                    style={{ width: '48%', marginRight: '4%', marginTop: '4%' }}
                    onClick={handleSaveEdit}
                    disabled={!isEditFormValid}
                  >
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    style={{ width: '48%', marginTop: '4%' }}
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div>
                  {/* View mode */}
                  {/* View mode */}
                  <input
                    type="text"
                    id="packageTypeLabel"
                    style={{ width: "50%", border: "0px", padding: '8px' }}
                    value='Package Type'
                    readOnly
                  />
                  <input
                    type="text"
                    id="packageTypeValue"
                    style={{ width: "50%", border: "0px", padding: '8px' }}
                    value={packageItem.packageType}
                    readOnly
                  />
                  {/* For subscriptionFeesInEGP */}
                  <input
                    type="text"
                    id="subscriptionFeesLabel"
                    style={{ width: "50%", border: "0px", padding: '8px' }}
                    value='Subscription Fees (EGP)'
                    readOnly
                  />
                  <input
                    type="text"
                    id="subscriptionFeesValue"
                    style={{ width: "50%", border: "0px", padding: '8px' }}
                    value={packageItem.subsriptionFeesInEGP}
                    readOnly
                  />
                  {/* For doctorDiscountInPercentage */}
                  <input
                    type="text"
                    id="doctorDiscountLabel"
                    style={{ width: "50%", border: "0px", padding: '8px' }}
                    value='Doctor Discount (%)'
                    readOnly
                  />
                  <input
                    type="text"
                    id="doctorDiscountValue"
                    style={{ width: "50%", border: "0px", padding: '8px' }}
                    value={packageItem.doctorDiscountInPercentage}
                    readOnly
                  />
                  {/* For medicinDiscountInPercentage */}
                  <input
                    type="text"
                    id="medicinDiscountLabel"
                    style={{ width: "50%", border: "0px", padding: '8px' }}
                    value='Medicin Discount (%)'
                    readOnly
                  />
                  <input
                    type="text"
                    id="medicinDiscountValue"
                    style={{ width: "50%", border: "0px", padding: '8px' }}
                    value={packageItem.medicinDiscountInPercentage}
                    readOnly
                  />
                  {/* For familyDiscountInPercentage */}
                  <input
                    type="text"
                    id="familyDiscountLabel"
                    style={{ width: "50%", border: "0px", padding: '8px' }}
                    value='Family Discount (%)'
                    readOnly
                  />
                  <input
                    type="text"
                    id="familyDiscountValue"
                    style={{ width: "50%", border: "0px", padding: '8px' }}
                    value={packageItem.familyDiscountInPercentage}
                    readOnly
                  />
                  <Button
                    variant="dark"
                    style={{ width: '48%', marginRight: '4%', marginTop: '4%' }}
                    onClick={() => handleEdit(packageItem)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    style={{ width: '48%', marginTop: '4%' }}
                    onClick={() => deleteHealthPackage(packageItem.packageType)}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No health packages available.</p>
        )}
      </div>
    </div>
    </div>
  );
}

export default ManagePackages;
