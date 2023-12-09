import express from 'express'
import Doctor from '../Models/doctorModel.js';
import patientModel from '../Models/patientsModel.js';
import appointmentModel from '../Models/appointmentModel.js';
import prescriptionsModel from '../Models/prescriptionsModel.js';
import familyMember from '../Models/familyMemberModel.js'
import doctorModel from '../Models/doctorModel.js';
import healthPackageModel from '../Models/healthPackageModel.js';
import unRegFamMem from '../Models/NotRegisteredFamilyMemberModel.js';
import RegFamMem from '../Models/RegisteredFamilyMemberModel.js';
import protect from '../middleware/authMiddleware.js';
import docAvailableSlots from '../Models/docAvailableSlotsModel.js';
import mongoose from 'mongoose'
import familyMemberModel from '../Models/familyMemberModel.js';
import healthPackageStatus from '../Models/healthPackageStatus.js';
import stripe from "stripe";
import healthModel from '../Models/healthModel.js';
import MedicineModel from '../Models/Medicine.js';
import CartItem from '../Models/Cart.js';
import Order from '../Models/Orders.js';
import transactionsModel from '../Models/transactionsModel.js';
import notificationModel from '../Models/notificationModel.js';
import nodemailer from 'nodemailer';
import followupRequest from '../Models/followupRequest.js';
import { Console } from 'console';

import RegisteredFamilyMemberModel from '../Models/RegisteredFamilyMemberModel.js';
import NotRegisteredFamilyMemberModel from '../Models/NotRegisteredFamilyMemberModel.js';

import multer from 'multer';
import { pid } from 'process';
import { TransformStreamDefaultController } from 'node:stream/web';
import userModel from '../Models/userModel.js';
import docAvailableSlotsModel from '../Models/docAvailableSlotsModel.js';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();
const stripeInstance = stripe('sk_test_51OAmglE5rOvAFcqVk714zBO64pgCArV8MfP0BWTnycXGzLnWqkX5cP37OvMffUIDt6DdoKif93x9PfiC39XvkhJr00LuYVmMyv');
// const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);


router.get('/getCurrentPatient', protect, async (req, res) => {
    const patient = await patientModel.findOne(req.user);
    if (!patient) {
        res.status(400).json({ message: "Patient not found", success: false })
    }
    else
        res.status(200).json({ Result: patient, success: true })
})



