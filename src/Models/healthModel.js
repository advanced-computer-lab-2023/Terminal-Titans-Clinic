import { mongoose } from 'mongoose';

const HealthRecSchema = new mongoose.Schema({
    healthDocument:{
        type:String,
        required:true
    },
    patientId:{
        type:String,
        required:true
    },
});
export default mongoose.model('healthRec',HealthRecSchema);