import { mongoose } from 'mongoose';
import familymember from './familyMemberModel.js';
const NotRegFamMemSchema = new mongoose.Schema({
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
      }
   
    }, { timestamps: true });
const NotRegisteredFamilyMember=familymember.discriminator('NotRegisteredFamilyMember',NotRegFamMemSchema);
export default mongoose.model('NotRegisteredFamilyMember');
