import React, { useState, useRef } from 'react';
import { LogoService } from '../services/logoService';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface LogoUploadProps {
  currentLogo?: string;
  onLogoChange: (url: string) => void;
  maxSizeMB?: number;
}

export const LogoUpload: React.FC<LogoUploadProps> = ({
  currentLogo,
  onLogoChange,
  maxSizeMB = 5
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validar arquivo selecionado
  const validateFile = (file: File): string | null => {
    // Verificar tipo
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return 'Apenas arquivos PNG, JPG, JPEG ou SVG são permitidos';
    }

    // Verificar tamanho (5MB max)
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      return `Arquivo muito grande. Máximo ${maxSizeMB}MB permitido`;
    }

    return null;
  };

  // Gerar nome único para o arquivo
  const generateUniqueFileName = (originalName: string): string => {
    const extension = originalName.split('.').pop();
    return `logo-${Date.now()}.${extension}`;
  };

  // Limpar mensagens
  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  // Lidar com seleção de arquivo
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    clearMessages();
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);

    // Criar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Fazer upload do arquivo
  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    clearMessages();

    console.log('Iniciando upload do arquivo:', selectedFile.name);

    try {
      const result = await LogoService.uploadSiteLogo(selectedFile);
      if (!result.success || !result.url) {
        setError(result.error || 'Erro ao enviar logotipo.');
        return;
      }

      // Atualizar estado e pai
      onLogoChange(result.url);

      // Disparar evento para outros componentes
      window.dispatchEvent(new CustomEvent('logoUpdated', { detail: { logoUrl: result.url } }));

      console.log('Evento logoUpdated disparado');

      setSuccess('Logotipo enviado com sucesso!');
      setSelectedFile(null);
      setPreviewUrl(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Erro no upload:', error);
      setError(`Erro ao enviar logotipo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  // Remover logotipo
  const handleRemove = async () => {
    if (!currentLogo) return;

    setLoading(true);
    clearMessages();

    try {
      const res = await LogoService.removeSiteLogo();
      if (!res.success) {
        setError(res.error || 'Erro ao remover logotipo.');
        return;
      }

      onLogoChange('');

      window.dispatchEvent(new CustomEvent('logoUpdated', { detail: { logoUrl: '' } }));

      setSuccess('Logotipo removido com sucesso!');
      setSelectedFile(null);
      setPreviewUrl(null);

    } catch (error) {
      console.error('Erro ao remover logotipo:', error);
      setError('Erro ao remover logotipo.');
    } finally {
      setLoading(false);
    }
  };

  // Cancelar upload
  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    clearMessages();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Area de Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <div className="space-y-4">
          {(previewUrl || currentLogo) && !selectedFile ? (
            // Preview do logotipo atual
            <div className="relative inline-block">
              <img
                src={previewUrl || currentLogo}
                alt="Preview do logotipo"
                className="max-h-32 max-w-48 object-contain rounded border"
                style={{
                  filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
                }}
              />
              <button
                onClick={handleRemove}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                title="Remover logotipo"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ) : previewUrl ? (
            // Preview do arquivo selecionado
            <div className="relative inline-block">
              <img
                src={previewUrl}
                alt="Preview do arquivo selecionado"
                className="max-h-32 max-w-48 object-contain rounded border"
                style={{
                  filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
                }}
              />
              <button
                onClick={handleCancel}
                className="absolute -top-2 -right-2 bg-gray-500 text-white rounded-full p-1 hover:bg-gray-600 transition-colors"
                title="Cancelar"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ) : (
            // Área vazia para upload
            <div>
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Clique para selecionar um logotipo
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, JPEG ou SVG até {maxSizeMB}MB
                </p>
              </div>
            </div>
          )}

          {/* Input de arquivo oculto */}
          <input
            ref={fileInputRef}
            id="logo-upload"
            type="file"
            className="sr-only"
            accept="image/png,image/jpg,image/jpeg,image/svg+xml"
            onChange={handleFileSelect}
          />
        </div>
      </div>

      {/* Botões de ação */}
      {selectedFile && (
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleUpload}
            disabled={loading}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? 'Enviando...' : 'Enviar Logotipo'}
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Mensagens */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}
    </div>
  );
};
