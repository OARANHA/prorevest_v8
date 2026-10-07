import type { MetaFunction } from "react-router-dom";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, X, SwatchBook, Archive } from "lucide-react";
import { productService, type Color, type Category } from "../../services/productService";
import { colorTextureService } from "../../services/colorTextureService";

export const meta: MetaFunction = () => {
  return [
    { title: "Gestão de Cores - ProRevest" },
    { name: "description", content: "Gerencie o catálogo de cores" },
  ];
};

export default function AdminColors() {
  const [colors, setColors] = useState<Color[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  const [categories, setCategories] = useState<Category[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);
  const [form, setForm] = useState<Partial<Color>>({
    name: "",
    hex_code: "",
    category: "",
    ral_code: "",
    pantone_code: "",
    ncs_code: "",
    description: "",
  });
  // Campo auxiliar para RGB textual (ex.: "255, 200, 100" ou "rgb(255,200,100)" ou "#RRGGBB")
  const [rgbInput, setRgbInput] = useState<string>("");

  // Conversão: ao colar RGB, atualiza HEX automaticamente
  function parseRgbOrHexToHex(input: string): string | null {
    try {
      const s = input.trim();
      // Se já for HEX válido
      const hexMatch = s.match(/^#?([a-fA-F0-9]{6})$/);
      if (hexMatch) {
        return `#${hexMatch[1].toLowerCase()}`;
      }
      // Formato rgb(r,g,b)
      const rgbFuncMatch = s.match(/rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/i);
      if (rgbFuncMatch) {
        const r = Math.max(0, Math.min(255, parseInt(rgbFuncMatch[1], 10)));
        const g = Math.max(0, Math.min(255, parseInt(rgbFuncMatch[2], 10)));
        const b = Math.max(0, Math.min(255, parseInt(rgbFuncMatch[3], 10)));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      }
      // Formato "r, g, b" ou "r g b"
      const parts = s.split(/[,\s]+/).filter(Boolean);
      if (parts.length === 3) {
        const r = Math.max(0, Math.min(255, parseInt(parts[0], 10)));
        const g = Math.max(0, Math.min(255, parseInt(parts[1], 10)));
        const b = Math.max(0, Math.min(255, parseInt(parts[2], 10)));
        if ([r, g, b].every((n) => Number.isFinite(n))) {
          return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  const resetForm = () => {
    setForm({
      name: "",
      hex_code: "",
      category: "",
      ral_code: "",
      pantone_code: "",
      ncs_code: "",
      description: "",
    });
  };

  const loadColors = async () => {
    setLoading(true);
    try {
      const { colors: data, total } = await productService.getColors({
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
        category: categoryFilter,
        search: searchTerm,
      });
      setColors(data);
      setTotal(total);
    } catch (error) {
      console.error("Erro ao carregar cores:", error);
      alert("Erro ao carregar cores.");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await productService.getCategories();
      setCategories(cats);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadColors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, categoryFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadColors();
  };

  const openNewColorModal = () => {
    setEditingColor(null);
    resetForm();
    setRgbInput("");
    setShowModal(true);
  };

  const openEditColorModal = (color: Color) => {
    setEditingColor(color);
    setForm({
      name: color.name,
      hex_code: color.hex_code,
      category: color.category,
      ral_code: color.ral_code,
      pantone_code: color.pantone_code,
      ncs_code: color.ncs_code,
      description: color.description,
      is_archived: color.is_archived,
    });
    // Preenche RGB textual a partir do hex se existir
    if (color.hex_code && /^#?[a-fA-F0-9]{6}$/.test(color.hex_code)) {
      const h = color.hex_code.startsWith('#') ? color.hex_code.slice(1) : color.hex_code;
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      setRgbInput(`${r}, ${g}, ${b}`);
    } else {
      setRgbInput("");
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (!form.name) {
        alert("Informe o nome da cor.");
        return;
      }

      // Se usuário preencheu RGB, converter e garantir hex_code
      if (rgbInput && !form.hex_code) {
        const hex = parseRgbOrHexToHex(rgbInput);
        if (hex) {
          setForm((prev) => ({ ...prev, hex_code: hex }));
        }
      }

      // Normalizar HEX se usuário colar no campo HEX (sem #)
      if (form.hex_code) {
        const normalized = parseRgbOrHexToHex(form.hex_code);
        if (normalized) {
          form.hex_code = normalized;
        }
      }

      // Popular rgb_info com base no hex_code
      if (form.hex_code && /^#?[a-fA-F0-9]{6}$/.test(form.hex_code)) {
        const h = form.hex_code.startsWith('#') ? form.hex_code.slice(1) : form.hex_code;
        const r = parseInt(h.slice(0, 2), 16);
        const g = parseInt(h.slice(2, 4), 16);
        const b = parseInt(h.slice(4, 6), 16);
        (form as any).rgb_info = `${r},${g},${b}`;
      }

      if (!editingColor) {
        await colorTextureService.createColor(form);
      } else {
        await colorTextureService.updateColor(editingColor.id, form);
      }

      setShowModal(false);
      await loadColors();
    } catch (error) {
      console.error("Erro ao salvar cor:", error);
      alert("Erro ao salvar cor.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta cor?")) return;
    try {
      await colorTextureService.deleteColor(id);
      await loadColors();
    } catch (error) {
      console.error("Erro ao excluir cor:", error);
      alert("Erro ao excluir cor.");
    }
  };

  const toggleArchive = async (color: Color) => {
    try {
      await colorTextureService.updateColor(color.id, { is_archived: !color.is_archived });
      await loadColors();
    } catch (error) {
      console.error("Erro ao arquivar/desarquivar:", error);
      alert("Erro ao atualizar status da cor.");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><SwatchBook className="h-6 w-6" /> Gestão de Cores</h1>
        <button
          onClick={openNewColorModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus className="inline h-4 w-4 mr-2" /> Nova Cor
        </button>
      </div>

      {/* Filtros e busca */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Busca</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nome, HEX, RAL, Código ProRevest"
              className="w-full px-3 py-2 rounded-md border border-gray-700 bg-slate-800 text-white"
            />
            <button type="submit" className="px-3 py-2 bg-slate-700 rounded-md text-white hover:bg-slate-600">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Categoria</label>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-2 rounded-md border border-gray-700 bg-slate-800 text-white"
          >
            <option value="Todos">Todas</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </form>

      {/* Lista */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm text-slate-300">Cor</th>
              <th className="px-4 py-3 text-left text-sm text-slate-300">Categoria</th>
              <th className="px-4 py-3 text-left text-sm text-slate-300">HEX</th>
              <th className="px-4 py-3 text-left text-sm text-slate-300">RAL</th>
              <th className="px-4 py-3 text-left text-sm text-slate-300">Pantone</th>
              <th className="px-4 py-3 text-left text-sm text-slate-300">NCS</th>
              <th className="px-4 py-3 text-left text-sm text-slate-300">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-slate-300">Carregando...</td></tr>
            ) : colors.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-slate-300">Nenhuma cor encontrada.</td></tr>
            ) : (
              colors.map((c) => (
                <tr key={c.id} className="border-t border-slate-700">
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded" style={{ backgroundColor: c.hex_code || '#999' }} />
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-slate-400">{c.description || ''}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">{c.category || '-'}</td>
                  <td className="px-4 py-2">{c.hex_code || '-'}</td>
                  <td className="px-4 py-2">{c.ral_code || '-'}</td>
                  <td className="px-4 py-2">{c.pantone_code || '-'}</td>
                  <td className="px-4 py-2">{c.ncs_code || '-'}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditColorModal(c)} className="px-2 py-1 bg-slate-700 rounded text-white hover:bg-slate-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => toggleArchive(c)} className="px-2 py-1 bg-yellow-600 rounded text-white hover:bg-yellow-500" title={c.is_archived ? 'Desarquivar' : 'Arquivar'}>
                        <Archive className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="px-2 py-1 bg-red-600 rounded text-white hover:bg-red-500">
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
        <div className="text-sm text-slate-400">Total: {total}</div>
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
                {editingColor ? 'Editar Cor' : 'Nova Cor'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-300 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Nome</label>
                  <input
                    value={form.name || ''}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-gray-700 bg-slate-900 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Categoria</label>
                  <select
                    value={form.category || ''}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-gray-700 bg-slate-900 text-white"
                  >
                    <option value="">Selecione</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">HEX</label>
                <input
                  value={form.hex_code || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm({ ...form, hex_code: val });
                    const normalized = parseRgbOrHexToHex(val);
                    if (normalized) {
                      // Atualiza RGB textual a partir do HEX
                      const h = normalized.slice(1);
                      const r = parseInt(h.slice(0, 2), 16);
                      const g = parseInt(h.slice(2, 4), 16);
                      const b = parseInt(h.slice(4, 6), 16);
                      setRgbInput(`${r}, ${g}, ${b}`);
                    }
                  }}
                  placeholder="#RRGGBB"
                  className="w-full px-3 py-2 rounded-md border border-gray-700 bg-slate-900 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">RGB</label>
                <input
                  value={rgbInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setRgbInput(val);
                    const hex = parseRgbOrHexToHex(val);
                    if (hex) {
                      setForm({ ...form, hex_code: hex });
                    }
                  }}
                  placeholder="Ex.: 255, 200, 100 ou rgb(255,200,100)"
                  className="w-full px-3 py-2 rounded-md border border-gray-700 bg-slate-900 text-white"
                />
              </div>
              <div className="flex items-end">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Preview</label>
                  <div className="h-10 w-16 rounded border border-slate-700" style={{ backgroundColor: form.hex_code || '#999' }} />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">RAL</label>
                <input
                  value={form.ral_code || ''}
                  onChange={(e) => setForm({ ...form, ral_code: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-gray-700 bg-slate-900 text-white"
                />
              </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Pantone</label>
                  <input
                    value={form.pantone_code || ''}
                    onChange={(e) => setForm({ ...form, pantone_code: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-gray-700 bg-slate-900 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">NCS</label>
                  <input
                    value={form.ncs_code || ''}
                    onChange={(e) => setForm({ ...form, ncs_code: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-gray-700 bg-slate-900 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Descrição</label>
                <textarea
                  value={form.description || ''}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-gray-700 bg-slate-900 text-white"
                />
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