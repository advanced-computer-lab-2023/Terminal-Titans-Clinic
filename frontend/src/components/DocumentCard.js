import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';

const DocumentCard = ({ title, imageData }) => {
  const [showModal, setShowModal] = useState(false);

  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
  }

  const handleImageClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Card style={{ width: '18rem', margin: '10px', display: 'inline-block', textAlign: 'center' }}>
        <Card.Body>
          <Card.Title style={{ backgroundColor: 'black', color: 'white', borderRadius:'15px'}}>{title}</Card.Title>
          <Card.Img
            src={`data:image/jpeg;base64,${arrayBufferToBase64(imageData.data.data)}`}
            onClick={handleImageClick}
            style={{ cursor: 'pointer' }}
          />
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header className='admin-header' closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={`data:image/jpeg;base64,${arrayBufferToBase64(imageData.data.data)}`}
            alt={title}
            style={{ width: '100%' }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DocumentCard;
