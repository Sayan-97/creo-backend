const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
const clientAuth = require('../middleware/client.auth');

router.post('/register', clientController.register);
router.post('/login', clientController.login);
router.post('/logout', clientAuth, clientController.logout);

module.exports = router;
