import React from 'react';
import Card from 'react-bootstrap/Card';

const DocumentCard = ({ title, imageData }) => {
  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
  }

  return (
    <Card style={{ width: '18rem', margin: '10px', display: 'inline-block', textAlign: 'center' }}>
      <Card.Body>
        <Card.Title style={{ backgroundColor: 'black', color: 'white' }}>{title}</Card.Title>
        <Card.Img src={`data:image/jpeg;base64,${arrayBufferToBase64(imageData.data.data)}`} />
      </Card.Body>
    </Card>
  );
};

export default DocumentCard;
