import express from 'express'
import doctorModel from '../Models/doctorModel.js';
import patientsModel from '../Models/patientsModel.js';
import healthModel from '../Models/healthModel.js';
import appointmentModel from '../Models/appointmentModel.js';
import familyMemberModel from '../Models/familyMemberModel.js';
import protect from '../middleware/authMiddleware.js';
import docAvailableSlots from '../Models/docAvailableSlotsModel.js';
import { escape } from 'querystring';
import unRegFamMem from '../Models/NotRegisteredFamilyMemberModel.js';
import RegFamMem from '../Models/RegisteredFamilyMemberModel.js';
import prescriptionModel from '../Models/prescriptionsModel.js';
import transactionsModel from '../Models/transactionsModel.js';
import notificationModel from '../Models/notificationModel.js';
import nodemailer from 'nodemailer';
import multer from 'multer';
import { exists } from 'fs';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router()

//get all doctors
// router.get('/', async (req, res) => {
//    const doctors = await doctorModel.find({})
//     res.status(200).render('doctorPage',doctors)
// })


router.get('/notifications', protect, async (req, res) => {
    const exists = await doctorModel.findOne(req.user);
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

router.get('/getCurrentDoctor', protect, async (req, res) => {
    const doctor = await doctorModel.findById(req.user)
    if (!doctor) {
        res.status(400).json({ message: "Doctor not found", success: false })
    }
    else{
        if(doctor.employmentContract!="Accepted"){
          return  res.status(400).json({ message: "Contract not accepted", success: false })
        }
        res.status(200).json({ Result: doctor, success: true })
    }
})

// requirement number 14 later
router.put('/updateDoctor', protect, async (req, res) => {
    try {
        const doctor = await doctorModel.findById(req.user)
        if (!doctor) {
            return res.status(400).json({ message: "Doctor not found", success: false })
        }
        else{
            if(doctor.employmentContract!="Accepted"){
                return res.status(400).json({ message: "Contract not accepted", success: false })
            }}
        const updatedDoctor = await doctorModel.findOneAndUpdate({ _id: req.user._id },
            {
                Email: req.body.Email || doctor.Email,
                HourlyRate: req.body.HourlyRate || doctor.HourlyRate,
                Affiliation: req.body.Affiliation || doctor.Affiliation
            });
        if (!updatedDoctor || updatedDoctor.length == 0) {
            res.status(400).json({ message: "Doctor not found", success: false })
        }
        else {
            res.status(200).render('../../views/doctorPage', { Result: updatedDoctor, success: true })
        }
    } catch (err) {
        res.status(400).json({ message: err.message, success: false })
    }
});

// requirement number 25
router.get('/getPatientInfoAndHealth/:id', protect, async (req, res) => {
    try {
        const doctor = await doctorModel.findById(req.user)
        if (!doctor) {
            res.status(500).json({ message: "You are not a doctor", success: false })
        }
        else{
            if(doctor.employmentContract!="Accepted"){
             return   res.status(400).json({ message: "Contract not accepted", success: false })
            }}


        const appointment = await appointmentModel.findOne({ DoctorId: req.user._id, PatientId: req.params.id });

        if (appointment.length == 0) {
            res.status(400).json({ message: "Not registered with you", success: false })
            return;
        }


        let healthRecords = await healthModel.find({ PatientId: appointment.PatientId })

       
        // if (healthRecords.length == 0) {
        //     res.status(400).json({ message: "No health records found", success: false })
        // }

        let patient = await patientsModel.findOne({ _id: req.params.id });

        if (!patient) {
            res.status(400).json({ message: "No patient found", success: false })
            return;
        }


        // var RegFamMemembers = await RegFamMem.find({ PatientId: patient._id })

        // patient = { ...patient._doc }
        // let famlist=[];
        // for (let i = 0; i < RegFamMemembers.length; i++) {
        //     var fam=await patientsModel.findOne({ _id: RegFamMemembers[i].Patient2Id })
        //    famlist.push(fam.Name)
        //    // patient.familyMember.push(familyMembers[i].Name)
        // }
        // RegFamMemembers = await RegFamMem.find({ Patient2Id: patient._id })


        // for (let i = 0; i < RegFamMemembers.length; i++) {
        //     var fam=await patientsModel.findOne({ _id: RegFamMemembers[i].PatientId })
        //    famlist.push(fam.Name)
        //    // patient.familyMember.push(familyMembers[i].Name)
        // }
        // var unRegFamMemembers = await unRegFamMem.find({ PatientId: patient._id })
        // for (let i = 0; i < unRegFamMemembers.length; i++) {
        //     famlist.push(unRegFamMemembers[i].Name)
        // }
        // let list = []
        // for (let x in healthRecords) {
        //     list.push(healthRecords[x].HealthDocument.data)

        // }
        // const medicalHistory = patient.HealthHistory
        // let list1=[]
        // let list2=[]
        // for(var x in medicalHistory){
        //     const type=medicalHistory[x].contentType
        //     if(type=='application/pdf')
        //         list1.push(medicalHistory[x])
        //     else
        //         list2.push(medicalHistory[x])
        // }
        
        //console.log(patient)
        patient.HealthHistory=null;
        const result = {
            
            "patient": patient,
            
        }

        res.status(200).json({ Result: result, success: true })
    } catch (err) {
        res.status(400).json({ message: err.message, success: false })
    }
});
router.get('/getPatientInfoAndHealth2/:id', protect, async (req, res) => {
    try {
        const doctor = await doctorModel.findById(req.user)
        if (!doctor) {
            res.status(500).json({ message: "You are not a doctor", success: false })
        }
        else{
            if(doctor.employmentContract!="Accepted"){
             return   res.status(400).json({ message: "Contract not accepted", success: false })
            }}


        const appointment = await appointmentModel.findOne({ DoctorId: req.user._id, PatientId: req.params.id });

        if (appointment.length == 0) {
            res.status(400).json({ message: "Not registered with you", success: false })
            return;
        }


        // let healthRecords = await healthModel.find({ PatientId: appointment.PatientId })

        // console.log(healthRecords)
        // if (healthRecords.length == 0) {
        //     res.status(400).json({ message: "No health records found", success: false })
        // }

        let patient = await patientsModel.findOne({ _id: req.params.id });

        if (!patient) {
            res.status(400).json({ message: "No patient found", success: false })
            return;
        }


        var RegFamMemembers = await RegFamMem.find({ PatientId: patient._id })

        patient = { ...patient._doc }
        let famlist=[];
        for (let i = 0; i < RegFamMemembers.length; i++) {
            var fam=await patientsModel.findOne({ _id: RegFamMemembers[i].Patient2Id })
           famlist.push(fam.Name)
           // patient.familyMember.push(familyMembers[i].Name)
        }
        RegFamMemembers = await RegFamMem.find({ Patient2Id: patient._id })


        for (let i = 0; i < RegFamMemembers.length; i++) {
            var fam=await patientsModel.findOne({ _id: RegFamMemembers[i].PatientId })
           famlist.push(fam.Name)
           // patient.familyMember.push(familyMembers[i].Name)
        }
        var unRegFamMemembers = await unRegFamMem.find({ PatientId: patient._id })
        for (let i = 0; i < unRegFamMemembers.length; i++) {
            famlist.push(unRegFamMemembers[i].Name)
        }
        // let list = []
        // for (let x in healthRecords) {
        //     list.push(healthRecords[x].HealthDocument.data)

        // }
        const medicalHistory = patient.HealthHistory
        let list1=[]
        let list2=[]
        for(var x in medicalHistory){
            const type=medicalHistory[x].contentType
            if(type=='application/pdf')
                list1.push(medicalHistory[x])
            else
                list2.push(medicalHistory[x])
        }
        
        //console.log(patient)
        const result = {
            "medicalHistoryPDF": list1,
            "medicalHistoryImage": list2,
            
        }

        res.status(200).json({ Result: result, success: true })
    } catch (err) {
        res.status(400).json({ message: err.message, success: false })
    }
});
router.get('/getPatientInfoAndHealth3/:id', protect, async (req, res) => {
    try {
        const doctor = await doctorModel.findById(req.user)
        if (!doctor) {
            res.status(500).json({ message: "You are not a doctor", success: false })
        }
        else{
            if(doctor.employmentContract!="Accepted"){
             return   res.status(400).json({ message: "Contract not accepted", success: false })
            }}


        const appointment = await appointmentModel.findOne({ DoctorId: req.user._id, PatientId: req.params.id });

        if (appointment.length == 0) {
            res.status(400).json({ message: "Not registered with you", success: false })
            return;
        }


        let healthRecords = await healthModel.find({ PatientId: appointment.PatientId })

        
        // if (healthRecords.length == 0) {
        //     res.status(400).json({ message: "No health records found", success: false })
        // }

        let patient = await patientsModel.findOne({ _id: req.params.id });

        if (!patient) {
            res.status(400).json({ message: "No patient found", success: false })
            return;
        }


        // var RegFamMemembers = await RegFamMem.find({ PatientId: patient._id })

        // patient = { ...patient._doc }
        // let famlist=[];
        // for (let i = 0; i < RegFamMemembers.length; i++) {
        //     var fam=await patientsModel.findOne({ _id: RegFamMemembers[i].Patient2Id })
        //    famlist.push(fam.Name)
        //    // patient.familyMember.push(familyMembers[i].Name)
        // }
        // RegFamMemembers = await RegFamMem.find({ Patient2Id: patient._id })


        // for (let i = 0; i < RegFamMemembers.length; i++) {
        //     var fam=await patientsModel.findOne({ _id: RegFamMemembers[i].PatientId })
        //    famlist.push(fam.Name)
        //    // patient.familyMember.push(familyMembers[i].Name)
        // }
        // var unRegFamMemembers = await unRegFamMem.find({ PatientId: patient._id })
        // for (let i = 0; i < unRegFamMemembers.length; i++) {
        //     famlist.push(unRegFamMemembers[i].Name)
        // }
        let list = []
        for (let x in healthRecords) {
            list.push(healthRecords[x].HealthDocument.data)

        }
        // const medicalHistory = patient.HealthHistory
        // let list1=[]
        // let list2=[]
        // for(var x in medicalHistory){
        //     const type=medicalHistory[x].contentType
        //     if(type=='application/pdf')
        //         list1.push(medicalHistory[x])
        //     else
        //         list2.push(medicalHistory[x])
        // }
        
        //console.log(patient)
        const result = {
           
            "healthDoc": list,
            
        }

        res.status(200).json({ Result: result, success: true })
    } catch (err) {
        res.status(400).json({ message: err.message, success: false })
    }
});

//requirement 26
//get all prescriptions of the logged in doctor
router.get('/getPrescriptions',protect,async(req,res)=>{
    try{
        const exists = await doctorModel.findById(req.user);
        if (!exists) {
            return res.status(500).json({
                success: false,
                message: "You are not a doctor"
            });
        }
        else{
            if(exists.employmentContract!="Accepted"){
                return res.status(400).json({ message: "Contract not accepted", success: false })
            }
        }
        const prescriptions=await prescriptionModel.find({DoctorId:req.user._id});
        res.status(200).json({
            success: true,
            prescriptions: prescriptions
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal error mate2refnash"
        });
    }
}); 


// requirement number 33
router.get('/getPatientsList', protect, async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ _id: req.user._id })
        console.log(req.user.Name)
        if (!doctor) {
            res.status(400).json({ message: "Doctor not found", success: false })
            return;
        }
        else{
            if(doctor.employmentContract!="Accepted"){
             return   res.status(400).json({ message: "Contract not accepted", success: false })
            }
        }
        const appointments = await appointmentModel.find({ DoctorId: req.user._id });
       
        // if (appointments.length == 0) {
        //     res.status(400).json({ message: "No patients found", success: false })
        //     return;
        // }

        let result = []

        for (let i = 0; i < appointments.length; i++) {
            let patient = await patientsModel.findOne({ _id: appointments[i].PatientId })
            console.log(appointments[i]._id)
            console.log(patient._id)
            let familyMembers = await unRegFamMem.find({ PatientId: patient._id })
            if(!result.find((pat) => pat._id.equals(patient._id))){
            patient = { ...patient._doc, "familyMember": [] }

            for (let i = 0; i < familyMembers.length; i++) {
                patient.familyMember.push(familyMembers[i].Name)
            }
            familyMembers = await RegFamMem.find({ PatientId: patient._id })
            for (let i = 0; i < familyMembers.length; i++) {
                let patientFam = await patientsModel.findOne({ _id: familyMembers[i].Patient2Id })

                patient.familyMember.push(patientFam.Name)
            }
            familyMembers = await RegFamMem.find({ Patient2Id: patient._id })
            for (let i = 0; i < familyMembers.length; i++) {
                let patientFam = await patientsModel.findOne({ _id: familyMembers[i].PatientId })

                patient.familyMember.push(patientFam.Name)
            }

            result = [...result, patient];
        }
    }

    console.log(result)

        if (result.length == 0) {
            res.status(400).json({ message: "No patient found", success: false })
        }
        else
            res.status(200).json({ Result: result, success: true })
    } catch (err) {
        console.error(err.message)
        res.status(400).json({ message: err.message, success: false })
    }
});
router.get('/getPatientsList2', protect, async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ _id: req.user._id })
        console.log(req.user.Name)
        if (!doctor) {
            res.status(400).json({ message: "Doctor not found", success: false })
            return;
        }
        else{
            if(doctor.employmentContract!="Accepted"){
             return   res.status(400).json({ message: "Contract not accepted", success: false })
            }
        }
        const appointments = await appointmentModel.find({ DoctorId: req.user._id });
       
        // if (appointments.length == 0) {
        //     res.status(400).json({ message: "No patients found", success: false })
        //     return;
        // }

        let result = []

        for (let i = 0; i < appointments.length; i++) {
            let patient = await patientsModel.findOne({ _id: appointments[i].PatientId })
            if(patient){
            const hasSameId = result.find((pat) => pat.id.equals(patient._id));
            
            if(!hasSameId){
            console.log(patient._id)
            const date=appointments[i].Date;
            var upcoming=false;
            if(date>new Date()){
                upcoming=true;
            }
            let pat={
                "Name":patient.Name,
                "Gender":patient.Gender,
                "Mobile":patient.Mobile,
                "Email":patient.Email,
                "DateOfBirth":patient.DateOfBirth,
                "upcoming":upcoming,
                "id":patient._id
            }
            result.push(pat);
        }
        else{
            const date=appointments[i].Date;
            var upcoming=false;
            if(date>new Date()){
                upcoming=true;
            }
            result = result.map(pat => {
                if (pat.id === patient._id) {
                    return { ...pat, upcoming: true };
                }
                return pat;
            });            
        }
        }
        }


        if (result.length == 0) {
            res.status(400).json({ message: "No patient found", success: false })
        }
        else
            res.status(200).json({ Result: result, success: true })
    } catch (err) {
        console.error(err.message)
        res.status(400).json({ message: err.message, success: false })
    }
});

