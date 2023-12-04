import { mongoose } from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    Message: {
        type: String,
        
      },
    Status: { type: String, 
        enum: ['unread', 'read'],
        default: 'unread' },

    timestamp: { type: Date, default: Date.now },
 //   relatedAppointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }
});
export default  mongoose.model('Notification', notificationSchema);
