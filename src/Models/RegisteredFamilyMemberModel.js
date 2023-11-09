import { mongoose } from 'mongoose';
import familymember from './familyMemberModel.js';
const RegFamMemSchema = new mongoose.Schema({
    Patient2Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'patient',
        required: true
    },

}, { timestamps: true });
const RegisteredFamilyMember = familymember.discriminator('RegisteredFamilyMember', RegFamMemSchema);
export default mongoose.model('RegisteredFamilyMember');
