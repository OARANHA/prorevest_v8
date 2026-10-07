import { DatabaseService } from "../../services/databaseService";

export async function loader() {
  try {
    await DatabaseService.initSuperAdmin();
    await DatabaseService.createMissingProfiles();
    return { success: true, message: "Superadmin e perfis criados com sucesso." };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export default function InitDb() {
  return (
    <div className="min-h-screen bg-dark-background flex items-center justify-center">
      <div className="bg-dark-card p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-cormorant font-bold text-dark-primary mb-4">Inicializando Banco de Dados</h1>
        <p className="text-dark-muted-foreground mb-6">Criando super administrador e perfis de usuários...</p>
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