router.post('/acceptContract', protect, async (req, res) => {
    try {

        const doctor = await doctorModel.findOne({ _id: req.user });

        if (!doctor) {
            return res.status(400).json({ message: "You are not a doctor", success: false });
        }
        
      console.log(doctor)
        doctor.employmentContract = "Accepted";

       
        await doctorModel.findOneAndUpdate({ _id: req.user }, doctor);
        return res.status(200).json({ message: "Contract accepted successfully", success: true });
    } catch (err) {
        return res.status(500).json({ message: err.message, success: false });
    }

});


//requirement number 51
router.post('/assignfollowUp', protect, async (req, res) => {
    const exists = await doctorModel.findOne(req.user);
    if (!exists) {
        return res.status(400).json({ message: "You are not a doctor", success: false })
    }
    else{
        if(exists.employmentContract!="Accepted"){
            return res.status(400).json({ message: "Contract not accepted", success: false })
        }
    }
    const PID = req.body.patientId;
    console.log(req.body);
    const date = req.body.date;
    let newDate = new Date(date);
    newDate.setHours(newDate.getHours() + 2)
    const DID= req.user._id;
   const aptmnt=await appointmentModel.find({DoctorId:DID,Date:newDate});
    //const slots= await docAvailableSlots.findOne({DoctorId:DID});
   if(aptmnt && aptmnt.length>0){
      return (res.status(400).send({ error: "You alraedy have an appointment during this slot", success: false }));
 }
    await docAvailableSlots.deleteMany({ DoctorId: DID, Date: newDate });
        const newAppointment = new appointmentModel({
            PatientId: PID,
            DoctorId: DID,
            Status: "upcoming",
            Date: newDate,
            Price: 0,
            FamilyMemId: req.body.FamilyMemId,
        });
        await newAppointment.save();
        res.status(200).json({ Result: newAppointment, success: true });
    
    
})
// requirement number 34
router.get('/getPatientName/:name', protect, async (req, res) => {
    console.log("doc route 352");
    try {
        const doctor = await doctorModel.findOne({ _id: req.user._id })

        if (!doctor) {
            res.status(400).json({ message: "Doctor not found", success: false })
            return;
        }
        else{
            if(doctor.employmentContract!="Accepted"){
                return   res.status(400).json({ message: "Contract not accepted", success: false })
                }

            }

        let appointments = await appointmentModel.find({ DoctorId: doctor._id })

        // if (appointments.length == 0) {
        //     res.status(400).json({ message: "No appointments found", success: false })
        //     return;
        // }

        let result = []
        for (let i = 0; i < appointments.length; i++) {
            let patient = await patientsModel.findOne({$and:[{ _id: appointments[i].PatientId },{Name:req.params.name}]})
            if(patient){
            const hasSameId = result.find((pat) => pat.id.equals(patient._id));  
          if(!hasSameId){
            
            const date=appointments[i].Date;
            var upcoming=false;
            if(date>new Date()){
                upcoming=true;
            }
            let pat={
                "Name":patient.Name,
                "Gender":patient.Gender,
                "Mobile":patient.Mobile,
                "Email":patient.Email,
                "DateOfBirth":patient.DateOfBirth,
                "upcoming":upcoming,
                "id":patient._id
            }
            result.push(pat);
        }
        else{
            const date=appointments[i].Date;
            var upcoming=false;
            if(date>new Date()){
                upcoming=true;
            }
            result = result.map(pat => {
                if (pat.id === patient._id) {
                    return { ...pat, upcoming: true };
                }
                return pat;
            });            
        }
        }
        }

        // for (let key in appointments) {
        //     let patient = await patientsModel.findOne({ _id: appointments[key].PatientId })

        //     if (patient.Name.toLowerCase() == req.params.name.toLowerCase()) {
        //         patient = { ...patient._doc, "familyMember": [] }

        //         let familyMembers = await RegFamMem.find({ PatientId: patient._id })    
        //         for (let i = 0; i < familyMembers.length; i++) {
        //             let patientFam = await patientsModel.findOne({ _id: familyMembers[i].Patient2Id })
        //             patient.familyMember.push(patientFam.Name)
        //         }
        //         familyMembers = await RegFamMem.find({ Patient2Id: patient._id })
        //         for (let i = 0; i < familyMembers.length; i++) {
        //             let patientFam = await patientsModel.findOne({ _id: familyMembers[i].PatientId })
    
        //             patient.familyMember.push(patientFam.Name)
        //         }
        //         familyMembers = await unRegFamMem.find({ PatientId: patient._id })
        //         for (let i = 0; i < familyMembers.length; i++) {
        //             patient.familyMember.push(familyMembers[i].Name)
        //         }

        //         patients.push(patient)
        //     }
      //  }

        // if (patients.length == 0) {
        //     res.status(400).json({ message: "No patient found with this name", success: false })
        // }
        // else
            res.status(200).json({ Result: result, success: true })
    } catch (err) {
        res.status(400).json({ message: err.message, success: false })
    }
})


