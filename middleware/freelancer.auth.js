const jwt = require('jsonwebtoken');
const Freelancer = require('../models/freelancer.schema');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const freelancer = await Freelancer.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!freelancer) {
      throw new Error();
    }

    req.token = token;
    req.freelancer = freelancer;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Please authenticate'
    });
  }
};

module.exports = auth;
