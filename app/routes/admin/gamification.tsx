import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Trophy, 
  Star, 
  Lock, 
  Unlock, 
  User, 
  Award,
  Medal,
  Crown,
  Zap
} from "lucide-react";
import { 
  GamificationService, 
  type Achievement,
  type UserProgress 
} from "../../services/gamificationService";

export const meta: MetaFunction = () => {
  return [
    { title: "Gamificação - ProRevest" },
    { name: "description", content: "Gerencie o sistema de gamificação e recompensas" },
  ];
}

export default function AdminGamification() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalPoints: 0,
    level: 1,
    achievements: [],
    lastActivity: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);

  // Carregar dados de gamificação
  useEffect(() => {
    const loadData = () => {
      try {
        // Inicializar conquistas do usuário
        GamificationService.initializeUserAchievements();
        
        // Carregar conquistas e progresso
        const userAchievements = GamificationService.getUserAchievements();
        const progress = GamificationService.getUserProgress();
        
        setAchievements(userAchievements);
        setUserProgress(progress);
      } catch (error) {
        console.error("Erro ao carregar dados de gamificação:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleUnlockAchievement = (achievementId: string) => {
    try {
      const unlocked = GamificationService.unlockAchievement(achievementId);
      if (unlocked) {
        // Atualizar lista de conquistas
        const updatedAchievements = GamificationService.getUserAchievements();
        const updatedProgress = GamificationService.getUserProgress();
        
        setAchievements(updatedAchievements);
        setUserProgress(updatedProgress);
        
        alert(`Conquista desbloqueada com sucesso! +${updatedAchievements.find(a => a.id === achievementId)?.points || 0} pontos`);
      } else {
        alert('Esta conquista já está desbloqueada ou não foi encontrada.');
      }
    } catch (error) {
      console.error("Erro ao desbloquear conquista:", error);
      alert("Erro ao desbloquear conquista");
    }
  };

  const handleLockAchievement = (achievementId: string) => {
    if (window.confirm("Tem certeza que deseja bloquear esta conquista? Isso removerá os pontos ganhos.")) {
      try {
        // Para simplificar, vamos apenas remover do armazenamento local
        // Em uma implementação real, seria necessário ajustar os pontos também
        const updatedAchievements = achievements.map(achievement => 
          achievement.id === achievementId 
            ? { ...achievement, unlocked: false, unlockedAt: null } 
            : achievement
        );
        
        GamificationService.saveUserAchievements(updatedAchievements);
        
        // Atualizar progresso (simplificado)
        const updatedProgress = { ...userProgress };
        updatedProgress.achievements = updatedProgress.achievements.filter(id => id !== achievementId);
        const achievement = achievements.find(a => a.id === achievementId);
        if (achievement) {
          updatedProgress.totalPoints -= achievement.points;
          updatedProgress.level = Math.floor(updatedProgress.totalPoints / 100) + 1;
        }
        
        GamificationService.saveUserProgress(updatedProgress);
        
        setAchievements(updatedAchievements);
        setUserProgress(updatedProgress);
        
        alert("Conquista bloqueada com sucesso!");
      } catch (error) {
        console.error("Erro ao bloquear conquista:", error);
        alert("Erro ao bloquear conquista");
      }
    }
  };

  const handleResetAll = () => {
    if (window.confirm("Tem certeza que deseja resetar todo o progresso de gamificação? Esta ação não pode ser desfeita.")) {
      try {
        // Resetar conquistas
        const resetAchievements = GamificationService.ACHIEVEMENTS.map(achievement => ({
          ...achievement,
          unlocked: false,
          unlockedAt: null
        }));
        
        GamificationService.saveUserAchievements(resetAchievements);
        
        // Resetar progresso
        const resetProgress: UserProgress = {
          totalPoints: 0,
          level: 1,
          achievements: [],
          lastActivity: new Date().toISOString()
        };
        
        GamificationService.saveUserProgress(resetProgress);
        
        setAchievements(resetAchievements);
        setUserProgress(resetProgress);
        
        alert("Todo o progresso de gamificação foi resetado!");
      } catch (error) {
        console.error("Erro ao resetar gamificação:", error);
        alert("Erro ao resetar gamificação");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  // Separar conquistas por tipo
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);
  const secretAchievements = achievements.filter(a => a.secret);
  const publicAchievements = achievements.filter(a => !a.secret);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-cormorant font-bold">Gamificação</h1>
            <p className="text-muted-foreground">Gerencie o sistema de conquistas e recompensas</p>
          </div>
          <button
            onClick={handleResetAll}
            className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
          >
            <Lock className="h-4 w-4" />
            Resetar Tudo
          </button>
        </div>
      </div>

      {/* Estatísticas do usuário */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nível</p>
              <h3 className="text-2xl font-bold flex items-center">
                <Medal className="h-6 w-6 text-yellow-500 mr-2" />
                {userProgress.level}
              </h3>
            </div>
            <Crown className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pontos Totais</p>
              <h3 className="text-2xl font-bold flex items-center">
                <Star className="h-6 w-6 text-yellow-500 mr-2" />
                {userProgress.totalPoints}
              </h3>
            </div>
            <Zap className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Conquistas</p>
              <h3 className="text-2xl font-bold flex items-center">
                <Trophy className="h-6 w-6 text-yellow-500 mr-2" />
                {unlockedAchievements.length}
              </h3>
              <p className="text-xs text-muted-foreground">
                de {achievements.length} disponíveis
              </p>
            </div>
            <Award className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Última Atividade</p>
              <h3 className="text-lg font-bold">
                {new Date(userProgress.lastActivity).toLocaleDateString('pt-BR')}
              </h3>
              <p className="text-xs text-muted-foreground">
                {new Date(userProgress.lastActivity).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <User className="h-8 w-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Conquistas desbloqueadas */}
      <div className="bg-card border border-border rounded-xl shadow-sm mb-6">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-cormorant font-bold flex items-center">
            <Unlock className="h-5 w-5 mr-2 text-green-500" />
            Conquistas Desbloqueadas ({unlockedAchievements.length})
          </h2>
        </div>
        
        {unlockedAchievements.length > 0 ? (
          <div className="divide-y divide-border">
            {unlockedAchievements.map((achievement) => (
              <div key={achievement.id} className="p-6 hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h3 className="font-medium text-foreground flex items-center">
                          {achievement.title}
                          {achievement.secret && (
                            <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                              Secreto
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>+{achievement.points} pontos</span>
                      {achievement.unlockedAt && (
                        <span>
                          Desbloqueado em: {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleLockAchievement(achievement.id)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    title="Bloquear conquista"
                  >
                    <Lock className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Trophy className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">Nenhuma conquista desbloqueada</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              As conquistas desbloqueadas aparecerão aqui.
            </p>
          </div>
        )}
      </div>

      {/* Conquistas bloqueadas */}
      <div className="bg-card border border-border rounded-xl shadow-sm mb-6">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-cormorant font-bold flex items-center">
            <Lock className="h-5 w-5 mr-2 text-muted-foreground" />
            Conquistas Bloqueadas ({lockedAchievements.length})
          </h2>
        </div>
        
        {lockedAchievements.length > 0 ? (
          <div className="divide-y divide-border">
            {lockedAchievements.map((achievement) => (
              <div key={achievement.id} className="p-6 hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl opacity-50">{achievement.icon}</span>
                      <div>
                        <h3 className="font-medium text-foreground flex items-center">
                          {achievement.title}
                          {achievement.secret && (
                            <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                              Secreto
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>+{achievement.points} pontos</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnlockAchievement(achievement.id)}
                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title="Desbloquear conquista"
                  >
                    <Unlock className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Lock className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">Todas as conquistas foram desbloqueadas</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Parabéns! Você desbloqueou todas as conquistas disponíveis.
            </p>
          </div>
        )}
      </div>

      {/* Informações sobre conquistas secretas */}
      <div className="bg-card border border-border rounded-xl shadow-sm">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-cormorant font-bold flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Conquistas Secretas
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Conquistas especiais que são desbloqueadas ao atingir certos critérios
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium text-foreground mb-2 flex items-center">
                <span className="text-xl mr-2">🗝️</span>
                Caçador de Segredos
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Desbloqueie seu primeiro guia secreto ao completar 3 conquistas normais.
              </p>
              <div className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded inline-block">
                +50 pontos
              </div>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-medium text-foreground mb-2 flex items-center">
                <span className="text-xl mr-2">🗝️🗝️</span>
                Mestre dos Segredos
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Desbloqueie três guias secretos ao completar 5 conquistas normais.
              </p>
              <div className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded inline-block">
                +100 pontos
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Dica para Desbloquear Segredos</h4>
            <p className="text-sm text-muted-foreground">
              Continue usando o sistema e completando as conquistas normais. 
              As conquistas secretas serão desbloqueadas automaticamente quando você atender aos critérios!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}