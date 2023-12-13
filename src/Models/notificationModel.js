import { mongoose } from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  Message: {
    type: String,
    required: true
  },
  Status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread',
    required: true
  },
  type: {
    type: String,
    required: true
  },
  Category: {
    type: String,
    default: 'inbox',
    enum: ['inbox', 'save', 'done'],
  },

  timestamp: { type: Date, default: Date.now },
  //   relatedAppointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }
});
const Notification = mongoose.model('Notification', notificationSchema);
const notificationChangeStream = Notification.watch();
// notificationChangeStream.on('change', (change) => {
//   console.log('in notification change stream', change);
// });
export default mongoose.model('Notification', notificationSchema);
export { notificationChangeStream };