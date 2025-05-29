import express from 'express';
import pool from '../db.js';
import auth from '../middleware/auth.js';
const router = express.Router();

router.get('/', auth, async (req, res) => {
  const [users] = await pool.query(
    'SELECT id, name, email, last_login, is_blocked, created_at FROM users ORDER BY last_login DESC'
  );
  res.json(users);
});

router.post('/block', auth, async (req, res) => {
  const { ids } = req.body;
  await pool.query('UPDATE users SET is_blocked = TRUE WHERE id IN (?)', [ids]);
  res.json({ message: 'Users blocked' });
});

router.post('/unblock', auth, async (req, res) => {
  const { ids } = req.body;
  await pool.query('UPDATE users SET is_blocked = FALSE WHERE id IN (?)', [ids]);
  res.json({ message: 'Users unblocked' });
});

router.post('/delete', auth, async (req, res) => {
  const { ids } = req.body;
  await pool.query('DELETE FROM users WHERE id IN (?)', [ids]);
  res.json({ message: 'Users deleted' });
});

export default router;