const mailSender = async (email, title, body) => {
    try {
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


//req. 64
router.post('/followup', protect, async (req, res) => {
    const exist = await patientModel.findOne(req.user);
   if (!exist) {
        return res.status(400).json({ message: "Patient not found", success: false })
    }
    const pId = req.user._id;
    const name = req.body.Name;
    const doc = await doctorModel.findOne({Name : name})
    const dId = doc._id;
    const date = req.body.Date;
    const famId = req.body.famId;
  

    let newfollowup;
    if (famId) {
        const famMember = await familyMember.find({ PatientId: pId, FamilyMemId: famId });
        if (!famMember) {
            return false;   
        }
        newfollowup = new followupRequest({
            PatientId: pId,
            FamilyMemId: famId,
            DoctorId: dId,
            Status: "pending",
            Date: date,
        });

        newfollowup.save();
   
    }
    else{

     newfollowup = new followupRequest({
        PatientId: pId,
        DoctorId: dId,
        Status: "pending",
        Date: date,

    });
    newfollowup.save();
}
    
return res.status(200).json({ newfollowup, success: true });
    
    
    
})

//requirement 18 (add family member)
router.post('/addFamilyMem', protect, async (req, res) => {
    const exist = patientModel.findOne(req.user);
    if (!exist) {
        return res.status(400).json({ message: "Patient not found", success: false })
    }
    const rel = req.body.relation.toLowerCase()
    if (!(rel == ('wife') || (rel) == ('husband') || (rel) == ('child')))
        return (res.status(400).send({ message: "family member can only be wife/husband or child", success: false }));

    var famMember = await familyMember.find({ PatientId: req.user._id, NationalId: req.body.nId });
    if (famMember.length > 0)
        return (res.status(400).send({ message: "This National Id is already registered as a family member", success: false }));

    // if((rel)==('wife') || (rel)==('husband')  ){  
    // const famMember = await familyMember.find({ PatientId: pId,Relation: req.body.relation.toLowerCase()});
    // if(famMember.length>0)
    //     return(res.status(400).send({message: "a family member is already registered as your spouse"}));
    //     }

    try {
        const newFamilyMember = new unRegFamMem({
            Name: req.body.name,
            Age: req.body.age,
            NationalId: req.body.nId,
            Gender: req.body.gender,
            Relation: req.body.relation.toLowerCase(),
            PatientId: req.user._id,
        });
        newFamilyMember.save();
        // console.log(req.body.pId)
        //const getPatient = await patient.find({ _id: pId });
        // console.log(req.body.pId)
        res.status(200).json({ Result: newFamilyMember, success: true })
    }
    catch (error) {
        res.status(400).send({ error: error, success: false });

    }
})

router.get('/getWalletAmount', protect, async (req, res) => {

    const exists = await patientModel.findById(req.user);
    if (!exists) {
        return res.status(500).json({
            success: false,
            message: "You are not a doctor"
        });
    }
    var result = {};
    result.Amount = exists.Wallet;
    return res.status(200).json(result);
})

router.post('/addRegFamilyMembyNum', protect, async (req, res) => {
    const exist = patientModel.findOne(req.user);
    if (!exist) {
        return res.status(400).json({ message: "Patient not found", success: false })
    }

    req.body.relation = req.body.relation.toLowerCase();
    if (!(req.body.relation == ('wife') || (req.body.relation) == ('husband') || (req.body.relation) == ('child') || (req.body.relation) == ('spouse')))
        return (res.status(400).send({ message: "family member can only be wife/husband or child", success: false }));
    const mobile = req.body.phoneNum;
    var famMember = await patientModel.findOne({ Mobile: mobile });
    if (!famMember)
        return (res.status(400).send({ message: "This phone num is not registered as a patient", success: false }));
    if (famMember._id == req.user._id)
        return (res.status(400).send({ message: "You can't add yourself as a family member", success: false }));
    var availFamMem = await familyMember.findOne({ $or: [{ PatientId: req.user._id, Patient2Id: famMember._id }, { PatientId: famMember._id, Patient2Id: req.user._id }] });
    if (availFamMem)
        return (res.status(400).send({ message: "This patient is already registered as a family member" }));
    try {
        const newFamilyMember = new RegFamMem({
            PatientId: req.user._id,
            Patient2Id: famMember._id,
            Relation: req.body.relation.toLowerCase()
        });
        newFamilyMember.save();
        res.status(200).json({ Result: newFamilyMember, success: true })
    }
    catch (error) {
        res.status(400).send({ error: error });
    }

})

router.post('/addRegFamilyMembyMail', protect, async (req, res) => {
    console.log('l')
    const exist = patientModel.findOne(req.user);
    if (!exist) {
        return res.status(400).json({ message: "Patient not found", success: false })
    }

    req.body.relation = req.body.relation.toLowerCase();
    if (!(req.body.relation == ('wife') || (req.body.relation) == ('husband') || (req.body.relation) == ('child') || (req.body.relation) == ('spouse')))
        return (res.status(400).send({ message: "family member can only be wife/husband or child", success: false }));
    const email = req.body.email;
    var famMember = await patientModel.findOne({ Email: email });
    console.log(famMember)
    if (!famMember)
        return (res.status(400).send({ message: "This email is not registered as a patient", success: false }));
    if (famMember._id == req.user._id)
        return (res.status(400).send({ message: "You can't add yourself as a family member", success: false }));
    var availFamMem = await familyMember.findOne({ $or: [{ PatientId: req.user._id, Patient2Id: famMember._id }, { PatientId: famMember._id, Patient2Id: req.user._id }] });

    if (availFamMem)
        return (res.status(400).send({ message: "This patient is alreadt registered as a family member" }));
    try {
        const newFamilyMember = new RegFamMem({
            PatientId: req.user._id,
            Patient2Id: famMember._id,
            Relation: req.body.relation.toLowerCase()
        });
        newFamilyMember.save();
        res.status(200).json({ Result: newFamilyMember, success: true })
    }
    catch (error) {
        res.status(400).send({ error: error });
    }

})
// requirement number 22
router.get('/viewFamMem', protect, async (req, res) => {
    const exists = await patientModel.findOne(req.user);
    if (!exists) {
        return res.status(400).json({ message: "Patient not found", success: false })
    }
    var unRegFamMemebers = await unRegFamMem.find({ PatientId: req.user._id });
    var regFamMemebers = await RegFamMem.find({ PatientId: req.user._id });
    var list = []
   // console.log(regFamMemebers)

    for (var x in regFamMemebers) {
        var patientFam = await patientModel.findOne({ _id: regFamMemebers[x].Patient2Id })
        if (patientFam)
            list.push(patientFam)
    }
    regFamMemebers = await RegFamMem.find({ Patient2Id: req.user._id });
    for (var x in regFamMemebers) {
        var patientFam = await patientModel.findOne({ _id: regFamMemebers[x].PatientId })
        if (patientFam)
            list.push(patientFam)
    }

    let famMembers = {
        registered: list,
        unregistered: unRegFamMemebers
    }

    //console.log(famMembers);
    res.status(200).json({ Result: famMembers, success: true });

})
router.get('/ViewMyProfile', protect, async (req, res) => {
    const patient = await patientModel.findById(req.user);
    console.log(patient);
    if (!patient) {
        res.status(400).json({ message: "Patient not found", success: false })
    }
    else

        res.status(200).json({ Result: patient, success: true })
})



// requirement number 23
router.post('/getAppointment', protect, async (req, res) => {
    const exists = await patientModel.findOne(req.user);
    if (!exists) {
        return res.status(400).json({ message: "Patient not found", success: false })
    }

    const startDate = req.body.startDate || new Date('1000-01-01T00:00:00.000Z');
    const endDate = req.body.endDate || new Date('3000-12-31T00:00:00.000Z');

    let getAppointmentsbyDate;
    getAppointmentsbyDate = await appointmentModel.find({
        Date: {
            $gte: startDate,
            $lte: endDate
        }, PatientId: req.user._id
    });

    let getAppointmentsbyStatus;
    if (req.body.status) {
        getAppointmentsbyStatus = await appointmentModel.find({ Status: req.body.status, PatientId: req.user._id });
    }
    else {
        getAppointmentsbyStatus = await appointmentModel.find({ PatientId: req.user._id });
    }
    var temp = getAppointmentsbyDate.filter((app) => {
        for (let y in getAppointmentsbyStatus) {
            if (getAppointmentsbyStatus[y]._id.equals(app._id)) {
                return true;
            }
        }
        return false;
    }
    );
    var final = [];
    for (let x in temp) {///if you need the patient's name in front end
        var result = {}
        const doctor = await doctorModel.find({ _id: temp[x].DoctorId })
        if (doctor && doctor.length > 0)
            result.Name = doctor[0].Name;
        result.Date = temp[x].Date;
        result.Status = temp[x].Status;
        if (temp[x].FamilyMemId) {
            const famNam = await familyMemberModel.findOne({ _id: temp[x].FamilyMemId });
            console.log(famNam.Name);
            result.famMem = famNam.Name;
        }

        final.push(result);

    }
    res.status(200).json(final);
});
router.get('/getAllFreeSlots/:id', protect, async (req, res) => {
    console.log("in getAllslots");
    const exists = await patientModel.findOne(req.user);
    if (!exists) {
        return res.status(400).json({ message: "Patient not found", success: false })
    }
    //const appointments = await appointmentModel.find({ DoctorId: req.user._id ,Status:"upcoming"});
    console.log("357");
    var slots= await docAvailableSlots.find({DoctorId:req.params.id});
    console.log("359")
    var result={};
    for(var x in slots){
        var date=slots[x].Date;
        const day=date.getDate();
        const month=date.getMonth()+1;
        const year=date.getFullYear();
        const dateKey=year+"-"+month+"-"+day;

        if(result[dateKey]){
            result[dateKey].push(date);
        }
        else{
            result[dateKey]=[date];
        }
        }

   console.log("done");
return res.status(200).json(result);
});
// requirement number 54
router.get('/viewPrescriptions', protect, async (req, res) => {
    const exists = await patientModel.findOne(req.user);
    if (!exists) {
        return res.status(400).json({ message: "Patient not found", success: false })
    }

    const allprescriptions = await prescriptionsModel.find({ PatientId: req.user._id })
    if (!allprescriptions)
        return res.status(400).json({ message: "no presriptions found", success: false })
    else {
        var final = []
        for (let x in allprescriptions) {
            var result = {};
            const doc = await Doctor.find({ _id: allprescriptions[x].DoctorId })
            if (doc.length < 1) {
                return res.status(400).json({ message: "no doctors found", success: false })

            }
            result.id = allprescriptions[x]._id;
            result.Doctor = doc[0].Name;
            result.Date = allprescriptions[x].Date;
            result.status = allprescriptions[x].status;

            final.push(result)

        }
        let prescriptions = final;

        return res.status(200).json({ Result: prescriptions, success: true })
    }
})

// requirement number 38
router.post('/getDoctors', protect, async (req, res) => {
    let exists = await patientModel.findOne(req.user);
    if (!exists) {
        return res.status(400).json({ message: "Patient not found", success: false })
    }

    let getDoctors;
    if (!req.body.Speciality && !req.body.Name) {
        getDoctors = await Doctor.find({});
    }
    else{
    if (req.body.Name && req.body.Speciality) {
        getDoctors = await Doctor.find({ Name: req.body.Name, Speciality: req.body.Speciality });
    }
    if (!req.body.Name) {
        getDoctors = await Doctor.find({ Speciality: req.body.Speciality });
    }
    if (!req.body.Speciality) {
        getDoctors = await Doctor.find({ Name: req.body.Name });
    }
}
   // console.log(getDoctors);
    if (getDoctors.length == 0) {
        return res.status(400).json({ message: "No doctors found " });
    }
console.log(getDoctors);
    return res.status(200).json({ Result: getDoctors, success: true });
});

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

//requirement number 37 //get all doctors
router.get('/getDoctorsInfo', protect, async (req, res) => {

    try {
        let exists = await patientModel.findOne(req.user);
        if (!exists) {
            return res.status(400).json({ message: "Patient not found", success: false })
        }

        const allDoctors = await Doctor.find({});
        const currPat = await patient.find({ _id: req.user._id })
        if (currPat.length < 1) {
            return (res.status(400).send({ error: "cant find patient", success: false }));

        }
        let myHealthStatus = await healthPackageStatus.findOne({ patientId: currPat.id, status: 'Subscribed' });
        const packId = myHealthStatus.packageId;
        var discountP = 0;
        if (packId) {
            const allPackages = await healthPackageModel.find({ _id: packId });
            if (allPackages.length > 0)
                discountP = allPackages[0].doctorDiscountInPercentage;
            else
                return (res.status(400).send({ error: "cant find package", success: false }));

        }
        else {
            discountP = 0;
        }
        let discount = 100 - discountP;

        console.log(discount)
        var final = []
        for (let x in allDoctors) {
            var result = {};
            console.log("here")
            var cur = allDoctors[x];
            var price = (allDoctors[x].HourlyRate * 1.1) * discount / 100;
            result.sessionPrice = price;
            result.Name = allDoctors[x].Name;
            result.Email = allDoctors[x].Email;
            result.Affiliation = allDoctors[x].Affiliation;
            result.Education = allDoctors[x].Education;
            result.Speciality = allDoctors[x].Speciality;
            result.id = allDoctors[x].id;
            final.push(result)

        }
        //console.log(final)
        res.status(200).json({ final: final, success: true });

    }
    catch (error) {
        res.status(400).send({ error: error, success: false });

    }
})

//get all available slots with a given Doctor._id
//req42
router.get('/getDoctorAvailableSlots/:dId', async (req, res) => {
    let exists = await patientModel.findOne(req.user);
    if (!exists) {
        return res.status(400).json({ message: "Patient not found", success: false })
    }
    const dId = req.params.dId;
   // console.log("dId");
    const Dr = await Doctor.find({ _id: dId });
    if (Dr.length < 1) {
        return (res.status(400).send({ error: "cant find doctor", success: false }));
    }
    const allSlots = await docAvailableSlots.find({ DoctorId: dId });
    if (allSlots.length < 1) {
        return (res.status(400).send({ error: "no available slots", success: false }));
    }
    var final = [];
    for (let x in allSlots) {
        var result = {};
        result.Date = allSlots[x].Date;
        result.id = allSlots[x].id;
        final.push(result);
    }
    res.status(200).json({ final: final, success: true });
})

//select an available slot and book an appointment for myself or a family member
//req43
async function bookApppByWallet(doctor,date,price,patientId,famId){
    const dId=doctor;
    console.log(famId);
    console.log("ppp");
var newAppointment;
    if (famId) {
        console.log('k')
        const famMember = await familyMember.find({ PatientId: patientId, FamilyMemId: famId });
        if (!famMember) {
            return false;
        }
        console.log("pio")
        const availableSlot=await docAvailableSlotsModel.find({DoctorId:dId,Date:date});
        if(availableSlot.length<1){
            return false;
        }
        console.log("pioppp")
         newAppointment = new appointmentModel({
            PatientId: patientId,
            FamilyMemId: famId,
            DoctorId: dId,
            Status: "upcoming",
            Date: date,
            Price: price
        });

        newAppointment.save();
    await docAvailableSlots.deleteOne({ DoctorId: dId, Date: date });
    }
    else{
//         if (aptmnt.length < 1) {
// return false;
//         }
console.log("571")
const availableSlot=await docAvailableSlotsModel.find({DoctorId:dId,Date:date});
if(availableSlot.length<1){
    return false;
}
    const newAppointment = new appointmentModel({
        PatientId: patientId,
        DoctorId: dId,
        Status: "upcoming",
        Date: date,
        Price: price

    });
    newAppointment.save();
    await docAvailableSlots.deleteOne({ DoctorId: dId, Date: date });
   
}
const pat=await patientModel.findById(patientId);
const doc=await doctorModel.findById(dId);
    
    const DmailResponse = await mailSender(
        doc.Email,
        "Booked:appointment",
        `<p>Patient:  ${pat.Name} booked an appointment on the following date: ${date}<p>`
        
    );
    if (DmailResponse) {
        console.log("Email to doctor sent successfully: ", DmailResponse);
       
    }
    else {
        console.log("Error sending email to doctor");
    }

    const mailResponse = await mailSender(
        pat.Email,
        "Booked:appointment",
        `<p>It is confirmed. You booked an appointment with doctor: ${doc.Name} on the following date: ${date}<p>`
        
    );
    if (mailResponse) {
        console.log("Email to patient sent successfully: ", mailResponse);
       
    }
    else {
        console.log("Error sending email to patient");
    }

    const DnewNotification = new notificationModel({
        userId: dId, 
        Message: `Patient:  ${pat.Name} booked an appointment on the following date: ${date}`,

    });

    await DnewNotification.save();

    const newNotification = new notificationModel({
        userId: pat._id, 
        Message: `It is confirmed. You booked an appointment with doctor: ${doc.Name} on the following date: ${date}`,

    });

    await newNotification.save();
    //console.log('noticationsent');

    return true;


}

router.get('/notifications', protect, async (req, res) => {
    const exists = await patientModel.findOne(req.user);
    if (!exists) {
        return res.status(400).json({ message: "Patient not found", success: false })
    }
    try {
        const userId = req.user._id; 
        const notifications = await notificationModel.find({ userId }).sort({ timestamp: -1 });
        res.status(200).json({ notifications, success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error retrieving notifications', success: false });
    }
});


router.put('/readnotification/:_id', protect, async (req, res) => {

    const exists = await patientModel.findOne(req.user);
    if (!exists) {
        return res.status(400).json({ message: "Patient not found", success: false })
    }
    try {
        
       const ID = req.params._id;
        const notification = await notificationModel.findByIdAndUpdate( ID ,{ $set:{Status :'read'}},{ new: true });
        console.log( 'Notification marked as read');
        res.status(200).json({ notification, success: true });
      
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error marking notifications as read', success: false });
    }
});
//reschedule an appointment req.47


router.put('/rescheduleAppointment/:_id', protect, async (req, res) => {
    const exists = await patientModel.findOne(req.user);
    if (!exists) {
        return res.status(400).json({ message: "Patient not found", success: false })
    }

    const appId = req.params._id;
    const newdate= req.body.Date ;
    const appointment= await appointmentModel.findById(appId);
    const Did = appointment.DoctorId ;
    const doc = await doctorModel.findById(Did);
    const aptmnt=await appointmentModel.find({DoctorId:Did ,Date:newdate});
   // console.log(aptmnt);
       if(aptmnt && aptmnt.length>0){
          return (res.status(400).send({ error: "The doctor is not available during this slot", success: false }));
     }
        await docAvailableSlots.deleteMany({ DoctorId: Did, Date: newdate });
 //   console.log(appId);
    const result = await appointmentModel.findByIdAndUpdate( appId ,  { $set:{ Date : newdate ,
        Status :"rescheduled"}},{ new: true });
        const DmailResponse = await mailSender(
                doc.Email,
                "rescheduled:appointment",
                `<p>Patient:  ${exists.Name} rescheduled his appointment to be on the following date: ${newdate}<p>`
                
            );
            if (DmailResponse) {
                console.log("Email to doctor sent successfully: ", DmailResponse);
               
            }
            else {
                console.log("Error sending email to doctor");
            }
 
            const mailResponse = await mailSender(
                exists.Email,
                "rescheduled:appointment",
                `<p>It is confirmed. You rescheduled your appointment with doctor: ${doc.Name} to be on the following date: ${newdate}<p>`
                
            );
            if (mailResponse) {
                console.log("Email to patient sent successfully: ", mailResponse);
               
            }
            else {
                console.log("Error sending email to patient");
            }

            const DnewNotification = new notificationModel({
                userId: Did, 
                Message: `Patient:  ${exists.Name} rescheduled his appointment to be on the following date: ${newdate}`,

            });

            await DnewNotification.save();

            const newNotification = new notificationModel({
                userId: req.user._id, 
                Message: `You rescheduled your appointment with doctor: ${doc.Name} to be on the following date: ${newdate}`,

            });

            await newNotification.save();
            console.log('noticationsent');

   return res.status(200).json({ Result: result, success: true });
        });

//req 49 cancel appointment
router.put('/cancelAppointment/:_id', protect, async (req, res) => {
    const patient = await patientModel.findOne(req.user);
    if (!patient) {
        return res.status(400).json({ message: "Patient not found", success: false })
    }

    const Pid = patient._id
    const appId = req.params._id;
    const appointment = await appointmentModel.findByIdAndUpdate(appId, { $set: { Status: "cancelled" } }, { new: true });


    if (!appointment) {

        return res.status(404).json({ message: "Appointment not found", success: false });
    }


    const Did = appointment.DoctorId;
    const doc = await doctorModel.findById(Did);

    const date = appointment.Date;
    const maxdate = date.setHours(date.getHours() - 24);
    const currdate = Date.now();

    const DmailResponse = await mailSender(
        doc.Email,
        "cancelled:appointment",
        `<p>Patient:  ${patient.Name} cancelled his appointment which was supposed to be on the following date: ${date}<p>`
        
    );
    if (DmailResponse) {
        console.log("Email to doctor sent successfully: ", DmailResponse);
       
    }
    else {
        console.log("Error sending email to doctor");
    }


    const mailResponse = await mailSender(
        patient.Email,
        "cancelled:appointment",
        `<p>It is confirmed. You cancelled your appointment with doctor: ${doc.Name} which was supposed to be on the following date: ${date}<p>`
        
    );
    if (mailResponse) {
        console.log("Email to patient sent successfully: ", mailResponse);
       
    }
    else {
        console.log("Error sending email to patient");
    }

    const DnewNotification = new notificationModel({
        userId: Did, 
        Message: `Patient:  ${patient.Name} cancelled his appointment which was supposed to be on the following date: ${date}`,

    });
    
    await DnewNotification.save();

    const newNotification = new notificationModel({
        userId: Pid, 
        Message: `It is confirmed. You cancelled your appointment with doctor: ${doc.Name} which was supposed to be on the following date: ${date}`,

    });
    
    await newNotification.save();
    console.log('noticationsent');


    
    if(currdate<maxdate){

        giveDoctorMoney(req, res, doc, -appointment.Price/1.1);



        patient.Wallet = patient.Wallet + appointment.Price ;
        
        try {
            await patientModel.findByIdAndUpdate(Pid, patient);
            console.log('you have recieved your refund successfully');
            return res.status(200).json({appointment, message: "appointment is cancelled successfully and you have recieved a refund", success: true });
            
        } catch (e) {
            console.error('Error recieving your refund:', e.message);
            return res.status(400).send({ error: e.message });
        }

            }
   else {

            return res.status(200).json({appointment, message: "appointment is cancelled successfully, however, you did not recieve a refund", success: true });
   }


});




router.get('/bookAppointmentCard/:pid/:did/:date/:famId/:fees/:fam', async (req, res) => {
    const pId = req.params.pid;
    const dId = req.params.did;
    const date = req.params.date;
    const aptmnt = await docAvailableSlots.findOne({ DoctorId: dId, Date: date });
    const famId = req.params.famId;
    const doc= await doctorModel.findById(dId);
    const pat=await patientModel.findById(pId);
    console.log(req.params.fam)
    if (req.params.fam == 'true') {
        console.log('hereee')
        const famMember = await familyMember.find({ PatientId: pId, FamilyMemId: famId });
        if (!famMember) {
            return (res.status(400).send({ error: "cant find family member", success: false }));
        }
        const newAppointment = new appointmentModel({
            PatientId: pId,
            FamilyMemId: famId,
            DoctorId: dId,
            Status: "upcoming",
            Date: date,
            Price: req.params.fees
        });
        let price = req.params.fees;
        addTransaction(-1 * price, pId, 'Card', 'Book Appointment');
        addTransaction(price / 1.1, dId, 'Card', 'Book Appointment');
        if (dId) {
            giveDoctorMoney(req, res, doc, price / 1.1);
        }
        newAppointment.save();
        await docAvailableSlots.deleteOne({ DoctorId: dId, Date: date });
       
        console.log(doc.Email);
        console.log(pat.Email);
        try {
            const mailResponse = await mailSender(
                pat.Email,
                "Booked:appointment",
                `<p>It is confirmed. You booked an appointment with doctor: ${doc.Name} on the following date: ${date}<p>`
    
            );
            if (mailResponse) {
                console.log("Email sent successfully: ", mailResponse);
                
            }
            
        } catch (error) {
            return false;
        }
        try {
            const DmailResponse = await mailSender(
                doc.Email,
                "Booked:appointment",
                `<p>It is confirmed. ${pat.Name} has booked an appointment with you on the following date: ${date}<p>`
    
            );
            if (DmailResponse) {
                console.log("Email sent successfully: ", DmailResponse);
                
            }
            
        } catch (error) {
            return false;
        }
        const DnewNotification = new notificationModel({
            userId: dId, 
            Message: `Patient:  ${pat.Name} booked an appointment on the following date: ${date}`,
    
        });
    
        await DnewNotification.save();
    
        const newNotification = new notificationModel({
            userId:pId, 
            Message: `It is confirmed. You booked an appointment with doctor: ${doc.Name} on the following date: ${date}`,
    
        });
    
        await newNotification.save();
        console.log('noticationsent');
        return res.redirect('http://localhost:3000/Health-Plus/patientHome')

    }
    else{
    if (!aptmnt) {
        return (res.status(400).send({ error: "This slot is no longer available", success: false }));
    }
    console.log('hereeee')
    const newAppointment = new appointmentModel({
        PatientId: pId,
        DoctorId: dId,
        Status: "upcoming",
        Date: date,
        Price: req.params.fees
    });
    let fees = req.params.fees;
    console.log('jj');
    newAppointment.save();
    if (dId) {
        giveDoctorMoney(req, res, doc, fees / 1.1);
    }
    let price = req.params.fees;
    addTransaction(price, pId, 'Card', 'Book Appointment');
    console.log('money to pat');
    addTransaction(price / 1.1, dId, 'Card', 'Book Appointment');
    await docAvailableSlots.deleteOne({ DoctorId: dId, Date: date });

    try {
        const mailResponse = await mailSender(
            pat.Email,
            "Booked:appointment",
            `<p>It is confirmed. You booked an appointment with doctor: ${doc.Name} on the following date: ${date}<p>`

        );
        if (mailResponse) {
            console.log("Email sent successfully: ", mailResponse);
            
        }
        else{
            console.log('msh 3aref');
        }
        
    } catch (error) {
        console.log(error.message);
        return false;
    }
    try {
        const DmailResponse = await mailSender(
            doc.Email,
            "Booked:appointment",
            `<p>It is confirmed. ${pat.Name} has booked an appointment with you on the following date: ${date}<p>`

        );
        if (DmailResponse) {
            console.log("Email sent successfully: ", DmailResponse);
            
        }
        
    } catch (error) {
        return false;
    }
    const DnewNotification = new notificationModel({
        userId: doc._id, 
        Message: `Patient:  ${pat.Name} booked an appointment on the following date: ${date}`,

    });

    await DnewNotification.save();

    const newNotification = new notificationModel({
        userId: pat._id, 
        Message: `It is confirmed. You booked an appointment with doctor: ${doc.Name} on the following date: ${date}`,

    });

    await newNotification.save();
    return res.redirect('http://localhost:3000/Health-Plus/patientHome')

    //res.status(200).json({ Result: newAppointment, success: true });

 //   return res.redirect('http://localhost:3000/Health-Plus/patientHome')

}
});
//view a list of all my upcoming / past appointments
//req45
router.get('/viewAppointments', protect, async (req, res) => {
    const exists = await patientModel.findOne(req.user);
    if (!exists) {
        return res.status(400).json({ message: "Patient not found", success: false })
    }
    const status = req.body.status;
    const allAppointments = await appointmentModel.find({ PatientId: req.user._id, Status: { $ne: "cancelled" } });
    if (allAppointments.length < 1) {
        return (res.status(400).send({ error: "no appointments found", success: false }));
    }
    var final = [];
    for (let x in allAppointments) {
        var result = {};
        const doc = await Doctor.find({ _id: allAppointments[x].DoctorId });
        if (doc.length < 1) {
            return (res.status(400).send({ error: "cant find doctor", success: false }));
        }
        result.Doctor = doc[0].Name;
        result.Date = allAppointments[x].Date;
        result.Status = allAppointments[x].Status;
        result.id = allAppointments[x].id;
        final.push(result);
    }
    res.status(200).json({ final: final, success: true });
})

//filter appointments by date or status (upcoming, completed, cancelled, rescheduled)
//req46
router.post('/filterAppointments', protect, async (req, res) => {
    const exists = await patientModel.findOne(req.user);
    if (!exists) {
        return res.status(400).json({ message: "Patient not found", success: false })
    }
    const status = req.body.status;
    const startDate = req.body.startDate || new Date('1000-01-01T00:00:00.000Z');
    const endDate = req.body.endDate || new Date('3000-12-31T00:00:00.000Z');
    if (startDate > endDate)
        return (res.status(400).send({ error: "please enter valid dates", success: false }));

    let appointments;
    if (!status) {
        appointments = await appointmentModel.find({
            Date: {
                $gte: startDate,
                $lte: endDate
            }, PatientId: req.user._id
        });
    }
    else {
        appointments = await appointmentModel.find({ PatientId: req.user._id, Status: status });
        if (appointments.length < 1) {
            return (res.status(400).send({ error: "no appointments found", success: false }));
        }
    }
    var final = [];
    for (let x in appointments) {
        var result = {};
        const doc = await Doctor.find({ _id: appointments[x].DoctorId });
        if (doc.length < 1) {
            return (res.status(400).send({ error: "cant find doctor", success: false }));
        }
        result.Doctor = doc[0].Name;
        result.Date = appointments[x].Date;
        result.Status = appointments[x].Status;
        result.id = appointments[x].id;
        final.push(result);
    }
    res.status(200).json({ final: final, success: true });
})

//requirement number 39
router.post('/filterDoctors', async (req, res) => {
    let exists = await patientModel.findOne(req.user);
    if (!exists) {
        return res.status(400).json({ message: "Patient not found", success: false })
    }
    const spclty = req.body.Speciality;
    let dTimeTemp = req.body.date;
    let dTime = new Date(dTimeTemp);
    dTime.setHours(dTime.getHours() + 2)
    console.log(dTime)

    var spcltyDocs = await Doctor.find({ Speciality: spclty })
    if (!spclty) {
        spcltyDocs = await Doctor.find({});
    }
    const aptmnts = await appointmentModel.find({})

    const result = spcltyDocs.filter((Dr) => {
        for (let y in aptmnts) {
            if (aptmnts[y].DoctorId == Dr._id) {
                let start = aptmnts[y].Date;
                let end = new Date(start);
                end.setMinutes(start.getMinutes() + 30);
                if (dTime >= start && dTime < end)
                    return false;
            }
        }
        return true
    });
    res.status(200).json(result);
})

router.post('/filterPrescriptions', async (req, res) => {
    let exists = await patientModel.findOne(req.user);
    if (!exists) {
        return res.status(400).json({ message: "Patient not found", success: false })
    }

    const startDate = req.body.startDate || new Date('1000-01-01T00:00:00.000Z');
    const endDate = req.body.endDate || new Date('3000-12-31T00:00:00.000Z');
    if (startDate > endDate)
        return (res.status(400).send({ error: "please enter valid dates", success: false }));

    let presDate;
    presDate = await prescriptionsModel.find({
        Date: {
            $gte: startDate,
            $lte: endDate
        }, PatientId: req.user._id
    });

    var id = await doctorModel.find({ Name: req.body.Name });
    // var id=await prescriptionsModel.find({DoctorId: req.body.DoctorId,PatientId:pId})
    const status = req.body.status;
    // presDate = await prescriptionsModel.find({Date: date,PatientId:pId});
    var presStatus = await prescriptionsModel.find({ status: status, PatientId: req.user._id });
    if (!req.body.Name) {
        var id = await doctorModel.find({});
    }
    // if(!req.body.DoctorId){
    //     var id = await prescriptionsModel.find({PatientId:pId});
    // }
    // if(!req.body.Date){
    //      presDate = await prescriptionsModel.find({PatientId:pId});
    // }
    if (!req.body.status) {
        var presStatus = await prescriptionsModel.find({ PatientId: req.user._id });
    }
    var temp = presDate.filter((pres) => {
        var flag1 = false;
        for (let y in id) {
            if (id[y]._id == pres.DoctorId) {
                //if(id[y].DoctorId==pres.DoctorId){ 
                flag1 = true;
            }
        }
        var flag2 = false;
        for (let y in presStatus) {

            if (presStatus[y]._id.equals(pres._id)) {
                flag2 = true;
            }
        }
        return flag1 && flag2
    });

    var final = [];
    for (let x in temp) {///if you need the doctor's name in front end
        var result = {}
        const doc = await Doctor.find({ _id: temp[x].DoctorId })
        console.log(doc.Name)
        if (doc.length > 0)
            result.Name = doc[0].Name;
        //result.prescriptionDoc=temp[x].prescriptionDoc;
        result.Date = temp[x].Date;
        result.status = temp[x].status;
        result.id = temp[x].id;
        result.prescriptionDoc = temp[x].prescriptionDoc.binData.toString('base64');
        final.push(result);

    }
    res.status(200).json({ final, success: true });




}

)
// requirement 40/41
router.get('/selectDoctors/:id', protect, async (req, res) => {
    let exists = await patientModel.findOne(req.user);
    if (!exists) {
        return res.status(400).json({ message: "Patient not found", success: false })
    }

    const pId = req.user._id;
    const docId = req.params.id;
    const Dr = await Doctor.find({ _id: docId });
    const currPat = await patient.find({ _id: pId })

    if (currPat.length < 1) {
        return (res.status(400).send({ error: "cant find patient", success: false }));

    }
    let myHealthStatus = await healthPackageStatus.findOne({ patientId: currPat.id, status: 'Subscribed' });
    const packId = myHealthStatus.packageId;
    var discountP = 0;

    if (packId) {
        const allPackages = await healthPackageModel.find({ _id: packId });
        if (allPackages.length > 0)
            discountP = allPackages[0].doctorDiscountInPercentage;
        else
            return (res.status(400).send({ error: "cant find package", success: false }));

    }
    else {
        discountP = 0;
    }
    let discount = 100 - discountP;

    console.log(discount)
    var final = []
    for (let x in Dr) {
        var result = {};
        console.log("here")
        var cur = Dr[x];
        var price = (Dr[x].HourlyRate * 1.1) * discount / 100;
        result.sessionPrice = price;
        result.Name = Dr[x].Name;
        result.Email = Dr[x].Email;
        result.Affiliation = Dr[x].Affiliation;
        result.Education = Dr[x].Education;
        result.Speciality = Dr[x].Speciality;
        result.HourlyRate = Dr[x].HourlyRate;
        result.DateOfBirth = Dr[x].DateOfBirth;
        result.id = Dr[x].id;
        final.push(result)

    }

    console.log("kkk")
    console.log(Dr)
    res.status(200).json({ Dr: final, success: true });
})

// requirement 56
router.get('/selectPrescriptions/:id', async (req, res) => {
    try {
        let exists = await patientModel.findOne(req.user);
        if (!exists) {
            return res.status(400).json({ message: "Patient not found", success: false })
        }

        const id = req.params.id;
        console.log(id)
        const prescriptions = await prescriptionsModel.find({ _id: id });
        if (prescriptions.length < 0) {

            res.status(400).send({ error: error, success: false });

        }

        console.log(prescriptions)
        let final = []
        for (let x in prescriptions) {
            var result = {};
            const doc = await Doctor.find({ _id: prescriptions[x].DoctorId })
            if (doc.length < 1) {
                return res.status(400).json({ message: "no doctors found", success: false })

            }
            result.id = prescriptions[x].DoctorId;
            result.Doctor = doc[0].Name;
            result.Date = prescriptions[x].Date;
            result.status = prescriptions[x].status;
            result.prescriptionDoc = prescriptions[x].prescriptionDoc.binData.toString('base64');
            final.push(result)

        }
        res.status(200).json({ final: final[0], success: true });
    }
    catch (error) {
        res.status(400).send({ error: error, success: false });


    }
})

//req 28 bas lesa msh akeed heya sah wala laa
async function subscribeHealthPackageWallet(userId,healthPackageId){
    try {
        const user = await patientModel.findById(userId);
        if (!user) {
            return false;
        }
        const healthPackage = await healthPackageModel.findById(healthPackageId);

        if (!healthPackage) {
            return false;
        }

        let renewalDate = new Date();
        renewalDate.setFullYear(renewalDate.getFullYear() + 1);
        console.log(renewalDate);


        //update baa el status bta3t el patient
        let myHealthStatus = await healthPackageStatus.findOne(
            { patientId: userId, status: 'Subscribed', renewalDate: renewalDate, endDate: renewalDate, healthPackageId: healthPackage }
        );

        if (!myHealthStatus) {
            let myHealthStatus = new healthPackageStatus({
                patientId: userId,
                status: 'Subscribed',
                renewalDate: renewalDate,
                endDate: renewalDate,
                healthPackageId: healthPackage
            })
            await myHealthStatus.save();
        }
        return true;

    } catch (error) {
        console.error('Error subscribing to health package:', error.message);
        return false;
    }

}
// router.post('/subscribeHealthPackage', protect, async (req, res) => {
//     const userId = req.user._id;
//     const healthPackageId = req.body.packageId;
//     try {
//         const user = await patientModel.findById(userId);
//         if (!user) {
//             return res.status(500).json({ message: 'Patient not found' });
//         }
//         const healthPackage = await healthPackageModel.findById(healthPackageId);

//         if (!healthPackage) {
//             return res.status(500).json({ message: 'Health package not found' });
//         }

//         let renewalDate = new Date();
//         renewalDate.setFullYear(renewalDate.getFullYear() + 1);
//         console.log(renewalDate);


//         //update baa el status bta3t el patient
//         let myHealthStatus = await healthPackageStatus.findOne(
//             { patientId: userId, status: 'Subscribed', renewalDate: renewalDate, endDate: renewalDate, healthPackageId: healthPackage }
//         );

//         if (!myHealthStatus) {
//             let myHealthStatus = new healthPackageStatus({
//                 patientId: userId,
//                 status: 'Subscribed',
//                 renewalDate: renewalDate,
//                 endDate: renewalDate,
//                 healthPackageId: healthPackage
//             })
//             await myHealthStatus.save();
//         }

//         // const registeredFamilyMembers = await RegFamMem.find({ Patient2Id: userId });
//         // // do the subscription for the fam members
//         // for (const familyMember of registeredFamilyMembers) {
//         //     let healthStatusFamMember = await healthPackageStatus.findOne(
//         //         { patientId: familyMember.PatientId, status: 'Subscribed', renewalDate: renewalDate, endDate: renewalDate, healthPackageId: healthPackage }
//         //     );
//         //     if(!healthStatusFamMember){
//         //         let healthStatusFamMember = new healthPackageStatus({
//         //             patientId: familyMember.PatientId,
//         //             status: 'Subscribed',
//         //             renewalDate: renewalDate,
//         //             endDate: renewalDate,
//         //             healthPackageId: healthPackage
//         //         })
//         //         await healthStatusFamMember.save();
//         //     }
//         //}

//         return res.status(200).json({ message: 'Health package subscribed successfully' });

//     } catch (error) {
//         console.error('Error subscribing to health package:', error.message);
//         return res.status(500).json({ error: 'Error' });
//     }
// });
router.get('/subscribeHealthPackageCard/:pid/:packageId/:fees', async (req, res) => {
    const userId = req.params.pid;
    const healthPackageId = req.params.packageId;
    try {
        const user = await patientModel.findById(userId);
        if (!user) {
            return res.status(500).json({ message: 'Patient not found' });
        }
        const healthPackage = await healthPackageModel.findById(healthPackageId);

        if (!healthPackage) {
            return res.status(500).json({ message: 'Health package not found' });
        }

        let renewalDate = new Date();
        renewalDate.setFullYear(renewalDate.getFullYear() + 1);
        console.log(renewalDate);


        //update baa el status bta3t el patient
        let myHealthStatus = await healthPackageStatus.findOne(
            { patientId: userId, status: 'Subscribed', renewalDate: renewalDate, endDate: renewalDate, healthPackageId: healthPackage }
        );

        if (!myHealthStatus) {
            let myHealthStatus = new healthPackageStatus({
                patientId: userId,
                status: 'Subscribed',
                renewalDate: renewalDate,
                endDate: renewalDate,
                healthPackageId: healthPackage
            })
            await myHealthStatus.save();
            addTransaction(-1 * req.params.fees, userId, 'Card', 'Package Subscribition');

        }

        // const registeredFamilyMembers = await RegFamMem.find({ Patient2Id: userId });
        // // do the subscription for the fam members
        // for (const familyMember of registeredFamilyMembers) {
        //     let healthStatusFamMember = await healthPackageStatus.findOne(
        //         { patientId: familyMember.PatientId, status: 'Subscribed', renewalDate: renewalDate, endDate: renewalDate, healthPackageId: healthPackage }
        //     );
        //     if(!healthStatusFamMember){
        //         let healthStatusFamMember = new healthPackageStatus({
        //             patientId: familyMember.PatientId,
        //             status: 'Subscribed',
        //             renewalDate: renewalDate,
        //             endDate: renewalDate,
        //             healthPackageId: healthPackage
        //         })
        //         await healthStatusFamMember.save();
        //     }
        //}
        return res.redirect('http://localhost:3000/Health-Plus/patientHome')

    } catch (error) {
        console.error('Error subscribing to health package:', error.message);
        return res.status(500).json({ error: 'Error' });
    }
});
// router.post('/subscribeHealthPackageforFamily', protect, async (req, res) => {
//     const userId = req.user._id;
//     const healthPackageId = req.body.packageId;
//     const familyMemberId = req.body.familyMemberId;

//     try {
//         const user = await patientModel.findById(familyMemberId);
//         if (!user) {
//             return res.status(500).json({ message: 'Patient not found' });
//         }
//         const healthPackage = await healthPackageModel.findById(healthPackageId);

//         if (!healthPackage) {
//             return res.status(500).json({ message: 'Health package not found' });
//         }

//         let renewalDate = new Date();
//         renewalDate.setFullYear(renewalDate.getFullYear() + 1);
//         console.log(renewalDate);


//         //update baa el status bta3t el patient
//         // let myHealthStatus = await healthPackageStatus.findOne(
//         //     { patientId: userId, status: 'Subscribed', renewalDate: renewalDate, endDate: renewalDate, healthPackageId: healthPackage }
//         // );

//         // if (!myHealthStatus) {
//         let myHealthStatus = new healthPackageStatus({
//             patientId: familyMemberId,
//             status: 'Subscribed',
//             renewalDate: renewalDate,
//             endDate: renewalDate,
//             healthPackageId: healthPackage
//         })
//         await myHealthStatus.save();

//         //   }

//         // const registeredFamilyMembers = await RegFamMem.find({ Patient2Id: userId });
//         // // do the subscription for the fam members
//         // for (const familyMember of registeredFamilyMembers) {
//         //     let healthStatusFamMember = await healthPackageStatus.findOne(
//         //         { patientId: familyMember.PatientId, status: 'Subscribed', renewalDate: renewalDate, endDate: renewalDate, healthPackageId: healthPackage }
//         //     );
//         //     if(!healthStatusFamMember){
//         //         let healthStatusFamMember = new healthPackageStatus({
//         //             patientId: familyMember.PatientId,
//         //             status: 'Subscribed',
//         //             renewalDate: renewalDate,
//         //             endDate: renewalDate,
//         //             healthPackageId: healthPackage
//         //         })
//         //         await healthStatusFamMember.save();
//         //     }
//         // }

//         return res.status(200).json({ message: 'Health package subscribed successfully' });

//     } catch (error) {
//         console.error('Error subscribing to health package:', error.message);
//         return res.status(500).json({ error: 'Error' });
//     }
// });
async function subscribeHealthPackageFamilyWallet(userId,familyMemberId,healthPackageId){
    try {
        const user = await patientModel.findById(familyMemberId);
        if (!user) {
            return false;
        }
        const healthPackage = await healthPackageModel.findById(healthPackageId);

        if (!healthPackage) {
            return false;
        }

        let renewalDate = new Date();
        renewalDate.setFullYear(renewalDate.getFullYear() + 1);
        console.log(renewalDate);


        let myHealthStatus = new healthPackageStatus({
            patientId: familyMemberId,
            status: 'Subscribed',
            renewalDate: renewalDate,
            endDate: renewalDate,
            healthPackageId: healthPackage
        })
        await myHealthStatus.save();

        return true;

    } catch (error) {
        console.error('Error subscribing to health package:', error.message);
        return false;
    }

}
//test done here (req 30)
router.get('/viewSubscriptions', protect, async (req, res) => {
    const userId = req.user._id;//bagib el id after authentication  
    try {
        // get the patient package
        const user = await patientModel.findById(userId);

        let userHealthPackageStatus = await healthPackageStatus.findOne({ patientId: userId, status: 'Subscribed' });
        // console.log(userHealthPackageStatus)
        let userHealthPackage = userHealthPackageStatus?.healthPackageId;
        let userHealth = new Object()

        if (userHealthPackageStatus?.status == 'Subscribed')
            userHealth = await healthPackageModel.findById(userHealthPackage) ?? {};

        userHealth["PatientId"] = user?._id;
        userHealth["Name"] = user?.Name;
        userHealth["Email"] = user?.Email;
        userHealth["Username"] = user?.Username;

        let result = { 'myUser': userHealth, 'familyMembers': [] };

        //Get the health package details for registered family members
        var registeredFamilyMembers = await RegFamMem.find({
            $or: [
                { Patient2Id: userId },
                { PatientId: userId }
            ]
        });

        for (let member of registeredFamilyMembers) {
            let famMemberUser = {};
            if (member.PatientId.equals(userId))
                famMemberUser = await patientModel.findById(member.Patient2Id);

            if (member.Patient2Id.equals(userId))
                famMemberUser = await patientModel.findById(member.PatientId);

            let famMemberUserHealthPackageStatus = await healthPackageStatus.findOne({ patientId: famMemberUser._id, status: 'Subscribed' });
            let famMemberUserHealthPackage = famMemberUserHealthPackageStatus?.healthPackageId;

            console.log(famMemberUserHealthPackage);
            console.log(famMemberUserHealthPackageStatus);

            let famMemberUserHealth = {};
            if (famMemberUserHealthPackageStatus?.status == 'Subscribed')
                famMemberUserHealth = await healthPackageModel.findById(famMemberUserHealthPackage) ?? {};

            let memberRes = JSON.parse(JSON.stringify(famMemberUserHealth)) ?? {};


            memberRes.PatientId = famMemberUser?._id;
            memberRes.Name = famMemberUser?.Name;
            memberRes.Email = famMemberUser?.Email;
            memberRes.Username = famMemberUser?.Username;
            result['familyMembers'].push(memberRes);
        }

        return res.json({ result });

    } catch (error) {
        console.error('Error viewing health package subscriptions:', error.message);
        return res.status(500).json({ error: 'Error' });
    }
});

//req 31 done
router.get('/viewSubscriptionStatus', protect, async (req, res) => {
    const userId = req.user._id;//bagib el id after authentication 


    try {
        // get the patient package
        const user = await patientModel.findById(userId);

        if (!user) {
            return res.status(500).json({ message: 'Patient not found' });
        }

        //patient
        let userHealthPackageStatus = await healthPackageStatus.find({ patientId: userId });
        //fam members

        // console.log('userHealthPackageStatus',userHealthPackageStatus);

        let registeredFamilyMembers = await RegFamMem.find({
            $or: [
                { Patient2Id: userId },
                { PatientId: userId }
            ]
        });

        if (!userHealthPackageStatus)
            userHealthPackageStatus.status = 'Unsubscribed';

        let result = { 'myUser': userHealthPackageStatus, 'familyMembers': [] };

        for (let member of registeredFamilyMembers) {
            let famMemberUser = {};
            if (member.PatientId.equals(userId))
                famMemberUser = await patientModel.findById(member.Patient2Id);

            if (member.Patient2Id.equals(userId))
                famMemberUser = await patientModel.findById(member.PatientId);

            let healthPackage = await healthPackageStatus.find({
                patientId: famMemberUser._id,
            });
            if (!healthPackage) {
                healthPackage = null;
            }



            console.log(healthPackage);

            for (let i = 0; i < healthPackage.length; i++) {
                let memberRes = JSON.parse(JSON.stringify(member));
                delete memberRes['Patient2Id'];
                delete memberRes['createdAt'];
                delete memberRes['updatedAt'];
                delete memberRes['__v'];
                memberRes['status'] = healthPackage[i].status;
                memberRes['renewalDate'] = healthPackage[i]?.renewalDate;
                memberRes['endDate'] = healthPackage[i]?.endDate;
                result['familyMembers'].push(memberRes);
                console.log(healthPackage[i].status);
                console.log(memberRes['status']);
            }



            // console.log(healthPackage.status);
            // console.log(memberRes['status']);



        }
        // registeredFamilyMembers = await RegFamMem.find({ PatientId: userId });
        // for (let member of registeredFamilyMembers) {
        //     let healthPackage = await healthPackageStatus.findOne({
        //         patientId: member.PatientId,
        //         status: { $in: ['Subscribed', 'Cancelled'] }
        //     });
        //     if (!healthPackage) {
        //         healthPackage = null;
        //     }

        //     let memberRes = JSON.parse(JSON.stringify(member));
        //     delete memberRes['PatientId'];
        //     delete memberRes['createdAt'];
        //     delete memberRes['updatedAt'];
        //     delete memberRes['__v'];

        //     memberRes['status'] = healthPackage?.status ? healthPackage?.status : 'Unsubscribed';
        //     memberRes['renewalDate'] = healthPackage?.renewalDate;
        //     memberRes['endDate'] = healthPackage?.endDate;

        //     result['familyMembers'].push(memberRes);

        // }

        return res.status(200).json({ success: true, result });

    } catch (error) {
        console.error('Error viewing health package subscription status:', error.message);
        return res.status(500).json({ error: error.message, success: false });
    }
});

//hena bas msh mota2aked bet cancel sah wala laa (req 32)
router.put('/cancelMySub', protect, async (req, res) => {
    console.log(req.user._id);
    let exists = await patientModel.findById(req.user._id).select('-HealthHistory');
    console.log(exists);
    if (!exists || req.user.__t != "patient") {
        return res.status(500).json({
            success: false,
            message: "Not authorized"
        });
    }
    const patientId = new mongoose.Types.ObjectId(req.body.patientId);
    console.log(patientId);
    console.log(req.user._id);
    if (patientId == req.user._id) {
        try {
            // get the patient package
            const user = await patientModel.findById(req.user._id);

            if (!user) {
                return res.status(500).json({ message: 'Patient not found' });
            }

            await healthPackageStatus.updateMany(
                {
                    patientId: req.user._id,
                    $expr: {
                        $eq: ["$status", "Subscribed"] // Your condition here
                    }
                },
                {
                    $set: {
                        status: 'Cancelled',
                        endDate: new Date(0),
                        renewalDate: new Date(0)
                    }
                }
            );
            return res.status(200).json({ message: 'Health package subscription canceled successfully' });
        } catch (error) {
            console.error('Error canceling health package subscription:', error.message);
            return res.status(500).json({ error: 'Error' });
        }
    } else {
        try {
            const famId = patientId;
            var FamMem = await RegFamMem.findOne({
                $or: [
                    { PatientId: req.user._id, Patient2Id: famId },
                    { PatientId: famId, Patient2Id: req.user._id }
                ]
            });
            if (!FamMem) {
                return res.status(500).json({
                    success: false,
                    message: "Cant find Family Member"
                });
            }
            let famMemberUser = await patientModel.findById(famId);
            if (!famMemberUser) {
                return res.status(500).json({
                    success: false,
                    message: "Cant find Family Member"
                });
            }
            await healthPackageStatus.updateMany(
                {
                    patientId: famId,
                    $expr: {
                        $eq: ["$status", "Subscribed"] // Your condition here
                    }
                },
                {
                    $set: {
                        status: 'Cancelled',
                        endDate: new Date(0),
                        renewalDate: new Date(0)
                    }
                }
            );

            return res.status(200).json({ message: 'Family Member Health package subscription canceled successfully' });
        }
        catch (error) {

            return res.status(500).json({ error: 'Error canceling health package subscription' });

        }
    }
});
// router.put('/cancelFamSub',protect, async (req, res) => {
//     let exists = await patientModel.findById(req.user);
//     if (!exists || req.user.__t != "Patient") {
//       return res.status(500).json({
//         success: false,
//         message: "Not authorized"
//       });
//     }

// });


//req 27

router.get('/viewHealthCarePackages', protect, async (req, res) => {
    try {
        const healthPackages = await healthPackageModel.find({});

        if (!healthPackages) {
            return res.status(400).send({ message: 'No health packages found' });
        }

        return res.status(200).json({
            message: 'Gettng Health Packages Details',
            success: true,
            Result: healthPackages
        });

    } catch (error) {
        console.error('Error getting Health Packages:', error.message);
        return res.status(400).send({ error: 'Error' });
    }
});

router.post('/addHistory', upload.array('files', 10), protect, async (req, res) => {
    try {
        const files = req.files;

        const pat = await patientModel.findById(req.user);
        if (!pat) {
            return res.status(500).json({
                success: false,
                message: "You are not authorised "
            });
        }

        let medical = pat.HealthHistory;

        if (files) {
            for (const file of files) {
                const newHistoryEntry = {
                    data: file.buffer,
                    contentType: file.mimetype,
                    // Add any other properties you need for the file entry
                };

                medical.push(newHistoryEntry);
            }
        }

        const updatedPatient = await patientModel.findByIdAndUpdate(
            req.user,
            { HealthHistory: medical },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Health history updated successfully",
            data: updatedPatient,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "General Error",
        });
    }
});

router.post('/addHistory', upload.array('files', 10), protect, async (req, res) => {
    try {
        const files = req.files;

        const pat = await patientModel.findById(req.user);
        if (!pat) {
            return res.status(500).json({
                success: false,
                message: "You are not authorised "
            });
        }

        let medical = pat.HealthHistory;

        if (files) {
            for (const file of files) {
                const newHistoryEntry = {
                    data: file.buffer,
                    type: file.mimetype,
                    // Add any other properties you need for the file entry
                };

                medical.push(newHistoryEntry);
            }
        }

        const updatedPatient = await patientModel.findByIdAndUpdate(
            req.user,
            { HealthHistory: medical },
            { new: true }
        );

       // console.log(updatedPatient.HealthHistory);
        res.status(200).json({
            success: true,
            message: "Health history updated successfully",
            data: updatedPatient,
        });
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            success: false,
            message: "General Error",
        });
    }
});

const getUserOrFamilyMember = async (req, res, userType, registered) => {
    const userId = req.user._id;

    const familyMemberId = userType === "familyMember" ? req.body.familyMember._id : null;

    try {
        if (userType === "patient") {
            const user = await patientModel.findById(userId);
            console.log(`${userType === "patient" ? 'User' : 'Family Member'} retrieved successfully`);
            return user;
        } else if (userType === "familyMember") {
            if (!registered) {
                const familyMember = await NotRegisteredFamilyMemberModel.findById(familyMemberId);
                console.log(`${userType === "patient" ? 'User' : 'Family Member'} retrieved successfully`);
                return familyMember;
            } else {
                const familyMember = await patientModel.findById(familyMemberId);
                console.log(`${userType === "patient" ? 'User' : 'Family Member'} retrieved successfully`);
                return familyMember;
            }
        }


        return null;
    } catch (error) {
        console.error(`Error getting ${userType === "patient" ? 'User' : 'Family Member'}:`, error.message);
        return res.status(400).send({ error: `Error getting ${userType === "patient" ? 'User' : 'Family Member'}:` + error.message });
    }
};

const getDoctor = async (req, res, doctorId) => {
    try {
        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
            console.error('Doctor not found');
            return res.status(400).send({ message: 'Doctor not found' });
        }

        console.log('Doctor retrieved successfully');
        return doctor;
    } catch (error) {
        console.error('Error getting Doctor:', error.message);
        return res.status(400).send({ error: 'Error getting Doctor:' + error.message });
    }
};

