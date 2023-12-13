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
    items: [
        {
          medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
          dosage: Number,
        },
        ],
    status:{
        type:String,
        required:true
    },
    Date:{
        type:Date,
        required:true
    },
    InCart:{
        type:Boolean,
        default:false
    }
    //appointment?
});
export default model('prescription',prescriptionSchema);