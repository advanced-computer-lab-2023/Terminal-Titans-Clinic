import { Router } from 'express';
import patientModel from '../Models/patientsModel.js';
import userModel from '../Models/userModel.js';
import reqdoctorModel from '../Models/requestedDoctorModel.js';

import validator from 'email-validator'

const router = Router()

router.get('/patient', (req, res) => {
    res.render('../../views/patientRegistration', { message: "" });
})

router.get('/doctor', (req, res) => {
    res.render('../../views/doctorRegistration', { message: "" });

})


router.post('/patient', async (req, res) => {

    if (!req.body.username || !req.body.dob || !req.body.password
        || !req.body.name || !req.body.email || !req.body.mobile
        || !req.body.first || !req.body.last || !req.body.emergencyNumber || !req.body.gender) {

        return res.status(400).json({ message: 'You have to complete all the fields', success: false })

    }
    if (req.body.username.includes(' ')) {

        return res.status(400).json({ message: 'username has to be one word', success: false })

    }
    let unqiueUser = await userModel.find({ Username: req.body.username });
    if (unqiueUser.length > 0)
        return res.status(400).json({ message: 'username has to be unique', success: false })
    unqiueUser = await userModel.find({ Email: req.body.email });
    if (unqiueUser.length > 0)
        return res.status(400).json({ message: 'email has to be unique', success: false })

    // if (!validator.validate(req.body.email))
    //     return res.status(400).json({ message: 'Please enter a valid email', success: false })

    try {
        const newPatient = new patientModel({
            Username: req.body.username,
            Password: req.body.password,
            Name: req.body.name,
            Email: req.body.email,
            DateOfBirth: req.body.dob,
            Mobile: req.body.mobile,
            EmergencyName: req.body.first + " " + req.body.last,
            EmergencyMobile: req.body.emergencyNumber,
            Gender: req.body.gender
        });

        newPatient.save();
        return res.status(200).json({ message: "You have registered", success: true, user: newPatient })
    }
    catch (error) {
        return res.status(400).json({ message: "There is an error", success: false })
    }
})


router.post('/doctor', async (req, res) => {

    if (!req.body.username || !req.body.dob || !req.body.password
        || !req.body.name || !req.body.email || !req.body.hourlyRate
        || !req.body.affiliation || !req.body.education || !req.body.speciality) {
        return res.status(400).json({ message: 'You have to complete all the fields', success: false })
    }
    if (req.body.username.includes(' ')) {
        return res.status(400).json({ message: 'username has to be one word', success: false })
    }
    const savedUser = await userModel.find({ Username: req.body.username });
    if (savedUser.length > 0)
        return res.status(400).json({ message: 'username has to be unique', success: false })

    const unqiueUser = await userModel.find({ Email: req.body.email });
    if (unqiueUser.length > 0)
        return res.status(400).json({ message: 'email has to be unique', success: false })
    //return(res.status(400).send({message: "username exists "}));
    // if (!validator.validate(req.body.email))
    //     return (res.render('../../views/doctorRegistration', { message: "Please enter a valid email" }));
    // if(!validator.validate(req.body.email))
    //      return(res.status(400).json({message:"Please enter a valid email"}))
    try {
        const newDoctor = new reqdoctorModel({
            Username: req.body.username,
            Password: req.body.password,
            Name: req.body.name,
            Email: req.body.email,
            DateOfBirth: req.body.dob,
            HourlyRate: req.body.hourlyRate,
            Affiliation: req.body.affiliation,
            Education: req.body.education,
            Speciality: req.body.speciality
        });

        newDoctor.save();

        let resultDoctor = JSON.parse(JSON.stringify(newDoctor))


        resultDoctor["token"] = generateToken(newDoctor._id)

        console.log(resultDoctor);


        // res.status(200).send("success");
        return res.status(200).json({ message: "You have registered", success: true, user: resultDoctor })
    }
    catch (error) {
        return res.status(400).json({ message: "There is an error", success: false })
    }
});

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

export default router;