const getSubscribedHealthPackage = async (req, res, userId) => {
    try {
        let packageStatus = await healthPackageStatus.find({ patientId: userId, status: 'Subscribed' });

        if (packageStatus && packageStatus.length > 0) {
            const healthPackage = await healthPackageModel.findById(packageStatus[0].healthPackageId);
            console.log('Subscribed health package retrieved successfully');
            return healthPackage || null;
        }

        console.log('No subscribed health package found');
        return null;
    } catch (error) {
        console.error('Error getting package', error.message);
        return null;
    }
};

const getHealthPackage = async (req, res, healthPackageId) => {
    try {
        const healthPackage = await healthPackageModel.findById(healthPackageId);
        console.log('Health Package retrieved successfully');
        return healthPackage;
    } catch (error) {
        console.error('Error getting Health Package', error.message);
        return res.status(400).send({ error: 'Error getting Health Package:' + error.message });
    }
};

const calculateFees = (fees, discount) => {
    return fees - (fees * (discount / 100));
};

const giveDoctorMoney = async (req, res, doctor, fees) => {
    doctor.Wallet = doctor.Wallet + fees;

    try {
        await doctorModel.findByIdAndUpdate(doctor._id, doctor);
        console.log('Money transferred to Doctor successfully');
    } catch (e) {
        console.error('Error transferring money to Doctor:', e.message);
        return res.status(400).send({ error: e.message });
    }
};

