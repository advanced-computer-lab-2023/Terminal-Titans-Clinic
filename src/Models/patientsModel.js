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
  Wallet: {
    type: Number,
    default: 0,
  },
  Mobile: {
    type: String,
    required: true,
  },
  EmergencyName: {
    type: String,
    required: true
  },
  EmergencyMobile: {
    type: String,
    required: true,
  },
  HealthHistory: [
    {
      data: Buffer,
      contentType: String
    }
  ]

}, { timestamps: true });
const patient = userModel.discriminator('patient', patientSchema);
export default model('patient');