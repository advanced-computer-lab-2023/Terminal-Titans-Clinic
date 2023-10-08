import { mongoose } from 'mongoose';

const HealthRecSchema = new mongoose.Schema({
    HealthDocument:{
        type:String,
        required:true
    },
    PatientId:{
        type:String,
        required:true
    },
});
export default mongoose.model('healthRec',HealthRecSchema);