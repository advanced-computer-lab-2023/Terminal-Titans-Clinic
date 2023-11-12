import mongoose, { Schema as _Schema, model } from 'mongoose';
//default duration is 30 mmins
const docAvailableSlotsSchema = new mongoose.Schema({
    DoctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    Date:{
        type:Date,
        required:true
    }
});
export default model('docAvailableSlots',docAvailableSlotsSchema);