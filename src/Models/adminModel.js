import { mongoose } from 'mongoose';
import userModel from './userModel.js';
const adminSchema = new mongoose.Schema({});
const Admin=userModel.discriminator('Admin',adminSchema);
export default mongoose.model('Admin');
