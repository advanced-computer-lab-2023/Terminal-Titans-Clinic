
# Titans Clinic

this projects intends to serve as a fully functional pharmacy webapp , it's linked to the clinic webapp having the same database for patients meaning that if you registered as a patient in the clinic website you don't need to register again in the pharmacy website , just sign in with your credentials and you're good to go 


#  Motivation
We came up with this project in order to facilitate communication between pharmacies and clinics and our goal is to bridge the gap between individuals and the medications they need, making healthcare more accessible and convenient for everyone.
# Build Status 
#### Due to the free plan subscription to Mongo Atlas database the speed of the website in which you fetch data from the database or send data to the database may be slower than expected , and sometimes this may cause a runtime error yet as developers we are searching on how to make the website faster so don't worry if tou feel that the website is slow it's not an error 
# Code Style

#### 1- Indentation 
use the tab to indent 

#### 2- Naming Conventions 
use camelCase for naming 
```javascript
let medicalUse = "cold";
```
#### 3- Comments 
Use descriptive comments to explain complex code or logic. Keep comments concise and up to date.
```javascript
// This function calculates the sum of two numbers
function add(a, b) {
  return a + b;
}
```
#### 4- Line Length
limit line length to the width of the screen to have better readability

#### 5- File Organisation
Organize files logically and group related functionalities together.

# Screenshots

