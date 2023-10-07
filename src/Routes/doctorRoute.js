import express from 'express'
import Doctor from '../Models/doctorModel.js';
import patient from '../Models/patientsModel.js';
import healthModel from '../Models/healthModel.js';
import appointmentModel from '../Models/appointmentModel.js';
import { get } from 'mongoose';

const router = express.Router()

// get all doctors
// router.get('/', async (req, res) => {
//     const doctors = await Doctor.find({})
//     res.status(200).json(doctors)
// })

router.get('/',(req,res)=>{
    res.render('doctorPage')
})

// requirement number 14
router.put('/:id', async (req, res) => {
    const doctor = await Doctor.findById(req.params.id)
    if (!doctor)
        res.status(400).json({ message: "Doctor not found",success:false})
    else {
        const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true })

        res.status(200).json({Result:updatedDoctor,success:true})
    }
})

// requirement number 25
router.get('/getPatientsAndHealth', async (req, res) => {

    const healthRecords = await healthModel.find({})


    if (healthRecords.length == 0) {
        res.status(400).json({ message: "No patients found",success:false })
        return;
    }

    const patients = []
    for (let key in healthRecords) {
        const patientRecord = await patient.findById(healthRecords[key].patientId)
        patients.push(patientRecord)
    }

    const result = {
        "healthRecords": healthRecords,
        "patients": patients
    }

    res.status(200).json({Result:result,success:true})
});

// requirement number 33
router.get('/getPatients', async (req, res) => {
    const getPatients = await patient.find({})
    if (getPatients.length == 0) {
        res.status(400).json({ message: "No patient found",success:false })
    }
    res.status(200).json({ Result:getPatients,success:true })
});

// requirement number 34
router.get('/getPatientName/:name', async (req, res) => {
    const getPatients = await patient.find({ Name: new RegExp(`${req.params.name}`) });
    if (getPatients.length == 0) {
        res.status(400).json({ message: "No patient found with this name",success:false })
    }
    res.status(200).json({ Result: getPatients,success:true })
})

// requirement number 35
router.get('/getAppointment/:date', async (req, res) => {
    const getAppointments = await appointmentModel.find({ Date: { $gte: req.params.date } });

    if(getAppointments.length == 0)
        res.status(400).json({ message: "No upcoming appointments found",success:false })

    res.status(200).json({Result:getAppointments,success:true})
});

// requirement number 36
router.get('/selectPatientName/:id', async (req, res) => {
    
    const getPatients = await patient.find({ _id: req.params.id });
    if (getPatients.length == 0) {
        res.status(400).json({ message: "No patient found with this name",success:false })
    }
    res.status(200).json({ Result: getPatients,success:true })
})

export default router;