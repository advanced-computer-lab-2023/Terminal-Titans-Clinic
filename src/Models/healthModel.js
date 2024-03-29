import { mongoose } from 'mongoose';

const HealthRecSchema = new mongoose.Schema({
    HealthDocument:{
        data:Buffer,
        contentType: String,
    },
    PatientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'patient',
        required: true
    },
});
export default mongoose.model('healthRec',HealthRecSchema);