#### To view the images of the system press [here]
(https://drive.google.com/drive/folders/1tx0hdi5ZB3V_JJmpOWaSMMvsaFt4zUj9?usp=drive_link)


# Tech/Frameworks Used

Our web application is built using the MERN stack, incorporating various technologies and frameworks to provide a powerful and modern development environment.

## Backend

- **Node.js:**
  - A JavaScript runtime built on Chrome's V8 JavaScript engine.

- **Express.js:**
  - A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

- **MongoDB:**
  - A NoSQL document database that stores data in a flexible, JSON-like format.

## Frontend

- **React:**
  - A JavaScript library for building user interfaces, maintained by Meta.

- **React Bootstrap:**
  - A popular front-end framework for designing responsive and mobile-first websites.

 - **Material UI:**
   - A popular front-end framework for designing responsive websites.


## Database

- **MongoDB:**
  - A NoSQL document database that provides scalability, flexibility, and high performance.

## Other Technologies

- **Mongoose:**
  - An ODM (Object-Document Mapping) library for MongoDB and Node.js, providing a schema-based solution to model application data.

## Development Tools

- **npm (Node Package Manager):**
  - A package manager for JavaScript, used to manage project dependencies and scripts.

- **Create React App:**
  - A command-line tool to create React applications with no build configuration.
# Features

Our webapp can come with different features for 3 main users


## General Features

- **Secure Login:** Users can securely create accounts and log in to access personalized features.

- **Secure Password Reset:** Users can securely reset their password in case the forgot it using an OTP sent to mail 

- **Real-time Notifications:** Users receive real-time notifications for important events and updates.


## Doctor

- **Secure Transactions:** Security measures to ensure the safety of user data and transactions upon receiving their hourly rate.

- **Appointment's management:**
   Doctors can add their available slots so when clients want to reserve an appointment with them the only thing that will apear is what the doctor's defined, furthermore they reschedule an appointment that has already been booked or cancel an appointment and also they can assign follow ups for their patients.

- **Contract management:** View a details of contract and chose to accept or reject.
  


## Patient

- **medical history management:** 
Easily add your medical history and delete from it if needed .

- **Appointment management:** Easily browse the doctors of your desired field and reserve a slot with any of them in your desired time, if there is any problem with the reservation and either of the patient or the doctor has to cancel the appointment, the patient recieves an email with the the updates of the appointments.

- **Subscription management:**
  You can view all the available health packages and based on the ones you like you can subscribe to it and get it's benefits as of discounts on appointments for the patient and their family member.

- **Secure Transactions:** Security measures to ensure the safety of user data and transactions.

- **Chat system with doctor:** Patients can easily communicate with doctors through a chatting system 
- **Chat system with doctors:** Pharmacists can easily communicate with doctors through a chatting system 



## Admin

- **Add Administrator:**
   Easily add a new administrator with predefined credentials.

- **Remove User Accounts:**
   Admins can remove doctors or patients from the system.

- **Doctor Onboarding:**
   View information uploaded by doctors applying to join the platform.

- **Approve/Reject Doctor Request:**
   Admins can accept or reject doctor registration requests.

- **View all users Information:**
   View basic information about registered users.

- **View, add, edit and delete Health Care Packages:**
    Admins can add, edit, delete and view the Health Care Packages on the System.



# Code Examples
## 1. Express.js API Endpoint

```javascript
// Example code for creating an Express.js API endpoint
import connectDB from './config/db.js'
import dotenvModule from 'dotenv'
import express from 'express'
import securityModule from './Routes/securityRoute.js'
import DoctorModule from './Routes/doctorRoute.js'
import PatientModule from './Routes/patientRoute.js'
import AdminModule from './Routes/adminRoute.js'
import PharmacistModule from './Routes/pharmacistRoute.js'
import ejs from 'ejs'
import cors from 'cors';
import http from 'http'
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { WebSocketServer } from 'ws'
import userModel from './Models/userModel.js'
import Message from './Models/messageModel.js'
import protect from './middleware/authMiddleware.js'
import appointmentModel from './Models/appointmentModel.js'
import notificationModel from './Models/notificationModel.js'
import notificationModule from './Routes/notificationRoute.js'
import { notificationChangeStream } from './Models/notificationModel.js'
import mongoose from 'mongoose'


const dotenv = dotenvModule.config();

connectDB()

```
## 2. MongoDB Connection

```javascript
import mongoose  from "mongoose";

mongoose.set('strictQuery', false);

const MongoURI = process.env.MONGO_URI ;

const connectDB = async () => {
  try{
      const conn = await mongoose.connect(process.env.MONGO_URI,{
          dbName: 'mernapp'
      });

      console.log(`mongodb connected ${conn.connection.host}`)
  }
  catch(err){
      console.log(err)
      process.exit(1)
  }
}

export default connectDB;
```
## 3. React Page creation

```javascript

// Assuming the file names and component names follow the uppercase convention
import React from "react";
import DoctorHome from "../components/DoctorHome";
import {DoctorNavBar} from "../components/doctorNavBar.jsx"; // Corrected the import

function Doctor() {
    return (
        <>
            <DoctorNavBar />
            <DoctorHome />
        </>
    );
}

export default Doctor;
```

## 4. React Component #1

```javascript
import PropTypes from 'prop-types';
import CurrencyDollarIcon from '@heroicons/react/24/solid/CurrencyDollarIcon';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';

export const OverviewTotalSales = (props) => {
  const { sx } = props;

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    getProgress();
  }, []);

  const getProgress = async () => {
    let response = await axios.get('http://localhost:8000/admin/getOrderProgress', {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token')
      }
    });

    let sales = response.data.totalSales;

    setProgress(sales);
  };

  

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              color="text.secondary"
              variant="overline"
            >
              Total Sales
            </Typography>
            <Typography variant="h4">
              {progress}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'primary.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              <CurrencyDollarIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewTotalSales.propTypes = {
  value: PropTypes.string,
  sx: PropTypes.object
};


```
## React Component #2
```javascript
// import React from "react";
import "../Styles/LoginForm.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import { useHistory, useNavigate } from 'react-router-dom';

function ViewDocInfo() {


<h1>anaa</h1>
    
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('Id');
    const [doctor, setDoctor] = useState({});

const getDocInfo=async()=>{
    
    try {
        const response = await axios.get(`http://localhost:8000/patient/selectDoctors/${userId}`, {
          headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem("token")
          }
        });
        console.log(response);
  
        const selectedDoc = response.data.Result[0];
        console.log(selectedDoc);
        setDoctor(selectedDoc);
        console.log("Selected Doctor:", selectedDoc);
      } catch (error) {
        console.error("Error fetching doctor info:", error);
      }
    }
    //console.log(response.data);
  
    useEffect(() => {
      getDocInfo();
    }, []);
  
    console.log(doctor.Name);
    console.log(doctor.id);
   
    return (
        <div>
            <div id="login-form"  style={{ width: "600px " }}>
                <form>
                    
                    <div className="form-group">
                       
                       <input type="text" id="namel"  style={{width: "50%", border:"0px", padding:'8px'}} value='Name' readOnly />

                        <input type="text" id="name"  style={{width: "50%", border:"0px",padding:'8px'}} value={doctor.Name} readOnly />

                        <input type="text" id="DateOfBirthl"  style={{width: "50%", border:"0px", padding:'8px'}} value='Date of birth' readOnly />
                        <input type="text" id="DateOfBirth"  style={{width: "50%", border:"0px", padding:'8px'}} value={doctor.DateOfBirth?.substring(0,10)} readOnly />

                        <input type="text" id="Emaill"  style={{width: "50%", border:"0px", padding:'8px'}} value='Email' readOnly />
                        <input type="text" id="Email"  style={{width: "50%", border:"0px", padding:'8px'}} value={doctor.Email} readOnly />

                        <input type="text" id="Affiliationl"  style={{width: "50%", border:"0px", padding:'8px'}} value='Affiliation' readOnly />
                        <input type="text" id="Affiliation"  style={{width: "50%", border:"0px", padding:'8px'}} value={doctor.Affiliation} readOnly />

                        <input type="text" id="Mobilel"  style={{width: "50%", border:"0px", padding:'8px'}} value='Hourly Rate Price' readOnly />
                        <input type="text" id="Mobile"  style={{width: "50%", border:"0px", padding:'8px'}} value={doctor.HourlyRate} readOnly />

                        <input type="text" id="EmergencyNamel"  style={{width: "50%", border:"0px", padding:'8px'}} value='Education' readOnly />
                        <input type="text" id="EmergencyName"  style={{width: "50%", border:"0px", padding:'8px'}} value={doctor.Education} readOnly />

                        <input type="text" id="Specialityl"  style={{width: "50%", border:"0px", padding:'8px'}} value='Speciality' readOnly />
                        <input type="text" id="Speciality"  style={{width: "50%", border:"0px", padding:'8px'}} value={doctor.Speciality} readOnly />

                        <input type="text" id="sessionPricel"  style={{width: "50%", border:"0px", padding:'8px'}} value='Session Price' readOnly />
                        <input type="text" id="sessionPrice"  style={{width: "50%", border:"0px", padding:'8px'}} value={doctor.sessionPrice} readOnly />
                 
                 
                 
                    </div>

                </form>
                <Button
                  variant="dark"
                  style={{ width: '45%' }}
                  //onClick={() => navigate(`/showAvailableSlots?Id=${doctor.id}`)}
                 // onClick={() => navigate(`/reschedule`)}
                
                 onClick={() =>window.location.href=`/Health-Plus/showAvailableSlots?Id=${doctor.id}`}
                >
                  Book Appointment
                </Button>
            </div>
        </div>
    );
}