router.get('/viewContract', protect, async (req, res) => {

    const doctor = await doctorModel.findById(req.user)
    if (!doctor) {
        return res.status(500).json({ message: "You are not a doctor", success: false })
    }

    const salary= Math.floor(doctor.HourlyRate / 2);
   /// const markup = Math.floor(salary/10);
    let result={
        salary:salary,
        name:doctor.Name,
    }
    return res.status(200).json({result:result, success: true})

});

router.post('/addavailableslots', protect, async (req, res) => {

    console.log('k')
    const doctor = await doctorModel.findById(req.user)
    if (!doctor) {
        return res.status(500).json({ message: "You are not a doctor", success: false })
    }
    else{
        if(doctor.employmentContract!="Accepted"){
            return res.status(400).json({ message: "Contract not accepted", success: false })
        }}
   // console.log(doctor);
    let flag= true;
    let dTimeTemp = req.body.date; 
    console.log("line 678"+dTimeTemp); 
    let startDate = new Date(dTimeTemp);
    startDate.setHours(startDate.getHours())
    //const startDate = req.body.Date
    console.log(startDate)
    let endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + 30);

    let aptmnts = await appointmentModel.find({ DoctorId: req.user._id });
    //console.log(aptmnts);
    console.log('kppp')
    if (aptmnts) {


        for (let y in aptmnts) {

            let start = aptmnts[y].Date;
            console.log('ll')
            console.log(!((startDate) > (aptmnts[y].Date) || (startDate) < (aptmnts[y].Date)))
            console.log(startDate)
            console.log(aptmnts[y].Date)

            if (!((startDate) > (aptmnts[y].Date) || (startDate) < (aptmnts[y].Date)))
                flag = false;
        }
    }
    console.log(flag)
    aptmnts = await docAvailableSlots.find({ DoctorId: req.user._id });
    if (flag == false) {
        return res.status(500).json({ message: "you have an appointment during this slot", success: false });
    }
    flag = true;
    console.log(aptmnts);
    if (aptmnts) {


        for (let y in aptmnts) {
            // console.log((startDate).toDateString==(aptmnts[y].Date).toDateString)
            console.log(startDate)
            console.log(aptmnts[y].Date)
            if (!((startDate) > (aptmnts[y].Date) || (startDate) < (aptmnts[y].Date)))
                flag = false;

        }
    }
    // console.log(aptmnts);
    if (flag == false) {
        return res.status(500).json({ message: "you already  during this slot", success: false });
    }


    try {
        const availableSlots = new docAvailableSlots({
            DoctorId: req.user._id,
            Date: startDate,
        });
        availableSlots.save();
        console.log('ho')
        return res.status(200).json({ Result: availableSlots, success: true })
    }

    catch (error) {
        res.status(400).send({ error: error, success: false });

    }
});


