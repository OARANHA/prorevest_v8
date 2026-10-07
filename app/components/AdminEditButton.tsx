import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Settings, Eye } from 'lucide-react';
import { useAdminPermissions } from '../hooks/useAdminPermissions';

interface AdminEditButtonProps {
  productId: string;
  productName?: string;
  className?: string;
  variant?: 'floating' | 'inline';
  position?: 'bottom-right' | 'bottom-left' | 'top-right';
}

/**
 * Componente de botão de edição para administradores
 * Baseado em padrões de segurança e UX do CLI Agent Knowledge
 */
export function AdminEditButton({ 
  productId, 
  productName = '',
  className = '',
  variant = 'floating',
  position = 'bottom-right'
}: AdminEditButtonProps) {
  const navigate = useNavigate();
  const { canEditProducts, loading, getPermissionLevel } = useAdminPermissions();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Logs de debug
  console.log('[ADMIN_EDIT_BUTTON] Renderizando componente');
  console.log('[ADMIN_EDIT_BUTTON] Loading:', loading);
  console.log('[ADMIN_EDIT_BUTTON] CanEditProducts:', canEditProducts());
  console.log('[ADMIN_EDIT_BUTTON] ProductId:', productId);
  console.log('[ADMIN_EDIT_BUTTON] PermissionLevel:', getPermissionLevel());

  // Não renderizar se não tiver permissão ou estiver carregando
  if (loading || !canEditProducts()) {
    console.log('[ADMIN_EDIT_BUTTON] Botão não será renderizado - loading:', loading, 'canEdit:', canEditProducts());
    return null;
  }

  console.log('[ADMIN_EDIT_BUTTON] Botão será renderizado!');

  const handleEdit = () => {
    // Log de auditoria (padrão de segurança do knowledge base)
    console.log(`[ADMIN_EDIT] Produto ${productId} acessado para edição por ${getPermissionLevel()}`);
    
    // Navegar para página de admin com o produto pré-carregado
    navigate(`/admin/products?edit=${productId}`);
  };

  const handleQuickView = () => {
    // Visualização rápida do produto no admin
    console.log(`[ADMIN_VIEW] Produto ${productId} visualizado por ${getPermissionLevel()}`);
    window.open(`/admin/products?view=${productId}`, '_blank');
  };

  // Posicionamento para botão flutuante
  const positionClasses = {
    'bottom-right': 'bottom-8 right-8',
    'bottom-left': 'bottom-8 left-8',
    'top-right': 'top-8 right-8'
  };

  // Botão flutuante (padrão não intrusivo)
  if (variant === 'floating') {
    return (
      <div 
        className={`fixed ${positionClasses[position]} z-50 ${className}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full mb-2 right-0 bg-slate-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            <div className="font-medium">Painel Admin</div>
            <div className="text-xs text-slate-300">{productName || 'Editar produto'}</div>
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
          </div>
        )}

        {/* Botão principal */}
        <div className="relative">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
            aria-label="Painel Administrativo"
          >
            <Settings className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Botões expandidos */}
          {isExpanded && (
            <div className="absolute bottom-full right-0 mb-2 space-y-2 animate-fade-in">
              {/* Botão de visualização */}
              <button
                onClick={handleQuickView}
                className="bg-slate-600 hover:bg-slate-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                title="Visualizar no Admin"
              >
                <Eye className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </button>

              {/* Botão de edição */}
              <button
                onClick={handleEdit}
                className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                title="Editar Produto"
              >
                <Edit className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Botão inline (integrado ao layout)
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* Indicador visual de permissão */}
      <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
        <Settings className="h-3 w-3" />
        <span>Admin</span>
      </div>

      {/* Botões de ação */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleQuickView}
          className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          title="Visualizar no Admin"
        >
          <Eye className="h-4 w-4" />
        </button>

        <button
          onClick={handleEdit}
          className="p-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1"
          title="Editar Produto"
        >
          <Edit className="h-4 w-4" />
          <span className="text-sm font-medium">Editar</span>
        </button>
      </div>
    </div>
  );
}

// Estilos para animações (adicionar ao CSS global)
const styles = `
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.2s ease-out;
  }
`;

export default AdminEditButton;
