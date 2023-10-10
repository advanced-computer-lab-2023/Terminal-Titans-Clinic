import express from 'express'
import doctorModel from '../Models/doctorModel.js';
import patientsModel from '../Models/patientsModel.js';
import healthModel from '../Models/healthModel.js';
import appointmentModel from '../Models/appointmentModel.js';
import familyMemberModel from '../Models/familyMemberModel.js';

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
    else
        res.status(200).json({ Result: doctor, success: true })
})

router.get('/', (req, res) => {
    res.render('doctorPage')
})

// requirement number 14 later
router.get('/updateDoctor', async (req, res) => {
    // const doctor = await doctorModel.findOne({_id:req.params.id});
    try {
        const updatedDoctor = await doctorModel.findOneAndUpdate({ _id: id },
            {
                Email: req.query.Email || doctor.Email,
                HourlyRate: req.query.HourlyRate || doctor.HourlyRate,
                Affiliation: req.query.Affiliation || doctor.Affiliation
            });
        if (!updatedDoctor || updatedDoctor.length == 0) {
            res.status(400).json({ message: "Doctor not found", success: false })
        }
        else {
            res.status(200).render('doctorPage', { Result: updatedDoctor, success: true })
        }
    } catch (err) {
        res.status(400).json({ message: err.message, success: false })
    }
});

// requirement number 25
router.get('/getPatientInfoAndHealth/:id', async (req, res) => {
    try {
        const appointment = await appointmentModel.findOne({ PatientId: req.params.id });

        if (appointment.length == 0) {
            res.status(400).json({ message: "Not registered with you", success: false })
            return;
        }


        let healthRecords = await healthModel.find({ PatientId: appointment.PatientId })


        if (healthRecords.length == 0) {
            res.status(400).json({ message: "No health records found", success: false })
            return;
        }

        let patient = await patientsModel.findOne({ _id: req.params.id });

        if (!patient) {
            res.status(400).json({ message: "No patient found", success: false })
            return;
        }


        let familyMembers = await familyMemberModel.find({ PatientId: patient._id })

        patient = { ...patient._doc, "familyMember": [] }

        for (let i = 0; i < familyMembers.length; i++) {
            console.log(familyMembers[i].Name)
            patient.familyMember.push(familyMembers[i].Name)
        }


        const result = {
            "healthRecords": healthRecords,
            "patient": patient
        }

        res.status(200).render('doctorPage', { Result: result, success: true })
    } catch (err) {
        res.status(400).json({ message: err.message, success: false })
    }
});

// requirement number 33
router.get('/getPatientsList', async (req, res) => {
    try {
        const appointments = await appointmentModel.find({ DoctorId: id });

        if (appointments.length == 0) {
            res.status(400).json({ message: "No patients found", success: false })
            return;
        }

        let result = []


        for (let i = 0; i < appointments.length; i++) {
            let patient = await patientsModel.findOne({ _id: appointments[i].PatientId })
            let familyMembers = await familyMemberModel.find({ PatientId: patient._id })

            patient = { ...patient._doc, "familyMember": [] }

            for (let i = 0; i < familyMembers.length; i++) {
                patient.familyMember.push(familyMembers[i].Name)
            }

            result = [...result, patient];
        }

        if (result.length == 0) {
            res.status(400).json({ message: "No patient found", success: false })
        }
        else
            res.status(200).json({ Result: result, success: true })
    } catch (err) {
        res.status(400).json({ message: err.message, success: false })
    }
});

// requirement number 34
router.get('/getPatientName/:name', async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ _id: id })

        if (!doctor) {
            res.status(400).json({ message: "Doctor not found", success: false })
            return;
        }

        let appointments = await appointmentModel.find({ DoctorId: doctor._id })

        if (appointments.length == 0) {
            res.status(400).json({ message: "No appointments found", success: false })
            return;
        }

        let patients = []


        for (let key in appointments) {
            let patient = await patientsModel.findOne({ _id: appointments[key].PatientId })

            let familyMembers = await familyMemberModel.find({ PatientId: patient._id })

            patient = { ...patient._doc, "familyMember": [] }

            for (let i = 0; i < familyMembers.length; i++) {
                console.log(familyMembers[i].Name)
                patient.familyMember.push(familyMembers[i].Name)
            }

            patients.push(patient)
        }


        if (patients.length == 0) {
            res.status(400).json({ message: "No patient found with this name", success: false })
        }
        else
            res.status(200).json({ Result: patients, success: true })
    } catch (err) {
        res.status(400).json({ message: err.message, success: false })
    }
})

// requirement number 35 front lesa
router.get('/getUpcomingAppointment', async (req, res) => {
    try {
        let today = new Date();

        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        today = new Date(today);

        const getAppointments = await appointmentModel.find({ Date: { $gte: today }, DoctorId: id });

        if (getAppointments.length == 0)
            return res.status(400).json({ message: "No upcoming appointments found", success: false })


        let result = []

        for (let i = 0; i < getAppointments.length; i++) {
            let patient = await patientsModel.findOne({ _id: getAppointments[i].PatientId })
            let familyMembers = await familyMemberModel.find({ PatientId: patient._id })
            patient = { ...patient._doc, "familyMember": [] }

            for (let j = 0; j < familyMembers.length; j++) {
                patient.familyMember.push(familyMembers[j].Name)
            }

            result = [...result, patient]
        }

        res.status(200).json({ Result: result, success: true })
    } catch (err) {
        res.status(400).json({ message: err.message, success: false })
    }
});

// requirement number 36
router.get('/selectPatientName/:id', async (req, res) => {
    try {
        // const getAppointment = await appointmentModel.find({ DoctorId: id });

        let patient = await patientsModel.findOne({ _id: req.params.id });

        if (!patient) {
            res.status(400).json({ message: "No patient found", success: false })
            return;
        }

        const appointment = await appointmentModel.find({ PatientId: req.params.id });

        if (appointment.length == 0) {
            res.status(400).json({ message: "No appointments found", success: false })
            return;
        }

        let result = []

        let familyMembers = await familyMemberModel.find({ PatientId: patient._id })

        patient = { ...patient._doc, "familyMember": [] }

        for (let i = 0; i < familyMembers.length; i++) {
            console.log(familyMembers[i].Name)
            patient.familyMember.push(familyMembers[i].Name)
        }

        result = [patient];


        res.status(200).render('doctorPage', { Result: result, success: true })
    }
    catch (err) {
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