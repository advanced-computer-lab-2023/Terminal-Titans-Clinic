import { Router } from 'express';
import patientModel from '../Models/patientsModel.js';
import userModel from '../Models/userModel.js';
import reqdoctorModel from '../Models/requestedDoctorModel.js';

import validator from 'email-validator'

const router= Router()

router.get('/patient',(req,res)=>{
    res.render('../../views/patientRegistration',{ message: "" });
})

router.get('/doctor',(req,res)=>{
    res.render('../../views/doctorRegistration',{ message: "" });

})


router.post('/patient',async (req,res)=>{

   if(!req.body.username || !req.body.dob || !req.body.password 
   || !req.body.name || !req.body.email || !req.body.mobile
   || !req.body.first || !req.body.last || !req.body.emergencyNumber || !req.body.gender  ){
    let msg="You must complete these fields: "
        if(!req.body.username) msg+="username, "
        if( !req.body.password) msg+="password, "
        if( !req.body.name) msg+="name, "
        if( !req.body.email) msg+="email, "
        if( !req.body.dob) msg+="Date of birth, "
        if( !req.body.mobile) msg+="Mobile Number, "
        if( !req.body.first || !req.aborted.last) msg+="Emergency Contact's name, "
        if( !req.body.emergencyNumber) msg+="Emergency Number, "
        if( !req.body.gender) msg+="gender, "

     return(res.render('../../views/patientRegistration',{message: msg.slice(0,-2)}));

   }
   if(req.body.username.includes(' ')){
    
    //return(res.status(400).send({message: "username has to be one word "}));

    return(res.render('../../views/patientRegistration',{message: "username has to be one word"}));

}
   const savedUser =  await userModel.find({Username :req.body.username});
    if(savedUser.length>0)
    return(res.render('../../views/patientRegistration',{message: "username has to be"}));

    //return(res.status(400).send({message: "username exists "}));

   if(!validator.validate(req.body.email))
   return(res.render('../../views/patientRegistration',{message:"Please enter a valid email"}));

     //   return(res.status(400).json({message:"Please enter a valid email"}))
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
    return res.redirect('/'); //render patient views page
    }
    catch(error){
        res.status(400).send({error: error});

    }
})


router.post('/doctor',async (req,res)=>{

    if(!req.body.username || !req.body.dob || !req.body.password 
    || !req.body.name || !req.body.email || !req.body.hourlyRate
    || !req.body.affiliation || !req.body.education  || !req.body.speciality){
        let msg="You must complete these fields: "
        if(!req.body.username) msg+="username, "
        if( !req.body.password) msg+="password, "
        if( !req.body.name) msg+="name, "
        if( !req.body.email) msg+="email, "
        if( !req.body.dob) msg+="Date of birth, "
        if( !req.body.hourlyRate) msg+="Hourly Rate, "
        if( !req.body.affiliation) msg+="Affiliation, "
        if( !req.body.education) msg+="Education, "
        if( !req.body.speciality) msg+="Speciality, "

     //return(res.status(400).send({message: msg.slice(0,-2)}));
     return(res.render('../../views/doctorRegistration',{message: msg.slice(0,-2)}));

    }
    if(req.body.username.includes(' ')){
        return(res.render('../../views/doctorRegistration',{message: "username has to be one word"}));

        //return(res.status(400).send({message: "username has to be"}));

    }
    const savedUser =  await userModel.find({Username :req.body.username});
     if(savedUser.length>0)
     return(res.render('../../views/doctorRegistration',{message: "username exists "}));

     //return(res.status(400).send({message: "username exists "}));
     if(!validator.validate(req.body.email))
     return(res.render('../../views/doctorRegistration',{message:"Please enter a valid email"}));
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
          Education:req.body.education,
          Speciality:req.body.speciality
     });
     
     newDoctor.save();
     res.status(200).send("success");
     return res.redirect('/');
     }
     catch(error){
         res.status(400).send({error: error});
 
     }
 });


export default router;