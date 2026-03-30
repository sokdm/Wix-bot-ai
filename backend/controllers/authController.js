const User = require('../models/User');
const Admin = require('../models/Admin');
const { generateToken } = require('../utils/jwt');
const { success, error } = require('../utils/response');
const logger = require('../utils/logger');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, 'Please provide email and password');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return error(res, 'User already exists');
    }

    const user = new User({ email, password });
    await user.save();

    const token = generateToken({ id: user._id });
    
    logger.info(`New user registered: ${email}`);
    return success(res, { token, user: { id: user._id, email: user.email } }, 'Registration successful');
  } catch (err) {
    logger.error('Registration error:', err);
    return error(res, 'Server error', 500);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, 'Please provide email and password');
    }

    const user = await User.findOne({ email });
    if (!user) {
      return error(res, 'Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return error(res, 'Invalid credentials');
    }

    user.lastActive = new Date();
    await user.save();

    const token = generateToken({ id: user._id });
    
    logger.info(`User logged in: ${email}`);
    return success(res, { 
      token, 
      user: { 
        id: user._id, 
        email: user.email,
        isConnected: user.isConnected,
        autoReply: user.autoReply
      } 
    }, 'Login successful');
  } catch (err) {
    logger.error('Login error:', err);
    return error(res, 'Server error', 500);
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      // Create default admin if not exists
      if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const newAdmin = new Admin({ 
          email: process.env.ADMIN_EMAIL, 
          password: process.env.ADMIN_PASSWORD,
          role: 'superadmin'
        });
        await newAdmin.save();
        
        const token = generateToken({ id: newAdmin._id, role: newAdmin.role });
        return success(res, { token, admin: { email: newAdmin.email, role: newAdmin.role } }, 'Admin login successful');
      }
      return error(res, 'Invalid admin credentials');
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return error(res, 'Invalid admin credentials');
    }

    const token = generateToken({ id: admin._id, role: admin.role });
    return success(res, { token, admin: { email: admin.email, role: admin.role } }, 'Admin login successful');
  } catch (err) {
    logger.error('Admin login error:', err);
    return error(res, 'Server error', 500);
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    return success(res, user);
  } catch (err) {
    return error(res, 'Server error', 500);
  }
};