router.get('/getWalletAmount', protect,async (req, res) => {
        
            const exists = await doctorModel.findById(req.user);
            if (!exists) {
                return res.status(500).json({
                    success: false,
                    message: "You are not a doctor"
                });
            }
            else{
                if(exists.employmentContract!="Accepted"){
                    return res.status(400).json({ message: "Contract not accepted", success: false })
                }
            }
          
    var result={};
    result.Amount=exists.Wallet;
    return res.status(200).json(result);

})

// requirement number 35 front lesa
router.get('/getUpcomingAppointment', protect, async (req, res) => {
    try {
        const exists = await doctorModel.findById(req.user);
        if (!exists) {
            return res.status(500).json({
                success: false,
                message: "You are not a doctor"
            });
        }
        else{
            if(exists.employmentContract!="Accepted"){
                return res.status(400).json({ message: "Contract not accepted", success: false })
            }
        }

        let today = new Date();

        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        today = new Date(today);

        const getAppointments = await appointmentModel.find({ Date: { $gte: today }, DoctorId: req.user._id });

        if (getAppointments.length == 0)
            return res.status(400).json({ message: "No upcoming appointments found", success: false })


        let result = []


        for (let i = 0; i < getAppointments.length; i++) {
            let patient = await patientsModel.findOne({ _id: getAppointments[i].PatientId })
            if(getAppointments[i].FamilyMemId){
            let familyMember = await unRegFamMem.findOne({ _id: getAppointments[i].FamilyMemId })
            patient = { ...patient._doc, "familyMember":familyMember.Name, "appointmentDate": getAppointments[i].Date }
            }
           

            result = [...result, patient]
        }

        res.status(200).json({ Result: result, success: true })
    } catch (err) {
        res.status(400).json({ message: err.message, success: false })
    }
});

