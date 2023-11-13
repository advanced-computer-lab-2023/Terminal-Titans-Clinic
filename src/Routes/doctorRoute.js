import express from 'express'
import doctorModel from '../Models/doctorModel.js';
import patientsModel from '../Models/patientsModel.js';
import healthModel from '../Models/healthModel.js';
import appointmentModel from '../Models/appointmentModel.js';
import familyMemberModel from '../Models/familyMemberModel.js';
import protect from '../middleware/authMiddleware.js';
import docAvailableSlots from '../Models/docAvailableSlotsModel.js';

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
    else
        res.status(200).json({ Result: doctor, success: true })
})

// requirement number 14 later
router.get('/updateDoctor', protect, async (req, res) => {
    try {
        const doctor = await doctorModel.findById(req.user)
        if (!doctor) {
            return res.status(400).json({ message: "Doctor not found", success: false })
        }
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
router.get('/getPatientInfoAndHealth/:id',protect, async (req, res) => {
    try {
        const doctor = await doctorModel.findById(req.user)
        if (!doctor) {
            res.status(500).json({ message: "You are not a doctor", success: false })
        }

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


        let familyMembers = await familyMemberModel.find({ PatientId: patient._id })

        patient = { ...patient._doc, "familyMember": [] }

        for (let i = 0; i < familyMembers.length; i++) {
            console.log(familyMembers[i].Name)
            patient.familyMember.push(familyMembers[i].Name)
        }
        let list = []
        for (let x in healthRecords) {
            list.push(healthRecords[x].HealthDocument.binData)

        }

        //console.log(patient)
        const result = {
            "healthRecords": healthRecords,
            "patient": patient,
            "healthDoc": list,
            "medicalHistory": patient.MedicalHistory
        }

        res.status(200).json({ Result: result, success: true })
    } catch (err) {
        res.status(400).json({ message: err.message, success: false })
    }
});



// requirement number 33
router.get('/getPatientsList', protect,async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ _id: req.user._id })
        if(!doctor){
            res.status(400).json({ message: "Doctor not found", success: false })
            return;
        }
        const appointments = await appointmentModel.find({ DoctorId: req.user._id });
        if (appointments.length == 0) {
            res.status(400).json({ message: "No patients found", success: false })
            return;
        }

        let result = []

        for (let i = 0; i < appointments.length; i++) {
            let patient = await patientsModel.findOne({ _id: appointments[i].PatientId })
            let familyMembers = await familyMemberModel.find({ PatientId: patient._id })
            if(!result.find((pat) => pat._id.equals(patient._id))){
            patient = { ...patient._doc, "familyMember": [] }

            for (let i = 0; i < familyMembers.length; i++) {
                patient.familyMember.push(familyMembers[i].Name)
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
        res.status(400).json({ message: err.message, success: false })
    }
});

router.post('/acceptContract', protect, async (req, res) => {
    try {
       
        const doctor = await doctorModel.findOne({ _id: req.user });

        if (!doctor) {
            return res.status(400).json({ message: "You are not a doctor", success: false });
        }

      
        doctor.employmentContract = "accepted";

       
        await doctor.save();

        return res.status(200).json({ message: "Contract accepted successfully", success: true });
    } catch (err) {
        return res.status(500).json({ message: err.message, success: false });
    }

});


//requirement number 51
router.post('/asiignfollowUp', protect, async (req, res) => {
    const exists = await doctorModel.findOne(req.user);
    if (!exists) {
        return res.status(400).json({ message: "You are not a doctor", success: false })
    }
    const PID = req.body.PatientId;
    const date = req.body.date;
    const DID= req.user._id;
    const aptmnt=await docAvailableSlots.findOne({DoctorId:DID,Date:date});
   
    if(aptmnt.length<1){
        return (res.status(400).send({ error: "You are not available during this slot", success: false }));
    }
  
        const newAppointment = new appointmentModel({
            PatientId: PID,
            DoctorId: DID,
            Status: "upcoming",
            Date: date
        });

        newAppointment.save();
        docAvailableSlots.findOneAndDelete({ DoctorId: dId , Date: date});
        res.status(200).json({ Result: newAppointment, success: true });
    
    
})

// requirement number 34
router.get('/getPatientName/:name',protect, async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ _id: req.user._id })

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

            if (patient.Name.toLowerCase() == req.params.name.toLowerCase()) {
                let familyMembers = await familyMemberModel.find({ PatientId: patient._id })

                patient = { ...patient._doc, "familyMember": [] }

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
   // console.log(doctor);
    const flag= true;
    let dTimeTemp = req.body.date; 
    console.log(dTimeTemp); 
    let startDate = new Date(dTimeTemp);
    startDate.setHours(startDate.getHours() + 2)
    //const startDate = req.body.Date
console.log(startDate)
    let endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + 30);
console.log('p')
    const aptmnts = await appointmentModel.find({ DoctorId: req.user._id });
    //console.log(aptmnts);
    if(aptmnts){


        for (let y in aptmnts) {
            
                let start = aptmnts[y].Date;
                if ( start==startDate )
                    flag=false;
            
            } 
        }
       // console.log(aptmnts);
            if (flag==false) {
                return res.status(500).json({ message: "you have an appointment during this slot", success: false });
            }
        
        
        try {
            const availableSlots = new docAvailableSlots({
                DoctorId: req.user._id ,
                Date: startDate,
            });
            availableSlots.save();
            console.log('ho')
           return  res.status(200).json({ Result: availableSlots, success: true })
        }

        catch (error) {
            res.status(400).send({ error: error, success: false });
        
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
          
    var result={};
    result.Amount=exists.Wallet;
    return res.status(200).json(result);

})

// requirement number 35 front lesa
router.get('/getUpcomingAppointment', protect,async (req, res) => {
    try {
        const exists = await doctorModel.findById(req.user);
        if (!exists) {
            return res.status(500).json({
                success: false,
                message: "You are not a doctor"
            });
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
            let familyMembers = await familyMemberModel.find({ PatientId: patient._id })

            patient = { ...patient._doc, "familyMember": [], "appointmentDate": getAppointments[i].Date }

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
router.get('/selectPatientName/:id', protect,async (req, res) => {
    try {
        // const getAppointment = await appointmentModel.find({ DoctorId: id });
        const exists = await doctorModel.findById(req.user);
        if (!exists) {
            return res.status(500).json({
                success: false,
                message: "You are not a doctor"
            });
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

        let familyMembers = await familyMemberModel.find({ PatientId: patient._id })

        patient = { ...patient._doc, "familyMember": [] }

        for (let i = 0; i < familyMembers.length; i++) {
            patient.familyMember.push(familyMembers[i].Name)
        }

        result = [patient];


        res.status(200).json({ Result: result, success: true })
    }
    catch (err) {
        res.status(400).json({ message: err.message, success: false })
    }
})

router.post('/getAppointment', protect,async (req, res) => {

    const exists = await doctorModel.findById(req.user);
    if (!exists) {
        return res.status(500).json({
            success: false,
            message: "You are not a doctor"
        });
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
        result.Date = temp[x].Date;
        result.Status = temp[x].Status;
        final.push(result);

    }
    res.status(200).json(final);
});
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
router.get('/test', (req, res) => {
    healthModel.find({})
        .then((data, err) => {
            if (err) {
                console.log(err);
            }
            console.log(data)
            res.render('../../views/imagepage', { items: data })
            //return(res.render('../../views/home'));

        })
});
export default router;