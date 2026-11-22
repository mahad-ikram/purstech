// app/api/ai-chat/route.ts
// 4-Layer Self-Distilling Hybrid AI Router for PursTech
// Layer 1: Instant Client-Side Solvers (runs in browser <5ms)
// Layer 2: Self-Learning Distilled Semantic Vault (lib/distilled-vault.ts)
// Layer 3: Custom PursTech-1.5B Student LLM (hosted on Free 16GB RAM HuggingFace Space via mahad-ikram/purstech-ai-engine)
// Layer 4: 5 RPM Gemini Free-Tier Teacher Escalation + Auto-Distillation & GitHub Private Repo Sync

import { NextRequest, NextResponse } from 'next/server';
import { searchDistilledVault, absorbTeacherLesson, DistilledLesson, PURSTECH_TOOL_CATALOG } from '@/lib/distilled-vault';
import { BLOG_POSTS } from '@/app/blog/data';

const tools = PURSTECH_TOOL_CATALOG;
const blogs = Object.values(BLOG_POSTS);

// Sliding-window 60-second rate limiter capped at 5 Requests Per Minute (5 RPM) for Gemini Free Tier
const TEACHER_RPM_LIMIT = 5;
const teacherRequestTimestamps: number[] = [];

function canCallGeminiTeacher(): { allowed: boolean; retryAfterSeconds: number; remainingRpm: number } {
  const now = Date.now();
  while (teacherRequestTimestamps.length > 0 && now - teacherRequestTimestamps[0] > 60_000) {
    teacherRequestTimestamps.shift();
  }
  if (teacherRequestTimestamps.length >= TEACHER_RPM_LIMIT) {
    const oldest = teacherRequestTimestamps[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((60_000 - (now - oldest)) / 1000));
    return { allowed: false, retryAfterSeconds, remainingRpm: 0 };
  }
  return {
    allowed: true,
    retryAfterSeconds: 0,
    remainingRpm: TEACHER_RPM_LIMIT - teacherRequestTimestamps.length
  };
}

function recordTeacherCall(): void {
  teacherRequestTimestamps.push(Date.now());
}

