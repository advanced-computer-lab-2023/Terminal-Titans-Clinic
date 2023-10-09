import { mongoose } from 'mongoose';

const HealthRecSchema = new mongoose.Schema({
    HealthDocument:{
        binData:Buffer,
        contentType: String,
    },
    PatientId:{
        type:String,
        required:true
    },
});
export default mongoose.model('healthRec',HealthRecSchema);