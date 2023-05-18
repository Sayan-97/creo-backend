const Freelancer = require('../models/freelancer.schema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

exports.register = async (req, res) => {

  const user = req.body.user ? req.body.user[0] : {};
  const profile = req.body.profile ? req.body.profile[0] : {};
  const workExperience = req.body.workExperience ? req.body.workExperience[0] : {};
  const education = req.body.education ? req.body.education[0] : {};
  
  const { firstName = '', lastName = '', email = '', password = '' } = user;
  const { profileTitle = '', profileDescription = '', skills = [], hourlyRate = 0, portfolio = [] } = profile;
  const { company = '', position = '', startDate = '', endDate = '', description = '' } = workExperience;
  const { institution = '', degree = '', fieldOfStudy = '', startDateE = '', endDateE = '' } = education;  

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const freelancer = await Freelancer.create({
      user: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
      profile: {
        profileTitle,
        profileDescription,
        skills,
        hourlyRate,
        portfolio,
      },
      workExperience: {
        company,
        position,
        startDate,
        endDate,
        description,
      },
      education: {
        institution,
        degree,
        fieldOfStudy,
        startDateE,
        endDateE
      }
    });

    const token = jwt.sign({ _id: freelancer._id }, process.env.JWT_SECRET);

    return res.status(200).json({
      success: true,
      data: {
        token,
        freelancer: {
          firstName: freelancer.user.firstName,
          lastName: freelancer.user.lastName,
          email: freelancer.user.email,
          profileTitle: freelancer.profile.profileTitle,
          profileDescription: freelancer.profile.profileDescription,
          skills: freelancer.profile.skills,
          hourlyRate: freelancer.profile.hourlyRate,
          portfolio: freelancer.profile.portfolio,
          workExperience: freelancer.workExperience,
          education: freelancer.education
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const freelancer = await Freelancer.findOne({ 'user.email': email });

    if (!freelancer) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, freelancer.user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const token = jwt.sign({ _id: freelancer._id }, process.env.JWT_SECRET);

    console.log(token)

    return res.status(200).json({
      success: true,
      data: {
        token,
        freelancer: {
          firstName: freelancer.user.firstName,
          lastName: freelancer.user.lastName,
          email: freelancer.user.email,
          profileTitle: freelancer.profile.profileTitle,
          profileDescription: freelancer.profile.profileDescription,
          skills: freelancer.profile.skills,
          hourlyRate: freelancer.profile.hourlyRate,
          portfolio: freelancer.profile.portfolio,
          workExperience: freelancer.workExperience,
          education: freelancer.education
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.logout = async (req, res) => {
  try {
    req.freelancer.tokens = req.freelancer.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.freelancer.save();

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken._id;

    const freelancer = await Freelancer.findOne({ _id: userId });

    if (!freelancer) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userProfile = {
      firstName: freelancer.user.firstName,
      lastName: freelancer.user.lastName,
      email: freelancer.user.email,
      profileTitle: freelancer.profile.profileTitle,
      profileDescription: freelancer.profile.profileDescription,
      skills: freelancer.profile.skills,
      hourlyRate: freelancer.profile.hourlyRate,
      portfolio: freelancer.profile.portfolio,
      workExperience: freelancer.workExperience,
      education: freelancer.education
    };

    return res.status(200).json({ userProfile });
  } catch (error) {
    console.error(error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllFreelancers = async (req, res) => {
  try {
    const freelancers = await Freelancer.find();

    const formattedFreelancers = freelancers.map((freelancer) => ({
      firstName: freelancer.user.firstName,
      lastName: freelancer.user.lastName,
      email: freelancer.user.email,
      profileTitle: freelancer.profile.profileTitle,
      profileDescription: freelancer.profile.profileDescription,
      skills: freelancer.profile.skills,
      hourlyRate: freelancer.profile.hourlyRate,
      portfolio: freelancer.profile.portfolio,
      workExperience: freelancer.workExperience,
      education: freelancer.education
    }));

    return res.status(200).json({
      success: true,
      data: formattedFreelancers
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decodedToken._id;

  const { profileTitle = '', profileDescription = '', skills = [], hourlyRate = 0, portfolio = [] } = req.body;

  try {
    const freelancer = await Freelancer.findOneAndUpdate({ _id: userId }, { 
      $set: {
        'profile.profileTitle': profileTitle,
        'profile.profileDescription': profileDescription,
        'profile.skills': skills,
        'profile.hourlyRate': hourlyRate,
        'profile.portfolio': portfolio,
      },
    }, { new: true });

    if (!freelancer) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userProfile = {
      firstName: freelancer.user.firstName,
      lastName: freelancer.user.lastName,
      email: freelancer.user.email,
      profileTitle: freelancer.profile.profileTitle,
      profileDescription: freelancer.profile.profileDescription,
      skills: freelancer.profile.skills,
      hourlyRate: freelancer.profile.hourlyRate,
      portfolio: freelancer.profile.portfolio,
      workExperience: freelancer.workExperience,
      education: freelancer.education
    };

    return res.status(200).json({ userProfile });
  } catch (error) {
    console.error(error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Server error' });
  }
};

// Add experience
exports.addExperience = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken._id;

    const freelancer = await Freelancer.findOne({ _id: userId });

    if (!freelancer) {
      return res.status(404).json({ error: 'User not found' });
    }

    freelancer.workExperience.push(req.body);

    await freelancer.save();

    return res.status(200).json({ freelancer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Delete Experience
exports.deleteExperience = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken._id;

    const freelancer = await Freelancer.findOne({ _id: userId });

    if (!freelancer) {
      return res.status(404).json({ error: 'User not found' });
    }

    const experienceIndex = freelancer.workExperience.findIndex(
      (exp) => exp._id.toString() === req.params.id
    );

    if (experienceIndex === -1) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    freelancer.workExperience.splice(experienceIndex, 1);

    await freelancer.save();

    return res.status(200).json({ freelancer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Update Experience
exports.updateExperience = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken._id;

    const freelancer = await Freelancer.findOne({ _id: userId });

    if (!freelancer) {
      return res.status(404).json({ error: 'User not found' });
    }

    const experienceIndex = freelancer.workExperience.findIndex(
      (exp) => exp._id.toString() === req.params.id
    );

    if (experienceIndex === -1) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    Object.assign(freelancer.workExperience[experienceIndex], req.body);

    await freelancer.save();

    return res.status(200).json({ freelancer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Add Education
exports.addEducation = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken._id;

    const freelancer = await Freelancer.findOne({ _id: userId });

    if (!freelancer) {
      return res.status(404).json({ error: 'User not found' });
    }

    freelancer.education.push(req.body);

    await freelancer.save();

    return res.status(200).json({ freelancer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Delete Experience
exports.deleteEducation = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken._id;

    const freelancer = await Freelancer.findOne({ _id: userId });

    if (!freelancer) {
      return res.status(404).json({ error: 'User not found' });
    }

    const educationIndex = freelancer.education.findIndex(
      (exp) => exp._id.toString() === req.params.id
    );

    if (educationIndex === -1) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    freelancer.education.splice(educationIndex, 1);

    await freelancer.save();

    return res.status(200).json({ freelancer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
 
// Update Experience
exports.updateEducation = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken._id;

    const freelancer = await Freelancer.findOne({ _id: userId });

    if (!freelancer) {
      return res.status(404).json({ error: 'User not found' });
    }

    const educationIndex = freelancer.education.findIndex(
      (exp) => exp._id.toString() === req.params.id
    );

    if (educationIndex === -1) {
      return res.status(404).json({ error: 'Education not found' });
    }

    Object.assign(freelancer.education[educationIndex], req.body);

    await freelancer.save();

    return res.status(200).json({ freelancer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};