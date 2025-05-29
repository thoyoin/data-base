import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';
const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    console.log('Register request:', req.body);

    try {
        const hash = await bcrypt.hash(password, 10);
        await db.execute({
            sql: 'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
            args: [email, hash, name]
        });
        res.json({ message: 'Registered successfully' });
    } catch (err) {
        console.error('Register error:', err);

        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const result = await db.execute({
        sql: 'SELECT * FROM users WHERE email = ?',
        args: [email]
    });
    const user = result.rows[0];
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    if (user.is_blocked) return res.status(403).json({ message: 'This user is blocked' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    await db.execute({
        sql: 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
        args: [user.id]
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true }).json({ message: 'Logged in' });
});

router.get('/check', async (req, res) => {
    res.set('Cache-Control', 'no-store');
    const token = req.cookies.token;
    if (!token) return res.json({ authenticated: false });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const result = await db.execute({
            sql: 'SELECT * FROM users WHERE id = ?',
            args: [decoded.id]
        });
        const user = result.rows[0];
        res.json({ authenticated: !!user, blocked: user?.is_blocked });
    } catch {
        res.json({ authenticated: false });
    }
});

export default router;