const processAppCardPayment = async (req, res, fees, description, doctor, subscribtion, pid, did, famId, date, fam) => {
    console.log( Math.round(fees * 100))
    try {
        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [{
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: description,
                    },
                    unit_amount: Math.round(fees * 100) ,
                },
                quantity: 1,
            }],
            success_url: `http://localhost:8000/patient/bookAppointmentCard/${pid}/${did}/${encodeURIComponent(date)}/${famId}/${fees}/${fam}`,

            cancel_url: `http://localhost:3000/Health-Plus/${subscribtion ? 'packageSubscribtion' : 'bookAppointments'}`,
        });



        console.log('Card payment processed successfully');
        return res.status(200).send({ url: session.url });
    } catch (e) {
        console.error('Error in payment', e.message, e);
        return res.status(400).send({ error: e.message });
    }
};

const processAppWalletPayment = async (req, res, userId, fees, doctor,famId,date) => {
    console.log("docccc")
    console.log(famId)
    const user = await getUserOrFamilyMember(req, res, "patient", true);
    if (!user) return;

    user.Wallet = user.Wallet - fees;
    if (user.Wallet < 0) {
        console.error('Insufficient funds in wallet');
        let result = res.status(400).send({ hello: 'Insufficient funds' });
        console.log(result);
        return result;
    }

    try {
        const flag=await bookApppByWallet(doctor,date,fees,userId,famId);
        console.log("lopo")
        console.log(flag);
        if(flag){
        await patientModel.findByIdAndUpdate(userId, user);
        if (doctor) {
            giveDoctorMoney(req, res, doctor, fees / 1.1);
            await patientModel.findByIdAndUpdate(userId, user);
            addTransaction(-1 * fees, userId, 'wallet', 'Book Appointment');
            addTransaction(fees / 1.1, doctor, 'wallet', 'Book Appointment');
        }
        else {
            addTransaction(-1 * fees, userId, 'wallet', 'Package subscription');

        }

        console.log('Wallet payment processed successfully');
       
        return res.status(200).json({
            message: 'Payment Successful',
            success: true,
            Result: "Money left in wallet: " + user.Wallet
        });
    }
    else{
        return res.status(400).json({
            message: 'Payment UnSuccessful',
            success: false,
            Result: "Money left in wallet: " + user.Wallet
        });
    }
    } catch (e) {
        console.error('Error processing wallet payment', e.message);
        return res.status(400).send({ error: e.message });
    }
};
const processSubWalletPayment = async (req, res, userId, fees,famId,healthPackageId) => {
    const user = await getUserOrFamilyMember(req, res, "patient", true);
    if (!user) return;

    user.Wallet = user.Wallet - fees;
    if (user.Wallet < 0) {
        console.error('Insufficient funds in wallet');
        let result = res.status(400).send({ hello: 'Insufficient funds' });
        console.log(result);
        return result;
    }
    await patientModel.findByIdAndUpdate(userId, user);

    try {
            addTransaction(-1 * fees, userId, 'wallet', 'Package subscription');

            if(famId===null){
            
                if(!subscribeHealthPackageWallet(userId,healthPackageId))
                return res.status(400).send({ error: 'Error subscribing to health package' });
              }else{
               
                    if(!subscribeHealthPackageFamilyWallet(userId,famId,healthPackageId))
                    return res.status(400).send({ error: 'Error subscribing to health package to family member' });
              }

        console.log('Wallet payment processed successfully');
        return res.status(200).json({
            message: 'Payment Successful',
            success: true,
            Result: "Money left in wallet: " + user.Wallet
        });
    } catch (e) {
        console.error('Error processing wallet payment', e.message);
        return res.status(400).send({ error: e.message });
    }
};

