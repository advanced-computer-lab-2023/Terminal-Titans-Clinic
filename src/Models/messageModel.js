import { mongoose } from 'mongoose';

const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    recipient:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    text: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export default mongoose.model('Message', MessageSchema);
