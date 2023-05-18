const express = require('express');
const router = express.Router();
const postJob = require('../controllers/jobs.controller').postJob;

router.post('/jobs', postJob);

module.exports = router;