import express from 'express';
import db from '../db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const result = await db.execute({
            sql: 'SELECT id, name, email, last_login, is_blocked, created_at FROM users ORDER BY last_login DESC'
        });
        res.json(result.rows);
        } catch (err) {
        console.error('GET /users error:', err);
        res.status(500).json({ message: 'Failed to fetch users' });
        }
});

router.post('/block', auth, async (req, res) => {
    const { ids } = req.body;
    try {
        for (const id of ids) {
        await db.execute({
            sql: 'UPDATE users SET is_blocked = 1 WHERE id = ?',
            args: [id]
        });
        }
        res.json({ message: 'Users blocked' });
    } catch (err) {
        console.error('POST /users/block error:', err);
        res.status(500).json({ message: 'Failed to block users' });
    }
});

router.post('/unblock', auth, async (req, res) => {
    const { ids } = req.body;
    try {
        for (const id of ids) {
        await db.execute({
            sql: 'UPDATE users SET is_blocked = 0 WHERE id = ?',
            args: [id]
        });
        }
        res.json({ message: 'Users unblocked' });
    } catch (err) {
        console.error('POST /users/unblock error:', err);
        res.status(500).json({ message: 'Failed to unblock users' });
    }
});

router.post('/delete', auth, async (req, res) => {
  const { ids } = req.body;
    try {
        for (const id of ids) {
        await db.execute({
            sql: 'DELETE FROM users WHERE id = ?',
            args: [id]
        });
        }
        res.json({ message: 'Users deleted' });
    } catch (err) {
        console.error('POST /users/delete error:', err);
        res.status(500).json({ message: 'Failed to delete users' });
    }
});

export default router;
