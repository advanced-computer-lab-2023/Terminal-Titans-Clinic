import { mongoose } from 'mongoose';
import familymember from './familyMemberModel.js';
const RegFamMemSchema = new mongoose.Schema({
    Patient2Id:{
        type:String,
        required:true
    },
   
    }, { timestamps: true });
const RegisteredFamilyMember=familymember.discriminator('RegisteredFamilyMember',RegFamMemSchema);
export default mongoose.model('RegisteredFamilyMember');
