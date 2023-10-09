import express from 'express'
import doctorModel from '../Models/doctorModel.js';
import patientsModel from '../Models/patientsModel.js';
import healthModel from '../Models/healthModel.js';
import appointmentModel from '../Models/appointmentModel.js';
import userModel from '../Models/userModel.js';
//import fs from 'fs';
import { get } from 'mongoose';

const router = express.Router()
let id = '652323f2050647d6c71d8758';

//get all doctors
// router.get('/', async (req, res) => {
//    const doctors = await doctorModel.find({})
//     res.status(200).render('doctorPage',doctors)
// })

router.get('/getCurrentDoctor', async (req, res) => {
    const doctor = await doctorModel.findOne({ _id: id })
    if (!doctor) {
        res.status(400).json({ message: "Doctor not found", success: false })
    }
    res.status(200).json({ Result: doctor, success: true })
})

router.get('/', (req, res) => {
    res.render('doctorPage')
})

// requirement number 14
router.get('/updateDoctor', async (req, res) => {
    // const doctor = await doctorModel.findOne({_id:req.params.id});
    try {
        const doctor = await doctorModel.findOne({ _id: id });
        if (!doctor || doctor.length == 0)
            res.status(400).json({ message: "Doctor not found", success: false })
        else {
            const updatedDoctor = await doctorModel.findOneAndUpdate({ _id: id },
                {
                    Email: req.query.Email || doctor.Email,
                    HourlyRate: req.query.HourlyRate || doctor.HourlyRate,
                    Affiliation: req.query.Affiliation || doctor.Affiliation
                }, { new: true });
            // const updatedDoctor=await doctorModel.findOneAndUpdate({_id:req.params.id},
            //     {Email:req.query.email||doctor.Email,
            //         HourlyRate:req.query.hourlyRate||doctor.HourlyRate,
            //         Affiliation:req.query.affiliation||doctor.Affiliation},{ new: true });
            res.status(200).json({ Result: updatedDoctor, success: true })
        }
    } catch (err) {
        res.status(400).json({ message: err.message, success: false })
    }
});

// requirement number 14
// router.put('/updateDoctor/:id', async (req, res) => {
// router.put('/updateDoctor', async (req, res) => {
//     // const doctor = await doctorModel.findOne({_id:req.params.id});
//     const doctor = await doctorModel.findOne({ _id: id });
//     console.log("here",doctor)
//     if (!doctor || doctor.length == 0)
//         res.status(400).json({ message: "Doctor not found", success: false })
//     else {
//         console.log("mybody",req.query);
//         const updatedDoctor=await doctorModel.findOneAndUpdate({_id:id},
//             {Email:req.query.email||doctor.Email,
//                 HourlyRate:req.query.hourlyRate||doctor.HourlyRate,
//                 Affiliation:req.query.affiliation||doctor.Affiliation},{ new: true });
//         // const updatedDoctor=await doctorModel.findOneAndUpdate({_id:req.params.id},
//         //     {Email:req.query.email||doctor.Email,
//         //         HourlyRate:req.query.hourlyRate||doctor.HourlyRate,
//         //         Affiliation:req.query.affiliation||doctor.Affiliation},{ new: true });
//         res.status(200).json({ Result: updatedDoctor, success: true })
//     }
// })

// requirement number 25 front lesa
router.get('/getPatientsAndHealth/:id', async (req, res) => {

    try {
        const getPatients = await appointmentModel.find({ DoctorId: req.params.id });


        let healthRecords = [];

        for (let i = 0; i < getPatients.length; i++) {
            const element = await healthModel.find({ patientId: getPatients[i].PatientId })
            healthRecords = [...healthRecords, ...element];
        }


        if (healthRecords.length == 0) {
            res.status(400).json({ message: "No patients found", success: false })
            return;
        }

        let patients = []
        for (let i = 0; i < healthRecords.length; i++) {
            const patientRecord = await patientsModel.findById(healthRecords[i].patientId)
            patients.push(patientRecord)
        }

        const result = {
            "healthRecords": healthRecords,
            "patients": patients
        }

        res.status(200).json({ Result: result, success: true })
    } catch (err) {
        res.status(400).json({ message: err.message, success: false })
    }
});

// requirement number 33
// router.get('/getPatients/:id', async (req, res) => {
router.get('/getPatients', async (req, res) => {
    // const getMyPatients = await appointmentModel.find({ DoctorId: req.params.id });
    try {
        const getMyPatients = await appointmentModel.find({ DoctorId: id });

        let result = []

        for (let i = 0; i < getMyPatients.length; i++) {
            console.log(getMyPatients[i].PatientId)
            const element = await patientsModel.find({ _id: getMyPatients[i].PatientId })
            result = [...result, ...element];
        }

        if (result.length == 0) {
            res.status(400).json({ message: "No patient found", success: false })
        }
        res.status(200).json({ Result: result, success: true })
    } catch (err) {
        res.status(400).json({ message: err.message, success: false })
    }
});

// requirement number 34
router.get('/getPatientName/:name', async (req, res) => {
    try {
        const getPatients = await patientsModel.find({ Name: new RegExp(`${req.params.name}`) });
        if (getPatients.length == 0) {
            res.status(400).json({ message: "No patient found with this name", success: false })
        }
        res.status(200).json({ Result: getPatients, success: true })
    } catch (err) {
        res.status(400).json({ message: err.message, success: false })
    }
})

// requirement number 35 front lesa
router.get('/getAppointment/:date/:id', async (req, res) => {
    try {
        const getAppointments = await appointmentModel.find({ Date: { $gte: req.params.date }, DoctorId: req.params.id });

        if (getAppointments.length == 0)
            res.status(400).json({ message: "No upcoming appointments found", success: false })

        res.status(200).json({ Result: getAppointments, success: true })
    } catch (err) {
        res.status(400).json({ message: err.message, success: false })
    }
});

// requirement number 36
router.get('/selectPatientName/:id', async (req, res) => {
    try {
        const getPatients = await patientsModel.find({ _id: req.params.id });
        if (getPatients.length == 0) {
            res.status(400).json({ message: "No patient found with this name", success: false })
        }
        res.status(200).json({ Result: getPatients, success: true })
    } catch (err) {
        res.status(400).json({ message: err.message, success: false })
    }
})

//add file to db
// router.post('/test',async(req,res)=>{

// // POST: called by uploading form

// var model = new healthModel({PatientId:'651c89b4a38c19dc5624ca5f'});
//     console.log('here')
//     await fs.readFile(req.body.myFile, function (err, data) {
//     console.log(data)
//     model.HealthDocument.binData = data;
//     // get extension
//     model.HealthDocument.contentType = 'file/pdf'
//         model.save();
//     console.log("end end")
//     res.status(200).json({status:"success"});
//   });
// });

//export file from db
// router.post('/test',async(req,res)=>{    
//     var model = new healthModel({PatientId:'651c89b4a38c19dc5624ca5f'});
//         console.log('here')
//         await fs.readFile(req.body.myFile, function (err, data) {
//         console.log(data)
//         model.HealthDocument.binData = data;
//         // get extension
//         model.HealthDocument.contentType = 'application/pdf'
//             model.save();
//         console.log("end end")
//         res.status(200).json({status:"success"});
//       });
//     });
//     router.get('/test', (req, res) => {
//         healthModel.find({})
//         .then((data, err)=>{
//             if(err){
//                 console.log(err);
//             }
//             console.log(data)
//             res.render('../../views/imagepage',{items: data})
//             //return(res.render('../../views/home'));

//         })
//     });
export default router;