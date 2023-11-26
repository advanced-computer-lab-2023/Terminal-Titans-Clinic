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

const dotenv = dotenvModule.config();

connectDB()

//App variables
const app = express();
const port = process.env.PORT || "8000";

app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(
   cors({
     origin: "http://localhost:3000",
   })
 )
 app.use('/security',securityModule)
app.use('/doctor',DoctorModule)
app.use('/patient',PatientModule)
app.use('/admin',AdminModule)
app.use('/Pharma',PharmacistModule)

app.set('view engine' , 'ejs');

//app.render('home.ejs')
app.get('/',(req,res)=>{
   res.render('../../views/home');
})
app.post('/',(req,res)=>{
   var username=req.body.user;
   if(!username)return(res.status(400));
   if(username=="patient") res.render('../../views/patientPage');
   if(username=="doctor")   res.render('../../views/doctorPage');
   if(username=="admin")   res.render('../../views/adminPage');
})
app.listen(port, "localhost", () => {
   console.log("Server is running on port 8000");
})