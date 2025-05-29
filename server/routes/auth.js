import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', [email, hash, name]);
        res.json({ message: 'Registered successfully' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    if (user.is_blocked) return res.status(403).json({ message: 'This user is blocked' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true }).json({ message: 'Logged in' });
});

router.get('/check', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.json({ authenticated: false });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
        const user = rows[0];
        res.json({ authenticated: !!user, blocked: user?.is_blocked });
    } catch {
        res.json({ authenticated: false });
    }
});

export default router;
