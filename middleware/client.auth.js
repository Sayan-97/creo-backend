const jwt = require('jsonwebtoken');
const Client = require('../models/client.schema');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const client = await Client.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!client) {
      throw new Error();
    }

    req.token = token;
    req.client = client;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

module.exports = auth;
