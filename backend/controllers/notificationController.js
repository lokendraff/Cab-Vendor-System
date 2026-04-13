const Notification = require('../models/Notification');

// vender will fetch his notifications 
const getMyNotifications = async (req, res) => {
    try {
        // 
        const notifications = await Notification.find({ recipientId: req.user.id })
                                              .sort({ createdAt: -1 }); // Latest first
        
        res.status(200).json({ success: true, count: notifications.length, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// marking read notifications as read after clicking on the notification
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipientId: req.user.id },
            { isRead: true },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }
        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const result = await Notification.updateMany(
            { recipientId: req.user.id, isRead: false },
            { $set: { isRead: true } }
        );
        res.status(200).json({
            success: true,
            message: 'All notifications marked as read',
            modifiedCount: result.modifiedCount,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { getMyNotifications, markAsRead, markAllAsRead };