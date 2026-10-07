import {
  isRouteErrorResponse,
  Outlet,
} from "react-router-dom";
import { Links, Meta, Scripts, ScrollRestoration } from "react-router";

import "./app.css";
import { Layout as AppLayout } from "./components/Layout";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { SEOHead } from "./components/SEOHead";
import { ReadingProgressBar } from "./components/ReadingProgressBar";

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { 
    rel: "preconnect", 
    href: "https://fonts.gstatic.com", 
    crossOrigin: "anonymous" 
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&display=swap"
  }
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <SEOHead />
        <Meta />
        <Links />
      </head>
      <body>
        <ReadingProgressBar />
        <ThemeProvider>
          <AuthProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </AuthProvider>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: any }) {
  let message = "Oops!";
  let details = "Ocorreu um erro inesperado.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Erro";
    details =
      error.status === 404
        ? "A página solicitada não foi encontrada."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
