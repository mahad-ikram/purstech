import { NextRequest, NextResponse } from 'next/server';
import {
  searchDistilledVault,
  absorbTeacherLesson,
  DistilledLesson,
  PURSTECH_TOOL_CATALOG
} from '@/lib/distilled-vault';
import { BLOG_POSTS } from '@/app/blog/data';

const tools = PURSTECH_TOOL_CATALOG;
const blogs = Object.values(BLOG_POSTS);

const TEACHER_RPM_LIMIT = 5;
const teacherRequestTimestamps: number[] = [];

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'has', 'had',
  'how', 'what', 'when', 'where', 'why', 'who', 'which', 'can', 'could',
  'should', 'would', 'will', 'does', 'did', 'are', 'was', 'were', 'check',
  'before', 'after', 'into', 'onto', 'about', 'using', 'use', 'need', 'want'
]);

function canCallGeminiTeacher() {
  const now = Date.now();
  while (teacherRequestTimestamps.length > 0 && now - teacherRequestTimestamps[0] > 60_000) {
    teacherRequestTimestamps.shift();
  }
  return teacherRequestTimestamps.length < TEACHER_RPM_LIMIT;
}

function recordTeacherCall() {
  teacherRequestTimestamps.push(Date.now());
}

// Safe GET health check (exposes booleans only, never secret values)
export async function GET(req: NextRequest) {
  const info: Record<string, unknown> = {
    status: 'ok',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    githubSyncConfigured: Boolean(process.env.GITHUB_PAT),
    privateRepo: process.env.PURSTECH_AI_PRIVATE_REPO || 'mahad-ikram/purstech-ai-engine'
  };

  if (req.nextUrl.searchParams.get('test') === '1' && process.env.GEMINI_API_KEY) {
    const model = (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY.trim()}`;
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Say OK in 2 words.' }] }],
          generationConfig: { maxOutputTokens: 20 }
        }),
        signal: AbortSignal.timeout(8000)
      });
      info.liveTestHttpStatus = r.status;
      info.liveTestResponse = (await r.text()).slice(0, 350);
    } catch (e: unknown) {
      info.liveTestError = e instanceof Error ? e.message : String(e);
    }
  }
  return NextResponse.json(info);
}

function handleConversationalIntent(query: string, historyLength: number) {
  const clean = query.toLowerCase().replace(/[^\w\s]/g, '').trim();

  if (/^(hi|hello|hey|hii+|yo|hola|salam|assalam\s*o?\s*alaikum|good\s*(morning|afternoon|evening)|howdy|sup)$/.test(clean)) {
    const replies = [
      "Hey there! 👋 What are you working on today? I can help you **remove AI watermarks**, **upscale or colorize photos**, **compress PDFs**, **audit AdSense readiness**, or answer quick math & technical questions.",
      "Hello! Great to see you on PursTech. Tell me what you need to get done—whether it's editing an image, formatting JSON, converting time zones, or troubleshooting a file—and I'll jump right in.",
      "Hi! Ready whenever you are. Drop any question, paste a calculation, or tell me what file you're working on and I'll help you solve it."
    ];
    return {
      answer: replies[historyLength % replies.length],
      recommendedTools: [
        { name: 'SynthID & C2PA Remover', slug: '/tools/synthid-remover', reason: 'Remove AI watermarks & metadata locally' },
        { name: 'AI Image Upscaler (4×)', slug: '/tools/image-upscaler', reason: 'Enhance blurry photos 4× in your browser' }
      ],
      recommendedBlogs: []
    };
  }

  if (/^(how are you|how r u|hows it going|whats up|how are u)/.test(clean)) {
    return {
      answer: "Doing great and running fast! ⚡ What can I help you build, fix, or calculate today?",
      recommendedTools: [],
      recommendedBlogs: []
    };
  }

  if (/^(thanks|thank you|thx|ty|awesome|great|nice|cool|perfect|ok|okay)$/.test(clean)) {
    return {
      answer: "Anytime! Let me know if you need help with another tool, calculation, or question.",
      recommendedTools: [],
      recommendedBlogs: []
    };
  }

  if (/(who are you|what are you|who made you|who built|about purstech|is purstech free)/.test(clean)) {
    return {
      answer:
        "I'm **PursTech Assistant**, built for **PursTech.com** (founded by Mahad Ikram). Every one of our **50+ online tools** is 100% free, requires zero login, and runs directly inside your browser so your files never leave your device.",
      recommendedTools: [
        { name: 'Browse All 50+ Tools', slug: '/tools', reason: 'Explore Image, PDF, Dev, SEO, Finance, and AI tools' }
      ],
      recommendedBlogs: []
    };
  }

  if (/^(help|what can you do|list tools|show tools|tools|categories|menu)$/.test(clean)) {
    return {
      answer:
        "Here's what I can help you with right now:\n- **AI & Image Studio:** Remove SynthID/C2PA watermarks, remove backgrounds (9 AI models), upscale 4×, or colorize old photos.\n- **PDF & Docs:** Compress, merge, split, or convert PDFs privately.\n- **Dev & SEO:** Format JSON, test regex, generate `llms.txt` / sitemaps, or audit Google AdSense readiness.\n- **Live Technical Q&A:** Ask any coding, design, prepress, math, or web question!",
      recommendedTools: [
        { name: 'Background Remover', slug: '/tools/background-remover', reason: '9-model browser AI cutout studio' },
        { name: 'PDF Compressor', slug: '/tools/pdf-compressor', reason: 'Shrink PDFs locally with zero uploads' },
        { name: 'AdSense Readiness Checker', slug: '/tools/adsense-checker', reason: '26-point Low Value Content auditor' }
      ],
      recommendedBlogs: []
    };
  }

  return null;
}

function runLocalCatalogReasoner(query: string) {
  const qLower = query.toLowerCase();
  const words = qLower
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));

  const scoredTools = tools
    .map((t) => {
      let score = 0;
      const nameLower = t.name.toLowerCase();
      const hay = `${t.name} ${t.description} ${t.category} ${t.slug}`.toLowerCase();
      for (const w of words) {
        const wb = new RegExp(`\\b${w}`, 'i');
        if (wb.test(nameLower)) score += 3;
        else if (wb.test(hay)) score += 1.2;
      }
      return { tool: t, score };
    })
    .filter((x) => x.score >= 2.4)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const scoredBlogs = blogs
    .map((b) => {
      let score = 0;
      const hay = `${b.title} ${b.excerpt} ${b.category} ${b.slug}`.toLowerCase();
      for (const w of words) {
        const wb = new RegExp(`\\b${w}`, 'i');
        if (wb.test(b.title)) score += 2.5;
        else if (wb.test(hay)) score += 1;
      }
      return { blog: b, score };
    })
    .filter((x) => x.score >= 2.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  const topScore = scoredTools[0]?.score ?? 0;
  const isComplex =
    words.length >= 4 ||
    /(why|how|compare|difference|error|fix|code|regex|formula|explain|write|best|print|cmyk|rgb|layer|transparent)/.test(qLower);

  const confidence = isComplex
    ? Math.min(0.62, topScore / 12)
    : Math.min(0.92, topScore / 6);

  return {
    confidence: Number(confidence.toFixed(2)),
    recommendedTools: scoredTools.map((x) => ({
      name: x.tool.name,
      slug: `/tools/${x.tool.slug}`,
      reason: x.tool.description
    })),
    recommendedBlogs: scoredBlogs.map((x) => ({
      title: x.blog.title,
      slug: `/blog/${x.blog.slug}`
    }))
  };
}

async function syncLessonToPrivateGithubRepo(lesson: DistilledLesson, rawQuery: string) {
  const githubPat = process.env.GITHUB_PAT;
  const privateRepo = process.env.PURSTECH_AI_PRIVATE_REPO || 'mahad-ikram/purstech-ai-engine';
  if (!githubPat) return false;

  try {
    const apiUrl = `https://api.github.com/repos/${privateRepo}/contents/data/distilled_vault.json`;
    const getRes = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${githubPat}`, Accept: 'application/vnd.github+json' }
    });

    let existingLessons: DistilledLesson[] = [];
    let sha: string | undefined;

    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
      existingLessons = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf-8'));
    }

    existingLessons.unshift(lesson);
    const updatedContent = Buffer.from(JSON.stringify(existingLessons.slice(0, 1000), null, 2)).toString('base64');

    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${githubPat}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `chore(distill): learned new solution for "${rawQuery.slice(0, 50)}"`,
        content: updatedContent,
        ...(sha ? { sha } : {})
      })
    });
    return putRes.ok;
  } catch (err) {
    console.error('GitHub vault sync failed:', err);
    return false;
  }
}

async function callGeminiWithFallback(
  apiKey: string,
  systemInstruction: string,
  contents: { role: string; parts: { text: string }[] }[]
) {
  const primaryModel = (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();
  const modelsToTry = Array.from(new Set([primaryModel, 'gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash']));

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: { temperature: 0.4, maxOutputTokens: 700, responseMimeType: 'application/json', ...(model.includes('2.5') ? { thinkingConfig: { thinkingBudget: 0 } } : {}) }
        }),
        signal: AbortSignal.timeout(14000)
      });

      if (res.ok) {
        const json = await res.json();
        const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (text) return text;
      } else {
        const errText = await res.text();
        console.error(`Gemini API error (${model}, ${res.status}):`, errText.slice(0, 300));
      }
    } catch (e) {
      console.error(`Gemini fetch failed (${model}):`, e);
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = String(body?.query || '').trim();
    const history: { role: string; text: string }[] = Array.isArray(body?.history) ? body.history : [];

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // 1. Instant natural conversational handling
    const convo = handleConversationalIntent(query, history.length);
    if (convo) {
      return NextResponse.json({
        badge: '',
        confidence: 0.99,
        answer: convo.answer,
        recommendedTools: convo.recommendedTools,
        recommendedBlogs: convo.recommendedBlogs,
        learnedNewLesson: false
      });
    }

    // 2. Semantic Knowledge Vault check
    const vaultHit = searchDistilledVault(query);
    if (vaultHit.lesson && vaultHit.score >= 0.7) {
      return NextResponse.json({
        badge: '',
        confidence: vaultHit.score,
        answer: vaultHit.lesson.answer,
        recommendedTools: vaultHit.lesson.recommendedTools,
        recommendedBlogs: vaultHit.lesson.recommendedBlogs,
        learnedNewLesson: false
      });
    }

    // 3. Local Catalog Match Evaluation (only short-circuits on simple direct tool lookups)
    const localEval = runLocalCatalogReasoner(query);
    if (localEval.confidence >= 0.85 && !body?.forceTeacher && localEval.recommendedTools.length > 0) {
      const topTool = localEval.recommendedTools[0];
      return NextResponse.json({
        badge: '',
        confidence: localEval.confidence,
        answer: `The fastest way to handle that on PursTech is with **${topTool.name}**.\n${topTool.reason} Everything runs 100% locally in your browser with zero file uploads.`,
        recommendedTools: localEval.recommendedTools,
        recommendedBlogs: localEval.recommendedBlogs,
        learnedNewLesson: false
      });
    }

    // 4. Full Conversational LLM Escalation (Gemini Free Tier @ 5 RPM max + Auto-Distillation)
    const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
    if (geminiApiKey && canCallGeminiTeacher()) {
      recordTeacherCall();
      const toolList = tools
        .slice(0, 55)
        .map((t) => `${t.name} (/tools/${t.slug})`)
        .join(', ');

      const systemInstruction = `You are PursTech Assistant, an expert, friendly, concise AI assistant on purstech.com.
Answer the user's question directly, accurately, and step-by-step.
Only include recommendedTools if a PursTech tool genuinely helps with the user's request (otherwise return an empty array []).
Respond strictly in valid JSON with this exact schema:
{
  "answer": "Clear markdown explanation with concrete steps",
  "keywords": ["4 to 7 lowercase keywords if this is a reusable technical Q&A"],
  "shouldLearn": true,
  "recommendedTools": [{"name": "Tool Name", "slug": "/tools/slug", "reason": "Short reason"}],
  "recommendedBlogs": [{"title": "Guide Title", "slug": "/blog/slug"}]
}
Available PursTech Tools: ${toolList}`;

      // Build strictly alternating user -> model -> user contents (Gemini rejects leading 'model' turns!)
      const sanitizedHistory: { role: string; parts: { text: string }[] }[] = [];
      for (const m of history.slice(-6)) {
        const mappedRole = m.role === 'assistant' ? 'model' : 'user';
        if (sanitizedHistory.length === 0 && mappedRole === 'model') continue;
        if (sanitizedHistory.length > 0 && sanitizedHistory[sanitizedHistory.length - 1].role === mappedRole) {
          sanitizedHistory[sanitizedHistory.length - 1].parts[0].text += `\n${m.text}`;
        } else {
          sanitizedHistory.push({ role: mappedRole, parts: [{ text: m.text }] });
        }
      }
      if (sanitizedHistory.length > 0 && sanitizedHistory[sanitizedHistory.length - 1].role === 'user') {
        sanitizedHistory[sanitizedHistory.length - 1].parts[0].text += `\n${query}`;
      } else {
        sanitizedHistory.push({ role: 'user', parts: [{ text: query }] });
      }

      const rawText = await callGeminiWithFallback(geminiApiKey, systemInstruction, sanitizedHistory);
      if (rawText) {
        try {
          const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
          const parsed = JSON.parse(cleaned);

          const recTools = Array.isArray(parsed.recommendedTools) ? parsed.recommendedTools : [];
          const recBlogs = Array.isArray(parsed.recommendedBlogs) ? parsed.recommendedBlogs : [];
          const shouldLearn =
            Boolean(parsed.shouldLearn) &&
            Array.isArray(parsed.keywords) &&
            parsed.keywords.length >= 3;

          let newLesson: DistilledLesson | null = null;
          if (shouldLearn) {
            newLesson = {
              id: `distill-${Date.now()}`,
              questionPattern: query,
              keywords: parsed.keywords,
              answer: parsed.answer || '',
              recommendedTools: recTools,
              recommendedBlogs: recBlogs,
              sourceTier: 'gemini-teacher-distilled',
              confidence: 0.96,
              createdAt: new Date().toISOString()
            };
            absorbTeacherLesson(newLesson);
            await syncLessonToPrivateGithubRepo(newLesson, query);
          }

          return NextResponse.json({
            badge: '',
            confidence: 0.96,
            answer: parsed.answer || "I'm here to help! What would you like to do next?",
            recommendedTools: recTools,
            recommendedBlogs: recBlogs,
            learnedNewLesson: Boolean(newLesson),
            ...(newLesson ? { distilledLesson: newLesson } : {})
          });
        } catch (parseErr) {
          console.error('Gemini JSON parse error:', parseErr);
          return NextResponse.json({
            badge: '',
            confidence: 0.9,
            answer: rawText,
            recommendedTools: localEval.recommendedTools,
            recommendedBlogs: localEval.recommendedBlogs,
            learnedNewLesson: false
          });
        }
      }
    }

    // 5. Fallback if API key is missing or rate limit hit
    if (localEval.recommendedTools.length > 0) {
      const topTool = localEval.recommendedTools[0];
      return NextResponse.json({
        badge: '',
        confidence: localEval.confidence,
        answer: `**${topTool.name}** may help with part of this task—open it below or rephrase your question for a more detailed answer.`,
        recommendedTools: localEval.recommendedTools,
        recommendedBlogs: localEval.recommendedBlogs,
        learnedNewLesson: false
      });
    }

    return NextResponse.json({
      badge: '',
      confidence: 0.5,
      answer: `I couldn't reach the AI engine for **"${query}"** right now. Try again in a few seconds, or browse our 50+ free browser tools below.`,
      recommendedTools: [
        { name: 'Browse All 50+ Tools', slug: '/tools', reason: 'Explore all 8 categories of free browser utilities' }
      ],
      recommendedBlogs: [],
      learnedNewLesson: false
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Assistant error', details: msg }, { status: 500 });
  }
}