router.post("/payForAppointment", protect, async (req, res) => {
    console.log(req);
    console.log("lp")
    const { userType, paymentType } = req.query;
    try {
        return await processAppointmentPayment(req, res, userType, paymentType);
    } catch (e) {
        console.error('Error processing payment', e.message);
        return res.status(400).send({ error: e.message });
    }
});

const processAppointmentPayment = async (req, res, userType, paymentType) => {
    const userId = req.user._id;
    const familyMemberId = userType === "familyMember" ? req.body.familyMember._id : null;
    const doctorId = req.body.doctor._id;
    const date = req.body.date;

    const user = await getUserOrFamilyMember(req, res, userType, false);
    if (!user) return;

    const doctor = await getDoctor(req, res, doctorId);
    if (!doctor) return;

    const healthPackage = await getSubscribedHealthPackage(req, res, userId);

    let discount = 0;
    if (healthPackage) {
        discount = healthPackage.doctorDiscountInPercentage;
    }
    var fam = false
    if (userType === "familyMember") {
        fam = true
    }
    console.log(req.body.familyMember._id);
    const fees = calculateFees(doctor.HourlyRate * 1.1, discount);
    try {
        if (paymentType === "wallet") {
            return await processAppWalletPayment(req, res, userId, fees, doctor,req.body.familyMember._id,req.body.date);
        } else {
            return await processAppCardPayment(req, res, fees, "Appointment with " + doctor.Name + " on " + date, doctor, false, userId, doctorId, req.body.familyMember._id, date, fam);
        }
    } catch (e) {
        console.error('Error processing payment', e.message);
        return res.status(400).send({ error: e.message });
    }
};
router.get('/packageSubsInfo/:packageId/:famId', protect, async (req, res) => {
    const exists=await patientModel.findById(req.user._id);
    if(!exists){
        return res.status(500).json({
            success: false,
            message: "You are not authorised "
        });
    }
    var famId = req.params.userId;
    var userId=req.user._id;
    var discount=0;
    const healthPackageId = req.params.packageId;
    if(famId){
        userId=famId;
        const sub=healthPackageStatus.findOne({patientId:exists._id,status:'Subscribed'});
        const healthPackageSub = await getHealthPackage(req, res, sub.healthPackageId);
        
        if (healthPackageSub) {
            discount = healthPackageSub.familyDiscountInPercentage;
        }

    }
    const healthPackage = await getHealthPackage(req, res, healthPackageId);
   
    const user=await patientModel.findById(userId);
   
    const fees = calculateFees(healthPackage.subsriptionFeesInEGP, discount);
    var wallet=user.Wallet
    let result = {
        "fees": Math.round(fees * 100) / 100,
        "user": user.Name,
        "healthPackage": healthPackage.Name,
        "wallet": wallet
    }
    return res.status(200).json({ result: result, success: true });
});
router.get('/checkSub/:userId', protect, async (req, res) => {
    try{
    const healthPackage=await healthPackageStatus.findOne({patientId:req.params.userId,status:'Subscribed'});
    if(healthPackage){
        return res.status(200).json({ result: true, success: true });
    }
    else{
        return res.status(200).json({ result: false, success: true });
    }
}
catch(e){
    return res.status(400).json({ result: 'error', success: true });
}
});
router.get('/checkMySub', protect, async (req, res) => {
    try{
    const userId=req.user._id;
    const healthPackage=await healthPackageStatus.findOne({patientId:userId,status:'Subscribed'});
    if(healthPackage){
        return res.status(200).json({ result: true, success: true });
    }
    else{
        return res.status(200).json({ result: false, success: true });
    }
}
catch(e){
    return res.status(400).json({ result: 'error', success: true });
}
});
router.get('/bookAppointmentInfo/:doctorId/:date/:famId', protect, async (req, res) => {
    console.log('line 1938')
    const exists=await patientModel.findById(req.user._id);
    if(!exists){
        return res.status(500).json({
            success: false,
            message: "You are not authorised "
        });
    }
    
    const userId = req.user._id;
    const doctorId = req.params.doctorId;
    const date = req.params.date;
   

    const familyMemberId = req.params.famId;
    console.log(date)
    console.log(doctorId)
    console.log(familyMemberId)
    const doctor = await getDoctor(req, res, doctorId);
    if (!doctor) return;
    const healthPackage = await getSubscribedHealthPackage(req, res, userId);
    let discount = 0;
    if (healthPackage) {
        discount = healthPackage.doctorDiscountInPercentage;
    }
    const fees = calculateFees(doctor.HourlyRate*1.1, discount);
    var user=await patientModel.findById(userId);
    const wallet=user.Wallet
    if(familyMemberId.length && familyMemberId!='null'){
        console.log('not null')
       user=await unRegFamMem.findById(familyMemberId);
    }
    console.log(fees)
   
   let result = {
        "fees": Math.round(fees * 100) / 100,
        "user": user.Name,
        "doctor": doctor.Name,
        "date": date,
        "familyMemberId": familyMemberId,
        "wallet": wallet
    }
  
    return res.status(200).json({ result: result, success: true });
});
router.post("/subscribeForPackage", protect, async (req, res) => {
    const { userType, paymentType } = req.query;
    try {
        const result = await processSubscription(req, res, userType, paymentType);
        return result;
    } catch (e) {
        console.error('Error processing payment', e.message);
        return res.status(400).send({ error: e.message });
    }
});

