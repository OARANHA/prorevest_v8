import type { ActionFunctionArgs } from "react-router-dom";

export async function action({ request }: ActionFunctionArgs) {
  return new Response(JSON.stringify({ ok: true, method: request.method }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}