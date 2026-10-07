import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLoaderData, useActionData, Form } from "react-router-dom";
import { redirect } from "react-router";
import { Save, Eye, ArrowLeft, Upload, X, Wand2, Loader2, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { BlogService, type BlogPost } from "../../services/blogService";
import { ProRevestAIService } from "../../services/zaiService";
import { ImageUploadService } from "../../services/imageUploadService";
import { supabaseServerClient } from "../../lib/supabaseServerClient";
import { supabase } from "../../lib/supabaseClient";

export const meta: MetaFunction = () => {
  return [
    { title: "Novo Post - Blog - ProRevest" },
    { name: "description", content: "Crie um novo post para o blog da ProRevest" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  return { categories: await BlogService.getBlogCategories() };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  console.log('=== Blog Post Action ===');
  console.log('Intent:', intent);
  console.log('FormData entries:', Array.from(formData.entries()).map(([k, v]) => `${k}: ${v?.toString()?.substring(0, 100)}`));

  // Obter tokens de autenticação do formulário
  const access_token = formData.get('access_token') as string;
  const refresh_token = formData.get('refresh_token') as string;


  // Criar cliente Supabase autenticado com os tokens
  let author_id: string | null = null;
  let authenticatedClient = supabaseServerClient;

  if (access_token && refresh_token) {
    try {
      // Criar novo cliente com sessão do usuário
      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase credentials not configured');
      }

      // Criar cliente e setar sessão
      const { createClient } = await import('@supabase/supabase-js');
      const client = createClient(supabaseUrl, supabaseKey);

      const { data: sessionData, error: sessionError } = await client.auth.setSession({
        access_token,
        refresh_token
      });

      console.log('Session error:', sessionError);
      console.log('Session user:', sessionData?.user?.id);

      if (!sessionError && sessionData.user) {
        author_id = sessionData.user.id;
        authenticatedClient = client;
      }
    } catch (e) {
      console.error('Error setting session:', e);
    }
  }

  // Se intent é 'save', status deve ser 'published'
  const status = intent === 'save' ? 'published' : formData.get('status') as 'draft' | 'published';

  const postData = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    excerpt: formData.get('excerpt') as string,
    content: formData.get('content') as string,
    author: formData.get('author') as string || 'ProRevest Team',
    author_id: author_id,
    status: status,
    category: formData.get('category') as string || 'Geral',
    featured_image: formData.get('featured_image') as string || null,
    tags: (formData.get('tags') as string || '').split(',').map(tag => tag.trim()).filter(Boolean),
    published_at: status === 'published' ? new Date().toISOString() : null,
  };

  console.log('Post data to create:', {
    title: postData.title,
    slug: postData.slug,
    status: postData.status,
    author_id: postData.author_id,
    category: postData.category
  });

  try {
    if (intent === 'save' || intent === 'preview') {
      // Usar cliente autenticado para criar post (passar RLS)
      const newPost = await BlogService.createBlogPost(postData, authenticatedClient);
      console.log('Post created successfully:', newPost.id);

      if (intent === 'save') {
        return redirect('/admin/blog-posts');
      } else {
        return redirect(`/blog/${newPost.slug}?preview=true`);
      }
    }
  } catch (error) {
    console.error('Error creating blog post:', error);
    return { error: 'Erro ao criar post: ' + (error instanceof Error ? error.message : 'Erro desconhecido') };
  }

  return null;
}

export default function NewBlogPost() {
  const { categories } = useLoaderData() as { categories: string[] };
  const actionData = useActionData() as { error?: string } | undefined;
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'ProRevest Team',
    status: 'draft' as 'draft' | 'published',
    category: 'Geral',
    featured_image: '',
    tags: ''
  });

  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [tokens, setTokens] = useState<{ access_token: string; refresh_token: string }>({ access_token: '', refresh_token: '' });

  // Capturar tokens da sessão no cliente e enviar via formulário para autenticar a action SSR
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setTokens({
        access_token: data.session?.access_token || '',
        refresh_token: data.session?.refresh_token || '',
      });
    })();
  }, []);

  // Gerar slug automático a partir do título
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({ ...prev, title }));
    
    // Gerar slug automaticamente se ainda estiver vazio
    if (!formData.slug || isGeneratingSlug) {
      setIsGeneratingSlug(true);
      const slug = generateSlug(title);
      setFormData(prev => ({ ...prev, slug }));
      setTimeout(() => setIsGeneratingSlug(false), 1000);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateWithAI = async () => {
    if (!aiTopic.trim()) {
      alert('Por favor, digite um tópico para o post.');
      return;
    }

    setIsGeneratingWithAI(true);
    
    try {
      const generatedPost = await ProRevestAIService.generateBlogPostFromTopic(aiTopic, formData.category);
      
      setFormData(prev => ({
        ...prev,
        title: generatedPost.title,
        slug: generatedPost.slug,
        excerpt: generatedPost.excerpt,
        content: generatedPost.content,
        tags: generatedPost.tags.join(', ')
      }));

      setAiTopic('');
    } catch (error) {
      console.error('Erro ao gerar post com IA:', error);
      alert('Erro ao gerar post com IA. Verifique se a API key está configurada.');
    } finally {
      setIsGeneratingWithAI(false);
    }
  };

  // Função para fazer upload de imagem
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo do arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    setIsUploading(true);
    
    // Criar preview imediato
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string;
      setImagePreview(previewUrl);
    };
    reader.readAsDataURL(file);

    try {
      const key = formData.slug || `${Date.now()}`;
      const result = await ImageUploadService.uploadImage(file, key);

      if (result.success && result.url) {
        setFormData(prev => ({ ...prev, featured_image: result.url || '' }));
        setImagePreview(result.url || '');
      } else {
        alert('Falha no upload para o Storage. Verifique se você está logado e tem permissão.');
      }
    } catch (error) {
      alert('Upload falhou. Verifique sua conexão e sessão.');
    } finally {
      setIsUploading(false);
    }
  };

  // Função para remover imagem
  const removeImage = () => {
    setFormData(prev => ({ ...prev, featured_image: '' }));
    setImagePreview('');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-5 w-5" />
                Voltar
              </button>
              <div>
                <h1 className="text-3xl font-cormorant font-bold">Novo Post</h1>
                <p className="text-muted-foreground">Crie um novo post para o blog</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <Form method="post">
                <input type="hidden" name="intent" value="preview" />
                <input type="hidden" name="access_token" value={tokens.access_token} />
                <input type="hidden" name="refresh_token" value={tokens.refresh_token} />
                {Object.entries(formData).map(([key, value]) => (
                  <input key={key} type="hidden" name={key} value={value} />
                ))}
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted"
                >
                  <Eye className="h-4 w-4" />
                  Visualizar
                </button>
              </Form>

              <Form method="post">
                <input type="hidden" name="intent" value="save" />
                <input type="hidden" name="access_token" value={tokens.access_token} />
                <input type="hidden" name="refresh_token" value={tokens.refresh_token} />
                {Object.entries(formData).map(([key, value]) => (
                  <input key={key} type="hidden" name={key} value={value} />
                ))}
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
                  disabled={!formData.title || !formData.content}
                >
                  <Save className="h-4 w-4" />
                  Publicar
                </button>
              </Form>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {actionData?.error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <p className="text-destructive">{actionData.error}</p>
          </div>
        )}

        <Form method="post" className="space-y-6">
          <input type="hidden" name="intent" value="save" />
          <input type="hidden" name="access_token" value={tokens.access_token} />
          <input type="hidden" name="refresh_token" value={tokens.refresh_token} />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 xl:col-span-4 space-y-8 p-8 bg-slate-800/30 rounded-lg border border-slate-700/50">
              {/* AI Generation */}
              <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-8">
                <h3 className="font-medium mb-6 flex items-center gap-3 text-slate-200">
                  <Wand2 className="h-6 w-6 text-purple-400" />
                  Gerar Post com IA
                </h3>

                <div className="flex gap-4">
                  <input
                    type="text"
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    className="flex-1 px-5 py-4 border border-slate-600 rounded-lg bg-slate-700/50 text-slate-200 text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
                    placeholder="Digite um tópico (ex: 'Cores para sala de estar')"
                    onKeyPress={(e) => e.key === 'Enter' && !isGeneratingWithAI && handleGenerateWithAI()}
                  />
                  <button
                    type="button"
                    onClick={handleGenerateWithAI}
                    disabled={isGeneratingWithAI || !aiTopic.trim()}
                    className="flex items-center gap-3 px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {isGeneratingWithAI ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-5 w-5" />
                        Gerar
                      </>
                    )}
                  </button>
                </div>

                <p className="text-sm text-slate-300 mt-4">
                  A IA irá gerar um título, conteúdo, resumo e tags automaticamente com base no tópico.
                </p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-4">
                  Título do Post *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full px-6 py-5 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-lg"
                  placeholder="Digite um título atraente..."
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-4">
                  URL Amigável (Slug)
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="w-full px-6 py-5 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 font-mono text-lg"
                  placeholder="url-amigavel-do-post"
                />
                <p className="text-sm text-slate-400 mt-3">
                  URL amigável para o post. Será gerada automaticamente a partir do título.
                </p>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-4">
                  Resumo
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  rows={5}
                  className="w-full px-6 py-5 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 resize-none text-lg"
                  placeholder="Breve resumo do post (aparece na listagem)..."
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-4">
                  Conteúdo *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  rows={25}
                  className="w-full px-6 py-5 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 resize-none font-mono text-lg"
                  placeholder="Escreva o conteúdo do post em Markdown..."
                  required
                />
                <p className="text-sm text-slate-400 mt-3">
                  Use Markdown para formatar o conteúdo. Títulos com ##, negrito com **texto**, etc.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Status */}
              <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-6">
                <h3 className="font-medium mb-4 text-slate-200">Publicação</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-600 rounded-lg bg-slate-700/50 text-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                    >
                      <option value="draft">Rascunho</option>
                      <option value="published">Publicado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Autor</label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={(e) => handleInputChange('author', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-600 rounded-lg bg-slate-700/50 text-slate-200 text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                    />
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-6">
                <h3 className="font-medium mb-4 text-slate-200">Categoria</h3>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Categoria</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-600 rounded-lg bg-slate-700/50 text-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                  >
                    <option value="">Selecione...</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                    <option value="Nova Categoria">+ Nova Categoria</option>
                  </select>
                </div>

                {formData.category === 'Nova Categoria' && (
                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="Nome da nova categoria"
                      className="w-full px-4 py-3 border border-slate-600 rounded-lg bg-slate-700/50 text-slate-200 text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                      onChange={(e) => handleInputChange('category', e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Featured Image */}
              <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-6">
                <h3 className="font-medium text-slate-200 mb-6 flex items-center gap-3">
                  <ImageIcon className="h-6 w-6 text-blue-400" />
                  Imagem Destaque
                </h3>

                {/* Área de Upload */}
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 hover:border-slate-500 transition-colors bg-slate-700/30">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload-new"
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="image-upload-new"
                      className={`flex flex-col items-center gap-4 cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center border-2 border-slate-500">
                        {isUploading ? (
                          <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                        ) : (
                          <Upload className="h-8 w-8 text-slate-300" />
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-base text-slate-300 mb-1">
                          {isUploading ? 'Fazendo upload...' : 'Clique para fazer upload'}
                        </p>
                        <p className="text-sm text-slate-400">PNG, JPG até 5MB</p>
                      </div>
                    </label>
                  </div>

                  {/* Preview da Imagem */}
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  )}

                  {/* URL Manual */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Ou insira URL da imagem
                    </label>
                    <input
                      type="url"
                      name="featured_image"
                      value={formData.featured_image}
                      onChange={(e) => {
                        handleInputChange('featured_image', e.target.value);
                        setImagePreview(e.target.value);
                      }}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-6">
                <h3 className="font-medium mb-4 text-slate-200">Tags</h3>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tags</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-600 rounded-lg bg-slate-700/50 text-slate-200 text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                    placeholder="tag1, tag2, tag3"
                  />
                  <p className="text-sm text-slate-400 mt-2">
                    Separe as tags com vírgula.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Form>
    </div>
  );
}
