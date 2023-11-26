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

import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router()

//get all doctors
// router.get('/', async (req, res) => {
//    const doctors = await doctorModel.find({})
//     res.status(200).render('doctorPage',doctors)
// })

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
router.get('/updateDoctor', protect, async (req, res) => {
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
                Email: req.query.Email || doctor.Email,
                HourlyRate: req.query.HourlyRate || doctor.HourlyRate,
                Affiliation: req.query.Affiliation || doctor.Affiliation
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

        console.log(healthRecords)
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
        let list = []
        for (let x in healthRecords) {
            list.push(healthRecords[x].HealthDocument.data)

        }
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
            "healthRecords": healthRecords,
            "patient": patient,
            "healthDoc": list,
            "medicalHistoryPDF": list1,
            "medicalHistoryImage": list2,
            "familyMembers":famlist
        }

        res.status(200).json({ Result: result, success: true })
    } catch (err) {
        res.status(400).json({ message: err.message, success: false })
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
       
        if (appointments.length == 0) {
            res.status(400).json({ message: "No patients found", success: false })
            return;
        }

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
    const PID = req.body.PatientId;
    const date = req.body.date;
    console.log(date)
    let newDate = new Date(date);
    newDate.setHours(newDate.getHours() + 2)
    const DID= req.user._id;
   const aptmnt=await appointmentModel.find({DoctorId:DID,Date:newDate});
    //const slots= await docAvailableSlots.findOne({DoctorId:DID});
console.log(aptmnt)
   if(aptmnt && aptmnt.length>0){
      return (res.status(400).send({ error: "You alraedy have an appointment during this slot", success: false }));
 }
    await docAvailableSlots.deleteMany({ DoctorId: DID, Date: newDate });
        const newAppointment = new appointmentModel({
            PatientId: PID,
            DoctorId: DID,
            Status: "upcoming",
            Date: newDate
        });
        await newAppointment.save();
        res.status(200).json({ Result: newAppointment, success: true });
    
    
})
// requirement number 34
router.get('/getPatientName/:name', protect, async (req, res) => {
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

        if (appointments.length == 0) {
            res.status(400).json({ message: "No appointments found", success: false })
            return;
        }

        let patients = []


        for (let key in appointments) {
            let patient = await patientsModel.findOne({ _id: appointments[key].PatientId })

            if (patient.Name.toLowerCase() == req.params.name.toLowerCase()) {
                patient = { ...patient._doc, "familyMember": [] }

                let familyMembers = await RegFamMem.find({ PatientId: patient._id })    
                for (let i = 0; i < familyMembers.length; i++) {
                    let patientFam = await patientsModel.findOne({ _id: familyMembers[i].Patient2Id })
                    patient.familyMember.push(patientFam.Name)
                }
                familyMembers = await RegFamMem.find({ Patient2Id: patient._id })
                for (let i = 0; i < familyMembers.length; i++) {
                    let patientFam = await patientsModel.findOne({ _id: familyMembers[i].PatientId })
    
                    patient.familyMember.push(patientFam.Name)
                }
                familyMembers = await unRegFamMem.find({ PatientId: patient._id })
                for (let i = 0; i < familyMembers.length; i++) {
                    patient.familyMember.push(familyMembers[i].Name)
                }

                patients.push(patient)
            }
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


router.get('/viewContract', protect, async (req, res) => {

    const doctor = await doctorModel.findById(req.user)
    if (!doctor) {
        return res.status(500).json({ message: "You are not a doctor", success: false })
    }

    const salary= Math.floor(doctor.HourlyRate / 2);
   /// const markup = Math.floor(salary/10);
    const contact='Employee: '+doctor.Name+'\n'+' The initial term of this employment shall commence once accepting this contract and continue until terminated by either party with 30 days written notice.\nThe Employer agrees to pay the doctor '+salary+' per appointment and that the clinic have a markup of 10% for the appointment' ;
    return res.status(200).json({message:contact, success: true})

});

router.post('/addavailableslots', protect, async (req, res) => {

    console.log('k')
    console.log(req.user);
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
    console.log(dTimeTemp); 
    let startDate = new Date(dTimeTemp);
    startDate.setHours(startDate.getHours() + 2)
    //const startDate = req.body.Date
    console.log(startDate)
    let endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + 30);

    let aptmnts = await appointmentModel.find({ DoctorId: req.user._id });
    //console.log(aptmnts);
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
    // console.log(flag)
    aptmnts = await docAvailableSlots.find({ DoctorId: req.user._id });
    if (flag == false) {
        return res.status(500).json({ message: "you have an appointment during this slot", success: false });
    }
    flag = true;
    //console.log(aptmnts);
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
        const patient = await patientsModel.find({ _id: temp[x].PatientId })
        if (patient.length > 0)
            result.Name = patient[0].Name;
        result.PatientId = temp[x].PatientId;
        result.DoctorId = temp[x].DoctorId;
        result.Date = temp[x].Date;
        result.Status = temp[x].Status;
        final.push(result);

    }
    res.status(200).json(final);
});
router.post('/addrecord/:PatientId',upload.single('file'),protect,async(req,res)=>{
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
    console.log(patientID);
    console.log(req.file);
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


export default router;