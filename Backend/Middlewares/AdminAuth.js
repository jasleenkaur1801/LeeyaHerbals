const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User');

const ensureAuthenticated = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        return res.status(403).json({ message: 'Unauthorized, JWT token is required' });
    }
    try {
        const decoded = jwt.verify(auth, process.env.JWT_SECRET || "secret123");
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Unauthorized, JWT token wrong or expired' });
    }
}

const ensureAdmin = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user._id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    ensureAuthenticated,
    ensureAdmin
}
