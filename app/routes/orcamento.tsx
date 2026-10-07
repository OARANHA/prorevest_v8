import { type LoaderFunctionArgs, type ActionFunctionArgs } from "react-router-dom";
import { redirect } from "react-router";
import { useLoaderData, useSearchParams, Form, useActionData, useNavigation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ProductService } from "~/services/productService";
import Layout from "~/components/Layout";
import { Calculator, Palette, Brush, FileText, Send, CheckCircle, AlertCircle } from "lucide-react";
import { useFormValidation, ValidationRules } from "~/hooks/useFormValidation";

interface Color {
  id: string;
  name: string;
  hex_code: string;
}

interface PaintType {
  id: string;
  name: string;
  description: string;
  applications: string[];
  coverage: string; // m²/L
  price_per_liter: number;
  min_quantity: number;
  icon: string;
}

interface LoaderData {
  colors: Color[];
  paintTypes: PaintType[];
  selectedColor?: Color;
  selectedPaintType?: PaintType;
}

interface ActionData {
  success?: boolean;
  error?: string;
  quoteId?: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const colorId = url.searchParams.get("cor");
  const paintTypeId = url.searchParams.get("tipo");
  
  const colors = await ProductService.getColors();
  
  // Tipos de tinta disponíveis
  const paintTypes: PaintType[] = [
    {
      id: "prime-selador",
      name: "Prime/Selador",
      description: "Primer e selador para preparação de superfícies",
      applications: ["Preparação de paredes", "Selagem de superfícies porosas", "Base para tintas"],
      coverage: "12-15",
      price_per_liter: 0,
      min_quantity: 1,
      icon: "🔧"
    },
    {
      id: "tinta-acrilica",
      name: "Tinta Acrílica",
      description: "Tinta à base de água para uso interno e externo",
      applications: ["Paredes internas", "Paredes externas", "Alvenaria", "Reboco"],
      coverage: "10-12",
      price_per_liter: 0,
      min_quantity: 1,
      icon: "🏠"
    },
    {
      id: "tinta-esmalte",
      name: "Tinta Esmalte",
      description: "Tinta sintética para madeira e metal",
      applications: ["Madeira", "Metal", "Portões", "Janelas", "Móveis"],
      coverage: "8-10",
      price_per_liter: 0,
      min_quantity: 1,
      icon: "🚪"
    },
    {
      id: "tinta-texturizada",
      name: "Tinta Texturizada",
      description: "Tinta com efeito texturizado para acabamentos especiais",
      applications: ["Paredes decorativas", "Fachadas", "Acabamentos especiais"],
      coverage: "6-8",
      price_per_liter: 0,
      min_quantity: 2,
      icon: "🎨"
    },
    {
      id: "verniz",
      name: "Verniz",
      description: "Verniz transparente para proteção e acabamento",
      applications: ["Madeira", "Móveis", "Pisos", "Proteção UV"],
      coverage: "12-15",
      price_per_liter: 0,
      min_quantity: 1,
      icon: "✨"
    }
  ];

  let selectedColor;
  if (colorId) {
    selectedColor = colors.find(color => color.id === colorId);
  }

  let selectedPaintType;
  if (paintTypeId) {
    selectedPaintType = paintTypes.find(pt => pt.id === paintTypeId);
  }

  return {
    colors,
    paintTypes,
    selectedColor,
    selectedPaintType
  };
}

import { QuoteService } from "~/services/quoteService";
import { supabase } from "~/lib/supabaseClient";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  
  try {
    // Obter sessão do usuário
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return { 
        error: "Usuário não autenticado. Faça login para solicitar orçamento." 
      };
    }

    // Preparar dados do orçamento
    const quoteData = {
      user_id: session.user.id,
      status: 'draft' as const,
      customer_name: formData.get("customerName") as string,
      customer_email: formData.get("customerEmail") as string,
      customer_phone: formData.get("customerPhone") as string || undefined,
      notes: formData.get("observations") as string || "",
      subtotal: 0, // Será calculado baseado nos itens
      discount: 0,
      total: 0, // Será calculado
    };

    // Criar orçamento no banco de dados
    const quote = await QuoteService.createQuote(quoteData);
    
    // Adicionar itens do orçamento
    const paintType = formData.get("paintType") as string;
    const colorId = formData.get("colorId") as string;
    const quantity = parseInt(formData.get("quantity") as string) || 0;
    const area = parseFloat(formData.get("area") as string) || 0;

    if (paintType && colorId && quantity > 0) {
      // Aqui você precisaria buscar o preço real do produto
      // Por enquanto, usando um valor padrão
      const priceAtTime = 32.90; // Preço padrão da tinta acrílica
      
      await QuoteService.addQuoteItem({
        quote_id: quote.id,
        variant_id: colorId, // Na prática, seria o ID da variante do produto
        quantity: quantity,
        price_at_time: priceAtTime
      });

      // Atualizar total do orçamento
      const total = quantity * priceAtTime;
      await QuoteService.updateQuote(quote.id, {
        subtotal: total,
        total: total
      });
    }
    
    return { 
      success: true, 
      quoteId: quote.id 
    };
  } catch (error) {
    console.error("Erro ao processar orçamento:", error);
    return { 
      error: "Erro ao processar orçamento. Tente novamente." 
    };
  }
}

