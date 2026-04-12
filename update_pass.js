const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://matin:F5HC3q3qoxxKhDy84YYWWpmd@localhost:5432/matin_db_new' });
bcrypt.hash('Admin@123456', 10).then(async hash => {
  console.log('hash:', hash);
  await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hash, 'admin@matin.sa']);
  const user = await pool.query('SELECT password FROM users WHERE email = $1', ['admin@matin.sa']);
  const ok = await bcrypt.compare('Admin@123456', user.rows[0].password);
  console.log('verify:', ok, 'stored:', user.rows[0].password.substring(0, 20));
  pool.end();
}).catch(e => { console.error(e.message); pool.end(); });
