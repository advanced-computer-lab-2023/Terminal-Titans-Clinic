import mongoose, { Schema as _Schema, model } from 'mongoose';

// const User=require('./userModel');
const familyMemberOptions = {
  discriminationKey: 'familyMembertype',
  collection: 'familyMember'
};
const familyMemberSchema = new _Schema({
  // PatientId: {
  //   type: String,
  //   required: true
  // },
  PatientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patient',
    required: true
  },
  Relation: {
    type: String,
    required: true
  }
}, { timestamps: true }, familyMemberOptions);
export default model('familymember', familyMemberSchema);