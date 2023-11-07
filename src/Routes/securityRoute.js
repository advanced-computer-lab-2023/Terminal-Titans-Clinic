import { Router } from 'express';
import patientModel from '../Models/patientsModel.js';
import userModel from '../Models/userModel.js';
import reqdoctorModel from '../Models/requestedDoctorModel.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer';
import otpModel from '../Models/otpModel.js';


// import validator from 'email-validator'

const router = Router()


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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newPatient = new patientModel({
            Username: req.body.username,
            Password: hashedPassword,
            Name: req.body.name,
            Email: req.body.email,
            DateOfBirth: req.body.dob,
            Mobile: req.body.mobile,
            EmergencyName: req.body.first + " " + req.body.last,
            EmergencyMobile: req.body.emergencyNumber,
            Gender: req.body.gender
        });

        newPatient.save();

        let resultPatient = JSON.parse(JSON.stringify(newDoctor));

        resultPatient["token"] = generateToken(newPatient._id);

        return res.status(200).json({ message: "You have registered", success: true, Result: resultPatient })

    }
    catch (error) {
        return res.status(400).json({ message: "There is an error", success: false })
    }
})

router.post('/doctor', async (req, res) => {
    if (!req.body.username || !req.body.dateOfBirth || !req.body.password
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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newDoctor = new reqdoctorModel({
            Username: req.body.username,
            Password: hashedPassword,
            Name: req.body.name,
            Email: req.body.email,
            DateOfBirth: req.body.dateOfBirth,
            HourlyRate: req.body.hourlyRate,
            Affiliation: req.body.affiliation,
            Education: req.body.education,
            Speciality: req.body.speciality
        });


        newDoctor.save();

        let resultDoctor = JSON.parse(JSON.stringify(newDoctor));

        resultDoctor["token"] = generateToken(newDoctor._id);

        return res.status(200).json({ message: "You have registered", success: true, Result: resultDoctor })
    }
    catch (error) {
        return res.status(400).json({ message: "There is an error", success: false })
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        res.status(400).json({ message: 'Please fill all fields', success: false })
        return;
    }

    const user = await userModel.findOne({ Username: username })

    console.log(user);
    console.log(username);
    console.log(password);
    if (user && (await bcrypt.compare(password, user.Password))) {
        // generate token
        res.status(200).json({
            Result:
            {
                _id: user._id,
                name: user.Name,
                email: user.Email,
                type: user.__t,
                token: generateToken(user._id)
            },
            success: true
        })
    }
    else {
        res.status(400).json({ message: 'Invalid username or password', success: false })
    }
})

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

router.post('/forgotPassword', async (req, res) => {
    const { email } = req.body

    const user = await userModel.findOne({ Email: email })
    console.log(user)
    if (user) {
        const otp = Math.floor(100000 + Math.random() * 900000);
        const newOtp = new otpModel({
            userId: user._id,
            otp: otp
        });
        newOtp.save();
        console.log("OTP: ", otp);

        try {
            const mailResponse = await mailSender(
                email,
                "Verification Email",
                `<h1>Please confirm your OTP</h1>
                 <p>Here is your OTP code: ${otp}</p>`
            );
            console.log("Email sent successfully: ", mailResponse);
            res.status(200).json({ message: 'Email sent' })
        } catch (error) {
            res.status(500).json({ message: 'Error sending email' })
        }
    }

})
const mailSender = async (email, title, body) => {
    try {
        // Create a Transporter to send emails
        // var smtpConfig = {
        //     host: 'smtp.gmail.com',
        //     port: 587,
        //     secure: false, // use SSL
        //     auth: {
        //         user: process.env.MAIL_USER,
        //         pass: process.env.MAIL_PASS,
        //     }
        // };
        // var transporter = nodemailer.createTransport(smtpConfig);
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
             secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });
        // Send emails to users
        let info = await transporter.sendMail({
            from: 'Terminal Titans',
            to: email,
            subject: title,
            html: body,
        });
        console.log("Email info: ", info);
        return info;
    } catch (error) {
        console.log(error.message);
    }
};
export default router;