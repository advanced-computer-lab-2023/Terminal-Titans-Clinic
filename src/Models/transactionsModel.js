
import { mongoose } from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    amount: {
        type: Number,
        required: true
    },

  paymentMethod: {
    type: String,
    
  },
},{ timestamps: true});

export default  mongoose.model('Transactions', transactionSchema);