//reschedule an appointment req.47


router.put('/rescheduleAppointment/:_id', protect, async (req, res) => {
    const doc = await doctorModel.findById(req.user)
    if (!doc) {
        return res.status(500).json({ message: "You are not a doctor", success: false })
    }
    console.log('ana');

    const appId = req.params._id;
    const newdate= req.body.Date ;
    const appointment= await appointmentModel.findById(appId);
    if (!appointment) {
        return res.status(404).json({ message: "Appointment not found", success: false });
    }
    const Pid = appointment.PatientId ;
    const DID= req.user._id;
    const patient = await patientsModel.findById(Pid);
    const aptmnt=await appointmentModel.find({DoctorId: DID ,Date:newdate});

    console.log('aptmpt:' ,aptmnt);
       if(aptmnt && aptmnt.length>0){
          return (res.status(400).send({ error: "You are not available during this slot", success: false }));
     }
        await docAvailableSlots.deleteMany({ DoctorId: DID, Date: newdate });
    console.log(appId);
    const result = await appointmentModel.findByIdAndUpdate( appId ,  { $set:{ Date : newdate ,
        Status :"rescheduled"}},{ new: true });


        const DmailResponse = await mailSender(
                doc.Email,
                "rescheduled:appointment",
                `<p>It is confirmed. You rescheduled your appointment with patient:  ${patient.Name} to be on the following date: ${newdate}<p>`
                
            );
            if (DmailResponse) {
                console.log("Email to doctor sent successfully: ", DmailResponse);
               
            }
            else {
                console.log("Error sending email to doctor");
            }
 
            const mailResponse = await mailSender(
                patient.Email,
                "rescheduled:appointment",
                `<p>Your appointment with doctor: ${doc.Name} is rescheduled to be on the following date: ${newdate}<p>`
                
            );
            if (mailResponse) {
                console.log("Email to patient sent successfully: ", mailResponse);
               
            }
            else {
                console.log("Error sending email to patient");
            }

            const DnewNotification = new notificationModel({
                userId: DID, 
                Message: `You rescheduled your appointment with patient:  ${patient.Name} to be on the following date: ${newdate}`,

            });
            await DnewNotification.save();

            const newNotification = new notificationModel({
                userId: Pid, 
                Message: `Your appointment with doctor: ${doc.Name} is rescheduled to be on the following date: ${newdate}`,

            });
            
            await newNotification.save();
            console.log('noticationsent');
       
   return res.status(200).json({ Result: result, success: true });

        }
)

