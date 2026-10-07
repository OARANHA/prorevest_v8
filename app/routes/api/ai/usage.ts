import type { LoaderFunctionArgs } from "react-router-dom";
import { promises as fs } from "node:fs";
import path from "node:path";

export async function loader({ request }: LoaderFunctionArgs) {
  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const url = new URL(request.url);
    const start = url.searchParams.get("start"); // ISO date
    const end = url.searchParams.get("end"); // ISO date
    const userId = url.searchParams.get("userId");
    const projectId = url.searchParams.get("projectId");
    const limitParam = url.searchParams.get("limit");
    const limit = Math.max(1, Math.min(1000, Number(limitParam || 200))); // default 200, max 1000

    const logsDir = path.join(process.cwd(), "logs");
    const logFile = path.join(logsDir, "ai-usage.jsonl");

    let raw = "";
    try {
      raw = await fs.readFile(logFile, "utf8");
    } catch (e) {
      // no logs yet
      return new Response(JSON.stringify({ status: "ok", total: 0, aggregates: { inputTokens: 0, outputTokens: 0, totalCostUSD: 0, totalRequests: 0 }, entries: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const lines = raw.split(/\r?\n/).filter(Boolean);
    const entries = [] as any[];

    for (const line of lines) {
      try {
        const obj = JSON.parse(line);
        entries.push(obj);
      } catch {}
    }

    const startMs = start ? Date.parse(start) : null;
    const endMs = end ? Date.parse(end) : null;

    const filtered = entries.filter((e) => {
      const t = Date.parse(e.timestamp);
      if (startMs && !(t >= startMs)) return false;
      if (endMs && !(t <= endMs)) return false;
      if (userId && !(e?.echo?.meta?.userId === userId)) return false;
      if (projectId && !(e?.echo?.meta?.projectId === projectId)) return false;
      return true;
    });

    const tail = filtered.slice(Math.max(0, filtered.length - limit));

    const agg = tail.reduce(
      (acc, e) => {
        const input = Number(e?.usage?.promptTokens || 0);
        const output = Number(e?.usage?.candidatesTokens || 0);
        const cost = Number(e?.costEstimate?.usd || 0);
        acc.inputTokens += input;
        acc.outputTokens += output;
        acc.totalCostUSD += cost;
        acc.totalRequests += 1;
        return acc;
      },
      { inputTokens: 0, outputTokens: 0, totalCostUSD: 0, totalRequests: 0 }
    );

    const payload = {
      status: "ok",
      total: filtered.length,
      window: { start: start || null, end: end || null },
      filters: { userId: userId || null, projectId: projectId || null },
      aggregates: {
        inputTokens: agg.inputTokens,
        outputTokens: agg.outputTokens,
        totalCostUSD: Number(agg.totalCostUSD.toFixed(6)),
        totalRequests: agg.totalRequests,
        averageCostUSD: agg.totalRequests ? Number((agg.totalCostUSD / agg.totalRequests).toFixed(6)) : 0,
      },
      entries: tail,
    };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("api/ai/usage error:", err);
    return new Response(JSON.stringify({ error: "Falha interna" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}