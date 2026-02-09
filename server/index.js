import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { pool } from './db.js';
import jwt from 'jsonwebtoken';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Database connection placeholder
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'opticall',
//   password: 'password',
//   port: 5432,
// });

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ... imports

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const user = { name: username };
    const accessToken = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: '12h',
    });
    res.json({ accessToken });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/report', authenticateToken, async (req, res) => {
  const { type, fromDate, toDate } = req.query;

  if (!fromDate || !toDate) {
    return res.status(400).json({ error: 'Missing date range' });
  }

  try {
    let query = '';
    const values = [fromDate, toDate];

    // Using generate_series to ensure every date in the range is listed
    if (type === 'batch') {
      query = `
        WITH dates AS (
            SELECT generate_series($1::date, $2::date, '1 day'::interval)::date AS d
        )
        SELECT 
          to_char(d, 'YYYY-MM-DD') as date,
          COALESCE(bj.status, 'No Data') as status,
          count(bj.*)::int as count    
        FROM dates d
        LEFT JOIN batch_jobs bj ON d = bj.created_at::date
        GROUP BY d, bj.status
        ORDER BY d, bj.status DESC
      `;
    } else if (type === 'call') {
      query = `
        WITH dates AS (
            SELECT generate_series($1::date, $2::date, '1 day'::interval)::date AS d
        )
        SELECT 
          to_char(d, 'YYYY-MM-DD') as date, 
          COALESCE(s.call_status, 'No Data') as status, 
          count(s.*)::int as count 
        FROM dates d
        LEFT JOIN scheduler s ON d = s.processed_date
        GROUP BY d, s.call_status
        ORDER BY d, s.call_status DESC
      `;
    } else {
      return res.status(400).json({ error: 'Invalid report type' });
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