// Local Student Keyword + Catalog Reasoner when external HF Space is not yet configured
function runLocalStudentCatalogReasoner(query: string) {
  const qLower = query.toLowerCase();
  const words = qLower.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2);

  const scoredTools = tools
    .map((t) => {
      let score = 0;
      const hay = `${t.name} ${t.description} ${t.category} ${t.slug}`.toLowerCase();
      for (const w of words) {
        if (t.name.toLowerCase().includes(w)) score += 3;
        else if (hay.includes(w)) score += 1.2;
      }
      return { tool: t, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const scoredBlogs = blogs
    .map((b) => {
      let score = 0;
      const hay = `${b.title} ${b.excerpt} ${b.category} ${b.slug}`.toLowerCase();
      for (const w of words) {
        if (b.title.toLowerCase().includes(w)) score += 2.5;
        else if (hay.includes(w)) score += 1;
      }
      return { blog: b, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  const topScore = scoredTools[0]?.score ?? 0;
  // Confidence calculation: high if clear tool match, lower (<0.75) for tough multi-part or open-ended technical queries
  const isComplexQuestion =
    words.length >= 9 ||
    qLower.includes('why') ||
    qLower.includes('compare') ||
    qLower.includes('difference') ||
    qLower.includes('error') ||
    qLower.includes('fix') ||
    qLower.includes('code') ||
    qLower.includes('regex') ||
    qLower.includes('formula');

  const confidence = isComplexQuestion
    ? Math.min(0.68, topScore / 12)
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

// Optional automatic sync to the user's private GitHub repo (mahad-ikram/purstech-ai-engine)
async function syncLessonToPrivateGithubRepo(lesson: DistilledLesson, rawQuery: string) {
  const githubPat = process.env.GITHUB_PAT;
  const privateRepo = process.env.PURSTECH_AI_PRIVATE_REPO || 'mahad-ikram/purstech-ai-engine';
  if (!githubPat) return false;

  try {
    const filePath = 'data/distilled_vault.json';
    const apiUrl = `https://api.github.com/repos/${privateRepo}/contents/${filePath}`;
    const getRes = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${githubPat}`,
        Accept: 'application/vnd.github+json'
      }
    });

    let existingLessons: DistilledLesson[] = [];
    let sha: string | undefined;

    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
      const decoded = Buffer.from(fileData.content, 'base64').toString('utf-8');
      existingLessons = JSON.parse(decoded);
    }

    existingLessons.unshift(lesson);
    const updatedContent = Buffer.from(JSON.stringify(existingLessons.slice(0, 1000), null, 2)).toString('base64');

    await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${githubPat}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `chore(distill): learned new Teacher solution for "${rawQuery.slice(0, 50)}"`,
        content: updatedContent,
        ...(sha ? { sha } : {})
      })
    });
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = String(body?.query || '').trim();
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // STEP 1: Check Layer 2 Self-Learning Distilled Semantic Vault (<15ms, $0.00)
    const vaultHit = searchDistilledVault(query);
    if (vaultHit.lesson && vaultHit.score >= 0.65) {
      return NextResponse.json({
        layer: 'layer-2-distilled-vault',
        badge: '',
        confidence: vaultHit.score,
        answer: vaultHit.lesson.answer,
        recommendedTools: vaultHit.lesson.recommendedTools,
        recommendedBlogs: vaultHit.lesson.recommendedBlogs,
        learnedNewLesson: false
      });
    }

    // STEP 2: Check Layer 3 External Private AI Engine (HuggingFace Space 16GB RAM Student LLM) if configured
    const aiEngineUrl = process.env.PURSTECH_AI_ENGINE_URL;
    if (aiEngineUrl) {
      try {
        const engineRes = await fetch(`${aiEngineUrl.replace(/\/$/, '')}/v1/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(process.env.PURSTECH_AI_SECRET
              ? { Authorization: `Bearer ${process.env.PURSTECH_AI_SECRET}` }
              : {})
          },
          body: JSON.stringify({ query }),
          signal: AbortSignal.timeout(8000)
        });
        if (engineRes.ok) {
          const engineData = await engineRes.json();
          if (engineData.learnedLesson) {
            absorbTeacherLesson(engineData.learnedLesson);
          }
          return NextResponse.json(engineData);
        }
      } catch {
        // Gracefully fall through to local Student + Layer 4 Teacher escalation
      }
    }

    // STEP 3: Run Local Student Catalog Reasoner & Evaluate Confidence
    const studentEval = runLocalStudentCatalogReasoner(query);

    // If Student confidence is high (>= 0.75) and no Teacher escalation is forced, return Student response
    if (studentEval.confidence >= 0.75 && !body?.forceTeacher) {
      const topTool = studentEval.recommendedTools[0];
      return NextResponse.json({
        layer: 'layer-3-purstech-student',
        badge: '',
        confidence: studentEval.confidence,
        answer: topTool
          ? `Based on your request, the best privacy-first tool on PursTech is **${topTool.name}** (\`${topTool.slug}\`).\n\n**How it solves this:** ${topTool.reason} Everything processes 100% locally inside your browser with zero file uploads.`
          : 'I matched your request against our 55+ browser-based utilities. Check the recommended tools and guides below.',
        recommendedTools: studentEval.recommendedTools,
        recommendedBlogs: studentEval.recommendedBlogs,
        learnedNewLesson: false
      });
    }

    // STEP 4: Layer 4 Escalation — Tough Query (<0.75 Confidence) -> Ask Gemini Free Tier Teacher (5 RPM Limit)
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const rateCheck = canCallGeminiTeacher();

    if (geminiApiKey && rateCheck.allowed) {
      recordTeacherCall();
      const toolCatalogSummary = tools
        .slice(0, 55)
        .map((t) => `${t.name} (/tools/${t.slug}): ${t.description}`)
        .join('\n');

      const systemInstruction = `You are the Master Teacher Model training PursTech-LM (purstech.com, founded by Muhammad Mahad Ikram).
A visitor asked a tough technical question where the Student model had low confidence (${studentEval.confidence}).
Provide a descriptive, accurate, step-by-step master answer AND map the solution to PursTech's 55 free browser-based tools.
Respond strictly in valid JSON with this schema:
{
  "answer": "Clear markdown explanation with actionable steps",
  "keywords": ["5 to 8 lowercase search keywords for semantic caching so PursTech-LM learns this permanently"],
  "recommendedTools": [{"name": "Tool Name", "slug": "/tools/slug", "reason": "Why this tool helps"}],
  "recommendedBlogs": [{"title": "Guide Title", "slug": "/blog/slug"}]
}

Available PursTech Tools:
${toolCatalogSummary}`;

      try {
        const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;
        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemInstruction }] },
            contents: [{ role: 'user', parts: [{ text: query }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json'
            }
          }),
          signal: AbortSignal.timeout(12000)
        });

        if (geminiRes.ok) {
          const geminiJson = await geminiRes.json();
          const rawText = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
          const parsed = JSON.parse(rawText);

          const newLesson: DistilledLesson = {
            id: `distill-${Date.now()}`,
            questionPattern: query,
            keywords: Array.isArray(parsed.keywords)
              ? parsed.keywords
              : query.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3),
            answer: parsed.answer || 'Here is the step-by-step solution using PursTech utilities.',
            recommendedTools:
              Array.isArray(parsed.recommendedTools) && parsed.recommendedTools.length > 0
                ? parsed.recommendedTools
                : studentEval.recommendedTools,
            recommendedBlogs:
              Array.isArray(parsed.recommendedBlogs) && parsed.recommendedBlogs.length > 0
                ? parsed.recommendedBlogs
                : studentEval.recommendedBlogs,
            sourceTier: 'gemini-teacher-distilled',
            confidence: 0.96,
            createdAt: new Date().toISOString()
          };

          // Absorb into runtime memory & optionally push to private GitHub repo
          absorbTeacherLesson(newLesson);
          await syncLessonToPrivateGithubRepo(newLesson, query);

          return NextResponse.json({
            layer: 'layer-4-gemini-teacher-distilled',
            badge: '',
            confidence: 0.96,
            answer: newLesson.answer,
            recommendedTools: newLesson.recommendedTools,
            recommendedBlogs: newLesson.recommendedBlogs,
            learnedNewLesson: true,
            distilledLesson: newLesson
          });
        }
      } catch {
        // Fall through to graceful Student synthesis if Teacher network request fails
      }
    }

    // Fallback when GEMINI_API_KEY is not yet set or 5 RPM window is cooling down
    const topTool = studentEval.recommendedTools[0];
    return NextResponse.json({
      layer: 'layer-3-student-fallback',
      badge: !rateCheck.allowed
        ? `⏳ Student Mode (Teacher 5 RPM cooldown: ${rateCheck.retryAfterSeconds}s)`
        : '🤖 PursTech-LM Local Student',
      confidence: studentEval.confidence,
      answer: topTool
        ? `Here is the closest match from PursTech's 55+ local browser utilities: **${topTool.name}** (\`${topTool.slug}\`) — ${topTool.reason}`
        : 'Explore our recommended browser-based utilities and comparison guides below to solve this task with 100% client-side privacy.',
      recommendedTools: studentEval.recommendedTools,
      recommendedBlogs: studentEval.recommendedBlogs,
      learnedNewLesson: false
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'AI Router error', details: err?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
