import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      $schema: 'https://glama.ai/mcp/schemas/connector.json',
      claim: 'glama_claim_3DUcZ55Cw2G24uuLn_SkLT9tD5ARhRrx'
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600'
      }
    }
  );
}
