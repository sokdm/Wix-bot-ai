const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

router.get('/dashboard', adminAuth, adminController.getDashboard);
router.get('/users', adminAuth, adminController.getUsers);
router.get('/sessions', adminAuth, adminController.getSessions);
router.post('/stop-session', adminAuth, adminController.stopSession);
router.get('/logs', adminAuth, adminController.getLogs);
router.delete('/users/:userId', adminAuth, adminController.deleteUser);

module.exports = router;
