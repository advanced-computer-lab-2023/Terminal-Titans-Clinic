import mongoose, { Schema as _Schema, model } from 'mongoose';
import userModel from './userModel.js';

// const User=require('./userModel');
const familyMember = {
  name: String,
  age: Number,
  nationalID: String, 
  gender: String,
  relation: String, 
}
const patientSchema = new _Schema({

  
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true
  },
 
  DateOfBirth: {
    type: Date,
    required: true
  },
  Gender: {
    type: String,
    required: true
  },
  Mobile: {
    type: Number,
    required: true,
  },
  EmergencyName: {
    type: String,
    required: true
  },
  EmergencyMobile: {
    type: Number,
    required: true,
  },
  familyMember: {
    type: [familyMember]
  }

}, { timestamps: true });
const patient=userModel.discriminator('patient',patientSchema);
export default model('patient');