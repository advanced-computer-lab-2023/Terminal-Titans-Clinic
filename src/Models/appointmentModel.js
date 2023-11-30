import mongoose, { Schema as _Schema, model } from 'mongoose';
//default duration is 30 mmins
const apppointmentSchema = new mongoose.Schema({
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
    Status: {
        type: String,
        enum: ['upcoming', 'completed', 'cancelled', 'rescheduled'],
        required: true
    }

}, { timestamps: true });
export default model('appointments', apppointmentSchema);