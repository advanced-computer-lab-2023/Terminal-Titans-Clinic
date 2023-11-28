import * as React from 'react'
import backgroundImage from '../Assets/Pharmacy-home.png'

export default function Body(){
    const backgroundStyles = {
        
        backgroundImage: 'url("../Assets/Pharmacy-home.png")', // Replace 'your-image.jpg' with your actual image file path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh', // Ensures the container covers the entire viewport height
        // You can add additional styling for your content
      };
      return(
        <div>
            <img src="../Assets/Pharmacy-home.png" alt="Image description"></img>
        </div>
      )

    }