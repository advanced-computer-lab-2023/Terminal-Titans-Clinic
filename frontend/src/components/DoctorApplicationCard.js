import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const DoctorCard = ({ doctor, onAccept, onReject }) => {
  return (
    <Card style={{ width: '18rem', margin: '10px' }}>
      <Card.Body>
        <Card.Title>{doctor.Name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{doctor.Email}</Card.Subtitle>
        <Card.Text>
          Date of Birth: {doctor.DateOfBirth}
          <br />
          Hourly Rate: {doctor.HourlyRate}
          <br />
          Affiliation: {doctor.Affiliation}
          <br />
          Education: {doctor.Education}
          <br />
          Speciality: {doctor.Speciality}
        </Card.Text>
        <Button variant="dark" style={{ width: '100%' }} onClick={() => window.location.href=`/Health-Plus/viewRegDocDoc?Id=${doctor._id}`}>
          View Doc
        </Button>
        <Button variant="success" style={{ width: '48%', marginRight: '4%', marginTop: '4%' }} onClick={() => onAccept(doctor.Username)}>
          Accept
        </Button>
        <Button variant="danger" style={{ width: '48%', marginTop: '4%' }} onClick={() => onReject(doctor.Username)}>
          Reject
        </Button>
      </Card.Body>
    </Card>
  );
};

export default DoctorCard;
