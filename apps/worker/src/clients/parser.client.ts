// ─────────────────────────────────────────────────────────────────────────────
// spatiumai-worker — Parser Service HTTP Client
// Calls spatiumai-parser: POST /parse → returns SpatialGraph JSON
// ─────────────────────────────────────────────────────────────────────────────
import { logger } from '../lib/logger';

interface ParseRequest {
  fileKey: string;
  fileFormat: 'dxf' | 'ifc' | 'pdf' | 'image';
}

export class ParserClient {
  constructor(private readonly baseUrl: string) {}

  async parseFile(req: ParseRequest): Promise<unknown> {
    const url = `${this.baseUrl}/parse`;
    const startMs = Date.now();

    logger.debug({ url, fileKey: req.fileKey, format: req.fileFormat }, 'Calling parser service');

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
      // Parser has longer timeout than regular API calls
      signal: AbortSignal.timeout(120_000), // 2 minutes max
    });

    const durationMs = Date.now() - startMs;

    if (!response.ok) {
      const text = await response.text().catch(() => 'no body');
      throw new Error(
        `Parser service returned ${response.status}: ${text} (${durationMs}ms)`
      );
    }

    const data: unknown = await response.json();
    logger.info({ durationMs, format: req.fileFormat }, 'Parser service response received');

    return data;
  }

  async health(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health`, {
        signal: AbortSignal.timeout(5_000),
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
