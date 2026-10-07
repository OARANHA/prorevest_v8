import { useLoaderData } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";

export async function loader({ request }: { request: Request }) {
  // Get the session from the request
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { error: "You must be logged in to make yourself an admin" };
  }
  
  const userId = session.user.id;
  
  try {
    // Update the user's role to admin
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', userId);
    
    if (error) {
      return { error: error.message };
    }
    
    return { success: true, message: "User role updated to admin successfully" };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export default function MakeAdmin() {
  const data = useLoaderData();
  
  if (data.error) {
    return (
      <div className="min-h-screen bg-dark-background flex items-center justify-center">
        <div className="bg-dark-card p-8 rounded-xl shadow-lg text-center">
          <h1 className="text-2xl font-cormorant font-bold text-destructive mb-4">Error</h1>
          <p className="text-dark-muted-foreground mb-6">{data.error}</p>
          <a href="/" className="bg-dark-primary text-dark-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-dark-primary/90 transition-all duration-300 transform hover:scale-105">
            Voltar para Home
          </a>
        </div>
      </div>
    );
  }
  
  if (data.success) {
    return (
      <div className="min-h-screen bg-dark-background flex items-center justify-center">
        <div className="bg-dark-card p-8 rounded-xl shadow-lg text-center">
          <h1 className="text-2xl font-cormorant font-bold text-green-500 mb-4">Success</h1>
          <p className="text-dark-muted-foreground mb-6">{data.message}</p>
          <a href="/admin" className="bg-dark-primary text-dark-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-dark-primary/90 transition-all duration-300 transform hover:scale-105">
            Acessar Painel Admin
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-dark-background flex items-center justify-center">
      <div className="bg-dark-card p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-cormorant font-bold text-dark-primary mb-4">Processing...</h1>
        <div className="flex justify-center">
          <svg className="animate-spin h-8 w-8 text-dark-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}