import express from 'express'
import Doctor from '../Models/doctorModel.js';
import patientModel from '../Models/patientsModel.js';
import appointmentModel from '../Models/appointmentModel.js';
import prescriptionsModel from '../Models/prescriptionsModel.js';
import familyMember from '../Models/familyMemberModel.js'
import fs from 'fs';
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
            FamilyMemId: req.body.fMemId
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
    const wallet = exists.wallet;
    return res.status(200).json({ Amount: wallet, success: true })

})



router.post('/addRegFamilyMem', protect, async (req, res) => {
    const exist = patientModel.findOne(req.user);
    if (!exist) {
        return res.status(400).json({ message: "Patient not found", success: false })
    }

    req.body.relation = req.body.relation.toLowerCase();
    if (!(req.body.relation == ('wife') || (req.body.relation) == ('husband') || (req.body.relation) == ('child')))
        return (res.status(400).send({ message: "family member can only be wife/husband or child", success: false }));
    const email = req.body.email;
    var famMember = await patientModel.findOne({ Email: email });
    if (!famMember)
        return (res.status(400).send({ message: "This email is not registered as a patient", success: false }));
    if (famMember._id == req.user._id)
        return (res.status(400).send({ message: "You can't add yourself as a family member", success: false }));
    var availFamMem = await familyMember.findOne({ $or: [{ PatientId: req.user._id, Patient2Id: famMember._id }, { PatientId: famMember._id, Patient2Id: req.user._id }] });
    if (availFamMem)
        return (res.status(400).send({ message: "This patient is not registered as a family member" }));
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
router.get('/viewRegFamMem', protect, async (req, res) => {
    const exists = await patientModel.findOne(req.user);
    if (!exists) {
        return res.status(400).json({ message: "Patient not found", success: false })
    }
    var unRegFamMemebers = await unRegFamMem.findOne({ PatientId: req.user._id  });
    var regFamMemebers = await RegFamMem.findOne({ PatientId: req.user._id  });
    var list=[]
    for  (var x in regFamMemebers){
        var patientFam=await patientModel.findOne({_id:regFamMemebers[x].Patient2Id})
        list.push(patientFam)
    }
    var regFamMemebers = await RegFamMem.findOne({ Patient2Id: req.user._id  });
    for( var x in regFamMemebers)   {
        var patientFam=await patientModel.findOne({_id:regFamMemebers[x].PatientId})
        list.push(patientFam)
    } 
   
        famMembers={
            registered:list,
            unregistered:unRegFamMemebers
        }
    
        res.status(200).json({ Result: famMembers, success: true });
    
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
        if (patient.length > 0)
            result.Name = doctor[0].Name;
        result.Date = temp[x].Date;
        result.Status = temp[x].Status;
        final.push(result);

    }
    res.status(200).json(final);
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
    if (req.body.Name && req.body.Speciality) {
        getDoctors = await Doctor.find({ Name: req.body.Name, Speciality: req.body.Speciality });
    }
    if (!req.body.Name) {
        getDoctors = await Doctor.find({ Speciality: req.body.Speciality });
    }
    if (!req.body.Speciality) {
        getDoctors = await Doctor.find({ Name: req.body.Name });
    }
    if (!req.body.Speciality && !req.body.Name) {
        getDoctors = await Doctor.find({});
    }
    console.log(getDoctors);
    if (getDoctors.length == 0) {
        return res.status(400).json({ message: "No doctors found " });
    }
    return res.status(200).json({ Doctors: getDoctors, success: true });
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
        const packId = currPat[0].PackageId;
        console.log(currPat)
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
        console.log(final)
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
    console.log("dId");
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
router.post('/bookAppointment', protect, async (req, res) => {
    const exists = await patientModel.findOne(req.user);
    if (!exists) {
        return res.status(400).json({ message: "Patient not found", success: false })
    }
    const dId = req.body.dId;
    const date = req.body.date;
    const aptmnt = await docAvailableSlots.findOne({ DoctorId: dId, Date: date });
    const famId = req.body.famId;
    if (famId) {
        const famMember = await familyMember.find({ PatientId: req.user._id, FamilyMemId: famId });
        if (famMember.length < 1) {
            return (res.status(400).send({ error: "cant find family member", success: false }));
        }
        const newAppointment = new appointmentModel({
            PatientId: famId,
            DoctorId: dId,
            Status: "upcoming",
            Date: date
        });
        newAppointment.save();
        docAvailableSlots.findOneAndDelete({ DoctorId: dId, Date: date });
        res.status(200).json({ Result: newAppointment, success: true });
    }
    if (aptmnt.length < 1) {
        return (res.status(400).send({ error: "This slot is no longer available", success: false }));
    }
    const newAppointment = new appointmentModel({
        PatientId: req.user._id,
        DoctorId: dId,
        Status: "upcoming",
        Date: date
    });
    newAppointment.save();
    docAvailableSlots.findOneAndDelete({ DoctorId: dId, Date: date });
    res.status(200).json({ Result: newAppointment, success: true });


})

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
    const packId = currPat[0].PackageId;
    console.log(currPat)
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
router.post('/subscribeHealthPackage/:packageId', protect, async (req, res) => {
    const userId = req.user._id;
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

        return res.status(200).json({ message: 'Health package subscribed successfully' });

    } catch (error) {
        console.error('Error subscribing to health package:', error.message);
        return res.status(500).json({ error: 'Error' });
    }
});
router.post('/subscribeHealthPackageforFamily', protect, async (req, res) => {
    const userId = req.user._id;
    const healthPackageId = req.body.packageId;
    const familyMemberId = req.body.familyMemberId;

    try {
        const user = await patientModel.findById(familyMemberId);
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
        // }

        return res.status(200).json({ message: 'Health package subscribed successfully' });

    } catch (error) {
        console.error('Error subscribing to health package:', error.message);
        return res.status(500).json({ error: 'Error' });
    }
});

//test done here (req 30)
router.get('/viewSubscriptions', protect, async (req, res) => {
    const userId = req.user._id;//bagib el id after authentication  
    try {
        // get the patient package
        const user = await patientModel.findById(userId);

        if (!user) {
            return res.status(500).json({ message: 'Patient not found' });
        }

        let userHealthPackageStatus = await healthPackageStatus.findOne({ patientId: userId });
        let userHealthPackage = userHealthPackageStatus?.healthPackageId;

        let userHealth = await healthPackageModel.findById(userHealthPackage) ?? {};

        userHealth.PatientId = user?._id;
        userHealth.Name = user?.Name;
        userHealth.Email = user?.Email;
        userHealth.Username = user?.Username;

        let result = { 'myUser': userHealth, 'familyMembers': [] };

        //Get the health package details for registered family members
        const registeredFamilyMembers = await RegFamMem.find({ Patient2Id: userId });

        for (let member of registeredFamilyMembers) {
            let famMemberUser = await patientModel.findById(member.PatientId);

            let famMemberUserHealthPackageStatus = await healthPackageStatus.findOne({ patientId: famMemberUser });
            let famMemberUserHealthPackage = famMemberUserHealthPackageStatus?.healthPackageId;

            let famMemberUserHealth = await healthPackageModel.findById(famMemberUserHealthPackage);

            let memberRes = JSON.parse(JSON.stringify(famMemberUserHealth)) ?? {};

            console.log(famMemberUser);

            memberRes.PatientId = famMemberUser?._id;
            memberRes.Name = famMemberUser?.Name;
            memberRes.Email = famMemberUser?.Email;
            memberRes.Username = famMemberUser?.Username;
            result['familyMembers'].push(memberRes);
        }
        //hena ba3mel array ba store fi kol package le kol fam member
        // const familyMembersHealthPackages = registeredFamilyMembers.map(member => member.PackageId);

        // //ba3mel a single array containing patient w fam members packages
        // const allHealthPackages = [userHealthPackage, ...familyMembersHealthPackages];

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
        let userHealthPackageStatus = await healthPackageStatus.findOne({ patientId: userId, status: { $in: ['Subscribed', 'Cancelled'] } });
        //fam members
        let registeredFamilyMembers = await RegFamMem.find({ Patient2Id: userId });

        console.log(userHealthPackageStatus);

        let myUser = JSON.parse(JSON.stringify(req.user));

        myUser.status = userHealthPackageStatus ?? 'Unsubscribed';

        let result = { 'myUser': myUser, 'familyMembers': [] };


        for (let member of registeredFamilyMembers) {
            let healthPackage = await healthPackageStatus.findOne({
                patientId: member.PatientId,
                status: { $in: ['Subscribed', 'Cancelled'] }
            });
            if (!healthPackage) {
                healthPackage = null;
            }

            let memberRes = JSON.parse(JSON.stringify(member));
            delete memberRes['Patient2Id'];
            delete memberRes['createdAt'];
            delete memberRes['updatedAt'];
            delete memberRes['__v'];

            memberRes['status'] = healthPackage?.status ? healthPackage?.status : 'Unsubscribed';
            memberRes['renewalDate'] = healthPackage?.renewalDate;
            memberRes['endDate'] = healthPackage?.endDate;

            result['familyMembers'].push(memberRes);

        }

        return res.status(200).json({ success: true, result });

    } catch (error) {
        console.error('Error viewing health package subscription status:', error.message);
        return res.status(500).json({ error: error.message, success: false });
    }
});

//hena bas msh mota2aked bet cancel sah wala laa (req 32)
router.put('/cancelSub', protect, async (req, res) => {
    const userId = req.user._id;//bagib el id after authentication

    try {
        // get the patient package
        const user = await patientModel.findById(userId);

        if (!user) {
            return res.status(500).json({ message: 'Patient not found' });
        }

        await healthPackageStatus.findOneAndUpdate({ patientId: userId }, { status: 'Cancelled', endDate: new Date(0), renewalDate: new Date(0) });

        const registeredFamilyMembers = await RegFamMem.find({ Patient2Id: userId });

        for (const familyMember of registeredFamilyMembers) {
            await healthPackageStatus.findOneAndUpdate({ patientId: familyMember.PatientId }, { status: 'Cancelled', endDate: new Date(0), renewalDate: new Date(0) });
        }

        return res.status(200).json({ message: 'Health package subscription canceled successfully' });
    } catch (error) {
        console.error('Error canceling health package subscription:', error.message);
        return res.status(500).json({ error: 'Error' });
    }
});

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
        Result: healthPackages});

    } catch (error) {
        console.error('Error getting Health Packages:', error.message);
        return res.status(400).send({ error: 'Error' });
    }
});

