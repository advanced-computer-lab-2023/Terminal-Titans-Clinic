import { mongoose } from 'mongoose';

const HealthPackageSchema = new mongoose.Schema({
    packageType:{
        type: String,
        required: true,
    },
    subsriptionFeesInEGP: {
        type: Number,
        required: true,
    },
    doctorDiscountInPercentage:{
        type: Number,
        required: true,
    },
    medicinDiscountInPercentage:{
        type: Number,
        required: true,
    },
    familyDiscountInPercentage:{
        type: Number,
        required: true,
    },
});
export default mongoose.model('healthPackage',HealthPackageSchema);