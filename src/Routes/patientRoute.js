import express from 'express'
import Doctor from '../Models/doctorModel.js';
import patient from '../Models/patientsModel.js';
import appointmentModel from '../Models/appointmentModel.js';
import prescriptionsModel from '../Models/prescriptionsModel.js';
import familyMember from '../Models/familyMemberModel.js'
import fs from 'fs';
import doctorModel from '../Models/doctorModel.js';
import { pid } from 'process';


const router = express.Router();
const pId='651c89b4a38c19dc5624ca5f';
const dId='652323f2050647d6c71d8758';

//requirement 18 (add family member)
router.post('/addFamilyMem', async (req,res)=>{
    try{
        const newFamilyMember = new familyMember({
            Name : req.body.name,
            Age : req.body.age,
            NationalId:req.body.nId,
            Gender:req.body.gender,
            Relation:req.body.relation,
            PatientId: pId,
            FamilyMemId: req.body.fMemId
        });
        newFamilyMember.save();
        console.log(req.body.pId)
        //const getPatient = await patient.find({ _id: pId });
        console.log(req.body.pId)    
        res.status(200).json({ Result: newFamilyMember, success: true })
    }
    catch(error){
        res.status(400).send({error: error});

    }
})

// requirement number 22
router.get('/viewRegFamMem', async (req, res) => {
    const famMembers = await familyMember.find({ PatientId: pId });
    res.status(200).json(famMembers);
})

// requirement number 23
router.get('/getAppointment/:date', async (req, res) => {
    const getAppointments = await appointmentModel.find({ Date: { $gte: req.params.date } });
    res.status(200).json(getAppointments);
});

// requirement number 54
router.get('/viewPrescriptions', async (req, res) => {
        const prescriptions = await prescriptionsModel.find({ PatientId: pId })
    if (!prescriptions)
       return  res.status(400).json({ message: "no presriptions found",success:false})
        else {

            return    res.status(200).json({Result:prescriptions, success:true})
        }
})
// requirement number 38
router.get('/getDoctor', async (req, res) => {
    var getDoctors ;
    if(req.body.Name && req.body.Speciality){
     getDoctors = await Doctor.find({ Name: req.body.Name,Speciality:req.body.Speciality});
    }
    if(!req.body.Name){
         getDoctors = await Doctor.find({Speciality:req.body.Speciality});
    }
    if(!req.body.Speciality){
         getDoctors = await Doctor.find({Name:req.body.Name});
    }
    if(!req.body.Speciality && !req.body.Name){
        getDoctors=await Doctor.find({});
    }
    console.log(getDoctors);
    if (getDoctors.length == 0) {
        return res.status(400).json({ message: "No doctors found "});
    }
    return res.status(200).json({ Doctors: getDoctors , success:true });
}) ;
// router.post('/pres',async(req,res)=>{
//     var model = new prescriptionsModel({PatientId:pId,DoctorId:dId,status:"not filled"});
//         await fs.readFile(req.body.myFile, function (err, data) {
//         console.log(data)
//         model.prescriptionDoc.binData = data;
//         model.prescriptionDoc.contentType = 'application/pdf'
//             model.save();
//         res.status(200).json({status:"success"});
//       });
// })

//requirement number 37

router.get('/getDoctors', async(req, res)=>{
    const allDoctors = await Doctor.find({});
    res.status(200).json( allDoctors );
})
//requirement number 39

router.get('/filterDoctors', async(req, res)=>{
    const spclty = req.body.Specialty;
    const  dTime = req.body.date;
    const spcltyDocs = await Doctor.find({Speciality:spclty})
    const aptmnts = await appointmentModel.find({Date:dTime})
    
    const result = spcltyDocs.filter((Dr) => {
    for(let y in aptmnts){
    if(aptmnts[y].DoctorId == Dr._id){
    console.log(Dr.Name);
    return false;
            }
        }
        return true});
    console.log(aptmnts);
   res.status(200).json(result);
})

router.get('/filterPrescriptions', async(req, res)=>{
    const date = req.body.Date;
    const id = doctorModel.find({Name:req.body.Name});
    const  status = req.body.status ;
    const result = await prescriptionsModel.filter((Pr)=>{
    


    })
    
   // const result = prescriptionsModel.filter({Date: date , DoctorId: doctorID ,  })


    res.status(200).json(result);
    



}

)

router.get('/selectDoctors', async(req,res)=>{
    const dId= req.body.id;
    const Dr = await Doctor.find({_id:dId});
    res.status(200).json(Dr);
})

// requirement 56
router.get('/selectPrescriptions', async(req,res)=>{
    const id= req.body._id;
    const result = await prescriptionsModel.find({_id:id});
    res.status(200).json(result);
})

export default router;