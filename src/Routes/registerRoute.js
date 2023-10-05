import { Router } from 'express';
import patientModel from '../Models/patientsModel.js';
import userModel from '../Models/userModel.js';
import reqdoctorModel from '../Models/requestedDoctorModel.js';

// import validator from 'email-validator'

const router= Router()

router.get('/patient',(req,res)=>{
    res.render('patientRegistration')
})

router.get('/doctor',(req,res)=>{
    //render registeration page of doctor
})


router.post('/patient',async (req,res)=>{

   if(!req.body.username || !req.body.dob || !req.body.password 
   || !req.body.name || !req.body.email || !req.body.mobile
   || !req.body.first || !req.body.last || !req.body.emergencyNumber || !req.body.gender  ){
    return(res.status(400).send({message: "mustfill all "}));

   }
   const savedUser =  await userModel.find({Username :req.body.username});
    if(savedUser.length>0)
    return(res.status(400).send({message: "username exists "}));

//    if(!validator.validate(req.body.email))
//         return(res.status(400).json({message:"Please enter a valid email"}))
   try{
    const newPatient = new patientModel({
        Username : req.body.username,
        Password : req.body.password,
         Name:req.body.name,
         Email:req.body.email,
         DateOfBirth:req.body.dob,
         Mobile :req.body.mobile,
         EmergencyName:req.body.first+" "+req.body.last,
         EmergencyMobile:req.body.emergencyNumber,
         Gender:req.body.gender
    });
    
    newPatient.save();
    res.status(200).send("success");

    }
    catch(error){
        res.status(400).send({error: error});

    }
})


router.post('/doctor',async (req,res)=>{

    if(!req.body.username || !req.body.dob || !req.body.password 
    || !req.body.name || !req.body.email || !req.body.hourlyRate
    || !req.body.affiliation || !req.body.education  ){
     return(res.status(400).send({message: "mustfill all "}));
 
    }
    const savedUser =  await userModel.find({Username :req.body.username});
     if(savedUser.length>0)
     return(res.status(400).send({message: "username exists "}));
 
    // if(!validator.validate(req.body.email))
    //      return(res.status(400).json({message:"Please enter a valid email"}))
    try{
     const newDoctor = new reqdoctorModel({
         Username : req.body.username,
         Password : req.body.password,
          Name:req.body.name,
          Email:req.body.email,
          DateOfBirth:req.body.dob,
          HourlyRate:req.body.hourlyRate,
          Affiliation:req.body.affiliation,
          Education:req.body.education
     });
     
     newDoctor.save();
     res.status(200).send("success");
 
     }
     catch(error){
         res.status(400).send({error: error});
 
     }
 });


export default router;