import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import pool from '@/lib/db';
import * as XLSX from 'xlsx';

// =====================================================
// API استيراد بنك الأسئلة من Excel - منصة متين
// يدعم جميع هياكل ملفات متين التعليمية:
// الهيكل 1 (12 عمود): # | الوحدة | الدرس | النوع | الصعوبة | المهارة | السؤال | أ | ب | ج | د | الإجابة
// الهيكل 2 (11 عمود): # | القسم | الدرس | النوع | الصعوبة | السؤال | أ | ب | ج | د | الإجابة
// الهيكل 3 (9 عمود):  # | القسم | الدرس | النوع | الصعوبة | السؤال | أ | ب | الإجابة
// =====================================================

const DIFFICULTY_MAP: Record<string, string> = {
  'سهل': 'easy', 'سهلة': 'easy', 'easy': 'easy', 'Easy': 'easy',
  'متوسط': 'medium', 'متوسطة': 'medium', 'medium': 'medium', 'Medium': 'medium',
  'صعب': 'hard', 'صعبة': 'hard', 'hard': 'hard', 'Hard': 'hard',
  'صعب جداً': 'hard', 'صعب جدا': 'hard',
};

function detectStructure(headers: string[]): 'type1' | 'type2' | 'type3' {
  const hasSkill = headers.some(h => h.includes('مهارة') || h.includes('المهارة') || h.includes('skill');
  const colCount = headers.filter(h => h.trim().length;
  
  if (hasSkill || colCount >= 12) return 'type1';
  if (colCount <= 9) return 'type3';
  return 'type2';
}

function parseQuestionRow(
  row: any[],
  structure: 'type1' | 'type2' | 'type3'
): {
  lesson: string;
  questionType: string;
  difficulty: string;
  questionText: string;
  options: Record<string, string>;
  correctAnswer: string;
} | null {
  const get = (i: number): string => {
    const v = row[i];
    if (v === null || v === undefined) return '';
    return String(v).trim();
  };

  let lesson = '', questionType = '', difficulty = '', questionText = '';
  let optA = '', optB = '', optC = '', optD = '', correctAnswer = '';

  if (structure === 'type1') {
    // # | الوحدة | الدرس | النوع | الصعوبة | المهارة | السؤال | أ | ب | ج | د | الإجابة
    lesson = get(2);
    questionType = get(3);
    difficulty = get(4);
    // عمود 5 = المهارة (نتجاهله)
    questionText = get(6);
    optA = get(7);
    optB = get(8);
    optC = get(9);
    optD = get(10);
    correctAnswer = get(11);
  } else if (structure === 'type2') {
    // # | القسم | الدرس | النوع | الصعوبة | السؤال | أ | ب | ج | د | الإجابة
    lesson = get(2);
    questionType = get(3);
    difficulty = get(4);
    questionText = get(5);
    optA = get(6);
    optB = get(7);
    optC = get(8);
    optD = get(9);
    correctAnswer = get(10);
  } else {
    // type3: # | القسم | الدرس | النوع | الصعوبة | السؤال | أ | ب | الإجابة
    lesson = get(2);
    questionType = get(3);
    difficulty = get(4);
    questionText = get(5);
    optA = get(6);
    optB = get(7);
    correctAnswer = get(8);
  }

  if (!questionText || questionText === 'None' || questionText === 'undefined') return null;

  const options: Record<string, string> = {};
  if (optA) options['أ'] = optA;
  if (optB) options['ب'] = optB;
  if (optC) options['ج'] = optC;
  if (optD) options['د'] = optD;

  return {
    lesson,
    questionType: questionType || 'اختيار من متعدد',
    difficulty: DIFFICULTY_MAP[difficulty] || 'medium',
    questionText,
    options,
    correctAnswer,
  };
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    if (!['super_admin', 'owner', 'admin', 'teacher'].includes(user.role)) {
      return NextResponse.json({ error: 'ليس لديك صلاحية استيراد الأسئلة' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const subject = (formData.get('subject') as string || '').trim();
    const grade = (formData.get('grade') as string || '').trim();
    const replaceExisting = formData.get('replace') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'لم يتم رفع ملف' }, { status: 400 });
    }
    if (!subject) {
      return NextResponse.json({ error: 'يجب تحديد المادة الدراسية' }, { status: 400 });
    }
    if (!grade) {
      return NextResponse.json({ error: 'يجب تحديد الصف الدراسي' }, { status: 400 });
    }

    // قراءة الملف
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });

    let totalImported = 0;
    let totalSkipped = 0;
    const sheetResults: Array<{ sheet: string; imported: number; skipped: number; structure: string }> = [];
    const sampleErrors: string[] = [];

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // حذف الأسئلة القديمة إذا طُلب الاستبدال
      if (replaceExisting) {
        await client.query(
          `DELETE FROM question_bank WHERE subject = $1 AND grade = $2`,
          [subject, grade]
        );
      }

      for (const sheetName of workbook.SheetNames) {
        // تجاهل أوراق الملخص
        if (/ملخص|summary|cover|غلاف/i.test(sheetName) continue;

        const worksheet = workbook.Sheets[sheetName];
        const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: null,
          raw: false,
        });

        if (rows.length < 4) continue;

        // تحديد الفصل الدراسي من اسم الورقة
        let semester = '1';
        if (/ثاني|second|2/i.test(sheetName) semester = '2';
        else if (/أول|first|1/i.test(sheetName) semester = '1';

        // إيجاد صف الرؤوس (أول صف يحتوي على "السؤال" أو "الصعوبة")
        let headerRowIndex = 2; // افتراضي: الصف الثالث
        for (let i = 0; i < Math.min(6, rows.length); i++) {
          const row = rows[i] || [];
          const rowText = row.map(c => String(c || '').join(' ');
          if (/السؤال|الصعوبة|نوع السؤال|question/i.test(rowText) ) {
            headerRowIndex = i;
            break;
          }
        }

        const headers = (rows[headerRowIndex] || []).map(h => String(h || '').trim();
        const structure = detectStructure(headers);

        let sheetImported = 0;
        let sheetSkipped = 0;

        for (let i = headerRowIndex + 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || !row[0]) continue;

          // التحقق من أن العمود الأول رقم صحيح
          const rowNum = String(row[0]).trim();
          if (!rowNum || !/^\d+$/.test(rowNum) continue;

          const parsed = parseQuestionRow(row, structure);
          if (!parsed) {
            sheetSkipped++;
            continue;
          }

          try {
            await client.query(`
              INSERT INTO question_bank 
              (subject, grade, semester, lesson, question_type, difficulty, 
               question_text, options, correct_answer, created_by, created_at, updated_at)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()
            `, [
              subject,
              grade,
              semester,
              parsed.lesson,
              parsed.questionType,
              parsed.difficulty,
              parsed.questionText,
              JSON.stringify(parsed.options),
              parsed.correctAnswer,
              user.id,
            ]);
            sheetImported++;
          } catch (err: any) {
            sheetSkipped++;
            if (sampleErrors.length < 3) {
              sampleErrors.push(`ورقة "${sheetName}" - صف ${i + 1}: ${err.message}`);
            }
          }
        }

        sheetResults.push({
          sheet: sheetName,
          imported: sheetImported,
          skipped: sheetSkipped,
          structure,
        });
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

    // إحصائيات بعد الاستيراد
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN difficulty = 'easy' THEN 1 END) as easy,
        COUNT(CASE WHEN difficulty = 'medium' THEN 1 END) as medium,
        COUNT(CASE WHEN difficulty = 'hard' THEN 1 END) as hard
      FROM question_bank 
      WHERE subject = $1 AND grade = $2
    `, [subject, grade]);

    return NextResponse.json({
      success: true,
      message: `تم استيراد ${totalImported} سؤال بنجاح من ${sheetResults.length} ورقة`,
      imported: totalImported,
      skipped: totalSkipped,
      sheets: sheetResults,
      bankStats: statsResult.rows[0],
      errors: sampleErrors.length > 0 ? sampleErrors : undefined,
    });

  } catch (error: any) {
    console.error('[Import Excel] Error:', error);
    return NextResponse.json(
      { error: 'فشل استيراد الملف: ' + error.message },
      { status: 500 }
    );
  }
}

// GET: إحصائيات بنك الأسئلة حسب المادة والصف
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const result = await pool.query(`
      SELECT 
        subject,
        grade,
        COUNT(*) as total,
        COUNT(CASE WHEN difficulty = 'easy' THEN 1 END) as easy,
        COUNT(CASE WHEN difficulty = 'medium' THEN 1 END) as medium,
        COUNT(CASE WHEN difficulty = 'hard' THEN 1 END) as hard,
        COUNT(CASE WHEN semester = '1' THEN 1 END) as semester1,
        COUNT(CASE WHEN semester = '2' THEN 1 END) as semester2
      FROM question_bank
      GROUP BY subject, grade
      ORDER BY subject, grade
    `);

    const total = await pool.query('SELECT COUNT(*) as count FROM question_bank');

    return NextResponse.json({
      total: parseInt(total.rows[0].count),
      bySubjectGrade: result.rows,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'فشل: ' + error.message }, { status: 500 });
  }
}
