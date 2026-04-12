const Notification = require('../models/Notification');

// vender will fetch his notifications 
const getMyNotifications = async (req, res) => {
    try {
        // 
        const notifications = await Notification.find({ recipientId: req.user.id })
                                              .sort({ createdAt: -1 }); // Naye sabse upar
        
        res.status(200).json({ success: true, count: notifications.length, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// marking read notifications as read after clicking on the notification
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id, 
            { isRead: true }, 
            { new: true }
        );
        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = { getMyNotifications, markAsRead };