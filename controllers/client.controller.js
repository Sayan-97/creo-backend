const Client = require('../models/client.schema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

exports.register = async (req, res) => {

  const { name = '', email = '', password = '', companyName = '' } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const client = await Client.create({
      name,
      email,
      password: hashedPassword,
      companyName
    });

    const token = jwt.sign({ _id: client._id }, process.env.JWT_SECRET);

    return res.status(200).json({
      success: true,
      data: {
        token,
        client: {
          name: client.name,
          email: client.email,
          companyName: client.companyName
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
    const client = await Client.findOne({ email });

    if (!client) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, client.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const token = jwt.sign({ _id: client._id }, process.env.JWT_SECRET);

    console.log(token)

    return res.status(200).json({
      success: true,
      data: {
        token,
        client: {
          name: client.name,
          email: client.email,
          companyName: client.companyName
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
    req.client.tokens = req.client.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.client.save();

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
