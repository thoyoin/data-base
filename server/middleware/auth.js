import jwt from 'jsonwebtoken';
import pool from '../db.js';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: 'Not authorized' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
        const user = rows[0];

        if (!user || user.is_blocked) return res.status(403).json({ message: 'Blocked or deleted' });

        req.user = user;
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;
