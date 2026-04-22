// ─────────────────────────────────────────────────────────────────────────────
// spatiumai-worker — AI Service HTTP Client
// Calls spatiumai-ai: POST /resolve → returns ResolutionSet
// ─────────────────────────────────────────────────────────────────────────────
import type { ResolveRequest, ResolveResponse } from '@spatiumai/shared';
import { logger } from '../lib/logger';

export class AIClient {
  constructor(private readonly baseUrl: string) {}

  async resolve(req: ResolveRequest): Promise<ResolveResponse> {
    const url = `${this.baseUrl}/resolve`;
    const startMs = Date.now();

    logger.debug(
      { url, evaluationId: req.evaluationId, constraintId: req.constraintId },
      'Calling AI resolution service'
    );

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
      // LLM calls can be slow — 60s timeout
      signal: AbortSignal.timeout(60_000),
    });

    const durationMs = Date.now() - startMs;

    if (!response.ok) {
      const text = await response.text().catch(() => 'no body');
      throw new Error(
        `AI service returned ${response.status}: ${text} (${durationMs}ms)`
      );
    }

    const data = (await response.json()) as ResolveResponse;
    logger.info(
      { durationMs, constraintId: req.constraintId, optionCount: data.resolutionSet.options.length },
      'AI resolution received'
    );

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
