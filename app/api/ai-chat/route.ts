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

// Natural conversational intelligence for greetings, small talk, identity, and help
function handleConversationalIntent(query: string, historyLength: number) {
  const clean = query.toLowerCase().replace(/[^\w\s]/g, '').trim();

  // Greetings
  if (/^(hi|hello|hey|hii+|yo|hola|salam|assalam\s*o?\s*alaikum|good\s*(morning|afternoon|evening)|howdy|sup)$/.test(clean)) {
    const replies = [
      "Hey there! 👋 What are you working on today? I can help you **remove AI watermarks**, **upscale or colorize photos**, **compress PDFs**, **audit AdSense readiness**, or answer quick math & dev questions.",
      "Hello! Great to see you on PursTech. Tell me what you need to get done—whether it's editing an image, formatting JSON, converting time zones, or checking SEO—and I'll jump right in.",
      "Hi! Ready whenever you are. Drop a question, paste a quick calculation, or tell me what file you're trying to fix and I'll point you to the fastest free tool."
    ];
    const reply = replies[historyLength % replies.length];
    return {
      answer: reply,
      recommendedTools: [
        { name: 'SynthID & C2PA Remover', slug: '/tools/synthid-remover', reason: 'Remove AI watermarks & metadata locally' },
        { name: 'AI Image Upscaler (4×)', slug: '/tools/image-upscaler', reason: 'Enhance blurry photos 4× in your browser' }
      ],
      recommendedBlogs: []
    };
  }

  // How are you / small talk
  if (/^(how are you|how r u|hows it going|whats up|how are u)/.test(clean)) {
    return {
      answer: "Doing great and running fast! ⚡ What can I help you build, fix, or calculate today?",
      recommendedTools: [],
      recommendedBlogs: []
    };
  }

  // Thanks / appreciation
  if (/^(thanks|thank you|thx|ty|awesome|great|nice|cool|perfect|ok|okay)$/.test(clean)) {
    return {
      answer: "Anytime! Let me know if you need help with another tool, calculation, or guide.",
      recommendedTools: [],
      recommendedBlogs: []
    };
  }

  // Identity / About PursTech
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

  // Capabilities / Help
  if (/^(help|what can you do|list tools|show tools|tools|categories|menu)$/.test(clean)) {
    return {
      answer:
        "Here's what I can help you with right now:\n- **AI & Image Studio:** Remove SynthID/C2PA watermarks, remove backgrounds (9 AI models), upscale 4×, or colorize old photos.\n- **PDF & Docs:** Compress, merge, split, or convert PDFs privately.\n- **Dev & SEO:** Format JSON, test regex, generate `llms.txt` / sitemaps, or audit Google AdSense readiness.\n- **Instant Answers:** Ask me percentages, time zone conversions, or any technical question!",
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
  const isComplex =
    words.length >= 7 ||
    /(why|how|compare|difference|error|fix|code|regex|formula|explain|write|best)/.test(qLower);

  const confidence = isComplex
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

    await fetch(apiUrl, {
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
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = String(body?.query || '').trim();
    const history: { role: string; text: string }[] = Array.isArray(body?.history) ? body.history : [];

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // 1. Instant natural conversational handling (greetings, small talk, identity, help)
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

    // 2. Semantic Knowledge Vault check (<15ms)
    const vaultHit = searchDistilledVault(query);
    if (vaultHit.lesson && vaultHit.score >= 0.65) {
      return NextResponse.json({
        badge: '',
        confidence: vaultHit.score,
        answer: vaultHit.lesson.answer,
        recommendedTools: vaultHit.lesson.recommendedTools,
        recommendedBlogs: vaultHit.lesson.recommendedBlogs,
        learnedNewLesson: false
      });
    }

    // 3. Optional External Private AI Engine (HuggingFace Space)
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
          if (engineData.learnedLesson) absorbTeacherLesson(engineData.learnedLesson);
          return NextResponse.json({ ...engineData, badge: '' });
        }
      } catch {}
    }

    // 4. Local Catalog Match Evaluation
    const localEval = runLocalCatalogReasoner(query);
    if (localEval.confidence >= 0.78 && !body?.forceTeacher && localEval.recommendedTools.length > 0) {
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

    // 5. Full Conversational LLM Escalation (Gemini Free Tier @ 5 RPM max + Auto-Distillation)
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey && canCallGeminiTeacher()) {
      recordTeacherCall();
      const toolList = tools
        .slice(0, 55)
        .map((t) => `${t.name} (/tools/${t.slug})`)
        .join(', ');

      const systemInstruction = `You are PursTech Assistant, a friendly, sharp, helpful AI assistant on purstech.com.
Answer the user's message naturally and conversationally—just like a top-tier AI assistant.
Keep answers concise, clear, and genuinely useful. Only recommend PursTech tools if they directly help with the user's request (otherwise leave recommendedTools empty).
Respond strictly in valid JSON with this schema:
{
  "answer": "Clear, helpful markdown response",
  "keywords": ["4 to 7 lowercase keywords if this is a reusable technical Q&A, otherwise empty array"],
  "shouldLearn": true or false (true for reusable technical/how-to answers, false for casual chat),
  "recommendedTools": [{"name": "Tool Name", "slug": "/tools/slug", "reason": "Short reason"}],
  "recommendedBlogs": [{"title": "Guide Title", "slug": "/blog/slug"}]
}
Available PursTech Tools: ${toolList}`;

      const contents = [
        ...history.slice(-4).map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.text }]
        })),
        { role: 'user', parts: [{ text: query }] }
      ];

      try {
        const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;
        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemInstruction }] },
            contents,
            generationConfig: { temperature: 0.4, responseMimeType: 'application/json' }
          }),
          signal: AbortSignal.timeout(12000)
        });

        if (geminiRes.ok) {
          const geminiJson = await geminiRes.json();
          const rawText = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
          const parsed = JSON.parse(rawText);

          const recTools = Array.isArray(parsed.recommendedTools) ? parsed.recommendedTools : [];
          const recBlogs = Array.isArray(parsed.recommendedBlogs) ? parsed.recommendedBlogs : [];
          const shouldLearn = Boolean(parsed.shouldLearn) && Array.isArray(parsed.keywords) && parsed.keywords.length >= 3;

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
        }
      } catch {}
    }

    // 6. Smart, helpful fallback when GEMINI_API_KEY isn't configured yet
    if (localEval.recommendedTools.length > 0) {
      const topTool = localEval.recommendedTools[0];
      return NextResponse.json({
        badge: '',
        confidence: localEval.confidence,
        answer: `It sounds like **${topTool.name}** could help with that. Open it below to run it directly in your browser, or ask me a more specific question!`,
        recommendedTools: localEval.recommendedTools,
        recommendedBlogs: localEval.recommendedBlogs,
        learnedNewLesson: false
      });
    }

    return NextResponse.json({
      badge: '',
      confidence: 0.5,
      answer: `I didn't find an exact tool match for **"${query}"** yet—could you tell me a bit more about what you're trying to do? For example, you can ask me to **remove an AI watermark**, **upscale a photo**, **compress a PDF**, or **convert a time zone**.`,
      recommendedTools: [
        { name: 'Browse All 50+ Tools', slug: '/tools', reason: 'Search all 8 categories of free browser utilities' }
      ],
      recommendedBlogs: [],
      learnedNewLesson: false
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Assistant error', details: err?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
