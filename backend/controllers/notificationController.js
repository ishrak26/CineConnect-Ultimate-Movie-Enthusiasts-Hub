const dbNotification = require('../models/Notification');

const notificationController = {
    getAllNotifications: async (req, res) => {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

        const userId = req.user.id;
        if (!req.query.beforeTime) {
            const currentDate = new Date();
            req.query.beforeTime = currentDate.toISOString();
        }
        const beforeTime = req.query.beforeTime;
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        try {
            const notifications = await dbNotification.fetchNotifications(
                userId,
                beforeTime,
                limit,
                offset
            );
            const data = [];
            for (let notification of notifications) {
                data.push({
                    interactor: {
                        id: notification.interactor_id,
                        username: notification.username,
                        fullname: notification.full_name,
                        imageUrl: notification.image_url,
                    },
                    type: notification.type,
                    created_at: notification.created_at,
                    isRead: notification.is_read,
                    postId: notification.post_id,
                });
            }
            res.status(200).json(data);
        } catch (error) {
            console.error('Error fetching notifications:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
};

module.exports = notificationController;
