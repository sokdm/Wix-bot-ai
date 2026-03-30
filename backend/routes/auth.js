const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');
const { auth } = require('../middleware/auth');

router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/admin/login', authLimiter, authController.adminLogin);
router.get('/me', auth, authController.getMe);

module.exports = router;