const getUserOrFamilyMember = async (req, res, userType) => {
    console.log(req.body.user);
    const userId = req.body.user._id;
    const familyMemberId = userType === "familyMember" ? req.body.familyMember._id : null;

    try {
        if (userType === "patient") {
            const user = await patientModel.findById(userId);
            console.log(`${userType === "patient" ? 'User' : 'Family Member'} retrieved successfully`);
            return user;
        } else if (userType === "familyMember") {
            const familyMember = await familyMemberModel.findById(familyMemberId);
            console.log(`${userType === "patient" ? 'User' : 'Family Member'} retrieved successfully`);
            return familyMember;
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

const processCardPayment = async (req, res, fees, description, doctor) => {
    try {
        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [{
                price_data: {
                    currency: "egp",
                    product_data: {
                        name: description,
                    },
                    unit_amount: fees * 100,
                },
                quantity: 1,
            }],
            success_url: "http://localhost:3000/Health-Plus/payment?success=true",
            cancel_url: "http://localhost:3000/Health-Plus/payment",
        });

        if (doctor) {
            giveDoctorMoney(req, res, doctor, fees);
        }

        console.log('Card payment processed successfully');
        return res.status(200).send({ url: session.url });
    } catch (e) {
        console.error('Error in payment', e.message, e);
        return res.status(400).send({ error: e.message });
    }
};

const processWalletPayment = async (req, res, userId, fees, doctor) => {
    const user = await getUserOrFamilyMember(req, res, "patient");
    if (!user) return;

    user.Wallet = user.Wallet - fees;
    if (user.Wallet < 0) {
        console.error('Insufficient funds in wallet');
        let result = res.status(400).send({ hello: 'Insufficient funds' });
        console.log(result);
        return result;
    }

    try {
        await patientModel.findByIdAndUpdate(userId, user);
        if (doctor) {
            giveDoctorMoney(req, res, doctor, fees);
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

router.post("/payForAppointment", async (req, res) => {
    const { userType, paymentType } = req.query;
    try{
        return await processPayment(req, res, userType, paymentType);
    } catch (e) {
        console.error('Error processing payment', e.message);
        return res.status(400).send({ error: e.message });
    }
});

const processPayment = async (req, res, userType, paymentType) => {
    const { _id: userId } = req.body.user;
    const familyMemberId = userType === "familyMember" ? req.body.familyMember._id : null;
    const doctorId = req.body.doctor._id;
    const date = req.body.date;

    const user = await getUserOrFamilyMember(req, res, userType);
    if (!user) return;

    const doctor = await getDoctor(req, res, doctorId);
    if (!doctor) return;

    const healthPackage = await getSubscribedHealthPackage(req, res, userType == "familyMember" ? familyMemberId : userId);

    let discount = 0;
    if (healthPackage) {
        discount = healthPackage.doctorDiscountInPercentage;
    } else if (userType == "familyMember") {
        healthPackage = await getHealthPackage(req, res, userId, familyMemberId, "patient");
        if (healthPackage) {
            discount = healthPackage.familyDiscountInPercentage;
        }
    }

    const fees = calculateFees(doctor.HourlyRate, discount);
    try{
        if (paymentType === "wallet") {
            return await processWalletPayment(req, res, userId, fees, doctor);
        } else {
            return await processCardPayment(req, res, fees, "Appointment with " + doctor.Name + " on " + date, doctor);
        }
    } catch (e) {
        console.error('Error processing payment', e.message);
        return res.status(400).send({ error: e.message });
    }
};

router.post("/subscribeForPackage", async (req, res) => {
    const { userType, paymentType } = req.query;
    try{
        const result = await processSubscription(req, res, userType, paymentType);
        return result;
    } catch (e) {
        console.error('Error processing payment', e.message);
        return res.status(400).send({ error: e.message });
    }
});

const processSubscription = async (req, res, userType, paymentType) => {
    const { _id: userId } = req.body.user;
    const healthPackageId = req.body.healthPackage._id;

    const user = await getUserOrFamilyMember(req, res, userType);
    if (!user) return;

    const healthPackage = await getHealthPackage(req, res, healthPackageId);

    let discount = 0;
    if (userType == "familyMember") {
        const subscribedHealthPackage = await getSubscribedHealthPackage(req, res, userId);
        discount = subscribedHealthPackage.familyDiscountInPercentage;
    }

    const fees = calculateFees(healthPackage.subsriptionFeesInEGP, discount);
    try{
        if (paymentType == "wallet") {
            return await processWalletPayment(req, res, userId, fees, null);
        } else {
            return await processCardPayment(req, res, fees, healthPackage.paymentType + " Subscription", null);
        }
    } catch (e) {
        console.error('Error processing payment', e.message);
        return res.status(400).send({ error: e.message });
    }
};

    
    
export default router;