// requirement number 36
router.get('/selectPatientName/:id', protect, async (req, res) => {
    try {
        // const getAppointment = await appointmentModel.find({ DoctorId: id });
        const exists = await doctorModel.findById(req.user);
        if (!exists) {
            return res.status(500).json({
                success: false,
                message: "You are not a doctor"
            });
        }
        else{
            if(exists.employmentContract!="Accepted"){
                return res.status(400).json({ message: "Contract not accepted", success: false })
            }
        }

        let patient = await patientsModel.findOne({ _id: req.params.id });

        if (!patient) {
            res.status(400).json({ message: "No patient found", success: false })
            return;
        }

        const appointment = await appointmentModel.find({ DoctorId: req.user._id, PatientId: req.params.id });

        if (appointment.length == 0) {
            res.status(400).json({ message: "No appointments found", success: false })
            return;
        }

        let result = []

       
        let familyMembers = await unRegFamMem.find({ PatientId: patient._id })
       
        patient = { ...patient._doc, "familyMember": [] }

        for (let i = 0; i < familyMembers.length; i++) {
            patient.familyMember.push(familyMembers[i].Name)
        }
        familyMembers = await RegFamMem.find({ PatientId: patient._id })
        for (let i = 0; i < familyMembers.length; i++) {
            let patientFam = await patientsModel.findOne({ _id: familyMembers[i].Patient2Id })

            patient.familyMember.push(patientFam.Name)
        }
        familyMembers = await RegFamMem.find({ Patient2Id: patient._id })
        for (let i = 0; i < familyMembers.length; i++) {
            let patientFam = await patientsModel.findOne({ _id: familyMembers[i].PatientId })

            patient.familyMember.push(patientFam.Name)
        }

        result = [patient];


        res.status(200).json({ Result: result, success: true })
    }
    catch (err) {
        res.status(400).json({ message: err.message, success: false })
    }
})

