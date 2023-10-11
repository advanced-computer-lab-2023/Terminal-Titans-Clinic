import mongoose, { Schema as _Schema, model } from 'mongoose';

// const User=require('./userModel');

const familyMemberSchema = new _Schema({
  Name: {
    type: String,
    required: true,
  },
  Age: {
    type: Number,
    required: true
  },
 
  NationalId: {
    type: Number,
    required: true
  },
  Gender: {
    type: String,
    enum:['Male', 'Female', 'Other'],
    required: true
  },
  Relation: {
    type: String,
    required: true,
  },
  PatientId:{
    type:String,
    required:true
  },
  FamilyMemId:{
    type:String
  }
 

}, { timestamps: true });
export default model('familymember',familyMemberSchema);