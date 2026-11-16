// Rota legada de diagnóstico de autenticação desativada por segurança.
// A operação não pode ser executada por GET ou a partir de credenciais no frontend.
export function loader() {
  throw new Response("Not Found", { status: 404 });
}

export default function DisabledLegacyRoute() {
  return null;
}
