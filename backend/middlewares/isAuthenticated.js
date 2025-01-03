const { requireSession } = require('@clerk/clerk-sdk-node');

// Middleware to authenticate requests
const authMiddleware = async (req, res, next) => {
  try {
    // Automatically verifies the session and attaches the user to the request object
    await requireSession()(req, res, next);
  } catch (error) {
    res.status(401).json({ success: false, message: "Unauthorized access." });
  }
};
module.exports = {authMiddleware}