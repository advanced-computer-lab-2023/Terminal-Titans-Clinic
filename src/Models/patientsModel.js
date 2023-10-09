import mongoose, { Schema as _Schema, model } from 'mongoose';
import userModel from './userModel.js';

// const User=require('./userModel');

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
  PackageId:{ //if registered in any packages
    type:String
  }

}, { timestamps: true });
const patient=userModel.discriminator('patient',patientSchema);
export default model('patient');