import type { MetaFunction } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Plus, Edit, Trash2, Search, X, Layers } from "lucide-react";
import { productService, type Texture } from "../../services/productService";
import { colorTextureService } from "../../services/colorTextureService";
import { ImageUpload } from "../../components/ImageUpload";

export const meta: MetaFunction = () => {
  return [
    { title: "Gestão de Texturas - ProRevest" },
    { name: "description", content: "Gerencie texturas do catálogo" },
  ];
};

export default function AdminTextures() {
  const [textures, setTextures] = useState<Texture[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Texture | null>(null);
  const [form, setForm] = useState<{ name: string; slug?: string; description?: string; image_url?: string }>({ name: "", description: "" });

  const filtered = useMemo(() => {
    const base = textures || [];
    if (!searchTerm) return base;
    const s = searchTerm.toLowerCase();
    return base.filter((t) => (t.name || '').toLowerCase().includes(s) || (t.description || '').toLowerCase().includes(s));
  }, [textures, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  const loadTextures = async () => {
    setLoading(true);
    try {
      const data = await productService.getTextures();
      setTextures(data);
    } catch (error) {
      console.error("Erro ao carregar texturas:", error);
      alert("Erro ao carregar texturas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTextures();
  }, []);

  const openNewModal = () => {
    setEditing(null);
    setForm({ name: "", slug: "", description: "", image_url: "" });
    setShowModal(true);
  };

  const openEditModal = (t: Texture) => {
    setEditing(t);
    setForm({ name: t.name || '', slug: t.slug || '', description: t.description || '', image_url: (t as any).image_url || '' });
    setShowModal(true);
  };

  // Util para gerar slug do nome
  const slugify = (text: string): string => {
    return (text || '')
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleSave = async () => {
    try {
      if (!form.name) {
        alert("Informe o nome da textura.");
        return;
      }
      const slugToUse = form.slug && form.slug.trim() ? form.slug.trim() : slugify(form.name);
      const payload = { name: form.name, description: form.description || '', slug: slugToUse, image_url: form.image_url || undefined };
      if (!editing) {
        await colorTextureService.createTexture(payload);
      } else {
        await colorTextureService.updateTexture(editing.id, payload);
      }
      setShowModal(false);
      await loadTextures();
    } catch (error) {
      console.error("Erro ao salvar textura:", error);
      const msgSrc = (error as any)?.message ? String((error as any).message) : String(error);
      let userMsg = "Erro ao salvar textura.";
      if ((error as any)?.code === '23505' || msgSrc.includes('duplicate key') || msgSrc.includes('textures_slug_key')) {
        userMsg = "Já existe uma textura com este slug. Altere o nome ou o slug.";
      } else if (msgSrc.toLowerCase().includes('permission') || (error as any)?.code === '42501') {
        userMsg = "Permissão negada. Verifique se você está autenticado como administrador.";
      }
      alert(userMsg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta textura?")) return;
    try {
      await colorTextureService.deleteTexture(id);
      await loadTextures();
    } catch (error) {
      console.error("Erro ao excluir textura:", error);
      alert("Erro ao excluir textura.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Layers className="h-6 w-6" /> Gestão de Texturas</h1>
        <button
          onClick={openNewModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus className="inline h-4 w-4 mr-2" /> Nova Textura
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Busca</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Nome ou descrição"
              className="w-full px-3 py-2 rounded-md border border-gray-700 bg-slate-800 text-white"
            />
            <button type="button" className="px-3 py-2 bg-slate-700 rounded-md text-white hover:bg-slate-600">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm text-slate-300">Nome</th>
              <th className="px-4 py-3 text-left text-sm text-slate-300">Descrição</th>
              <th className="px-4 py-3 text-left text-sm text-slate-300">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="px-4 py-6 text-center text-slate-300">Carregando...</td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-6 text-center text-slate-300">Nenhuma textura encontrada.</td></tr>
            ) : (
              paginated.map((t) => (
                <tr key={t.id} className="border-t border-slate-700">
                  <td className="px-4 py-2">
                    <div className="font-medium">{t.name}</div>
                  </td>
                  <td className="px-4 py-2">{t.description || '-'}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditModal(t)} className="px-2 py-1 bg-slate-700 rounded text-white hover:bg-slate-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(t.id)} className="px-2 py-1 bg-red-600 rounded text-white hover:bg-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-400">Total: {filtered.length}</div>
        <div className="flex gap-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className="px-3 py-1 rounded bg-slate-700 text-white disabled:opacity-50">Anterior</button>
          <span className="px-2 py-1 text-slate-300">Página {currentPage} de {totalPages}</span>
          <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1 rounded bg-slate-700 text-white disabled:opacity-50">Próxima</button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-lg w-full max-w-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
              <h2 className="font-semibold">
                {editing ? 'Editar Textura' : 'Nova Textura'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-300 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-300 mb-1">Nome</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })}
                    className="w-full px-3 py-2 rounded-md border border-gray-700 bg-slate-900 text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-300 mb-1">Slug</label>
                  <input
                    value={form.slug || ''}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder={slugify(form.name || '')}
                    className="w-full px-3 py-2 rounded-md border border-gray-700 bg-slate-900 text-white"
                  />
                  <p className="text-xs text-slate-400 mt-1">Se vazio, usaremos: {slugify(form.name || '')}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-300 mb-1">Descrição</label>
                  <textarea
                    value={form.description || ''}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-gray-700 bg-slate-900 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Imagem ilustrativa (armazenamento)</label>
                <ImageUpload
                  value={form.image_url || ''}
                  onChange={(url) => setForm({ ...form, image_url: url })}
                  placeholder="URL da imagem"
                  accept="image/*"
                  maxSize={5}
                />
                <p className="text-xs text-slate-400 mt-1">A URL será persistida na textura e usada como miniatura no Studio.</p>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-700 rounded-md text-white">Cancelar</button>
                <button onClick={handleSave} className="px-4 py-2 bg-blue-600 rounded-md text-white">Salvar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}