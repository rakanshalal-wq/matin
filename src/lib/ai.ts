/**
 * lib/ai.ts — نظام AI موحد
 * يقرأ المزود الافتراضي من جدول integrations تلقائياً
 * يدعم: OpenAI, Gemini, Claude, Groq
 */

import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  text: string;
  provider: string;
  model: string;
}

// ── جلب المزود الافتراضي من قاعدة البيانات ─────────────────────────
async function getDefaultAIProvider(): Promise<{ provider: string; apiKey: string; model: string } | null> {
  try {
    // أولاً: ابحث عن مزود مفعّل وعنده is_default = true في extra_config
    const res = await pool.query(`
      SELECT name, api_key, extra_config, config
      FROM integrations
      WHERE category = 'ai' AND is_active = true
      ORDER BY
        CASE WHEN extra_config->>'is_default' = 'true' THEN 0 ELSE 1 END,
        updated_at DESC
      LIMIT 1
    `);

    if (res.rows.length === 0) {
      // fallback: استخدم OPENAI_API_KEY من .env إذا وجد
      if (process.env.OPENAI_API_KEY) {
        return { provider: 'openai', apiKey: process.env.OPENAI_API_KEY, model: 'gpt-4.1-mini' };
      }
      return null;
    }

    const row = res.rows[0];
    const extraConfig = row.extra_config || {};
    // API Key يُخزن في extra_config.api_key أو في حقل api_key المباشر
    const apiKey = extraConfig.api_key || row.api_key || '';
    const model = extraConfig.model || getDefaultModel(row.name);

    if (!apiKey) {
      if (process.env.OPENAI_API_KEY) {
        return { provider: 'openai', apiKey: process.env.OPENAI_API_KEY, model: 'gpt-4.1-mini' };
      }
      return null;
    }

    return {
      provider: row.name,
      apiKey,
      model,
    };
  } catch (err) {
    console.error('AI provider fetch error:', err);
    if (process.env.OPENAI_API_KEY) {
      return { provider: 'openai', apiKey: process.env.OPENAI_API_KEY, model: 'gpt-4.1-mini' };
    }
    return null;
  }
}

function getDefaultModel(provider: string): string {
  const defaults: Record<string, string> = {
    openai: 'gpt-4.1-mini',
    gemini: 'gemini-2.0-flash',
    claude: 'claude-3-5-haiku-20241022',
    groq: 'llama-3.3-70b-versatile',
  };
  return defaults[provider] || 'gpt-4.1-mini';
}

// ── الدالة الرئيسية: إرسال رسالة لأي مزود ──────────────────────────
export async function chat(messages: AIMessage[], options?: {
  provider?: string;
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}): Promise<AIResponse> {
  let config = options?.provider && options?.apiKey
    ? { provider: options.provider, apiKey: options.apiKey, model: options.model || getDefaultModel(options.provider) }
    : await getDefaultAIProvider();

  if (!config) {
    throw new Error('لم يتم تكوين أي مزود AI. يرجى إضافة مزود AI من قسم التكامل في لوحة التحكم.');
  }

  const { provider, apiKey, model } = config;

  switch (provider) {
    case 'openai':
      return await callOpenAI(messages, apiKey, model, options);
    case 'gemini':
      return await callGemini(messages, apiKey, model, options);
    case 'claude':
      return await callClaude(messages, apiKey, model, options);
    case 'groq':
      return await callGroq(messages, apiKey, model, options);
    default:
      return await callOpenAI(messages, apiKey, model, options);
  }
}

// ── OpenAI ──────────────────────────────────────────────────────────
async function callOpenAI(messages: AIMessage[], apiKey: string, model: string, options?: any): Promise<AIResponse> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1000,
    }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(`OpenAI Error: ${err.error?.message || response.statusText}`);
  }
  const data = await response.json();
  return { text: data.choices[0]?.message?.content || '', provider: 'openai', model };
}