export default ViewDocInfo;

```# Installation

Follow these steps to set up and run the MERN stack application locally on your machine.

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)

## Clone the Repository

```bash
git clone https://github.com/advanced-computer-lab-2023/Terminal-Titans-Clinic.git

cd Terminal-Titans-Clinic

```

## Backend Setup



```bash
# Navigate to the server directory

cd src

# Install server dependencies

npm install

# Create a .env file in the server directory and add the following:
# PORT=7000
# MONGO_URI='mongodb+srv://farahalfawzy:terminaltitans@mernapp.n3hzhmm.mongodb.net/?retryWrites=true&w=majority'
#JWT_SECRET='abc123'
#MAIL_USER='terminaltitansacl@gmail.com'
#MAIL_PASS='hzbw etjg nozv yluu'

# You can start the backend either by running it on Node using

node App.js

#Or on Nodemon using 

nodemon app.js

```


## Frontend Setup



```bash
# Navigate to the Frontend directory

cd frontend

# Install frontend dependencies

npm install

npm start

```


# API Reference

 ### General

#### Forgot password

 ```http
  POST /security/forgotPassword
```

|Body|Type|Description |
|----------|--|:------------------------- |
|`User Email`|`String`|resets the password |



#### Change password

 ```http
  POST /security/changePassword
```

|Body|Type|Description |
|---------|---|:------------------------- |
|`Old Password - New Password`|`String - String`|Changes the password given that the old password macthes the password in the database (for extra security) with the new password |



#### OTP sending via email 

 ```http
  POST /security/sendOTP
```

|Body|Description                |
|------------|:------------------------- |
| `User Email`|Sends an OTP to the user via email in case of forgotten password |


#### OTP verification

 ```http
  POST /security/verifyOTP
```

|Body|Description                |
|----|:------------------------- |
| `User Email`|Verifies the OTP  |

  ### Admin

#### Add Health Package..

```http
  POST /admin/addHealthPackage
```
| Body|Type|Description                       |
| ---|--|:-------------------------------- |
| `healthPackage`|`HealthPackage`| Adds a new health package to the system |

#### Update Health Package..

```http
  PUT /admin/updateHealthPackage
```
| Body|Type|Description                       |
| ---|--|:-------------------------------- |
| `id-healthPackage`|`String-HealthPackage`| updates the health package with the id in the body |

#### Delete Health Package..

```http
  DELETE /admin/deleteHealthPackage
```
| Body|Type|Description                       |
| ---|--|:-------------------------------- |
| `packageType`|`String`| deletes the health package with the specified type in the body |

#### Add a new admin..

```http
  POST /admin/createAdmin
```
| Body|Type|Description                       |
| ---|--|:-------------------------------- |
| `Username - Password`|`String - String`| Adds a new admin to the system with the given username and password |

#### Get all Doctor Applications..

```http
  GET /admin/fetchReqDoctors
