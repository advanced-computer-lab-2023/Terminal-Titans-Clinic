import { mongoose } from 'mongoose';
import userModel from './userModel.js';



const PharmacistSchema = new mongoose.Schema({
    Username: {
      type: String,
      required: true,
      unique : true
    },
    Name: {
      type: String,
      required: true
    },
    Email: {
      type: String,
      required: true, 
      unique:true
    },
    DateOfBirth: {
        type: Date,
        required: true
    },
    HourlyRate: {
        type: Number,
        required: true 
    },
    Affiliation: {
        type: String,
        required: true
    },
    EducationalBackground: {
        type: String,
        required: true 
    },
    ID: {
      data: Buffer,
      contentType:String,
    },
    Degree: {
      data: Buffer,
      contentType:String,
    }
,
    License: {
      data: Buffer,
      contentType:String,
      
    },
    Wallet: {
      type: Number,
      default: 0
    }

  }, { timestamps: true });
  
  const Pharmacist = userModel.discriminator('Pharmacist', PharmacistSchema);
  
export default mongoose.model('Pharmacist');