router.post('/getAppointment', protect, async (req, res) => {
    console.log('here')
    const exists = await doctorModel.findById(req.user);
    if (!exists) {
        return res.status(500).json({
            success: false,
            message: "You are not a doctor"
        });
    }
    else{
        if(exists.employmentContract!="Accepted"){
            return res.status(400).json({ message: "Contract not accepted", success: false })
        }
    }
    console.log(req.body.startDate)
    console.log(req.body.endDate)
    
    const startDate = req.body.startDate || new Date('1000-01-01T00:00:00.000Z');
    const endDate = req.body.endDate || new Date('3000-12-31T00:00:00.000Z');

    let getAppointmentsbyDate;
    getAppointmentsbyDate = await appointmentModel.find({
        Date: {
            $gte: startDate,
            $lte: endDate
        }, DoctorId: req.user._id
    });

    let getAppointmentsbyStatus;
    if (req.body.status) {
        getAppointmentsbyStatus = await appointmentModel.find({ Status: req.body.status, DoctorId: req.user._id });
    }
    else {
        getAppointmentsbyStatus = await appointmentModel.find({ DoctorId: req.user._id });
    }
    let temp = getAppointmentsbyDate.filter((app) => {
        for (let y in getAppointmentsbyStatus) {
            if (getAppointmentsbyStatus[y]._id.equals(app._id)) {
                return true;
            }
        }
        return false;
    }
    );
    let final = [];
    for (let x in temp) {///if you need the patient's name in front end
        let result = {}
        result.id=temp[x]._id;
        const patient = await patientsModel.find({ _id: temp[x].PatientId })
        if (patient.length > 0)
            result.Name = patient[0].Name;
        result.PatientId = temp[x].PatientId;
        result.DoctorId = temp[x].DoctorId;
        result.Date = temp[x].Date;
        result.Status = temp[x].Status;
        if(temp[x].FamilyMemId){
        let familyMember = await unRegFamMem.findOne({ _id: temp[x].FamilyMemId })
        result.familyMember = familyMember.Name;
        }
        final.push(result);

    }
    res.status(200).json(final);
});
router.post('/addrecord/:PatientId',upload.single('file'),protect,async(req,res)=>{
    console.log('l')
  try { const exists = await doctorModel.findById(req.user);
    if (!exists) {
        return res.status(500).json({
            success: false,
            message: "You are not a doctor"
        });
    } 
    else{
        if(exists.employmentContract!="Accepted"){
            return res.status(400).json({ message: "Contract not accepted", success: false })
        }
    }
    
    console.log("Abl el patient ID")
    const patientID = req.params.PatientId;
    // console.log(patientID);
    // console.log(req.file);
    const existingpatient = await patientsModel.findById(patientID);
    if(!existingpatient){
        res.status(400).json({
            success: false,
            message:"patient doesn't exist"
        })
        }
        else {
            const newrecord = new healthModel({
                HealthDocument: {
                    data: req.file.buffer,
                    contentType: req.file.mimetype
                },
                PatientId: patientID
            });
            newrecord.save();
            res.status(200).json({
                success: true,
                message: "record added successfully"
            })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            messsage: "Internal error mate2refnash"
        })
    }
})

//requirement 53
//add/delete medicine to/from the prescription from the pharmacy platform

router.post('/addOrDeleteMedFromPresc',protect,async(req,res)=>{
    try{
        const exists = await doctorModel.findById(req.user);
        if (!exists) {
            return res.status(500).json({
                success: false,
                message: "You are not a doctor"
            });
        }
        else{
            if(exists.employmentContract!="Accepted"){
                return res.status(400).json({ message: "Contract not accepted", success: false })
            }
        }
        const prescriptionId=req.body.prescriptionId;
        const medicineId=req.body.medicineId;
        const action=req.body.action;
        const prescription=await prescriptionModel.findById(prescriptionId);
        if(!prescription){
            return res.status(400).json({
                success: false,
                message: "Prescription not found"
            });
        }
        if(action=="add"){
            prescription.items.push({medicineId:medicineId,dosage:1});
        }
        else if(action=="delete"){
            prescription.items=prescription.items.filter((item)=>item.medicineId!=medicineId);
        }
        await prescription.save();
        res.status(200).json({
            success: true,
            message: "Prescription updated successfully"
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal error mate2refnash"
        });
    }

})

