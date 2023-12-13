import express from 'express';
import mongoose from 'mongoose';
import protect from '../middleware/authMiddleware.js';
import patientModel from '../Models/patientsModel.js';
import notificationModel from '../Models/notificationModel.js';


const router = express.Router();


router.get('/notifications', protect, async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await notificationModel.find({ userId }).sort({ timestamp: -1 });
        const length = notifications.length;
        res.status(200).json({ notifications, length, success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error retrieving notifications', success: false });
    }
});

router.get('/unReadNotifications', protect, async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await notificationModel.find({ userId, Status: 'unread' }).sort({ timestamp: -1 });
        const length = notifications.length;
        res.status(200).json({ length, success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error retrieving notifications', success: false });
    }
});


router.put('/readnotification/:_id', protect, async (req, res) => {
    try {
        console.log(req.params._id);
        const ID = new mongoose.Types.ObjectId(req.params._id);
        // type cast to mongoose object id
        const notification = await notificationModel.findByIdAndUpdate(ID, { $set: { Status: 'read' } }, { new: true });
        console.log('Notification marked as read');
        res.status(200).json({ notification, success: true });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error marking notifications as read', success: false });
    }
});

router.put('/unReadnotification/:_id', protect, async (req, res) => {
    try {

        const ID = req.params._id;
        const notification = await notificationModel.findByIdAndUpdate(ID, { $set: { Status: 'unread' } }, { new: true });
        console.log('Notification marked as unread');
        res.status(200).json({ notification, success: true });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error marking notifications as read', success: false });
    }
});

router.put('/savenotification/:id', protect, async (req, res) => {
    try {
        const notificationId = req.params.id;
        const myNotification = await notificationModel.findById(notificationId);
        let newNotification = null;
        if (myNotification.Category == 'save')
            newNotification = await notificationModel.findByIdAndUpdate(notificationId, { $set: { Category: 'inbox' } }, { new: true });
        else
            newNotification = await notificationModel.findByIdAndUpdate(notificationId, { $set: { Category: 'save' } }, { new: true });

        res.status(200).json({ newNotification, success: true });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error saving notifications', success: false });
    }
});

router.delete('/deletenotification/:id', protect, async (req, res) => {
    try {
        const notificationId = req.params.id;
        const myNotification = await notificationModel.deleteOne(notificationId);
        res.status(200).json({ message: 'Deleted Successfully', success: true });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error deleting notifications', success: false });
    }
});

router.put('/donenotification/:id', protect, async (req, res) => {
    try {
        const notificationId = req.params.id;
        console.log(notificationId);
        let newNotification = null;
        newNotification = await notificationModel.findByIdAndUpdate(notificationId, { $set: { Category: 'done' } }, { new: true });
        res.status(200).json({ newNotification, success: true });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error saving notifications', success: false });
    }
});

export default router;