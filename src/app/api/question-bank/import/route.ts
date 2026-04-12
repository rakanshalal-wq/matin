import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import pool from '@/lib/db';
import ExcelJS from 'exceljs';

// =====================================================
// API استيراد بنك الأسئلة من Excel — منصة متين
// يدعم جميع المراحل والمسارات وفق وزارة التعليم السعودية 1445هـ
//
// الهيكل الجديد (نموذج متين الرسمي):
//   رقم | المرحلة | الصف | المسار | المادة | الوحدة | الموضوع | نص السؤال | نوع السؤال | أ | ب | ج | د | الإجابة | الشرح | الصعوبة | بلوم | الدرجة | الوقت | كلمات مفتاحية | ملاحظات
//
// الهياكل القديمة (متوافق مع الإصدارات السابقة):
//   type1 (12 عمود): # | الوحدة | الدرس | النوع | الصعوبة | المهارة | السؤال | أ | ب | ج | د | الإجابة
//   type2 (11 عمود): # | القسم  | الدرس | النوع | الصعوبة | السؤال  | أ | ب | ج | د | الإجابة
//   type3 (9 عمود):  # | القسم  | الدرس | النوع | الصعوبة | السؤال  | أ | ب | الإجابة
// =====================================================

const DIFFICULTY_MAP: Record<string, string> = {
  'سهل': 'easy', 'سهلة': 'easy', 'easy': 'easy', 'Easy': 'easy',
  'متوسط': 'medium', 'متوسطة': 'medium', 'medium': 'medium', 'Medium': 'medium',
  'صعب': 'hard', 'صعبة': 'hard', 'hard': 'hard', 'Hard': 'hard',
  'صعب جداً': 'hard', 'صعب جدا': 'hard',
};

const QUESTION_TYPE_MAP: Record<string, string> = {
  'MCQ': 'mcq', 'اختيار من متعدد': 'mcq', 'اختيار': 'mcq', 'mcq': 'mcq',
  'True/False': 'true_false', 'صح وخطأ': 'true_false', 'صح أو خطأ': 'true_false', 'true_false': 'true_false',
  'Essay': 'essay', 'مقالي': 'essay', 'تفصيلي': 'essay', 'essay': 'essay',
  'Short Answer': 'short_answer', 'إجابة قصيرة': 'short_answer', 'short_answer': 'short_answer',
  'Fill Blank': 'fill_blank', 'إكمال الفراغ': 'fill_blank', 'أكمل الفراغ': 'fill_blank', 'fill_blank': 'fill_blank',
  'Matching': 'matching', 'مطابقة': 'matching', 'matching': 'matching',
};

type StructureType = 'matin_new' | 'type1' | 'type2' | 'type3';

function detectStructure(headers: string[]): StructureType {
  const h = headers.map(x => String(x || '').trim());
  if (h.some(x => x.includes('المرحلة') || x.includes('المسار'))) return 'matin_new';
  const hasSkill = h.some(x => x.includes('مهارة') || x.includes('skill'));
  const colCount = h.filter(x => x).length;
  if (hasSkill || colCount >= 12) return 'type1';
  if (colCount <= 9) return 'type3';
  return 'type2';
}

interface ParsedQuestion {
  stage: string; grade: string; track: string; subject: string;
  lesson: string; questionType: string; difficulty: string;
  questionText: string; options: Record<string, string>;
  correctAnswer: string; explanation: string; tags: string[];
}

