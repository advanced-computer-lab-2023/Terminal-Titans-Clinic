
import { mongoose } from 'mongoose';

const MedicineSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    unique: true
  },
  Price: {
    type: Number,
    required: true
  },
  Quantity: {
    type: Number,
    required: true
  },
  Sales:{
    type : Number,
    required: false
  },
  ActiveIngredients: {
    type: Array,
    required: true
  },
  MedicalUse: {
    type: Array,
    required: true
  },
  Picture: {
    data: Buffer,
    contentType:String,
  },
  OverTheCounter: {
    type: Boolean,
    required: true
  },
}, { timestamps: true });

export default mongoose.model('Medicine', MedicineSchema);
