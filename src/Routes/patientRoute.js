import express from 'express'
import Doctor from '../Models/doctorModel.js';
import patient from '../Models/patientsModel.js';
import appointmentModel from '../Models/appointmentModel.js';
import prescriptionsModel from '../Models/prescriptionsModel.js';
import familyMember from '../Models/familyMemberModel.js'
import fs from 'fs';
import doctorModel from '../Models/doctorModel.js';
import { pid } from 'process';
import healthPackageModel from '../Models/healthPackageModel.js' ;


const router = express.Router();
const pId='651c89b4a38c19dc5624ca5f';
const doc1Id='652323f2050647d6c71d8758';
const doc2Id='6523244bc7aa4b1920a48e03';

router.get('/getCurrentPatient', async (req, res) => {
    const patient = await patientModel.findOne({ _id: pId })
    if (!patient) {
        res.status(400).json({ message: "Patient not found", success: false })
    }
    else
        res.status(200).json({ Result: patient, success: true })
})

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
    if (!famMembers){
    return  res.status(400).json({ message: "no family members found",success:false})}
else {
    res.status(200).json({Result:famMembers, success:true});
}
})

// requirement number 23
// router.GET('/getAppointment', async (req, res) => {
//     const startDate=req.body.startDate || new Date('1000-01-01T00:00:00.000Z');
//     const endDate=req.body.endDate || new Date('3000-12-31T00:00:00.000Z');

//     let getAppointmentsbyDate;
//     getAppointmentsbyDate = await appointmentModel.find({ Date: { $gte: startDate, 
//         $lte: endDate } ,PatientId:pId });
    
//     let getAppointmentsbyStatus;
//     if (req.body.status){
//         getAppointmentsbyStatus = await appointmentModel.find({ Status: req.body.status,PatientId:pId });
//     }
//     else{
//         getAppointmentsbyStatus = await appointmentModel.find({PatientId:pId});
//     }
//     var temp = getAppointmentsbyDate.filter((app) => {
//         for(let y in getAppointmentsbyStatus){
//         if(getAppointmentsbyStatus[y]._id .equals( app._id)){
//             return true;
//                 }
//             }
//        return false;
//         }
//     );
//     let final=[]
//     for(let x in temp){///if you need the patient's name in front end
//         var result={}
//         const doctor=await doctorModel.find({_id:temp[x].DoctorId})
//         if(doctor.length>0)
//         result.Name=doctor[0].Name;           
//         //result.prescriptionDoc=temp[x].prescriptionDoc;
//         result.Date=temp[x].Date;
//         result.Status=temp[x].Status;
//         final.push(result);

//     }
//     res.status(200).json(final);
// });

