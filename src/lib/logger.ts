/**
 * Logger مخصص للسيرفر — يعمل فقط في server-side
 * يُستخدم بدلاً من console.log/info/warn/error مباشرةً
 */

const isProd = process.env.NODE_ENV === 'production';
const isServer = typeof window === 'undefined';

function formatMsg(level: string, tag: string, msg: unknown): string {
  const ts = new Date().toISOString();
  const data = typeof msg === 'object' ? JSON.stringify(msg) : String(msg);
  return `[${ts}] [${level}] ${tag} — ${data}`;
}

export const logger = {
  info(tag: string, msg: unknown) {
    if (!isServer) return;
    process.stdout.write(formatMsg('INFO', tag, msg) + '\n');
  },
  warn(tag: string, msg: unknown) {
    if (!isServer) return;
    process.stderr.write(formatMsg('WARN', tag, msg) + '\n');
  },
  error(tag: string, msg: unknown) {
    if (!isServer) return;
    process.stderr.write(formatMsg('ERROR', tag, msg) + '\n');
  },
  debug(tag: string, msg: unknown) {
    if (!isServer || isProd) return;
    process.stdout.write(formatMsg('DEBUG', tag, msg) + '\n');
  },
};
