import { mongoose } from 'mongoose';
import userModel from './userModel.js';

const doctorSchema = new mongoose.Schema({
    
    Name:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    DateOfBirth:{
        type:String,
        required:true
    },
    HourlyRate:{
        type:Number,
        required:true
    },
    Affiliation:{
        type:String,
        required:true
    },
    Education:{
        type:String,
        required:true
    },
    Speciality:{
         type:String,
         required:true
    },
});
const Doctor=userModel.discriminator('Doctor',doctorSchema);
export default mongoose.model('Doctor');