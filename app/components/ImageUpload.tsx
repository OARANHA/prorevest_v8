import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
  accept?: string;
  maxSize?: number; // em MB
  className?: string;
}

/**
 * Componente de upload de imagens com preview e validação
 * Suporta upload via URL e arquivo local
 */
export function ImageUpload({ 
  value = '', 
  onChange, 
  placeholder = 'URL da imagem ou faça upload',
  accept = 'image/*',
  maxSize = 5,
  className = ''
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState(value);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Atualizar preview quando o valor mudar
  React.useEffect(() => {
    setPreviewUrl(value);
  }, [value]);

  const handleFileSelect = async (file: File) => {
    // Validar tamanho do arquivo
    if (file.size > maxSize * 1024 * 1024) {
      alert(`O arquivo é muito grande. Tamanho máximo: ${maxSize}MB`);
      return;
    }

    // Validar tipo do arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Criar preview local
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      // Simular upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Upload da imagem
      const formData = new FormData();
      formData.append('file', file);

      // Para desenvolvimento, vamos usar uma abordagem simples
      // Em produção, você deve usar um serviço de upload real
      const uploadedUrl = await uploadImage(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Limpar preview local
      URL.revokeObjectURL(localPreview);
      
      // Atualizar com a URL final
      setPreviewUrl(uploadedUrl);
      onChange(uploadedUrl);
      
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload da imagem. Tente novamente.');
      
      // Limpar preview em caso de erro
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(value);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      // Sempre usar Supabase Storage para upload físico
      // Importar dinamicamente para evitar erros de inicialização
      const { ImageUploadService } = await import('~/services/imageUploadService');
      
      // Gerar um ID temporário para o produto (será substituído pelo ID real quando salvo)
      const tempProductId = `temp-${Date.now()}`;
      
      const result = await ImageUploadService.uploadImage(file, tempProductId);
      
      if (result.success && result.url) {
        return result.url;
      } else {
        throw new Error(result.error || 'Falha no upload da imagem');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      throw new Error('Não foi possível fazer upload da imagem. Verifique sua conexão e tente novamente.');
    }
  };



  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPreviewUrl(url);
    onChange(url);
  };

  const handleRemove = () => {
    setPreviewUrl('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Preview da imagem */}
      {previewUrl && (
        <div className="relative group">
          <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
            
            {/* Overlay com ações */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={handleRemove}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Progress indicator */}
          {isUploading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-sm text-gray-600">Fazendo upload... {uploadProgress}%</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Área de upload */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
        />
        
        <div className="space-y-3">
          <div className="flex justify-center">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
          
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Enviando...' : 'Selecionar Imagem'}
            </button>
            
            <p className="text-sm text-gray-500 mt-2">
              ou arraste e solte uma imagem aqui
            </p>
          </div>
          
          <p className="text-xs text-gray-400">
            Formatos: JPG, PNG, GIF, WebP (máx. {maxSize}MB)
          </p>
        </div>
      </div>

      {/* Campo de URL como alternativa */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Ou informar URL da imagem:
        </label>
        <input
          type="url"
          value={value}
          onChange={handleUrlChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isUploading}
        />
      </div>
    </div>
  );
}

export default ImageUpload;