// ── Google Gemini ────────────────────────────────────────────────────
async function callGemini(messages: AIMessage[], apiKey: string, model: string, options?: any): Promise<AIResponse> {
  // تحويل messages إلى صيغة Gemini
  const contents = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  const systemMsg = messages.find(m => m.role === 'system');
  const body: any = {
    contents,
    generationConfig: {
      temperature: options?.temperature ?? 0.7,
      maxOutputTokens: options?.maxTokens ?? 1000,
    },
  };
  if (systemMsg) {
    body.systemInstruction = { parts: [{ text: systemMsg.content }] };
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  );
  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Gemini Error: ${err.error?.message || response.statusText}`);
  }
  const data = await response.json();
  return { text: data.candidates?.[0]?.content?.parts?.[0]?.text || '', provider: 'gemini', model };
}

// ── Anthropic Claude ─────────────────────────────────────────────────
async function callClaude(messages: AIMessage[], apiKey: string, model: string, options?: any): Promise<AIResponse> {
  const systemMsg = messages.find(m => m.role === 'system')?.content;
  const userMessages = messages.filter(m => m.role !== 'system').map(m => ({
    role: m.role,
    content: m.content,
  }));

  const body: any = {
    model,
    max_tokens: options?.maxTokens ?? 1000,
    messages: userMessages,
  };
  if (systemMsg) body.system = systemMsg;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Claude Error: ${err.error?.message || response.statusText}`);
  }
  const data = await response.json();
  return { text: data.content?.[0]?.text || '', provider: 'claude', model };
}

// ── Groq ─────────────────────────────────────────────────────────────
async function callGroq(messages: AIMessage[], apiKey: string, model: string, options?: any): Promise<AIResponse> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1000,
    }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Groq Error: ${err.error?.message || response.statusText}`);
  }
  const data = await response.json();
  return { text: data.choices[0]?.message?.content || '', provider: 'groq', model };
}

// ── اختبار الاتصال بمزود معين ───────────────────────────────────────
export async function testAIProvider(provider: string, apiKey: string, model: string): Promise<{ success: boolean; message: string; latency?: number }> {
  const start = Date.now();
  try {
    const result = await chat(
      [{ role: 'user', content: 'قل "مرحبا" فقط' }],
      { provider, apiKey, model, maxTokens: 10 }
    );
    const latency = Date.now() - start;
    return { success: true, message: `يعمل بشكل صحيح (${latency}ms) — الرد: "${result.text.trim()}"`, latency };
  } catch (err: any) {
    return { success: false, message: `${err.message}` };
  }
}

// ── وظائف جاهزة للاستخدام في المنصة ────────────────────────────────

/** رقابة المحتوى */
export async function moderateContent(content: string): Promise<{ safety_score: number; verdict: 'safe' | 'suspicious' | 'harmful'; explanation: string }> {
  try {
    const result = await chat([
      {
        role: 'system',
        content: 'أنت نظام رقابة محتوى لمنصة تعليمية سعودية. أجب بـ JSON فقط.',
      },
      {
        role: 'user',
        content: `فحص هذا المحتوى وأعطِ {"safety_score": 0-100, "verdict": "safe|suspicious|harmful", "explanation": "سبب قصير"}:\n\n"${content.substring(0, 500)}"`,
      },
    ], { temperature: 0.1, maxTokens: 150 });

    const match = result.text.match(/\{[^}]+\}/);
    const parsed = JSON.parse(match?.[0] || '{}');
    return {
      safety_score: Math.min(100, Math.max(0, parseInt(parsed.safety_score) || 80)),
      verdict: ['safe', 'suspicious', 'harmful'].includes(parsed.verdict) ? parsed.verdict : 'safe',
      explanation: parsed.explanation || 'تم الفحص',
    };
  } catch {
    return { safety_score: 80, verdict: 'safe', explanation: 'لم يتمكن من التحليل' };
  }
}

/** توليد أسئلة اختبار */
export async function generateQuestions(topic: string, count: number = 5, difficulty: string = 'متوسط'): Promise<any[]> {
  const result = await chat([
    { role: 'system', content: 'أنت معلم خبير. أنشئ أسئلة اختبار بصيغة JSON.' },
    {
      role: 'user',
      content: `أنشئ ${count} أسئلة اختيار من متعدد عن "${topic}" بمستوى ${difficulty}. الصيغة:\n[{"question":"...","options":["أ","ب","ج","د"],"correct":0,"explanation":"..."}]`,
    },
  ], { temperature: 0.8, maxTokens: 2000 });

  const match = result.text.match(/\[[\s\S]*\]/);
  return JSON.parse(match?.[0] || '[]');
}

/** مساعد ذكي عام */
export async function askAssistant(question: string, context?: string): Promise<string> {
  const messages: AIMessage[] = [
    { role: 'system', content: 'أنت مساعد تعليمي ذكي لمنصة متين التعليمية. أجب بالعربية بشكل واضح ومختصر.' },
  ];
  if (context) messages.push({ role: 'user', content: `السياق: ${context}` });
  messages.push({ role: 'user', content: question });

  const result = await chat(messages, { temperature: 0.7, maxTokens: 500 });
  return result.text;
}
