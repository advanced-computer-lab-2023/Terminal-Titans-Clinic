import express from 'express'
import Doctor from '../Models/doctorModel.js';
import patient from '../Models/patientsModel.js';
import appointmentModel from '../Models/appointmentModel.js';
import doctorModel from '../Models/doctorModel.js';


const router = express.Router()


//requirement 18 (add family member)

// requirement number 23
router.get('/getAppointment/:date', async (req, res) => {
    const getAppointments = await appointmentModel.find({ Date: { $gte: req.params.date } });
    res.status(200).json(getAppointments)
});

// requirement number 38
router.get('/getDoctor/:name', async (req, res) => {
    const getDoctors = await Doctor.find({ Name: new RegExp(`${req.params.name}`) });
    if (getDoctors.length == 0) {
        res.status(400).json({ message: "No doctor found with this name" })
    }
    res.status(200).json({ Doctors: getDoctors })
}) ;
//requirement number 37

router.get('/getDoctors', async(req, res)=>{
    const allDoctors = await Doctor.find({});
    res.status(200).json( allDoctors )
})
//requirement number 39

router.get('/filterDoctors', async(req, res)=>{

})
export default router;