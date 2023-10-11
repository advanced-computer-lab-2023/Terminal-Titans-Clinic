import express from 'express'
import Doctor from '../Models/doctorModel.js';
import patient from '../Models/patientsModel.js';
import appointmentModel from '../Models/appointmentModel.js';
import prescriptionsModel from '../Models/prescriptionsModel.js';
import familyMember from '../Models/familyMemberModel.js'
import fs from 'fs';
import doctorModel from '../Models/doctorModel.js';
import { pid } from 'process';


const router = express.Router();
const pId='651c89b4a38c19dc5624ca5f';
const dId='652323f2050647d6c71d8758';

//requirement 18 (add family member)
router.post('/addFamilyMem', async (req,res)=>{
    const rel=req.body.relation.toLowerCase()
    if(!(rel==('wife') || (rel)==('husband')|| (rel)==('child')))
        return(res.status(400).send({message: "family member can only be wife/husband or child"}));
    
    var famMember = await familyMember.find({ PatientId: pId,NationalId:req.body.nId});
    if(famMember.length>0)
        return(res.status(400).send({message: "This National Id is already registered as a family member"}));
        
    if((rel)==('wife') || (rel)==('husband')  ){  
    const famMember = await familyMember.find({ PatientId: pId,Relation: req.body.relation.toLowerCase()});
    if(famMember.length>0)
        return(res.status(400).send({message: "a family member is already registered as your spouse"}));
        }

    try{
        const newFamilyMember = new familyMember({
            Name : req.body.name,
            Age : req.body.age,
            NationalId:req.body.nId,
            Gender:req.body.gender,
            Relation:req.body.relation.toLowerCase(),
            PatientId: pId,
            FamilyMemId: req.body.fMemId
        });
        newFamilyMember.save();
        console.log(req.body.pId)
        //const getPatient = await patient.find({ _id: pId });
        console.log(req.body.pId)    
        res.status(200).json({ Result: newFamilyMember, success: true })
    }
    catch(error){
        res.status(400).send({error: error});

    }
})

// requirement number 22
router.get('/viewRegFamMem', async (req, res) => {
    const famMembers = await familyMember.find({ PatientId: pId });
    res.status(200).json(famMembers);
})

// requirement number 23
router.get('/getAppointment', async (req, res) => {

    let getAppointmentsbyDate;
    if (req.body.date){
        getAppointmentsbyDate = await appointmentModel.find({ Date: req.body.date,PatientId:pId });
    }
    else{
        getAppointmentsbyDate = await appointmentModel.find({PatientId:pId});
    }
    let getAppointmentsbyStatus;
    if (req.body.status){
        getAppointmentsbyStatus = await appointmentModel.find({ Status: req.body.status,PatientId:pId });
    }
    else{
        getAppointmentsbyStatus = await appointmentModel.find({PatientId:pId});
    }
    var temp = getAppointmentsbyDate.filter((app) => {
        for(let y in getAppointmentsbyStatus){
        if(getAppointmentsbyStatus[y]._id .equals( app._id)){
            return true;
                }
            }
       return false;
        }
    );
    let final=[]
    for(let x in temp){///if you need the patient's name in front end
        var result={}
        const doctor=await doctorModel.find({_id:temp[x].DoctorId})
        if(doctor.length>0)
        result.Name=doctor[0].Name;           
        //result.prescriptionDoc=temp[x].prescriptionDoc;
        result.Date=temp[x].Date;
        result.Status=temp[x].Status;
        final.push(result);

    }
    res.status(200).json(final);
});

// requirement number 54
router.get('/viewPrescriptions', async (req, res) => {
        const prescriptions = await prescriptionsModel.find({ PatientId: pId })
            if (!prescriptions)
       return  res.status(400).json({ message: "no presriptions found",success:false})
        else {

            return    res.status(200).json({Result:prescriptions, success:true})
        }
})
// requirement number 38
router.get('/getDoctor', async (req, res) => {
    var getDoctors ;
    if(req.body.Name && req.body.Speciality){
     getDoctors = await Doctor.find({ Name: req.body.Name,Speciality:req.body.Speciality});
    }
    if(!req.body.Name){
         getDoctors = await Doctor.find({Speciality:req.body.Speciality});
    }
    if(!req.body.Speciality){
         getDoctors = await Doctor.find({Name:req.body.Name});
    }
    if(!req.body.Speciality && !req.body.Name){
        getDoctors=await Doctor.find({});
    }
    console.log(getDoctors);
    if (getDoctors.length == 0) {
        return res.status(400).json({ message: "No doctors found "});
    }
    return res.status(200).json({ Doctors: getDoctors , success:true });
}) ;
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