const processSubscription = async (req, res, userType, paymentType) => {
    const userId = req.user._id;
    const healthPackageId = req.body.healthPackage._id;
    const user = await getUserOrFamilyMember(req, res, userType, true);
    if (!user) return;
    const healthPackage = await getHealthPackage(req, res, healthPackageId);

    let discount = 0;
    if (userType == "familyMember") {
        let packageStatus = await healthPackageStatus.find({ patientId: user, status: 'Subscribed' });
        if (packageStatus && packageStatus.length > 0) {
            return res.status(900).send({ error: "This patient is already subscribed to a health package, you have to cancel first" });
        }
        const subscribedHealthPackage = await getSubscribedHealthPackage(req, res, userId);
        if (subscribedHealthPackage)
            discount = subscribedHealthPackage.familyDiscountInPercentage;
    } else {
        let packageStatus = await healthPackageStatus.find({ patientId: userId, status: 'Subscribed' });

        if (packageStatus && packageStatus.length > 0) {

            return res.status(400).send({ error: "You are already subscribed to a health package" });
        }
    }
var famId=null;
if(userType=="familyMember"){
    famId=user._id;
}
    const fees = calculateFees(healthPackage.subsriptionFeesInEGP, discount);
    try {
        if (paymentType == "wallet") {
            return await processSubWalletPayment(req, res, req.user._id, fees,famId,healthPackageId );
        } else {
            return await processSubCardPayment(req, res, fees, healthPackage.paymentType + " Subscription", null, true, user._id, healthPackageId);
        }
    } catch (e) {
        console.error('Error processing payment', e.message);
        return res.status(400).send({ error: e.message });
    }
};
const processSubCardPayment = async (req, res, fees, description, doctor, subscribtion, pid, packageId) => {
    try {
        console.log('l')
        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [{
                price_data: {
                    currency: "egp",
                    product_data: {
                        name: description,
                    },
                    unit_amount: Math.round(fees * 100) ,
                },
                quantity: 1,
            }],
            success_url: `http://localhost:8000/patient/subscribeHealthPackageCard/${pid}/${packageId}/${fees}`,


            cancel_url: `http://localhost:3000/Health-Plus/${subscribtion ? 'packageSubscribtion' : 'bookAppointments'}`,
        });



        console.log('Card payment processed successfully');
        return res.status(200).send({ url: session.url });
    } catch (e) {
        console.error('Error in payment', e.message, e);
        return res.status(400).send({ error: e.message });
    }
};

router.get('/viewmyHealthRecords', protect, async (req, res) => {
    const patient = await patientModel.findOne(req.user);

    if (!patient) {
        return res.status(400).json({ message: "Patient not found", success: false })
    }
    try {
        const healthRecord = await healthModel.find({ PatientId: patient._id });
        let list = []
        // console.log(healthRecord)

        for (let x in healthRecord) {
            list.push(healthRecord[x].HealthDocument.data)

        }

        const medicalHistory = patient.HealthHistory
        let list1 = []
        let list2 = []
        for (var x in medicalHistory) {
            const type = medicalHistory[x].contentType
            if (type == 'application/pdf')
                list1.push(medicalHistory[x])
            else
                list2.push(medicalHistory[x])
        }
        let Result = {
            "healthRecords": list,
            "medicalHistoryPDF": list1,
            "medicalHistoryImage": list2
        }
      
        return res.status(200).json({ Result: Result, success: true });
    }
    catch (error) {
        console.error('Error getting health records', error.message);
    }
});

