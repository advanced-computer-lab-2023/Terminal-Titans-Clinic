import * as React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'typeface-roboto';
// import 'typeface-roboto';
import '../Styles/PharmScreenBody.css'


export default function Body(){
  const font={
    fontFamily:'roboto,sans-serif'
  }


      return(
        <div>
          <div zstyle={{
             backgroundImage: `url(${require("../Assets/Pharmacy-home.png")})`, // Replace 'your-image.jpg' with your actual image file path
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             backgroundRepeat: 'no-repeat',
             minHeight: '90vh'
          }}></div>

            <Container>
            <Row style={{
              zIndex:'1',
              top:'30%',
              left:'10%',
              position:'absolute',
              
            }}>
        <Col xs={4} md={6}
         className='custom-font-size'>
           Empowering pharmacists to be guardians of health, where expertise and compassion converge.
        </Col>
        <Col xs={6} md={4}>
  
        </Col>
      </Row>
            </Container>
        </div>
      )

    }