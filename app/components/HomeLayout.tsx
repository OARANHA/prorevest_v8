import React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from "./ThemeProvider";
import { AuthProvider } from "../contexts/AuthContext";

export function HomeLayout() {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen bg-background text-foreground font-inter transition-colors duration-300">
              <main>
                <Outlet />
              </main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}