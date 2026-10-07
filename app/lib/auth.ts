import { supabaseServerClient } from './supabaseServerClient'

export async function requireAuth() {
  const { data: { session } } = await supabaseServerClient.auth.getSession()
  
  if (!session) {
    throw new Response("Não autorizado", { status: 401 })
  }
  
  return session
}