router.post('/getAppointment', async (req, res) => {
    const startDate=req.body.startDate || new Date('1000-01-01T00:00:00.000Z');
    const endDate=req.body.endDate || new Date('3000-12-31T00:00:00.000Z');

    let getAppointmentsbyDate;
        getAppointmentsbyDate = await appointmentModel.find({ Date: { $gte: startDate, 
        $lte: endDate } ,PatientId: pId});
    
    let getAppointmentsbyStatus;
    if (req.body.status) {
        getAppointmentsbyStatus = await appointmentModel.find({ Status: req.body.status, PatientId: pId });
    }
    else {
        getAppointmentsbyStatus = await appointmentModel.find({ PatientId: pId });
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
    var final=[];
    for(let x in temp){///if you need the patient's name in front end
        var result={}
        const doctor=await doctorModel.find({_id:temp[x].DoctorId})
        if(patient.length>0)
        result.Name=doctor[0].Name;           
        result.Date=temp[x].Date;
        result.Status=temp[x].Status;
        final.push(result);

    }
    res.status(200).json(final);
});

// requirement number 54
router.get('/viewPrescriptions', async (req, res) => {
    const allprescriptions = await prescriptionsModel.find({ PatientId: pId })
        if (!allprescriptions)
   return  res.status(400).json({ message: "no presriptions found",success:false})
    else {
        var final=[]
for(let x in allprescriptions){
    var result={};
    const doc=await Doctor.find({_id:allprescriptions[x].DoctorId})
    if(doc.length<1){
        return  res.status(400).json({ message: "no doctors found",success:false})

    }
    result.id=allprescriptions[x]._id;
    result.Doctor=doc[0].Name;
    result.Date=allprescriptions[x].Date;
    result.status=allprescriptions[x].status;
   
    final.push(result)

}
let prescriptions=final;

        return    res.status(200).json({Result:prescriptions, success:true})
    }
})
// requirement number 38
router.post('/getDoctors', async (req, res) => {
    console.log("h")
    var getDoctors;
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

//requirement number 37 //get all doctors

router.get('/getDoctorsInfo', async(req, res)=>{
    try{
    const allDoctors = await Doctor.find({});
    const currPat= await patient.find({_id:pId})
    if(currPat.length<1){
        return(res.status(400).send({error: "cant find patient",success: false }));

    }
    const packId=currPat[0].PackageId;
    console.log(currPat)
    var discountP=0;
    if(packId){
        const allPackages = await healthPackageModel.find({_id:packId});
        if(allPackages.length>0)
         discountP= allPackages[0].doctorDiscountInPercentage;
    else
    return(res.status(400).send({error: "cant find package",success: false }));

    }
    else{
         discountP=0;
    }
    let discount=100-discountP;

    console.log(discount)
    var final=[]
    for(let x in allDoctors){
        var result={};
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
        final.push(result)

    }
    console.log(final)
    res.status(200).json({final: final ,success: true });

}
catch(error){
    res.status(400).send({error: error,success: false });

}
})
//requirement number 39

router.post('/filterDoctors', async(req, res)=>{
    const spclty = req.body.Speciality;
    let  dTimeTemp = req.body.date;
    let dTime = new Date(dTimeTemp);
    dTime.setHours(dTime.getHours()+2) 
    console.log(dTime)

    var spcltyDocs = await Doctor.find({Speciality:spclty})
    if(!spclty){
        spcltyDocs = await Doctor.find({});
    }
    const aptmnts = await appointmentModel.find({})
    
    const result = spcltyDocs.filter((Dr) => {
    for(let y in aptmnts){
    if(aptmnts[y].DoctorId == Dr._id){
        let start= aptmnts[y].Date;
        let end = new Date ( start );
        end.setMinutes ( start.getMinutes() + 30 );
        if(dTime>=start && dTime<end)
            return false;
            }
        }
        return true});
   res.status(200).json(result);
})

router.post('/filterPrescriptions', async(req, res)=>{
    const startDate=req.body.startDate || new Date('1000-01-01T00:00:00.000Z');
    const endDate=req.body.endDate || new Date('3000-12-31T00:00:00.000Z');
    let presDate;
    presDate = await prescriptionsModel.find({ Date: { $gte: startDate,
    $lte: endDate } ,PatientId:pId});
   
    var id = await doctorModel.find({Name:req.body.Name});
    // var id=await prescriptionsModel.find({DoctorId: req.body.DoctorId,PatientId:pId})
    const  status = req.body.status ;
    // presDate = await prescriptionsModel.find({Date: date,PatientId:pId});
    var presStatus = await prescriptionsModel.find({status: status,PatientId:pId});
    if(!req.body.Name){
        var id = await doctorModel.find({});
    }
    // if(!req.body.DoctorId){
    //     var id = await prescriptionsModel.find({PatientId:pId});
    // }
    // if(!req.body.Date){
    //      presDate = await prescriptionsModel.find({PatientId:pId});
    // }
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
            result.prescriptionDoc=temp[x].prescriptionDoc.binData.toString('base64');
            final.push(result);
   
        }
    res.status(200).json(final);




}

)
// requirement 40/41
router.get('/selectDoctors/:id', async(req,res)=>{
    const docId= req.params.id;
    const Dr = await Doctor.find({_id:docId});
    console.log("kkk")
    console.log(Dr)
    res.status(200).json({Dr:Dr, success:true});
})

// requirement 56
router.get('/selectPrescriptions/:id', async(req,res)=>{
    try{
        const id= req.params.id;
        console.log(id)
        const prescriptions = await prescriptionsModel.find({_id:id});
        if(prescriptions.length<0){
           
                res.status(400).send({error: error, success:false});
       
            }
       
        console.log(prescriptions)
        let final=[]
        for(let x in prescriptions){
            var result={};
            const doc=await Doctor.find({_id:prescriptions[x].DoctorId})
            if(doc.length<1){
                return  res.status(400).json({ message: "no doctors found",success:false})
    
            }
            result.id=prescriptions[x].DoctorId;
            result.Doctor=doc[0].Name;
            result.Date=prescriptions[x].Date;
            result.status=prescriptions[x].status;
            result.prescriptionDoc=prescriptions[x].prescriptionDoc.binData.toString('base64');
            final.push(result)
    
        }
        res.status(200).json({final:final[0],success:true});
    }
    catch(error){
            res.status(400).send({error: error, success :false});
    
       
    }
    })
    
    export default router;