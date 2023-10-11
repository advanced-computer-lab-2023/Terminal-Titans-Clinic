import mongoose, { Schema as _Schema, model } from 'mongoose';

const apppointmentSchema = new mongoose.Schema({
    PatientId:{
        type: String, 
        required:true
    },
    DoctorId:{
        type: String, 
        required:true
    },
    Date:{
        type:Date,
        required:true
    },
    Status:{
        type:String,
        enum:['upcoming', 'completed', 'cancelled', 'rescheduled'],
        required:true
    }

});
export default model('appointments',apppointmentSchema);