```
| Description                       |
|  :-------------------------------- |
|  gets a list of all the requested doctors |

#### Accept a certain doctor's application..

```http
  POST /admin/DoctorAcceptance/${username}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username` | `String` | **Required**. The username of the doctor |

#### Reject a certain doctor's application..

```http
  DELETE /admin/DoctorRejection/${username}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username` | `String` | **Required**. The username of the doctor |

#### Fetch All Users..

```http
  GET /admin/fetchUsers
```
| Description                       |
|  :-------------------------------- |
|  gets a list of all users registered in the system |

#### Deletes a User..

```http
  DELETE /admin/deleteUser/${username}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username` | `String` | **Required**. The username of the doctor to be deleted|



## Doctor

#### Add Available slots of the doctor

```http
  POST /doctor/addAvailableSlots
```

| Body|Type|Description                       |
| ---|--|:-------------------------------- |
| `date `|`Date `| adds an available slot to the doctor with the specified date|



#### View Total sales report

```http
  GET /Doctor/getWalletAmount
```

|   Description | 
| :----- |
| Gets the total amount in the doctor's wallet 

#### Get all upcoming appointments

```http
GET /doctor/getUpcomingAppointment
```
| Description                       |
|  :-------------------------------- |
|  gets a list of all the upcoming appointments |



## Patient
#### Get all doctor's names

```http
GET /patient/getDoctorNames
```
| Description                       |
|  :-------------------------------- |
|  gets a list containing the names of all the doctors |


#### Buy all the medicines in the prescription

```http
  POST /doctor//buyPrescription/${id}
```

| Parameter|Type|Description                       |
| ---|--|:-------------------------------- |
| `id `|`ObjectId `| adds all the medicines in the prescription to my the patients cart|

#### View the content of a current prescription

```http
  POST /doctor//viewPrescription/${id}
```

| Parameter|Type|Description                       |
| ---|--|:-------------------------------- |
| `id `|`ObjectId `| retrieves all the data inside a prescription|

# Test cases

#### To view the test cases of the system press [here]
(https://drive.google.com/drive/folders/1l31CJEQ2Rwgt3zlSpMCXJYjGRxxz2JnL?usp=drive_link)

# Contributing

We welcome contributions from the community! If you're interested in contributing to our project, please follow the guidelines below:

## Getting Started

 1. **Fork the Repository:**
   - Click the "Fork" button on the top right corner of this repository to create your own copy.

2. **Clone Your Fork:**
   - Clone the repository to your local machine using the following command:
     ```bash
     git clone https://github.com/your-username/your-project.git
     
     #replace the url with the url of your repo 
     ```

3. **Create a Branch:**
   - Create a new branch for your feature or bug fix:
     ```bash
     git checkout -b feature/new-feature
     ```

4. **Make Changes:**
   - Implement your changes or add new features.

5. **Test:**
   - Ensure that your changes are thoroughly tested.

6. **Commit Changes:**
   - Commit your changes with a descriptive commit message:
     ```bash
     git commit -m "Add new feature: your feature description"
     ```

7. **Push Changes:**
   - Push your changes to your forked repository:
     ```bash
     git push origin feature/new-feature
     ```

8. **Create a Pull Request:**
   - Open a Pull Request (PR) from your forked repository to the original repository. Provide a detailed description of your changes.

## Contributors

- [Farah Maher](https://github.com/farahalfawzy)
- [Seif Hossam](https://github.com/seifhossam2002)
- [Paula Bassem](https://github.com/paula-iskander)
- [Abdelrahman Ahmed](https://github.com/Abdelrahman772)
- [Micheal Mokhles](https://github.com/Mickey0002)
- [Abdullah el nahas](https://github.com/AbdullahElNahas)
- [Youssef Eid](https://github.com/Joseph-Eid)
- [Habiba Mohamed](https://github.com/HabibaMohamedd4)


# Credits
We would initially like to thank Dr. Mervat Abu el Kheir and all the TAs for their help , there have been multiple online sources that aided us in this project and these sources are :
- http://openai.com/chatgpt 
- https://bard.google.com/chat
- https://www.bing.com/search?q=Bing+AI&showconv=1&FORM=hpcodx
- https://m.youtube.com/watch?v=0divhP3pEsg
- https://www.youtube.com/watch?v=-0exw-9YJBo&list=PLillGF-RfqbbQeVSccR9PGKHzPJSWqcsm
- https://youtu.be/mYy-d6BtqmU?si=p0M90zFwYVzqlmyv
- https://youtu.be/gnM3Ld6_upE?si=SGJ3iAZse6htZK0I
- https://youtu.be/1r-F3FIONl8
# License

This project is licensed under the Apache License 2.0 - see the [LICENSE](https://www.apache.org/licenses/LICENSE-2.0) file for details.
