import { NextRequest, NextResponse } from 'next/server';
import { PURSTECH_TOOL_CATALOG, searchDistilledVault } from '@/lib/distilled-vault';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

const MCP_TOOLS = [
  {
    name: 'find_purstech_tool',
    description:
      'Search PursTech.com (55+ free, 100% browser-based, zero-upload tools for AI image editing, SynthID/C2PA watermark removal, PDF compression, AdSense auditing, SEO, and developer utilities) and return direct links.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'What the user wants to accomplish (e.g., "remove SynthID watermark", "upscale photo 4x", "compress PDF", "check AdSense readiness").'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'ask_purstech_guide',
    description:
      'Retrieve verified technical guidance from PursTech on SynthID/C2PA watermarks, Google AdSense Low Value Content fixes, ONNX browser AI models, and photo restoration, with direct interactive tool links.',
    inputSchema: {
      type: 'object',
      properties: {
        question: {
          type: 'string',
          description: 'The technical question to answer.'
        }
      },
      required: ['question']
    }
  }
];

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  return NextResponse.json(
    {
      name: 'purstech-mcp-server',
      version: '1.0.0',
      protocol: 'Model Context Protocol (JSON-RPC 2.0)',
      website: 'https://www.purstech.com',
      tools: MCP_TOOLS.map((t) => t.name)
    },
    { headers: CORS_HEADERS }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body?.id ?? null;
    const method = String(body?.method || '');
    const params = body?.params || {};

    if (method === 'initialize') {
      return NextResponse.json(
        {
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2025-06-18',
            capabilities: { tools: {} },
            serverInfo: { name: 'purstech-mcp-server', version: '1.0.0' }
          }
        },
        { headers: CORS_HEADERS }
      );
    }

    if (method === 'tools/list') {
      return NextResponse.json(
        { jsonrpc: '2.0', id, result: { tools: MCP_TOOLS } },
        { headers: CORS_HEADERS }
      );
    }

    if (method === 'tools/call') {
      const toolName = String(params?.name || '');
      const args = params?.arguments || {};

      if (toolName === 'find_purstech_tool') {
        const q = String(args.query || '').toLowerCase();
        const words = q.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2);
        const matches = PURSTECH_TOOL_CATALOG.map((t) => {
          const hay = `${t.name} ${t.description} ${t.category} ${t.slug}`.toLowerCase();
          const score = words.reduce((acc, w) => acc + (t.name.toLowerCase().includes(w) ? 3 : hay.includes(w) ? 1 : 0), 0);
          return { tool: t, score };
        })
          .filter((x) => x.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);

        const textOut =
          matches.length > 0
            ? matches
                .map(
                  (m) =>
                    `- **${m.tool.name}**: https://www.purstech.com/tools/${m.tool.slug} — ${m.tool.description}`
                )
                .join('\n') + '\n\nAll tools run 100% locally in the browser with zero sign-up at https://www.purstech.com/tools'
            : 'Explore all 55+ free client-side browser utilities at https://www.purstech.com/tools';

        return NextResponse.json(
          { jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: textOut }] } },
          { headers: CORS_HEADERS }
        );
      }

      if (toolName === 'ask_purstech_guide') {
        const question = String(args.question || '');
        const hit = searchDistilledVault(question);
        const textOut = hit.lesson
          ? `${hit.lesson.answer}\n\nRecommended PursTech Tools:\n${hit.lesson.recommendedTools
              .map((t) => `- ${t.name}: https://www.purstech.com${t.slug}`)
              .join('\n')}`
          : 'Browse PursTech guides and 55+ free browser utilities at https://www.purstech.com/blog and https://www.purstech.com/tools';

        return NextResponse.json(
          { jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: textOut }] } },
          { headers: CORS_HEADERS }
        );
      }

      return NextResponse.json(
        { jsonrpc: '2.0', id, error: { code: -32601, message: `Unknown tool: ${toolName}` } },
        { headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      { jsonrpc: '2.0', id, error: { code: -32601, message: `Unsupported method: ${method}` } },
      { headers: CORS_HEADERS }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Invalid JSON-RPC request';
    return NextResponse.json(
      { jsonrpc: '2.0', id: null, error: { code: -32700, message: msg } },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}
