import bcrypt from 'bcryptjs';
const hash = await bcrypt.hash('Admin@2026', 10);
console.log(hash);