function parseQuestionRow(
  row: any[], structure: StructureType,
  defaultSubject: string, defaultGrade: string,
  defaultTrack: string, defaultStage: string,
): ParsedQuestion | null {
  const get = (i: number): string => {
    const v = row[i];
    if (v === null || v === undefined) return '';
    return String(v).trim();
  };

  let stage = defaultStage, grade = defaultGrade, track = defaultTrack;
  let subject = defaultSubject, lesson = '', questionType = '', difficulty = '';
  let questionText = '', optA = '', optB = '', optC = '', optD = '', correctAnswer = '';
  let explanation = '', tags: string[] = [];

  if (structure === 'matin_new') {
    stage = get(1) || defaultStage;
    grade = get(2) || defaultGrade;
    track = get(3) || defaultTrack;
    subject = get(4) || defaultSubject;
    lesson = get(5);
    const topic = get(6);
    if (topic) lesson = lesson ? `${lesson} — ${topic}` : topic;
    questionText = get(7);
    questionType = get(8);
    optA = get(9); optB = get(10); optC = get(11); optD = get(12);
    correctAnswer = get(13);
    explanation = get(14);
    difficulty = get(15);
    const tagsRaw = get(19);
    tags = tagsRaw ? tagsRaw.split(/[,،]/).map((t: string) => t.trim()).filter(Boolean) : [];
  } else if (structure === 'type1') {
    lesson = get(2); questionType = get(3); difficulty = get(4);
    questionText = get(6); optA = get(7); optB = get(8); optC = get(9); optD = get(10); correctAnswer = get(11);
  } else if (structure === 'type2') {
    lesson = get(2); questionType = get(3); difficulty = get(4);
    questionText = get(5); optA = get(6); optB = get(7); optC = get(8); optD = get(9); correctAnswer = get(10);
  } else {
    lesson = get(2); questionType = get(3); difficulty = get(4);
    questionText = get(5); optA = get(6); optB = get(7); correctAnswer = get(8);
  }

  if (!questionText || questionText === 'None' || questionText === 'undefined') return null;

  const options: Record<string, string> = {};
  if (optA) options['أ'] = optA;
  if (optB) options['ب'] = optB;
  if (optC) options['ج'] = optC;
  if (optD) options['د'] = optD;

  return {
    stage: stage || 'غير محدد', grade: grade || defaultGrade,
    track: track || 'عام', subject: subject || defaultSubject,
    lesson, questionType: QUESTION_TYPE_MAP[questionType] || questionType || 'mcq',
    difficulty: DIFFICULTY_MAP[difficulty] || 'medium',
    questionText, options, correctAnswer, explanation, tags,
  };
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner', 'admin', 'teacher'].includes(user.role)) {
      return NextResponse.json({ error: 'ليس لديك صلاحية استيراد الأسئلة' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const subject = (formData.get('subject') as string || '').trim();
    const grade = (formData.get('grade') as string || '').trim();
    const track = (formData.get('track') as string || 'عام').trim();
    const stage = (formData.get('stage') as string || '').trim();
    const replaceExisting = formData.get('replace') === 'true';

    if (!file) return NextResponse.json({ error: 'لم يتم رفع ملف' }, { status: 400 });
    if (!subject) return NextResponse.json({ error: 'يجب تحديد المادة الدراسية' }, { status: 400 });
    if (!grade) return NextResponse.json({ error: 'يجب تحديد الصف الدراسي' }, { status: 400 });

    const buffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (workbook.xlsx as any).load(Buffer.from(new Uint8Array(buffer)));

    let totalImported = 0, totalSkipped = 0;
    const sheetResults: Array<{ sheet: string; imported: number; skipped: number; structure: string }> = [];
    const sampleErrors: string[] = [];

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      if (replaceExisting) {
        if (track && track !== 'عام') {
          await client.query(`DELETE FROM question_bank WHERE subject = $1 AND grade = $2 AND track = $3`, [subject, grade, track]);
        } else {
          await client.query(`DELETE FROM question_bank WHERE subject = $1 AND grade = $2`, [subject, grade]);
        }
      }

      for (const worksheet of workbook.worksheets) {
        const sheetName = worksheet.name;
        if (/ملخص|summary|cover|غلاف|تعليمات|instructions|مرجع|reference/i.test(sheetName)) continue;

        // Convert exceljs worksheet to 2D array (same format as before)
        const rows: any[][] = [];
        for (let r = 1; r <= worksheet.rowCount; r++) {
          const row = worksheet.getRow(r);
          rows.push((row.values as any[]).slice(1));
        }
        if (rows.length < 3) continue;

        let semester = '1';
        if (/ثاني|second|2/i.test(sheetName)) semester = '2';

        let headerRowIndex = 1;
        for (let i = 0; i < Math.min(6, rows.length); i++) {
          const rowText = (rows[i] || []).map((c: any) => String(c || '')).join(' ');
          if (/السؤال|الصعوبة|نوع السؤال|question|المرحلة|المسار/i.test(rowText)) {
            headerRowIndex = i; break;
          }
        }

        const headers = (rows[headerRowIndex] || []).map((h: any) => String(h || '').trim());
        const structure = detectStructure(headers);
        let sheetImported = 0, sheetSkipped = 0;

        for (let i = headerRowIndex + 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || !row[0]) continue;
          const rowNum = String(row[0]).trim();
          if (!rowNum || !/^\d+$/.test(rowNum)) continue;

          const parsed = parseQuestionRow(row, structure, subject, grade, track, stage);
          if (!parsed) { sheetSkipped++; continue; }

          try {
            await client.query(`
              INSERT INTO question_bank (
                school_id, subject, grade, stage, track, semester, lesson,
                question_type, difficulty, question_text, options, correct_answer,
                explanation, tags, created_by, status, created_at, updated_at
              ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'locked',NOW(),NOW())
            `, [
              user.school_id || null,
              parsed.subject, parsed.grade, parsed.stage, parsed.track,
              semester, parsed.lesson, parsed.questionType, parsed.difficulty,
              parsed.questionText, JSON.stringify(parsed.options), parsed.correctAnswer,
              parsed.explanation || null,
              parsed.tags.length > 0 ? JSON.stringify(parsed.tags) : null,
              user.id,
            ]);
            sheetImported++;
          } catch (err: any) {
            sheetSkipped++;
            if (sampleErrors.length < 3) sampleErrors.push(`ورقة "${sheetName}" - صف ${i + 1}: ${err.message}`);
          }
        }

        sheetResults.push({ sheet: sheetName, imported: sheetImported, skipped: sheetSkipped, structure });
        totalImported += sheetImported;
        totalSkipped += sheetSkipped;
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

    const statsResult = await pool.query(`
      SELECT COUNT(*) as total,
        COUNT(CASE WHEN difficulty = 'easy'   THEN 1 END) as easy,
        COUNT(CASE WHEN difficulty = 'medium' THEN 1 END) as medium,
        COUNT(CASE WHEN difficulty = 'hard'   THEN 1 END) as hard
      FROM question_bank WHERE subject = $1 AND grade = $2
    `, [subject, grade]);

    return NextResponse.json({
      success: true,
      message: `تم استيراد ${totalImported} سؤال بنجاح من ${sheetResults.length} ورقة`,
      imported: totalImported, skipped: totalSkipped,
      sheets: sheetResults, bankStats: statsResult.rows[0],
      errors: sampleErrors.length > 0 ? sampleErrors : undefined,
    });

  } catch (error: any) {
    console.error('[Import Excel] Error:', error);
    return NextResponse.json({ error: 'فشل استيراد الملف: ' + error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const result = await pool.query(`
      SELECT subject, grade,
        COALESCE(track, 'عام') as track,
        COALESCE(stage, '') as stage,
        COUNT(*) as total,
        COUNT(CASE WHEN difficulty = 'easy'   THEN 1 END) as easy,
        COUNT(CASE WHEN difficulty = 'medium' THEN 1 END) as medium,
        COUNT(CASE WHEN difficulty = 'hard'   THEN 1 END) as hard,
        COUNT(CASE WHEN semester = '1' THEN 1 END) as semester1,
        COUNT(CASE WHEN semester = '2' THEN 1 END) as semester2
      FROM question_bank
      GROUP BY subject, grade, track, stage
      ORDER BY stage, grade, subject
    `);

    const total = await pool.query('SELECT COUNT(*) as count FROM question_bank');
    return NextResponse.json({ total: parseInt(total.rows[0].count), bySubjectGrade: result.rows });
  } catch (error: any) {
    return NextResponse.json({ error: 'فشل: ' + error.message }, { status: 500 });
  }
}
