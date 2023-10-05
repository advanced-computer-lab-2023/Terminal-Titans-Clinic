import mongoose, { Schema as _Schema, model } from 'mongoose';

const userOptions={
    discriminationKey: 'usertype',
    collection:'users'
};
const userSchema = new mongoose.Schema({

  Username: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true
  }

}, { timestamps: true },
userOptions,);
export default model('user',userSchema);