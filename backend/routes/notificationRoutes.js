const express = require('express');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

// Route for fetching all notifications
router.get('/', notificationController.getAllNotifications); // /v1/notifications

module.exports = router;