export default function Orcamento() {
  const { colors, paintTypes, selectedColor, selectedPaintType: preselectedPaintType } = useLoaderData<LoaderData>();
  const [searchParams] = useSearchParams();
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  
  const [selectedPaintType, setSelectedPaintType] = useState<string>(preselectedPaintType?.id || "");
  const [selectedColorId, setSelectedColorId] = useState<string>(selectedColor?.id || "");
  const [area, setArea] = useState<string>("");
  const [calculatedQuantity, setCalculatedQuantity] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const isSubmitting = navigation.state === "submitting";

  // Calcular quantidade e preço quando área ou tipo de tinta mudam
  useEffect(() => {
    if (area && selectedPaintType) {
      const paintType = paintTypes.find(pt => pt.id === selectedPaintType);
      if (paintType) {
        const areaNum = parseFloat(area);
        const coverage = parseFloat(paintType.coverage.split("-")[0]); // Pega o menor valor de cobertura
        const quantity = Math.ceil(areaNum / coverage);
        const finalQuantity = Math.max(quantity, paintType.min_quantity);
        
        setCalculatedQuantity(finalQuantity);
        setTotalPrice(finalQuantity * paintType.price_per_liter);
      }
    }
  }, [area, selectedPaintType, paintTypes]);

  const selectedPaint = paintTypes.find(pt => pt.id === selectedPaintType);
  const selectedColorObj = colors.find(color => color.id === selectedColorId);

  if (actionData?.success) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Orçamento Enviado!
              </h2>
              <p className="text-gray-600 mb-4">
                Seu orçamento foi registrado com sucesso.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 font-semibold">
                  Número do Orçamento: {actionData.quoteId}
                </p>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Entraremos em contato em até 24 horas com o orçamento detalhado.
              </p>
              <div className="space-y-2">
                <a
                  href="/orcamento"
                  className="block w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Novo Orçamento
                </a>
                <a
                  href="/cores"
                  className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Ver Paleta de Cores
                </a>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section Minimalista */}
        <div className="bg-white border-b border-gray-100 py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center">
              <h1 className="text-4xl font-light text-gray-900 mb-4">
                Solicite seu Orçamento
              </h1>
              <p className="text-lg text-gray-600">
                Nossa equipe entrará em contato com uma proposta personalizada
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <Form method="post" className="max-w-2xl mx-auto">
            <div className="space-y-8">
              {/* Tipo de Tinta - Simplificado */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Tipo de Tinta</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {paintTypes.map((paintType) => (
                    <label
                      key={paintType.id}
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedPaintType === paintType.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paintType"
                        value={paintType.id}
                        checked={selectedPaintType === paintType.id}
                        onChange={(e) => setSelectedPaintType(e.target.value)}
                        className="text-blue-600"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{paintType.icon}</span>
                        <div>
                          <h3 className="font-medium text-gray-900">{paintType.name}</h3>
                          <p className="text-xs text-gray-500">{paintType.description}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cor - Simplificado */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Cor Desejada</h2>
                <select
                  name="colorId"
                  value={selectedColorId}
                  onChange={(e) => setSelectedColorId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecione uma cor</option>
                  {colors.map((color) => (
                    <option key={color.id} value={color.id}>
                      {color.name} ({color.hex_code})
                    </option>
                  ))}
                </select>
                
                {selectedColorObj && (
                  <div className="mt-3 flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: selectedColorObj.hex_code }}
                    />
                    <span className="font-medium text-gray-900">{selectedColorObj.name}</span>
                    <span className="text-sm text-gray-500">{selectedColorObj.hex_code}</span>
                  </div>
                )}
              </div>

              {/* Área - Simplificado */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Área a Pintar</h2>
                <div className="flex gap-3">
                  <input
                    type="number"
                    name="area"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Ex: 50"
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    step="0.1"
                    required
                  />
                  <span className="flex items-center px-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-600">
                    m²
                  </span>
                </div>
                
                {calculatedQuantity > 0 && selectedPaint && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Quantidade estimada:</strong> {calculatedQuantity} litros
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Baseado na cobertura de {selectedPaint.coverage} m²/L
                    </p>
                  </div>
                )}
              </div>

              {/* Dados do Cliente - Simplificado */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Seus Dados</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="customerName"
                    placeholder="Nome completo"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="email"
                      name="customerEmail"
                      placeholder="E-mail"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <input
                      type="tel"
                      name="customerPhone"
                      placeholder="Telefone/WhatsApp"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <textarea
                    name="observations"
                    placeholder="Observações adicionais (opcional)"
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {/* Botão de Envio - Minimalista */}
              <button
                type="submit"
                disabled={isSubmitting || !selectedPaintType || !selectedColorId || !area}
                className="w-full px-6 py-4 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Enviando...
                  </div>
                ) : (
                  "Solicitar Orçamento"
                )}
              </button>

              {actionData?.error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  {actionData.error}
                </div>
              )}
            </div>

            {/* Campos ocultos para o cálculo */}
            <input type="hidden" name="quantity" value={calculatedQuantity} />
          </Form>
        </div>
      </div>
    </Layout>

  );
}
