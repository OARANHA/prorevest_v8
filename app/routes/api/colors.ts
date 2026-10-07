import type { LoaderFunctionArgs } from "react-router-dom";
import { supabaseServerClient } from "../../lib/supabaseServerClient";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

export async function loader({ request }: LoaderFunctionArgs) {
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }

  if (!supabaseServerClient) {
    return new Response(JSON.stringify({ error: "Database not configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }

  try {
    const url = new URL(request.url);
    const limit = Math.max(1, Math.min(500, Number(url.searchParams.get("limit") || 200)));
    const offset = Math.max(0, Number(url.searchParams.get("offset") || 0));
    const category = url.searchParams.get("category") || url.searchParams.get("collection") || "";
    const search = url.searchParams.get("search") || "";

    // Count query
    let countQuery = supabaseServerClient
      .from("colors")
      .select("*", { count: "exact", head: true })
      .eq("is_archived", false);

    if (category) {
      countQuery = countQuery.eq("category", category);
    }

    if (search) {
      countQuery = countQuery.or(
        `name.ilike.%${search}%,pro_revest_code.ilike.%${search}%,numeric_code.ilike.%${search}%,reference_number.ilike.%${search}%`
      );
    }

    const { count } = await countQuery;

    // Main query
    let query = supabaseServerClient
      .from("colors")
      .select("id,name,hex_code,pro_revest_code,numeric_code,reference_number,category", { count: "estimated" })
      .eq("is_archived", false);

    if (category) {
      query = query.eq("category", category);
    }

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,pro_revest_code.ilike.%${search}%,numeric_code.ilike.%${search}%,reference_number.ilike.%${search}%`
      );
    }

    query = query.order("name", { ascending: true }).range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error("api/colors error:", error);
      return new Response(JSON.stringify({ error: "Database query failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    return new Response(
      JSON.stringify({
        colors: data || [],
        total: count || 0,
        limit,
        offset,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...CORS_HEADERS,
          "Cache-Control": "public, max-age=3600",
        },
      }
    );
  } catch (err) {
    console.error("api/colors error:", err);
    return new Response(JSON.stringify({ error: "Falha interna" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }
}
