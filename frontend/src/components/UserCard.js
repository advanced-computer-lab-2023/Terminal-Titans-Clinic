import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const UserCard = ({ user, onDelete, onViewInfo }) => {
  return (
    <Card style={{ width: '18rem', margin: '10px' }}>
      <Card.Body>
        <Card.Title>{user.Username}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">User Type: {user.__t}</Card.Subtitle>
        <Card.Text>{/* Add any additional user details here */}</Card.Text>
        <Button variant="dark" style={{ width: '100%' }} onClick={onViewInfo}>
          View User Info
        </Button>
        <Button variant="danger" style={{ width: '100%', marginTop: '4%' }} onClick={() => onDelete(user.Username)}>
          Delete User
        </Button>
      </Card.Body>
    </Card>
  );
};

export default UserCard;
