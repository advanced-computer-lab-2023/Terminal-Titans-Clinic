import connectDB from './config/db.js'
import dotenvModule from 'dotenv'
import express from 'express'
import RegisterModule from './Routes/registerRoute.js'
import DoctorModule from './Routes/doctorRoute.js'
import ejs from 'ejs'

const dotenv = dotenvModule.config();

connectDB()

//App variables
const app = express();
const port = process.env.PORT || "8000";

app.use(express.urlencoded({ extended: false }));
app.use(express.json())

app.use('/register',RegisterModule)
app.use('/doctor',DoctorModule)

app.set('view engine' , 'ejs');

//app.render('home.ejs')
app.get('/',(req,res)=>{
   res.render('../../views/home');
})

app.listen(port, "localhost", () => {
   console.log("Server is running on port 8000");
})