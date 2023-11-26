
import { mongoose } from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  items: [
    {
      medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
      quantity: Number,
      price: Number,
    },
  ],
  total: Number,
  status: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  paymentMethod: {
    type: String,
    required: true
  },
},{ timestamps: true});

export default  mongoose.model('Order', orderSchema);
