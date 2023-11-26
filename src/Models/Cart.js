
import { mongoose } from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }, // If you have user authentication
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }, // Reference to the medicine schema
  quantity: { type: Number, default: 1 },
  price: { type: Number },
  // You can add other fields as needed
});

export default mongoose.model('CartItem', cartItemSchema);

