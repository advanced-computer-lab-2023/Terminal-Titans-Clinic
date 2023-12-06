import { mongoose } from 'mongoose';

const prescDocSchema = new mongoose.Schema({
    prescDoc:{
        data:Buffer,
        contentType: String,
    },
    Prescription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'prescription',
        required: true
    },
});
export default mongoose.model('prescDoc',prescDocSchema);