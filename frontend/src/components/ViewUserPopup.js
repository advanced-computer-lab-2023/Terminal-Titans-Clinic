import React from 'react';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { styled } from '@mui/system';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';



const PopupBody = styled('div')(
  ({ theme }) => `
      width: 600px;
      padding: 15px;
      background-color: ${theme.palette.mode === 'dark' ? '#1C2025' : '#fff'};
      box-shadow: ${
        theme.palette.mode === 'dark'
          ? '0px 4px 8px rgb(0 0 0 / 0.7)'
          : '0px 4px 8px rgb(0 0 0 / 0.1)'
      };
      
      z-index: 1;
    `,
);

const UserInfoPopup = ({ user, onClose }) => {
  const renderUserDetails = () => {
    switch (user.__t) {
      case 'patient':
        return (
          <>
            <h1>Patient Information</h1>
            {createInput('Name', `Name: ${user.Name}`)}
            {createInput('Email', `Email: ${user.Email}`)}
            {createInput('DateOfBirth', `Date of Birth: ${user.DateOfBirth?.substring(0,10)}`)}
            {createInput('Gender', `Gender: ${user.Gender}`)}
            {createInput('Mobile', `Mobile: ${user.Mobile}`)}
            {createInput('EmergencyName', `Emergency Contact Name: ${user.EmergencyName}`)}
            {createInput('EmergencyMobile', `Emergency Contact Mobile: ${user.EmergencyMobile}`)}
          </>
        );
      case 'Admin':
        return (
          <>
            <h1>Admin Information</h1>
            {createInput('Username', `Username: ${user.Username}`)}
          </>
        );
      case 'Doctor':
        return (
          <>
            <h1>Doctor Information</h1>
            {createInput('Name', `Name: ${user.Name}`)}
            {createInput('Email', `Email: ${user.Email}`)}
            {createInput('DateOfBirth', `Date of Birth: ${user.DateOfBirth}`)}
            {createInput('Affiliation', `Affiliation: ${user.Affiliation}`)}
            {createInput('Education', `Education: ${user.Education}`)}
            {createInput('Speciality', `Speciality: ${user.Speciality}`)}
            {createInput('HourlyRate', `Hourly Rate: ${user.HourlyRate}`)}
          </>
        );
      case 'Pharmacist':
        return (
          <>
            <h1>Pharmacist Information</h1>
            {createInput('Name', `Name: ${user.Name}`)}
            {createInput('Email', `Email: ${user.Email}`)}
            {createInput('DateOfBirth', `Date of Birth: ${user.DateOfBirth}`)}
            {createInput('EducationalBackground', `Educational Background: ${user.EducationalBackground}`)}
            {createInput('Affiliation', `Affiliation: ${user.Affiliation}`)}
            {createInput('HourlyRate', `Hourly Rate: ${user.HourlyRate}`)}
          </>
        );
      default:
        return null;
    }
  };

  const createInput = (id, value) => (
    <>
      <input type="text" id={id} style={{ width: '50%', border: '0px', padding: '8px' }} value={value.split(": ")[0]+":"} readOnly />
      <input type="text" id={id} style={{ width: '50%', border: '0px', padding: '8px' }} value={value.split(": ")[1]} disabled />
    </>
  );

  return (
    <BasePopup style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} open={true} onClose={onClose}>
      <PopupBody>
        {renderUserDetails()}
        <Button variant="dark" style={{ width: '100%', marginTop: '20px' }} onClick={onClose}>
          Close
        </Button>
      </PopupBody>
    </BasePopup>
  );
};

export default UserInfoPopup;
