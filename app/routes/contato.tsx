import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { 
  Phone, 
  Mail as Envelope, 
  MapPin, 
  Clock, 
  Send, 
  User,
  Building,
  MessageSquare,
  CheckCircle
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    contactType: "general" // general, quote, technical
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const offices = [
    {
      city: "São Paulo",
      address: "Av. Paulista, 1000 - Bela Vista",
      phone: "(11) 5555-1234",
      email: "sp@prorevest.com.br",
      hours: "Segunda a Sexta: 8h às 18h"
    },
    {
      city: "Rio de Janeiro",
      address: "Rua das Flores, 200 - Botafogo",
      phone: "(21) 5555-5678",
      email: "rj@prorevest.com.br",
      hours: "Segunda a Sexta: 8h às 18h"
    },
    {
      city: "Belo Horizonte",
      address: "Av. Afonso Pena, 500 - Centro",
      phone: "(31) 5555-9012",
      email: "bh@prorevest.com.br",
      hours: "Segunda a Sexta: 8h às 18h"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulação de envio
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Formulário enviado:", formData);
      setIsSubmitted(true);
      setIsSubmitting(false);
      
      // Resetar formulário após envio
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          contactType: "general"
        });
        setIsSubmitted(false);
      }, 3000);
      
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      alert("Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.");
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isSubmitted) {
    return (
      <Layout showHeaderFooter={false}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-green-100 text-green-600 rounded-full p-4 mb-6 inline-block">
              <CheckCircle className="h-12 w-12" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Mensagem Enviada!</h1>
            <p className="text-lg text-gray-600 mb-8">Obrigado pelo seu contato. Responderemos em breve.</p>
            <Link 
              to="/" 
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Voltar para Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showHeaderFooter={false}>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative text-white py-16">
          <div
            className="absolute inset-0 bg-fixed bg-cover bg-center"
            style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Entre em Contato
              </h1>
              <p className="text-xl max-w-3xl mx-auto opacity-90">
                Estamos aqui para ajudar. Entre em contato conosco e descubra como podemos transformar seu espaço.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Envie sua Mensagem</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="seu.email@exemplo.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="(11) 9999-9999"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Assunto
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="Orçamento">Orçamento</option>
                      <option value="Assessoria">Assessoria Técnica</option>
                      <option value="Dúvida">Dúvida</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Mensagem *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Descreva sua mensagem aqui..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white border-t-transparent mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Enviar Mensagem
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-primary" />
                  Contato Telefônico
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700">Telefone 1:</span>
                    <span className="text-gray-600 ml-2">51 98660-5758</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700">Telefone 2:</span>
                    <span className="text-gray-600 ml-2">51 99140-1815</span>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>Segunda a Sexta: 8h às 18h</p>
                  <p>Sábados: 9h às 13h</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Envelope className="h-5 w-5 mr-2 text-primary" />
                  E-mail
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700">Geral:</span>
                    <span className="text-gray-600 ml-2">matheus@prorevesttintas.com.br</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700">Vendas:</span>
                    <span className="text-gray-600 ml-2">matheus@prorevesttintas.com.br</span>
                  </div>
                  {/* <div className="flex items-center">
                    <span className="font-medium text-gray-700">Suporte:</span>
                    <span className="text-gray-600 ml-2">suporte@prorevesttintas.com.br</span>
                  </div> */}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  Endereço
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium text-gray-700">Endereço</span>
                    <p className="text-gray-600">CANOAS, RS - Brasil</p>
                  </div>
                </div>
              </div>

              <div className="bg-primary text-white rounded-lg p-6 mt-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2 text-white" />
                  Outras Formas de Contato
                </h3>
                <div className="space-y-3">
                  {/*<Link 
                    to="/catalogo" 
                    className="flex items-center text-white hover:text-gray-200 transition-colors"
                  >
                    <span className="mr-2">🛒</span>
                    Solicitar Orçamento Online
                  </Link>*/}
                  <Link 
                    to="/studio" 
                    className="flex items-center text-white hover:text-gray-200 transition-colors"
                  >
                    <span className="mr-2">🎨</span>
                    Experimentar o Simulador
                  </Link>
                  <div className="flex items-center text-white hover:text-gray-200 transition-colors">
                    <span className="mr-2">💬</span>
                    Instagram: @prorevest
                  </div>
                  <div className="flex items-center text-white hover:text-gray-200 transition-colors">
                    <span className="mr-2">📘</span>
                    WhatsApp: (51) 96660-5758
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <Link 
              to="/catalogo"
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900">Catálogo</h3>
              <p className="text-sm text-gray-600">Nossos produtos</p>
            </Link>

            <Link 
              to="/studio"
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900">Simulador</h3>
              <p className="text-sm text-gray-600">Visualize cores</p>
            </Link>

            <Link
              to="/orcamento"
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900">Orçamento</h3>
              <p className="text-sm text-gray-600">Cotação rápida</p>
            </Link>
          </div>

          {/* FAQ Section */}
          <div className="bg-gray-100 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Perguntas Frequentes</h2>
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Como posso solicitar um orçamento?</h3>
                <p className="text-gray-600">Você pode solicitar um orçamento através do nosso formulário online, WhatsApp ou ligando para nossa central de atendimento.</p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Vocês entregam em todo o Brasil?</h3>
                <p className="text-gray-600">Sim, realizamos entregas em todo o território nacional. Consulte nossas condições de entrega.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Qual o prazo de entrega?</h3>
                <p className="text-gray-600">O prazo médio é de 5 a 10 dias úteis, dependendo da sua localização e dos produtos solicitados.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
