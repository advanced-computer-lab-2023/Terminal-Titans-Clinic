
import { mongoose } from 'mongoose';
import userModel from './userModel.js';

const requestedDoctorSchema = new mongoose.Schema({

    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    DateOfBirth: {
        type: Date,
        required: true
    },
    HourlyRate: {
        type: Number,
        required: true
    },
    Affiliation: {
        type: String,
        required: true
    },
    Education: {
        type: String,
        required: true
    },
});
const RequestedDoctor = userModel.discriminator('RequestedDoctor', requestedDoctorSchema);
export default mongoose.model('RequestedDoctor');