//requirement 54
//add/update dosage for each medicine added to the prescription
router.post('/updateDosage',protect,async(req,res)=>{
    try{
        const exists = await doctorModel.findById(req.user);
        if (!exists) {
            return res.status(500).json({
                success: false,
                message: "You are not a doctor"
            });
        }
        else{
            if(exists.employmentContract!="Accepted"){
                return res.status(400).json({ message: "Contract not accepted", success: false })
            }
        }
        const prescriptionId=req.body.prescriptionId;
        const medicineId=req.body.medicineId;
        const dosage=req.body.dosage;
        const prescription=await prescriptionModel.findById(prescriptionId);
        if(!prescription){
            return res.status(400).json({
                success: false,
                message: "Prescription not found"
            });
        }
        prescription.items=prescription.items.map((item)=>{
            if(item.medicineId==medicineId){
                item.dosage=dosage;
            }
            return item;
        });
        await prescription.save();
        res.status(200).json({
            success: true,
            message: "Prescription updated successfully"
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal error mate2refnash"
        });
    }

})

//requirement 63
//add a patient's prescription
router.post('/addPrescription',protect,async(req,res)=>{
    try{
        const exists = await doctorModel.findById(req.user);
        if (!exists) {
            return res.status(500).json({
                success: false,
                message: "You are not a doctor"
            });
        }
        else{
            if(exists.employmentContract!="Accepted"){
                return res.status(400).json({ message: "Contract not accepted", success: false })
            }
        }
        const patientId=req.body.patientId;
        const prescription=new prescriptionModel({
            PatientId:patientId,
            DoctorId:req.user._id,
            items:[],
            status:"pending",
            Date:Date.now()
        });
        await prescription.save();
        res.status(200).json({
            success: true,
            message: "Prescription added successfully"
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal error mate2refnash"
        });
    }

})

//requirement 64
//update a patient's prescriptions before it's submitted to the pharmacy
router.post('updatePrescription',protect,async(req,res)=>{
    try{
        const exists = await doctorModel.findById(req.user);
        if (!exists) {
            return res.status(500).json({
                success: false,
                message: "You are not a doctor"
            });
        }
        else{
            if(exists.employmentContract!="Accepted"){
                return res.status(400).json({ message: "Contract not accepted", success: false })
            }
        }
        const prescriptionId=req.body.prescriptionId;
        const prescription=await prescriptionModel.findById(prescriptionId);
        if(!prescription){
            return res.status(400).json({
                success: false,
                message: "Prescription not found"
            });
        }
        prescription.status="pending";
        await prescription.save();
        res.status(200).json({
            success: true,
            message: "Prescription updated successfully"
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal error mate2refnash"
        });
    }

})
router.get('/getTransactionHistory',protect,async(req,res)=>{
    try{
        const exists = await doctorModel.findById(req.user);
        if (!exists) {
            return res.status(500).json({
                success: false,
                message: "You are not a doctor"
            });
        }
        else{
            if(exists.employmentContract!="Accepted"){
                return res.status(400).json({ message: "Contract not accepted", success: false })
            }
        }
        console.log(exists.Wallet)
        const transactions=await transactionsModel.find({userId:req.user._id});
        res.status(200).json({
            success: true,
            transactions:transactions,
            wallet:exists.Wallet
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal error mate2refnash"
        });
    }
});

router.get('/getAppointment/:id', protect, async (req, res) => {
   const exists = await doctorModel.findById(req.user);
    if (!exists) {
        return res.status(500).json({
            success: false,
            message: "You are not a doctor"
        });
    }
    else{
        if(exists.employmentContract!="Accepted"){
            return res.status(400).json({ message: "Contract not accepted", success: false })
        }
    }
    const appointment = await appointmentModel.findById(req.params.id);
    if (!appointment) {
        return res.status(400).json({
            success: false,
            message: "Appointment not found"
        });
    }
        let result = {}
        const patient = await patientsModel.findOne({ _id: appointment.PatientId })
        if (patient)
            result.Name = patient.Name;
        result.PatientId =appointment.PatientId;
        result.DoctorId = appointment.DoctorId;
        result.Date = appointment.Date;
        result.Status = appointment.Status;
        if(appointment.FamilyMemId){
            let familyMember = await unRegFamMem.findOne({ _id: appointment.FamilyMemId })
            result.familyMember = familyMember.Name;
            result.FamilyMemId=appointment.FamilyMemId;
            }

    return res.status(200).json({
        success: true,
        appointment: result
    });
}  );
router.get('/getAllFreeSlots', protect, async (req, res) => {
    var exists=await doctorModel.findById(req.user);
    if (!exists) {
        return res.status(500).json({
            success: false,
            message: "You are not a doctor"
        });
    }
    else{
        if(exists.employmentContract!="Accepted"){
            return res.status(400).json({ message: "Contract not accepted", success: false })
        }
    }
    const appointments = await appointmentModel.find({ DoctorId: req.user._id ,Status:"upcoming"});
    var slots= await docAvailableSlots.find({DoctorId:req.user._id});
   console.log(slots);
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

    for(var x in appointments){
        var date=appointments[x].Date;
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
    console.log(result);
return res.status(200).json(result);
});

export default router;