import { mongoose } from 'mongoose';

const followuprequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    PatientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'patient',
      required: true
  },
  DoctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true
  },
  FamilyMemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NotRegisteredFamilyMember',
      required: false
  },
  Date: {
      type: Date,
      required: true
  },
    Status: { type: String, 
        enum: ['accepted', 'revoked', 'pending']
         },
         timestamp: { type: Date, default: Date.now },
 //   relatedAppointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }
});
export default  mongoose.model('followupRequest', followuprequestSchema);
