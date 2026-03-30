const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { error } = require('../utils/response');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return error(res, 'No token, authorization denied', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return error(res, 'Token is not valid', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    return error(res, 'Token is not valid', 401);
  }
};

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return error(res, 'No token, authorization denied', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'admin' && decoded.role !== 'superadmin') {
      return error(res, 'Admin access required', 403);
    }

    req.admin = decoded;
    next();
  } catch (err) {
    return error(res, 'Token is not valid', 401);
  }
};

module.exports = { auth, adminAuth };