//requirement number 37

router.get('/getDoctors', async(req, res)=>{
    const allDoctors = await Doctor.find({});
    const discount=80;//get from PACKAGE
    var result={};
    for(let x in allDoctors){
        console.log("here")
        var cur=allDoctors[x];
        var price=(allDoctors[x].HourlyRate*1.1)*discount/100;
        result.sessionPrice=price;
        result.Name=allDoctors[x].Name;
        result.Email=allDoctors[x].Email;
        result.Affiliation=allDoctors[x].Affiliation;
        result.Education=allDoctors[x].Education;
        result.Speciality=allDoctors[x].Speciality;
        result.id=allDoctors[x].id;

    }
    //console.log(allDoctors)
    res.status(200).json( result );
})
//requirement number 39

router.get('/filterDoctors', async(req, res)=>{
    const spclty = req.body.Speciality;
    const  dTime = req.body.date;
    var spcltyDocs = await Doctor.find({Speciality:spclty})
    if(!spclty){
        spcltyDocs = await Doctor.find({});
    }
    const aptmnts = await appointmentModel.find({Date:dTime})
    
    const result = spcltyDocs.filter((Dr) => {
    for(let y in aptmnts){
    if(aptmnts[y].DoctorId == Dr._id){
    console.log(Dr.Name);
    return false;
            }
        }
        return true});
    console.log(aptmnts);
   res.status(200).json(result);
})

router.get('/filterPrescriptions', async(req, res)=>{
    const date = req.body.Date;
    var id = await doctorModel.find({Name:req.body.Name});
    // var id=await prescriptionsModel.find({DoctorId: req.body.DoctorId,PatientId:pId})
    const  status = req.body.status ;
    var presDate = await prescriptionsModel.find({Date: date,PatientId:pId});
    var presStatus = await prescriptionsModel.find({status: status,PatientId:pId});
    if(!req.body.Name){
        var id = await doctorModel.find({});
    }
    // if(!req.body.DoctorId){
    //     var id = await prescriptionsModel.find({PatientId:pId});
    // }
    if(!req.body.Date){
        var presDate = await prescriptionsModel.find({PatientId:pId});
    }
    if(!req.body.status){
        var presStatus = await prescriptionsModel.find({PatientId:pId});
    }
    var temp = presDate.filter((pres) => {
        var flag1=false;
        for(let y in id){
        if(id[y]._id == pres.DoctorId){
          //if(id[y].DoctorId==pres.DoctorId){  
        flag1=true;
                }
            }
        var flag2=false;    
        for(let y in presStatus){
            
            if(presStatus[y]._id.equals( pres._id)){
                flag2=true;
            }
        }
            return flag1 && flag2});
         
            var final=[];
        for(let x in temp){///if you need the doctor's name in front end
            var result={}
            const doc=await Doctor.find({_id:temp[x].DoctorId})
            console.log(doc.Name)
            if(doc.length>0)
            result.Name=doc[0].Name;           
            //result.prescriptionDoc=temp[x].prescriptionDoc;
            result.Date=temp[x].Date;
            result.status=temp[x].status;
            result.id=temp[x].id;
            final.push(result);
    
        }
    res.status(200).json(final);




}

)
// requirement 40/41
router.get('/selectDoctors', async(req,res)=>{
    const dId= req.body.id;
    const Dr = await Doctor.find({_id:dId});
    res.status(200).json(Dr);
})

// requirement 56
router.get('/selectPrescriptions', async(req,res)=>{
    const id= req.body.id;
    const result = await prescriptionsModel.find({_id:id});
    res.status(200).json(result);
})

export default router;