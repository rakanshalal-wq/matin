import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { verifyToken } from '@/lib/auth';
import OpenAI from 'openai';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// تهيئة OpenAI بشكل lazy لتجنب خطأ البناء
let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'placeholder' });
  }
  return _openai;
}

async function getUser(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value || req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return null;
    return await verifyToken(token);
  } catch { return null; }
}

// ── GET: جلب البيانات ─────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const user = await getUser(req);
  if (!user || user.role !== 'super_admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'dashboard';
  const filter = searchParams.get('filter') || 'all';

  try {
    if (type === 'dashboard') {
      // إحصائيات
      const [statsRes, activityRes, settingsRes] = await Promise.all([
        pool.query(`
          SELECT
            (SELECT COUNT(*) FROM posts WHERE is_hidden=false AND status='approved') as active_posts,
            (SELECT COUNT(*) FROM posts WHERE is_hidden=true) as hidden_posts,
            (SELECT COUNT(*) FROM posts WHERE ai_verdict IN ('suspicious','harmful')) as flagged_posts,
            (SELECT COUNT(*) FROM content_reports WHERE status='pending') as pending_reports,
            (SELECT COUNT(*) FROM ai_moderation WHERE created_at > NOW() - INTERVAL '24 hours' AND verdict != 'safe') as ai_flags_today,
            (SELECT COUNT(*) FROM users WHERE is_community_banned=true) as banned_users
        `),
        pool.query(`
          SELECT ml.*, u.name as moderator_name
          FROM moderation_log ml
          LEFT JOIN users u ON ml.moderator_id = u.id
          ORDER BY ml.created_at DESC LIMIT 20
        `),
        pool.query(`SELECT key, value FROM moderation_settings`),
      ]);

      const settings: Record<string, string> = {};
      settingsRes.rows.forEach((r: any) => { settings[r.key] = r.value; });

      return NextResponse.json({
        success: true,
        stats: statsRes.rows[0],
        recent_activity: activityRes.rows,
        settings,
      });
    }

    if (type === 'posts') {
      let whereClause = '';
      if (filter === 'hidden') whereClause = 'WHERE p.is_hidden=true';
      else if (filter === 'flagged') whereClause = "WHERE p.ai_verdict IN ('suspicious','harmful')";
      else if (filter === 'reported') whereClause = 'WHERE p.reports_count > 0';
      else if (filter === 'pinned') whereClause = 'WHERE p.is_pinned=true';

      const res = await pool.query(`
        SELECT p.*, u.name as author_name, u.avatar as author_avatar,
          (SELECT COUNT(*) FROM content_reports cr WHERE cr.content_type='post' AND cr.content_id=p.id AND cr.status='pending') as pending_reports_count
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.id
        ${whereClause}
        ORDER BY p.created_at DESC
        LIMIT 100
      `);
      return NextResponse.json({ success: true, posts: res.rows });
    }

    if (type === 'comments') {
      let whereClause = '';
      if (filter === 'hidden') whereClause = 'WHERE c.is_hidden=true';
      else if (filter === 'flagged') whereClause = "WHERE c.ai_verdict IN ('suspicious','harmful')";
      else if (filter === 'reported') whereClause = `WHERE EXISTS (SELECT 1 FROM content_reports cr WHERE cr.content_type='comment' AND cr.content_id=c.id AND cr.status='pending')`;

      const res = await pool.query(`
        SELECT c.*, u.name as author_name,
          SUBSTRING(p.content, 1, 80) as post_content
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.id
        LEFT JOIN posts p ON c.post_id = p.id
        ${whereClause}
        ORDER BY c.created_at DESC
        LIMIT 100
      `);
      return NextResponse.json({ success: true, comments: res.rows });
    }

    if (type === 'reports') {
      const res = await pool.query(`
        SELECT cr.*,
          reporter.name as reporter_name,
          CASE
            WHEN cr.content_type='post' THEN (SELECT content FROM posts WHERE id=cr.content_id)
            WHEN cr.content_type='comment' THEN (SELECT content FROM comments WHERE id=cr.content_id)
          END as content_text,
          CASE
            WHEN cr.content_type='post' THEN (SELECT u.name FROM posts p LEFT JOIN users u ON p.user_id=u.id WHERE p.id=cr.content_id)
            WHEN cr.content_type='comment' THEN (SELECT u.name FROM comments c LEFT JOIN users u ON c.user_id=u.id WHERE c.id=cr.content_id)
          END as content_author
        FROM content_reports cr
        LEFT JOIN users reporter ON cr.reporter_id = reporter.id
        WHERE cr.status='pending'
        ORDER BY cr.created_at DESC
        LIMIT 100
      `);
      return NextResponse.json({ success: true, reports: res.rows });
    }

    if (type === 'ai_log') {
      const res = await pool.query(`
        SELECT * FROM ai_moderation
        ORDER BY created_at DESC LIMIT 100
      `);
      return NextResponse.json({ success: true, ai_log: res.rows });
    }

    if (type === 'banned_users') {
      const res = await pool.query(`
        SELECT id, name, email, avatar, is_community_banned, community_ban_reason,
          community_ban_until, warnings_count
        FROM users
        WHERE is_community_banned=true OR warnings_count > 0
        ORDER BY warnings_count DESC, community_ban_until DESC NULLS LAST
        LIMIT 100
      `);
      return NextResponse.json({ success: true, users: res.rows });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (err: any) {
    console.error('Moderation GET error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── POST: تنفيذ الإجراءات ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  const user = await getUser(req);
  if (!user || user.role !== 'super_admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { action } = body;

  try {
    // ── إخفاء منشور
    if (action === 'hide_post') {
      const { post_id, reason } = body;
      await pool.query('UPDATE posts SET is_hidden=true, hidden_reason=$1 WHERE id=$2', [reason || 'مخالفة قواعد المجتمع', post_id]);
      await logAction(pool, user.id, user.name, 'hide_post', 'post', post_id, reason);
      return NextResponse.json({ success: true, message: 'تم إخفاء المنشور' });
    }

    // ── إظهار منشور
    if (action === 'show_post') {
      const { post_id } = body;
      await pool.query('UPDATE posts SET is_hidden=false, hidden_reason=NULL WHERE id=$1', [post_id]);
      await logAction(pool, user.id, user.name, 'show_post', 'post', post_id, null);
      return NextResponse.json({ success: true, message: 'تم إظهار المنشور' });
    }

    // ── حذف منشور
    if (action === 'delete_post') {
      const { post_id, reason } = body;
      await logAction(pool, user.id, user.name, 'delete_post', 'post', post_id, reason);
      await pool.query('DELETE FROM posts WHERE id=$1', [post_id]);
      return NextResponse.json({ success: true, message: 'تم حذف المنشور نهائياً' });
    }

    // ── تثبيت منشور
    if (action === 'pin_post') {
      const { post_id } = body;
      await pool.query('UPDATE posts SET is_pinned=true WHERE id=$1', [post_id]);
      await logAction(pool, user.id, user.name, 'pin_post', 'post', post_id, null);
      return NextResponse.json({ success: true, message: 'تم تثبيت المنشور' });
    }

    // ── إلغاء تثبيت منشور
    if (action === 'unpin_post') {
      const { post_id } = body;
      await pool.query('UPDATE posts SET is_pinned=false WHERE id=$1', [post_id]);
      await logAction(pool, user.id, user.name, 'unpin_post', 'post', post_id, null);
      return NextResponse.json({ success: true, message: 'تم إلغاء تثبيت المنشور' });
    }

    // ── إخفاء تعليق
    if (action === 'hide_comment') {
      const { comment_id, reason } = body;
      await pool.query('UPDATE comments SET is_hidden=true, hidden_reason=$1 WHERE id=$2', [reason || 'مخالفة', comment_id]);
      await logAction(pool, user.id, user.name, 'hide_comment', 'comment', comment_id, reason);
      return NextResponse.json({ success: true, message: 'تم إخفاء التعليق' });
    }

    // ── إظهار تعليق
    if (action === 'show_comment') {
      const { comment_id } = body;
      await pool.query('UPDATE comments SET is_hidden=false, hidden_reason=NULL WHERE id=$1', [comment_id]);
      await logAction(pool, user.id, user.name, 'show_comment', 'comment', comment_id, null);
      return NextResponse.json({ success: true, message: 'تم إظهار التعليق' });
    }

    // ── حذف تعليق
    if (action === 'delete_comment') {
      const { comment_id } = body;
      await logAction(pool, user.id, user.name, 'delete_comment', 'comment', comment_id, null);
      await pool.query('DELETE FROM comments WHERE id=$1', [comment_id]);
      return NextResponse.json({ success: true, message: 'تم حذف التعليق' });
    }

    // ── حظر مستخدم من المجتمع
    if (action === 'ban_user') {
      const { user_id, reason } = body;
      await pool.query('UPDATE users SET is_community_banned=true, community_ban_reason=$1, community_ban_until=NOW() WHERE id=$2', [reason, user_id]);
      await logAction(pool, user.id, user.name, 'ban_user', 'user', user_id, reason);
      return NextResponse.json({ success: true, message: 'تم حظر المستخدم من المجتمع' });
    }

    // ── رفع حظر مستخدم
    if (action === 'unban_user') {
      const { user_id } = body;
      await pool.query('UPDATE users SET is_community_banned=false, community_ban_reason=NULL, community_ban_until=NULL WHERE id=$1', [user_id]);
      await logAction(pool, user.id, user.name, 'unban_user', 'user', user_id, null);
      return NextResponse.json({ success: true, message: 'تم رفع الحظر عن المستخدم' });
    }

    // ── تحذير مستخدم
    if (action === 'warn_user') {
      const { user_id, reason } = body;
      await pool.query('UPDATE users SET warnings_count = COALESCE(warnings_count,0) + 1 WHERE id=$1', [user_id]);
      await logAction(pool, user.id, user.name, 'warn_user', 'user', user_id, reason);
      return NextResponse.json({ success: true, message: 'تم إرسال تحذير للمستخدم' });
    }

    // ── معالجة بلاغ
    if (action === 'resolve_report') {
      const { report_id, resolution } = body;
      await pool.query(
        'UPDATE content_reports SET status=$1, resolved_by=$2, resolved_at=NOW() WHERE id=$3',
        [resolution, user.id, report_id]
      );
      return NextResponse.json({ success: true, message: resolution === 'resolved' ? 'تم التعامل مع البلاغ' : 'تم رفض البلاغ' });
    }

    // ── تحديث إعدادات الرقابة
    if (action === 'update_settings') {
      const { settings } = body;
      for (const [key, value] of Object.entries(settings)) {
        await pool.query(
          'INSERT INTO moderation_settings (key, value, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (key) DO UPDATE SET value=$2, updated_at=NOW()',
          [key, String(value)]
        );
      }
      return NextResponse.json({ success: true, message: 'تم حفظ إعدادات الرقابة' });
    }

    // ── فحص AI لجميع المنشورات غير المفحوصة
    if (action === 'ai_scan_all') {
      const settingsRes = await pool.query("SELECT key, value FROM moderation_settings WHERE key IN ('ai_moderation_enabled','ai_auto_hide_threshold','ai_auto_block_threshold')");
      const settings: Record<string, string> = {};
      settingsRes.rows.forEach((r: any) => { settings[r.key] = r.value; });

      if (settings.ai_moderation_enabled !== 'true') {
        return NextResponse.json({ success: false, message: 'فحص AI معطّل من الإعدادات' });
      }

      const hideThreshold = parseInt(settings.ai_auto_hide_threshold || '30');
      const blockThreshold = parseInt(settings.ai_auto_block_threshold || '10');

      // جلب المنشورات غير المفحوصة (آخر 100)
      const unscanned = await pool.query(`
        SELECT id, content FROM posts
        WHERE (ai_verdict IS NULL OR ai_verdict='unscanned')
        AND is_hidden=false
        ORDER BY created_at DESC LIMIT 50
      `);

      let scanned = 0, hidden = 0, deleted = 0;

      for (const post of unscanned.rows) {
        try {
          const result = await scanContentWithAI(post.content, 'post');
          const action_taken = result.safety_score < blockThreshold ? 'deleted' :
                               result.safety_score < hideThreshold ? 'hidden' : 'none';

          // حفظ نتيجة الفحص
          await pool.query(`
            INSERT INTO ai_moderation_log (content_type, content_id, content_preview, safety_score, verdict, ai_explanation, action_taken)
            VALUES ('post', $1, $2, $3, $4, $5, $6)
          `, [post.id, post.content.substring(0, 200), result.safety_score, result.verdict, result.explanation, action_taken]);

          // تحديث المنشور
          await pool.query(`
            UPDATE posts SET ai_verdict=$1, ai_explanation=$2, latest_ai_score=$3, ai_scanned_at=NOW()
            WHERE id=$4
          `, [result.verdict, result.explanation, result.safety_score, post.id]);

          // تنفيذ الإجراء التلقائي
          if (action_taken === 'hidden') {
            await pool.query("UPDATE posts SET is_hidden=true, hidden_reason='إخفاء تلقائي بواسطة AI' WHERE id=$1", [post.id]);
            await logAction(pool, null, 'AI System', 'hide_post', 'post', post.id, `AI Score: ${result.safety_score}% - ${result.explanation}`, true);
            hidden++;
          } else if (action_taken === 'deleted') {
            await logAction(pool, null, 'AI System', 'delete_post', 'post', post.id, `AI Score: ${result.safety_score}% - ${result.explanation}`, true);
            await pool.query('DELETE FROM posts WHERE id=$1', [post.id]);
            deleted++;
          }

          scanned++;
        } catch (e) {
          console.error('AI scan error for post', post.id, e);
        }
      }

      return NextResponse.json({
        success: true,
        message: `✅ تم فحص ${scanned} منشور — أُخفي ${hidden} وحُذف ${deleted}`,
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    console.error('Moderation POST error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── Helper: تسجيل الإجراء ─────────────────────────────────────────
async function logAction(
  pool: Pool, moderatorId: number | null, moderatorName: string,
  action: string, contentType: string, contentId: number,
  reason: string | null, isAi = false
) {
  await pool.query(`
    INSERT INTO moderation_log (moderator_id, moderator_name, action, content_type, content_id, reason, is_ai_action)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `, [moderatorId, moderatorName, action, contentType, contentId, reason, isAi]);
}

// ── Helper: فحص المحتوى بالذكاء الاصطناعي ─────────────────────────
async function scanContentWithAI(content: string, type: 'post' | 'comment') {
  const prompt = `أنت نظام رقابة محتوى لمنصة تعليمية سعودية. فحص هذا ${type === 'post' ? 'المنشور' : 'التعليق'}:

"${content.substring(0, 500)}"

قيّم المحتوى وأعطِ:
1. safety_score: رقم من 0 إلى 100 (100 = آمن تماماً، 0 = ضار جداً)
2. verdict: "safe" أو "suspicious" أو "harmful"
3. explanation: سبب قصير بالعربية (جملة واحدة)

معايير التقييم:
- المحتوى الديني المسيء أو الطائفي: 0-20
- الإساءة الشخصية أو التحرش: 0-30
- المحتوى الجنسي أو العنيف: 0-10
- الإعلانات غير المرغوبة: 20-40
- المحتوى المشبوه أو غير المناسب: 30-60
- المحتوى التعليمي الطبيعي: 70-100

أجب بـ JSON فقط: {"safety_score": 85, "verdict": "safe", "explanation": "محتوى تعليمي مناسب"}`;

  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
    max_tokens: 150,
  });

  const text = response.choices[0]?.message?.content || '{}';
  try {
    const match = text.match(/\{[^}]+\}/);
    const result = JSON.parse(match?.[0] || '{}');
    return {
      safety_score: Math.min(100, Math.max(0, parseInt(result.safety_score) || 80)),
      verdict: ['safe', 'suspicious', 'harmful'].includes(result.verdict) ? result.verdict : 'safe',
      explanation: result.explanation || 'تم الفحص',
    };
  } catch {
    return { safety_score: 80, verdict: 'safe', explanation: 'لم يتمكن من التحليل' };
  }
}
