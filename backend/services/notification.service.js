const Notification = require('../models/Notification');

const createNotification = async (recipientId, title, message, type = 'SYSTEM') => {
    try {
        const newNotification = new Notification({
            recipientId,
            title,
            message,
            type
        });
        await newNotification.save();
        return true;
    } catch (error) {
        console.error("🚨 Error creating notification:", error);
        return false;
    }
};

module.exports = { createNotification };