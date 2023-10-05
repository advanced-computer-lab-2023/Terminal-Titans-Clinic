import express from 'express'
import Doctor from '../Models/doctorModel.js';
import patient from '../Models/patientsModel.js';
import healthModel from '../Models/healthModel.js';
import appointmentModel from '../Models/appointmentModel.js';

const router = express.Router()

router.post('/createAdmin', async (req, res) => {
    // Create the admin
    try {
        const { Username, Pass } = req.body;
        const Position = 'Admin';
        const userexist = await adminModel.findOne({ Username });
        if (!userexist) {
            const admin = new adminModel({ Username, Pass, Position });
            const Nadmin = await admin.save();
            res.status(201).json(Nadmin);

            //throw new Error("Username already exist");
        }
        else {
            res.status(500).json({ message: 'Username already exist' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Username already exist' })
    }
});


router.get('/createAdmin', (req, res) => {
    res.render('showDoctors.ejs')
})

// get all doctors
// router.get('/', async (req, res) => {
//     const doctors = await Doctor.find({})
//     res.status(200).json(doctors)
// })


// requirement number 14
router.put('/:id', async (req, res) => {
    const doctor = await Doctor.findById(req.params.id)
    if (!doctor)
        res.status(400).json({ message: "Doctor not found" })
    else {
        const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true })

        res.status(200).json(updatedDoctor)
    }
})

// requirement number 25
router.get('/getPatientsAndHealth', async (req, res) => {

    const healthRecords = await healthModel.find({})


    if (healthRecords.length == 0) {
        res.status(400).json({ message: "No patients found" })
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

    res.status(200).json(result)
});

// requirement number 33
router.get('/getPatients', async (req, res) => {
    const getPatients = await patient.find({})
    if (getPatients.length == 0) {
        res.status(400).json({ message: "No patient found" })
    }
    res.status(200).json({ getPatients })
});

// requirement number 34
router.get('/getPatientName/:name', async (req, res) => {
    const getPatients = await patient.find({ Name: new RegExp(`${req.params.name}`) });
    if (getPatients.length == 0) {
        res.status(400).json({ message: "No patient found with this name" })
    }
    res.status(200).json({ message: getPatients })
})

// requirement number 35
router.get('/getAppointment/:date', async (req, res) => {
    const getAppointments = await appointmentModel.find({ Date: { $gte: req.params.date } });
    res.status(200).json(getAppointments)
});

// requirement number 36
router.get('/selectPatientName/:id', async (req, res) => {
    const getPatients = await patient.find({ Name: req.params.id });
    if (getPatients.length == 0) {
        res.status(400).json({ message: "No patient found with this name" })
    }
    res.status(200).json({ message: getPatients })
})

export default router;