// router.get('/viewMedicalHistory', protect, async (req, res) => {
//     const patient = await patientModel.findOne(req.user);

//     if (!patient) {
//         return res.status(400).json({ message: "Patient not found", success: false })
//     }
//     try {
//         let Result = {
//             "medicalHistory": patient.HealthHistory
//         }
//         return res.status(200).json({ Result: Result, success: true });
//     }
//     catch (error) {
//         console.error('Error getting health history', error.message);
//     }
// });

router.delete('/deleteMedicalHistory/:medicalHistoryId', protect, async (req, res) => {
    const patient = await patientModel.findOne(req.user);
    console.log(req.params)
    if (!patient) {
        return res.status(400).json({ message: "Patient not found", success: false })
    }
    try {
        for (let i = 0; i < patient.HealthHistory.length; i++) {
            if (patient.HealthHistory[i]._id == req.params.medicalHistoryId) {
                patient.HealthHistory.splice(i, 1)
            }
        }
        await patient.save();
        return res.status(200).json({ Result: patient, message: "Delete successfully", success: true });
    }
    catch (error) {
        console.error('Error getting health history', error.message);
    }
});

//---------------------------------------------------------
//PHARMACYY



//filter 
router.get('/filterMedical/:MedicalUse', protect, async (req, res) => {
    let exists = await patientModel.findById(req.user);
    if (!exists || req.user.__t != "patient") {
        return res.status(500).json({
            success: false,
            message: "Not authorized"
        });
    }
    const MedicalUse = req.params.MedicalUse.toLowerCase();
    if (!MedicalUse) {
        return res.status(400).send({ message: 'Please fill the input', success: false });
    }

    const Medicines = await MedicineModel.find({ MedicalUse });
    if (!Medicines.length) {
        return res.status(400).send({ message: 'No medicines found with the specified medical use.', success: false });
    }

    res.status(200).send({ Result: Medicines, success: true })

});



//search for medicine based on name


router.get('/getMedicine/:Name', protect, async (req, res) => {
    let exists = await patientModel.findById(req.user);
    if (!exists || req.user.__t != "patient") {
        return res.status(500).json({
            success: false,
            message: "Not authorized"
        });
    }
    const Name = req.params.Name.toLowerCase();
    if (!Name) {
        return res.status(400).send({ message: 'Please fill the input', success: false });
    }
    try {
        // const Name = req.body;
        const Medicines = await MedicineModel.findOne({ Name });
        if (!Medicines) {
            return (res.status(400).send({ message: "No Medicine with this name", success: false }));
        }
        res.status(200).json({ Result: Medicines, success: true });
    }

    catch (error) {
        res.status(500).json({ message: "Failed getMedicine", success: false })
    }
});

