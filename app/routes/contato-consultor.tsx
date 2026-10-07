import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Falar com Consultor de Cor - ProRevest" },
    { name: "description", content: "Conecte-se com nossos especialistas em cores para auxiliar no seu projeto." },
  ];
}

export default function ContatoConsultor() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: "residencial",
    message: ""
  });
  
  const [preferredContact, setPreferredContact] = useState("whatsapp");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-cormorant font-bold mb-4">Falar com Consultor de Cor</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Conecte-se com nossos especialistas em cores para auxiliar no seu projeto. 
          Nossos consultores estão prontos para ajudar você a encontrar as combinações perfeitas.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Options */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-2xl p-6 sticky top-6">
            <h2 className="text-xl font-cormorant font-bold mb-6">Como Prefere Ser Atendido?</h2>
            
            <div className="space-y-4">
              <button
                className={`w-full p-4 rounded-xl border text-left transition-colors ${
                  preferredContact === "whatsapp"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary"
                }`}
                onClick={() => setPreferredContact("whatsapp")}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">WhatsApp</h3>
                    <p className="text-sm text-muted-foreground">Resposta em até 15 minutos</p>
                  </div>
                </div>
              </button>
              
              <button
                className={`w-full p-4 rounded-xl border text-left transition-colors ${
                  preferredContact === "video"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary"
                }`}
                onClick={() => setPreferredContact("video")}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Vídeo Chamada</h3>
                    <p className="text-sm text-muted-foreground">Agende um horário conveniente</p>
                  </div>
                </div>
              </button>
              
              <button
                className={`w-full p-4 rounded-xl border text-left transition-colors ${
                  preferredContact === "email"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary"
                }`}
                onClick={() => setPreferredContact("email")}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">E-mail</h3>
                    <p className="text-sm text-muted-foreground">Resposta em até 24 horas</p>
                  </div>
                </div>
              </button>
              
              <button
                className={`w-full p-4 rounded-xl border text-left transition-colors ${
                  preferredContact === "phone"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary"
                }`}
                onClick={() => setPreferredContact("phone")}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Telefone</h3>
                    <p className="text-sm text-muted-foreground">Ligamos para você</p>
                  </div>
                </div>
              </button>
            </div>
            
            {/* Contact Info */}
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="font-medium mb-4">Informações de Contato</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>(11) 99999-9999</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>contato@tintaszanai.com.br</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Rua das Cores, 123 - São Paulo, SP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-xl font-cormorant font-bold mb-6">
              {preferredContact === "whatsapp" && "Conversar pelo WhatsApp"}
              {preferredContact === "video" && "Agendar Vídeo Chamada"}
              {preferredContact === "email" && "Enviar Mensagem por E-mail"}
              {preferredContact === "phone" && "Solicitar Ligação"}
            </h2>
            
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Solicitação Enviada!</h3>
                <p className="text-muted-foreground mb-6">
                  {preferredContact === "whatsapp" && "Em breve nosso consultor entrará em contato pelo WhatsApp."}
                  {preferredContact === "video" && "Você receberá um e-mail com os detalhes para agendar sua vídeo chamada."}
                  {preferredContact === "email" && "Recebemos sua mensagem e responderemos em até 24 horas."}
                  {preferredContact === "phone" && "Nosso consultor ligará para você no número informado."}
                </p>
                <button
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  onClick={() => setIsSubmitted(false)}
                >
                  Enviar Nova Solicitação
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                      Empresa (opcional)
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Nome da sua empresa"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="projectType" className="block text-sm font-medium mb-2">
                      Tipo de Projeto *
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      required
                      className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.projectType}
                      onChange={handleChange}
                    >
                      <option value="residencial">Residencial</option>
                      <option value="comercial">Comercial</option>
                      <option value="industrial">Industrial</option>
                      <option value="reformas">Reformas</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Como podemos ajudar? *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Descreva seu projeto, dúvidas sobre cores, etc."
                  ></textarea>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                      </span>
                    ) : (
                      <>
                        {preferredContact === "whatsapp" && "Iniciar Conversa no WhatsApp"}
                        {preferredContact === "video" && "Agendar Vídeo Chamada"}
                        {preferredContact === "email" && "Enviar Mensagem"}
                        {preferredContact === "phone" && "Solicitar Ligação"}
                      </>
                    )}
                  </button>
                  
                  <Link 
                    to="/catalogo" 
                    className="flex-1 text-center bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-black"
                  >
                    Explorar Produtos
                  </Link>
                </div>
              </form>
            )}
          </div>
          
          {/* Consultants Info */}
          <div className="mt-8 bg-card border border-border rounded-2xl p-6">
            <h2 className="text-xl font-cormorant font-bold mb-4">Nossos Consultores de Cor</h2>
            <p className="text-muted-foreground mb-6">
              Nossa equipe de consultores especializados está pronta para ajudar você a encontrar 
              as combinações de cores e texturas perfeitas para o seu projeto.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-black mx-auto mb-4 flex items-center justify-center text-2xl font-cormorant font-bold text-white">
                  M
                </div>
                <h3 className="font-medium">Maria Silva</h3>
                <p className="text-sm text-muted-foreground">Especialista em Cores Residenciais</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gray-800 mx-auto mb-4 flex items-center justify-center text-2xl font-cormorant font-bold text-white">
                  J
                </div>
                <h3 className="font-medium">João Santos</h3>
                <p className="text-sm text-muted-foreground">Especialista em Projetos Comerciais</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gray-600 mx-auto mb-4 flex items-center justify-center text-2xl font-cormorant font-bold text-white">
                  A
                </div>
                <h3 className="font-medium">Ana Costa</h3>
                <p className="text-sm text-muted-foreground">Especialista em Texturas e Acabamentos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}