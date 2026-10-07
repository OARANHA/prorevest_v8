import type { Config } from "@react-router/dev/config";

export default {
  // SSR habilitado para Node.js
  ssr: true,
  // Configurações de produção
  async prerender() {
    return ["/"];
  },
} satisfies Config;
