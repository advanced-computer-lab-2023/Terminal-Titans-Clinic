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
        type:Date,
        required:true
    },
    HourlyRate:{
        type:Number,
        required:true
    },
    Wallet: {
        type: Number,
        default: 0,
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
    employmentContract:{
        type: String,
        enum: ['Accepted', 'Unaccepted', 'Pending'],
        required: true,

    },
    ID: {
        data: Buffer,
        contentType:String,
      },
      Degree: {
        data: Buffer,
        contentType:String,
        
      },
      License: {
        data: Buffer,
        contentType:String,

      }
});
const Doctor=userModel.discriminator('Doctor',doctorSchema);
export default mongoose.model('Doctor');