router.get('/getAllMedicine2', protect, async (req, res) => {
    try {
        let exists = await patientModel.findById(req.user);
        if (!exists || req.user.__t != "patient") {
            return res.status(500).json({
                success: false,
                message: "Not authorized"
            });
        }

        const meds = await MedicineModel.find({ OverTheCounter: true });

        // Add a new property 'isOverTheCounter' to each medicine object

        res.status(200).json({ success: true, meds });
    } catch (error) {
        //  console.error('Error fetching medicine data:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

//view a list of all available medicine pic,price,description
// const viewInfo =async (req,res)=> {
//  const pic = req.query.Picture;
//  const price = req.query.Price;

router.get('/getAllMedicine', protect, async (req, res) => {
    try {

        let exists = await patientModel.findById(req.user);
        if (!exists || req.user.__t != "patient") {
            return res.status(500).json({
                success: false,
                message: "Not authorized"
            });
        }

        const meds = await MedicineModel.find();


        // const medicines = data.Result.filter((medicine) => medicine.Picture);
        res.status(200).json({ success: true, meds });
    } catch (error) {
        console.error('Error fetching medicine data:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/getMedicineById/:id', protect, async (req, res) => {
    try {
        let exists = await patientModel.findById(req.user);
        if (!exists || req.user.__t != "patient") {
            return res.status(500).json({
                success: false,
                message: "Not authorized"
            });
        }
        const id = req.params.id;
        const meds = await MedicineModel.findById(id);

        // const medicines = data.Result.filter((medicine) => medicine.Picture);
        res.status(200).json({ success: true, meds });
    } catch (error) {
        console.error('Error fetching medicine data:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// }
// router.get('/viewAvailableMedicines', viewInfo);
// Import required packages

// Add a medicine to the cart
// router.post('/addToCart', protect, async (req, res) => {
//   let exists = await PatientModel.findById(req.user);
//   if (!exists) {
//     return res.status(500).json({
//       success: false,
//       message: "Not authorized"
//     });
//   }
//   try {
//     const medicineId = req.body.medicineId;

//     // Check if the item is already in the cart
//     const existingCartItem = await CartItem.findOne({ medicineId });

//     if (existingCartItem) {
//       if (quantity <= 0) {
//         return res.status(400).json({ error: 'Invalid quantity selected' });
//       }

//       // Check if there's enough quantity in stock
//       if (medicine.Quantity - existingCartItem.quantity >= quantity) {
//         // If it exists, update the quantity and calculate the new price
//         existingCartItem.quantity += quantity;
//         existingCartItem.price = existingCartItem.quantity * medicine.Price; // Calculate the new price
//         await existingCartItem.save();

//         // Decrement the medicine quantity
//         // medicine.Quantity -= quantity;
//         await medicine.save();

//         res.json(existingCartItem);
//       } else {
//         res.status(404).json({ message: "no stoke", success: false });
//       }
//     } else {
//       if (quantity <= 0) {
//         return res.status(400).json({ error: 'Invalid quantity selected' });
//       }

//       // If not, create a new cart item and calculate the price
//       const newCartItem = new CartItem({ medicineId, quantity });
//       newCartItem.price = newCartItem.quantity * medicine.Price; // Calculate the price
//       await newCartItem.save();

//       // Decrement the medicine quantity
//       //  medicine.Quantity -= quantity;
//       await medicine.save();

//       res.json(newCartItem);
//     }
//   }
//   catch (error) {
//     console.error('Error adding to cart:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });
router.post('/addToCart/:medicineId', protect, async (req, res) => {
    let exists = await patientModel.findById(req.user);
    if (!exists || req.user.__t !== "patient") {
        return res.status(500).json({
            success: false,
            message: "Not authorized"
        });
    }
    try {
        const userId = req.user._id; // Assuming req.user contains the user ID
        const medicineId = req.params.medicineId;
        const quantity = req.body.quantity || 1; // Default to 1 if quantity is not provided

        // Check if the item is already in the cart for the specific user
        const existingCartItem = await CartItem.findOne({ userId, medicineId });

        // Retrieve medicine details
        const medicine = await MedicineModel.findById(medicineId);

        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found', success: false });
        }

        if (existingCartItem) {
            // If it exists, update the quantity and calculate the new price
            if (medicine.Quantity - existingCartItem.quantity >= quantity) {
                existingCartItem.quantity += quantity;
            } else {
                return res.status(400).json({ message: "no stoke", success: false });
            }
            existingCartItem.price = medicine.Price; // Calculate the new price
            await existingCartItem.save();

            res.json({ existingCartItem, success: false });
        } else {
            // If not, create a new cart item and calculate the price
            const newCartItem = new CartItem({ userId, medicineId, quantity });
            newCartItem.price = medicine.Price; // Calculate the price
            await newCartItem.save();

            res.json({ newCartItem, success: false });
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
});

// router.get('/cartItemCount', async (req, res) => {
//   try {
//       // const userId = req.params.userId;

//       // // Count the number of items in the user's cart
//       // const itemCount = await Cart.countDocuments({ userId });
//       const itemCount = await Cart.countDocuments();
//       console.log(itemCount);
//       res.json({ itemCount });
//   } catch (error) {
//       console.error('Error getting cart item count:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.get('/cartItemCount', protect, async (req, res) => {
    let exists = await patientModel.findById(req.user);
    if (!exists || req.user.__t !== "patient") {
        return res.status(500).json({
            success: false,
            message: "Not authorized"
        });
    }
    try {
        // Assuming you have a field named userId in the CartItem model
        const cartItems = await CartItem.find({ userId: req.user._id });

        const itemCount = cartItems.length;

        console.log(itemCount);
        res.json({ itemCount });
    } catch (error) {
        console.error('Error getting cart item count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add this route handler to your Express app (app.js or your main application file)
// const getListMed = async (req, res) => {
//   //retrieve all users from the database
//   try {
//     const meds = await MedicineModel.find();
//     res.status(200).json({ Result: meds, success: true });
//   }

//   catch (error) {
//     res.status(500).json({ message: "No Medicine listed", success: false })
//   }
// }

// router.get('/getAllMedicine', getListMed);

router.get('/cartinCheckOut', protect, async (req, res) => {
    let exists = await patientModel.findById(req.user);
    if (!exists || req.user.__t !== "patient") {
        return res.status(500).json({
            success: false,
            message: "Not authorized"
        });
    } let pid = req.user._id//temp until login
    const cartItems = await CartItem.find({ userId: pid });
    let list = []
    let total = 0;
    for (var x in cartItems) {
        const med = await MedicineModel.findById(cartItems[x].medicineId);
        total += med.Price * cartItems[x].quantity;
        list.push(med);
    }
    let myHealthStatus = await healthPackageStatus.findOne({ patientId: currPat.id, status: 'Subscribed' });
    const packId = myHealthStatus.packageId;
    var discountP = 0;
    if (packId) {
        const allPackages = await healthPackageModel.find({ _id: packId });
        if (allPackages.length > 0)
            discountP = allPackages[0].medicineDiscountInPercentage;
        else
            return (res.status(400).send({ error: "cant find package", success: false }));

    }
    total = total - (total * (discountP / 100));
    Result = {
        cartItems: cartItems,
        medInfo: list,
        total: total
    }
    res.json(Result);
});

// Delete an item from the cart
router.delete('/deleteCartItem/:cartItemId', protect, async (req, res) => {
    let exists = await patientModel.findById(req.user);
    if (!exists || req.user.__t !== "patient") {
        return res.status(500).json({
            success: false,
            message: "Not authorized"
        });
    }
    const cartItemId = req.params.cartItemId;

    try {
        // Find the cart item by its unique ID and remove it
        const deletedCartItem = await CartItem.findByIdAndRemove({ _id: cartItemId, userId: req.user._id });

        if (!deletedCartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        res.json({ message: 'Cart item deleted successfully', deletedCartItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// View the cart
router.get('/cart', protect, async (req, res) => {
    let exists = await patientModel.findById(req.user);
    if (!exists || req.user.__t !== "patient") {
        return res.status(500).json({
            success: false,
            message: "Not authorized"
        });
    }
    const cartItems = await CartItem.find({ userId: req.user._id });
    res.json(cartItems);
});

// Update the quantity of an item in the cart
router.put('/updateCartItem/:cartItemId', protect, async (req, res) => {
    let exists = await patientModel.findById(req.user);
    if (!exists || req.user.__t !== "patient") {
        return res.status(500).json({
            success: false,
            message: "Not authorized"
        });
    }
    const cartItemId = req.params.cartItemId;
    const newQuantity = req.body.quantity;

    try {
        // Find the cart item by its unique ID
        const cartItem = await CartItem.findOne({ _id: cartItemId, userId: req.user._id });

        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        // Update the quantity
        cartItem.quantity = newQuantity;
        await cartItem.save();

        res.json({ message: 'Cart item quantity updated successfully', updatedCartItem: cartItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/cart/total', protect, async (req, res) => {
    let exists = await patientModel.findById(req.user);
    if (!exists || req.user.__t !== "patient") {
        return res.status(500).json({
            success: false,
            message: "Not authorized"
        });
    }
    try {
        // Use the aggregate pipeline to calculate the total price for the specific user
        const totalResult = await CartItem.aggregate([
            {
                $match: {
                    userId: req.user._id // Match the user ID
                }
            },
            {
                $group: {
                    _id: null,
                    totalPrice: { $sum: { $multiply: ['$price', '$quantity'] } }
                }
            }
        ]);

        // If there are results, send the total price; otherwise, set it to 0
        const totalPrice = totalResult.length > 0 ? totalResult[0].totalPrice : 0;
        res.json({ totalPrice });
    } catch (error) {
        console.error('Error fetching total price:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/getAllMedicine', protect, async (req, res) => {
    //retrieve all users from the database
    try {
        let user = await patientModel.findById(req.user);
        if (!user || user.__t !== 'patient') {
            return res.status(500).json({
                success: false,
                message: "Not authorized"
            });
        }

        const meds = await MedicineModel.find();
        res.status(200).json({ Result: meds, success: true });
    }

    catch (error) {
        res.status(500).json({ message: "No Medicine listed", success: false })
    }
});
// Checkout and create an order
router.get('/checkout/:id/:address/:paymentMethod', async (req, res) => {
    try {

        // let exists = await PatientModel.findById(req.user);
        // if (!exists || req.user.__t != "Patient") {
        //   return res.status(500).json({
        //     success: false,
        //     message: "Not authorized"
        //   });
        // }

        const patientId = req.params.id;

        // Get the items from the cart
        const cartItems = await CartItem.find({ userId: patientId });
        //console.log(cartItems);

        // Initialize variables for order creation
        let total = 0;
        const itemsForOrder = [];

        // Calculate the total cost and construct the order
        for (const cartItem of cartItems) {
            const medicine = await MedicineModel.findById(cartItem.medicineId);
            console.log(medicine);

            if (medicine) {
                const itemTotal = cartItem.quantity * medicine.Price;
                console.log('Item Total:', itemTotal); // Add this line for debugging
                total += itemTotal;

                itemsForOrder.push({
                    medicineId: cartItem.medicineId,
                    quantity: cartItem.quantity,
                    price: medicine.Price, // Use the price from the medicine schema
                });
            } else {
                // Handle the case where the medicine is not found
                return res.status(400).json({ error: 'Medicine not found' });
            }

        }

        // Debugging: Output the 'total' value to the console for verification
        console.log('Total before setting:', total);

        // Check if the cart is empty and set 'total' to 0 in that case
        if (itemsForOrder.length === 0) {
            total = 0;
        }

        // Debugging: Output the 'total' value after setting it
        console.log('Total after setting:', total);
        if (total > 0) {
            let myHealthStatus = await healthPackageStatus.findOne({ patientId: patientId.id, status: 'Subscribed' });
            const packId = myHealthStatus.packageId;
            var discountP = 0;
            if (packId) {
                const allPackages = await healthPackageModel.find({ _id: packId });
                if (allPackages.length > 0)
                    discountP = allPackages[0].medicinDiscountInPercentage;
                else
                    return (res.status(400).send({ error: "cant find package", success: false }));

            }
            const discount = (total * (discountP / 100));
            total = total - discount;

            // Create the order in the database
            const newOrder = new Order({
                userId: patientId,
                items: itemsForOrder,
                total: total,
                discount: discount,
                address: req.params.address,
                paymentMethod: req.params.paymentMethod,
                status: 'processing'
            });
            await newOrder.save();
            addTransaction(-1 * total, patientId, req.params.paymentMethod, 'Medicine Purchase');

        }

        // Clear the cart by removing all cart items

        await CartItem.deleteMany({ userId: patientId });
        console.log('right before redirect')
        if (req.params.paymentMethod === 'Card')
            return res.redirect('http://localhost:3000/patient')
        else
            res.status(200).json({ message: 'Checkout successful. Your order has been placed.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Checkout failed. Server error.' });
    }
});

// Add a new delivery address for a patient

router.post('/addAddress', protect, async (req, res) => {
    let exists = await patientModel.findById(req.user);
    if (!exists || req.user.__t != "patient") {
        return res.status(500).json({
            success: false,
            message: "Not authorized"
        });
    }
    const patientId = req.user._id;//temp untill login
    const newAddress = req.body.address;
    // const { patientId, newAddress} = req.body; // Assuming you send patientId and newAddress in the request body

    try {
        // Find the patient by their ID
        const patient = await patientModel.findById(patientId);
        console.log(patient);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Check if the patient has an address array
        if (!patient.address) {
            patient.address = [];
            console.log(patient.address);
        }

        // Validate the new address
        if (typeof newAddress !== 'string') {
            return res.status(400).json({ error: 'Invalid address format' });
        }

        // Add the new address to the array of addresses
        //patient.address.push(newAddress);
        if (patient.address.includes(newAddress)) {
            return res.status(400).json({ error: 'Address already exists for this patient' });
        }
        patient.address.push(newAddress);
        console.log(patient.address);
        // Save the updated patient data
        // const updatedPatient = await patient.save();
        const updatedPatient = await patientModel.findOneAndUpdate({ _id: patientId },
            {
                address: patient.address,

            });
        res.json({ message: 'Address added successfully', patient: updatedPatient });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add the address' });
    }
});


// Retrieve the patient's addresses
router.get('/getAddresses', protect, async (req, res) => {
    let exists = await patientModel.findById(req.user);
    if (!exists || req.user.__t != "patient") {
        return res.status(500).json({
            success: false,
            message: "Not authorized"
        });
    }
    const patientId = req.user._id;


    try {
        // Find the patient by their ID
        const patient = await patientModel.findById(patientId);

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const address = patient.address; // Retrieve the patient's addresses

        res.json({ address });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve addresses' });
    }
});

// Retrieve order details and status
router.get('/getOrder', protect, async (req, res) => {
    const user = await patientModel.findById(req.user);
    if (!user || user.__t !== 'patient') {
        return res.status(500).json({
            success: false,
            message: "Not authorized"
        });
    }

    // const orderId = req.params.orderId;

    try {
        // Find the order by its ID
        // const order = await Order.find({_id:orderId,userId:req.user._id});
        const order = await Order.find({ userId: req.user._id });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Return order details and status
        res.json({ order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve order details' });
    }
});

router.get('/getOrder/:orderId', protect, async (req, res) => {
    const user = await patientModel.findById(req.user);
    if (!user || user.__t !== 'patient') {
        return res.status(500).json({
            success: false,
            message: "Not authorized"
        });
    }

    const orderId = req.params.orderId;

    try {
        // Find the order by its ID
        const order = await Order.findOne({ _id: orderId, userId: req.user._id });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Return order details and status
        res.json({ order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve order details' });
    }
});

// Cancel an order
router.put('/cancelOrder/:orderId', protect, async (req, res) => {
    console.log(req);
    const user = await patientModel.findById(req.user);
    if (!user || user.__t !== 'patient') {
        return res.status(500).json({
            success: false,
            message: "Not authorized"
        });
    }
    const orderId = req.params.orderId;

    try {
        // Find the order by its ID
        let order = await Order.findOne({ _id: orderId, userId: req.user._id });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        console.log(order);
        // Update the order's status to "canceled"
        if (order.status !== 'out for delievery' || order.status !== 'delivered' || order.status !== 'returned' || order.status !== 'refunded' || order.status !== 'failed' || order.status !== 'completed')
            order.status = 'canceled';

        // Save the updated order data
        await order.save();

        let myOrders = await Order.find({ userId: req.user._id });

        res.json({ message: 'Order canceled successfully', myOrders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to cancel the order' });
    }
});

async function getOrderDetails(pid) {
    try {
        let myHealthStatus = await healthPackageStatus.findOne({ patientId: pid, status: 'Subscribed' });
        const packId = myHealthStatus.packageId;
        var discountP = 0;
        if (packId) {
            const allPackages = await healthPackageModel.find({ _id: packId });
            if (allPackages.length > 0)
                discountP = allPackages[0].medicinDiscountInPercentage;
            else
                return (res.status(400).send({ error: "cant find package", success: false }));

        }
        const cartItems = await CartItem.find({ userId: pid });
        let list = []
        for (var x in cartItems) {
            const med = await MedicineModel.findById(cartItems[x].medicineId);
            medInfo = {
                id: med._id,
                name: med.Name,
                price: med.Price * 100 * (1 - discountP / 100),
                quantity: cartItems[x].quantity
            }
            list.push(medInfo);
        }
        return list
    }
    catch (error) {
        console.log(error);
    }

}


const processPharmCardPayment = async (req, res, pid, address) => {
    const paymentMethod = 'Card';
    try {
        let orderDetails = await getOrderDetails(pid);
        console.log(address)
        const session = await stripeInstance.checkout.sessions.create({

            payment_method_types: ["card"],
            mode: "payment",
            line_items: orderDetails.map(item => {
                return {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: item.name,
                        },
                        unit_amount:Math.round(item.price * 100) / 100 ,
                    },
                    quantity: item.quantity,
                }
            }),
            success_url: `http://localhost:8000/patient/checkout/${pid}/${encodeURIComponent(address)}/${encodeURIComponent(paymentMethod)}`,
            cancel_url: `http://localhost:3000/cancel`,
        })


        // Handle the response as needed

        return res.json({ url: session.url });
    } catch (e) {
        console.error('Error processing card payment', e.message);
        return false;
        //res.status(500).json({ error: e.message })
    }
};

const processPharmWalletPayment = async (req, res, userId, address) => {
    const paymentMethod = 'Wallet';
    let orderDetails = await getOrderDetails(userId);
    var total = 0;
    console.log(orderDetails);
    for (var x in orderDetails) {
        total += orderDetails[x].price * orderDetails[x].quantity;
        console.log(total);
    }
    total = total / 100;
    const user = await patientModel.findById(userId);
    user.Wallet = user.Wallet - total;
    if (user.Wallet < 0) {
        console.error('Insufficient funds in wallet');
        let result = res.status(400).send({ hello: 'Insufficient funds' });
        console.log(result);
        return result;
    }
    try {
        await patientModel.findByIdAndUpdate(userId, user);
        var response = await fetch(`http://localhost:8000/patient/checkout/${userId}/${encodeURIComponent(address)}/${encodeURIComponent(paymentMethod)}`);

        console.log(response.status)
        if (response.status === 200)
            return res.status(200).json({ message: 'Checkout successful. Your order has been placed.' });
    } catch (e) {
        console.error('Error processing wallet payment', e.message);
        return res.status(500).json({ error: e.message });
    }
};

router.post('/payment', protect, async (req, res) => {
    let exists = await patientModel.findById(req.user);
    if (!exists || req.user.__t != "patient") {
        return res.status(500).json({
            success: false,
            message: "Not authorized"
        });
    }
    let userId = exists._id
    let paymentMethod = req.body.paymentMethod;
    try {
        if (paymentMethod === "wallet") {

            let respone = await processPharmWalletPayment(req, res, userId, req.body.address);
            console.log(response)
            return response
        } else {
            if (paymentMethod === "card") {
                const response = await processPharmCardPayment(req, res, userId, req.body.address);
                console.log('card')
                //console.log(response);

            }

            else
                var response = await fetch(`http://localhost:8000/patient/checkout/${userId}/${encodeURIComponent(req.body.address)}/${encodeURIComponent(paymentMethod)}`);
            if (response.status === 200)
                return res.status(200).json({ message: 'Checkout successful. Your order has been placed.' });
        }
    }

    catch (e) {
        console.error('Error processing payment', e.message);
        return false;
    }
});

//requirement 58
//view the details of my selected prescription
router.get('/viewPrescription/:prescriptionId', protect, async (req, res) => {
    const patient = await patientModel.findOne(req.user);
    if (!patient) {
        return res.status(400).json({ message: "Patient not found", success: false })
    }
    try {
        const prescription = await prescriptionsModel.findById(req.params.prescriptionId);
        if (!prescription) {
            return res.status(400).json({ message: "Prescription not found", success: false })
        }
        return res.status(200).json({ Result: prescription, success: true });
    }
    catch (error) {
        console.error('Error getting prescription', error.message);
    }
});
const addTransaction = (amount, userId, paymentMethod, description) => {
    console.log('l')
    const newTransaction = new transactionsModel({
        amount: Math.round(amount * 100) / 100,
        userId: userId,
        paymentMethod: paymentMethod,
        description: description
    });
    newTransaction.save();
    console.log('l')
}



export default router;