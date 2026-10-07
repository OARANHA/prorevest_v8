import type { MetaFunction } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import { LogoUpload } from '../../components/LogoUpload';
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: "Configurações do Logotipo - ProRevest" },
    { name: "description", content: "Configure o logotipo dinâmico do painel administrativo" },
  ];
};

export default function LogoSettingsPage() {
  const { isAdmin } = useAuth();
  const [currentLogo, setCurrentLogo] = useState<string>('');

  // Carregar logotipo atual ao montar (verificar ambos os storages para o status)
  useEffect(() => {
    const loadLogo = () => {
      const siteLogo = localStorage.getItem('siteLogo');
      const adminLogo = localStorage.getItem('adminLogo');
      console.log('Loading logo from localStorage:', { siteLogo, adminLogo });
      if (siteLogo) {
        setCurrentLogo(siteLogo);
      } else if (adminLogo) {
        setCurrentLogo(adminLogo);
      }
    };

    loadLogo();

    // Escutar mudanças de evento (quando upload acontece)
    const handleLogoChange = (event: CustomEvent) => {
      console.log('Logo changed event received:', event.detail);
      loadLogo();
    };

    window.addEventListener('logoUpdate', handleLogoChange as EventListener);
    window.addEventListener('logoUpdated', handleLogoChange as EventListener);

    return () => {
      window.removeEventListener('logoUpdate', handleLogoChange as EventListener);
      window.removeEventListener('logoUpdated', handleLogoChange as EventListener);
    };
  }, []);

  // Callback quando o logotipo muda
  const handleLogoChange = (newLogoUrl: string) => {
    console.log('handleLogoChange called with:', newLogoUrl);
    setCurrentLogo(newLogoUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <Link
            to="/admin"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Link>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto py-8 px-6">
        {/* Título */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Configuração do Logotipo
            </h1>
            <p className="text-gray-600">
              Personalize o logotipo exibido no header da área administrativa.
            </p>
          </div>

          {/* Divider */}
          <div className="border-b border-gray-200 mb-6"></div>

          {/* Área de Upload */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Upload do Logotipo
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Selecione uma imagem para usar como logotipo no header administrativo.
                Tamanho recomendado: até 120x48px para melhor visualização.
              </p>

              <LogoUpload
                currentLogo={currentLogo}
                onLogoChange={handleLogoChange}
              />
            </div>

            {/* Informações Importantes */}
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-6">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-amber-800 mb-2">
                    Informações Importantes
                  </h3>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• O logotipo é exibido automaticamente no header da área administrativa</li>
                    <li>• Nosso sistema redimensiona automaticamente o logotipo (120x48px normal, 80x32px ao rolar)</li>
                    <li>• O logotipo é armazenado de forma segura e persiste entre sessões</li>
                    <li>• Você pode fazer upload/remover o logotipo a qualquer momento</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Dicas de Uso */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                Dicas de Uso
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Use apenas arquivos PNG, JPG ou JPEG com fundo transparente quando possível</li>
                <li>• Arquivos com tamanho de até 5MB são aceitos</li>
                <li>• Para melhor visualização, use imagens com proporção horizontal (largura maior que altura)</li>
                <li>• Teste o resultado acessando qualquer página da área administrativa</li>
              </ul>
            </div>

            {/* Status Atual */}
            <div className="bg-white border border-gray-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Status Atual
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Logotipo configurado:</span>
                  <span className={`text-sm font-medium ${currentLogo ? 'text-green-600' : 'text-gray-400'}`}>
                    {currentLogo ? 'Sim' : 'Não'}
                  </span>
                </div>
                {currentLogo && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Última atualização:</span>
                    <span className="text-sm text-gray-900">
                      {new Date().toLocaleString('pt-BR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
