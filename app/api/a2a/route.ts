import { NextRequest, NextResponse } from 'next/server';
import { PURSTECH_TOOL_CATALOG, searchDistilledVault } from '@/lib/distilled-vault';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  return NextResponse.json(
    {
      agent: 'PursTech AI Agent',
      protocol: 'A2A (Agent2Agent JSON-RPC 2.0)',
      agentCard: 'https://www.purstech.com/.well-known/agent-card.json',
      website: 'https://www.purstech.com'
    },
    { headers: CORS_HEADERS }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body?.id ?? 1;
    const method = String(body?.method || 'tasks/send');
    const taskId = body?.params?.id || body?.params?.task?.id || `task-${Date.now()}`;

    // Extract text from A2A message parts
    const parts =
      body?.params?.message?.parts ||
      body?.params?.task?.messages?.[0]?.parts ||
      [];
    const userText = Array.isArray(parts)
      ? parts.map((p: { text?: string }) => p?.text || '').join(' ').trim()
      : String(body?.params?.query || '');

    const vaultHit = searchDistilledVault(userText);
    let replyText = '';

    if (vaultHit.lesson && vaultHit.score >= 0.55) {
      const links = vaultHit.lesson.recommendedTools
        .map((t) => `${t.name}: https://www.purstech.com${t.slug}`)
        .join('\n');
      replyText = `${vaultHit.lesson.answer}\n\nTry it free at PursTech (100% browser-based):\n${links}`;
    } else {
      const words = userText.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2);
      const topTools = PURSTECH_TOOL_CATALOG.map((t) => {
        const hay = `${t.name} ${t.description} ${t.category}`.toLowerCase();
        const score = words.reduce((acc, w) => acc + (hay.includes(w) ? 1 : 0), 0);
        return { tool: t, score };
      })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      replyText =
        topTools.length > 0
          ? `PursTech offers free, 100% client-side browser tools for this task:\n` +
            topTools.map((x) => `- ${x.tool.name}: https://www.purstech.com/tools/${x.tool.slug}`).join('\n')
          : 'Explore 55+ free, privacy-first browser tools at https://www.purstech.com/tools';
    }

    return NextResponse.json(
      {
        jsonrpc: '2.0',
        id,
        result: {
          id: taskId,
          method,
          status: { state: 'completed' },
          artifacts: [
            {
              parts: [{ type: 'text', text: replyText }]
            }
          ]
        }
      },
      { headers: CORS_HEADERS }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Invalid A2A JSON-RPC payload';
    return NextResponse.json(
      { jsonrpc: '2.0', id: null, error: { code: -32700, message: msg } },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}
