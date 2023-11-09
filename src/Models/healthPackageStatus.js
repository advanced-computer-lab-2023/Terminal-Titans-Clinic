import mongoose from 'mongoose';

const HealthPackageStatusSchema = new mongoose.Schema({
  healthPackageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'healthPackage',
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patient',
    required: true,
  },
  status: {
    type: String,
    enum: ['Subscribed', 'Unsubscribed', 'Cancelled'],
    required: true,
  },
  renewalDate: {
    type: Date,
    required: false,
  },
  endDate: {
    type: Date,
    required: false,
  },
});

export default mongoose.model('HealthPackageStatus', HealthPackageStatusSchema);
