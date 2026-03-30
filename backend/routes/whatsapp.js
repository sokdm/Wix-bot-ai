const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const whatsappController = require('../controllers/whatsappController');

router.post('/connect', auth, whatsappController.connect);
router.get('/status', auth, whatsappController.getStatus);
router.post('/disconnect', auth, whatsappController.disconnect);
router.post('/autoreply', auth, whatsappController.toggleAutoReply);
router.get('/logs', auth, whatsappController.getLogs);

module.exports = router;
