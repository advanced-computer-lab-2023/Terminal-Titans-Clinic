import express from 'express'
import doctorModel from '../Models/doctorModel.js';
import patientsModel from '../Models/patientsModel.js';
import healthModel from '../Models/healthModel.js';
import appointmentModel from '../Models/appointmentModel.js';
import userModel from '../Models/userModel.js';
import { get } from 'mongoose';

const router = express.Router()

//get all doctors
router.get('/', async (req, res) => {
   const doctors = await doctorModel.find({})
    res.status(200).json(doctors)
})

router.get('/', (req, res) => {
    res.render('doctorPage')
})

// requirement number 14
router.put('/updateDoctor/:id', async (req, res) => {
    const doctor = await doctorModel.findOne({_id:req.params.id});
    console.log("here",doctor)
    if (!doctor || doctor.length == 0)
        res.status(400).json({ message: "Doctor not found", success: false })
    else {
        console.log(req.body);
        const updatedDoctor=await doctorModel.findOneAndUpdate({_id:req.params.id},
            {Email:req.body.email||doctor.Email,
                HourlyRate:req.body.hourlyRate||doctor.HourlyRate,
                Affiliation:req.body.affiliation||doctor.Affiliation},{ new: true });
        res.status(200).json({ Result: updatedDoctor, success: true })
    }
})

// requirement number 25
router.get('/getPatientsAndHealth/:id', async (req, res) => {


    const getPatients = await appointmentModel.find({ DoctorId: req.params.id });


    let healthRecords = [];

    for (let i=0;i<getPatients.length;i++) {
        const element = await healthModel.find({ patientId: getPatients[i].PatientId})
        healthRecords = [...healthRecords, ...element];
    }


    if (healthRecords.length == 0) {
        res.status(400).json({ message: "No patients found",success:false })
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
});

// requirement number 33
router.get('/getPatients/:id', async (req, res) => {

    const getMyPatients = await appointmentModel.find({ DoctorId: req.params.id });

    let result=[]

    for (let i=0;i<getMyPatients.length;i++) {
        console.log(getMyPatients[i].PatientId)
        const element = await patientsModel.find({ _id: getMyPatients[i].PatientId})
        result = [...result, ...element];
    }

    if (result.length == 0) {
        res.status(400).json({ message: "No patient found", success: false })
    }
    res.status(200).json({ Result: result, success: true })
});

// requirement number 34
router.get('/getPatientName/:name', async (req, res) => {
    const getPatients = await patient.find({ Name: new RegExp(`${req.params.name}`) });
    if (getPatients.length == 0) {
        res.status(400).json({ message: "No patient found with this name", success: false })
    }
    res.status(200).json({ Result: getPatients, success: true })
})

// requirement number 35
router.get('/getAppointment/:date/:id', async (req, res) => {
    const getAppointments = await appointmentModel.find({ Date: { $gte: req.params.date } , DoctorId : req.params.id});

    if (getAppointments.length == 0)
        res.status(400).json({ message: "No upcoming appointments found", success: false })

    res.status(200).json({ Result: getAppointments, success: true })
});

// requirement number 36
router.get('/selectPatientName/:id', async (req, res) => {

    const getPatients = await patient.find({ _id: req.params.id });
    if (getPatients.length == 0) {
        res.status(400).json({ message: "No patient found with this name", success: false })
    }
    res.status(200).json({ Result: getPatients, success: true })
})

export default router;