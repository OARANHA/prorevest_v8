import "@react-router/node/install";
import path from "node:path";
import fs from "node:fs";
import { config as dotenvConfig } from "dotenv";

// Load environment from .env.local (dev) or fallback to .env/.env.production
const root = process.cwd();
const envLocal = path.join(root, ".env.local");
const envDefault = path.join(root, ".env");
const envProd = path.join(root, ".env.production");

if (fs.existsSync(envLocal)) {
  dotenvConfig({ path: envLocal });
} else if (fs.existsSync(envDefault)) {
  dotenvConfig({ path: envDefault });
} else if (fs.existsSync(envProd)) {
  dotenvConfig({ path: envProd });
} else {
  dotenvConfig();
}

import { renderToString } from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router";
import routes from "./routes";

export async function render(request: Request) {
  let handler = createStaticHandler(routes);
  let a = await handler.query(request);

  if (a instanceof Response) {
    return a;
  }

  let router = createStaticRouter(a.routes);

  let html = renderToString(
    <StaticRouterProvider
      router={router}
      context={a.context}
    />
  );

  return new Response("<!DOCTYPE html>" + html, {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "public, max-age=0",
      "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://api.supabase.co wss://*.supabase.co; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';",
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()"
    },
  });
}
