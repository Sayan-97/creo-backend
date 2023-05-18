const express = require('express');
const router = express.Router();
const freelancerController = require('../controllers/freelancer.controller');
const freelancerAuth = require('../middleware/freelancer.auth');

router.post('/register', freelancerController.register);
router.post('/login', freelancerController.login);
router.post('/logout', freelancerAuth, freelancerController.logout);

// Get All freelancers
router.get('/freelancers', freelancerController.getAllFreelancers);

// Get profile
router.get('/user/:id', freelancerController.getUserProfile);

// Update profile (Make sure to pass the entire json)
router.put('/profile', freelancerController.updateProfile);

// Add experience
router.post('/add-experience', freelancerController.addExperience);

// Delete experience
router.delete('/delete-experience/:id', freelancerController.deleteExperience);

// Update experience
router.put('/update-experience/:id', freelancerController.updateExperience);

// Add experience
router.post('/add-education', freelancerController.addEducation);

// Delete experience
router.delete('/delete-education/:id', freelancerController.deleteEducation);

// Update experience
router.put('/update-education/:id', freelancerController.updateEducation);

module.exports = router;
