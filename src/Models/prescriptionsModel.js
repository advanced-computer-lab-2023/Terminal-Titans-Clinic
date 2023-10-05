import mongoose, { Schema as _Schema, model } from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
    PatientId:{
        type: String, 
        required:true
    },
    DoctorId:{
        type: String, 
        required:true
    },
    prescription:{
        type:String,
        required:true
    },
    //appointment?
});
export default model('prescription',prescriptionSchema);