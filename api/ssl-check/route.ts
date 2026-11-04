import tls from "tls";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function grade(daysLeft: number, bits: number, protocol: string | null): string {
  if (daysLeft < 0)    return "F";
  if (daysLeft < 7)    return "D";
  const tlsOk  = protocol === "TLSv1.3";
  const tlsGood= protocol === "TLSv1.2";
  const keyOk  = bits >= 2048;
  if (tlsOk  && keyOk && daysLeft > 30) return "A+";
  if (tlsOk  && keyOk)                  return "A";
  if (tlsGood && keyOk && daysLeft > 30) return "B";
  if (tlsGood && keyOk)                  return "B-";
  if (tlsGood)                           return "C";
  return "D";
}

export async function GET(req: NextRequest) {
  const domain = new URL(req.url).searchParams.get("domain")?.trim().replace(/^https?:\/\//i, "").split("/")[0];

  if (!domain) {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 });
  }

  return new Promise<NextResponse>((resolve) => {
    const socket = tls.connect(
      { host: domain, port: 443, servername: domain, rejectUnauthorized: false, timeout: 12000 },
      () => {
        try {
          const cert     = socket.getPeerCertificate(true);
          const protocol = socket.getProtocol() ?? null;
          const cipher   = socket.getCipher();
          socket.end();

          if (!cert || !Object.keys(cert).length) {
            resolve(NextResponse.json({ error: "No certificate returned by server" }, { status: 400 }));
            return;
          }

          const validTo   = new Date(cert.valid_to);
          const validFrom = new Date(cert.valid_from);
          const now       = new Date();
          const daysLeft  = Math.floor((validTo.getTime() - now.getTime()) / 86_400_000);
          const totalDays = Math.floor((validTo.getTime() - validFrom.getTime()) / 86_400_000);
          const elapsed   = Math.floor((now.getTime() - validFrom.getTime()) / 86_400_000);
          const pctUsed   = totalDays > 0 ? Math.round((elapsed / totalDays) * 100) : 0;
          const bits      = (cert as any).bits ?? 0;

          resolve(NextResponse.json({
            domain,
            grade:       grade(daysLeft, bits, protocol),
            valid:       daysLeft >= 0,
            daysLeft,
            pctUsed,
            validFrom:   cert.valid_from,
            validTo:     cert.valid_to,
            subject:     cert.subject,
            issuer:      cert.issuer,
            serialNumber:cert.serialNumber,
            fingerprint: cert.fingerprint,
            fingerprint256: (cert as any).fingerprint256 ?? "",
            bits,
            subjectAltName: (cert as any).subjectaltname ?? "",
            protocol,
            cipherName:  cipher?.name ?? "",
            cipherVersion: cipher?.version ?? "",
            selfSigned:  cert.subject?.CN === cert.issuer?.CN,
          }));
        } catch (err) {
          socket.end();
          resolve(NextResponse.json({ error: String(err) }, { status: 500 }));
        }
      }
    );
    socket.on("error",   (e) => resolve(NextResponse.json({ error: e.message },    { status: 400 })));
    socket.on("timeout", ()  => { socket.destroy(); resolve(NextResponse.json({ error: "Connection timed out" }, { status: 408 })); });
  });
}
