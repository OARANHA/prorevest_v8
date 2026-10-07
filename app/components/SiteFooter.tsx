import React, { useEffect, useState } from 'react';
import 'remixicon/fonts/remixicon.css';
import { Link } from 'react-router-dom';

export const SiteFooter = () => {
  const [builderImage, setBuilderImage] = useState<string | null>(null);
  useEffect(() => {
    try {
      const href = new URL('../../28.png', import.meta.url).href;
      setBuilderImage(href);
    } catch {}
  }, []);
  const footerLinks = [
    {
      title: "Produtos",
      links: [
        { name: "Acrílicas", url: "/catalogo" },
        { name: "Esmaltes", url: "/catalogo" },
        { name: "Texturizadas", url: "/catalogo" },
        { name: "Especiais", url: "/catalogo" },
        { name: "Catálogo Completo", url: "/catalogo" }
      ]
    },
    {
      title: "Empresa",
      links: [
        { name: "Sobre Nós", url: "/sobre" },
        { name: "Nossa História", url: "/sobre" },
        { name: "Sustentabilidade", url: "/sustentabilidade" },
        { name: "Carreiras", url: "/contato" },
        { name: "Blog", url: "/blog" }
      ]
    },
    {
      title: "Suporte",
      links: [
        { name: "Central de Ajuda", url: "/central-de-ajuda" },
        { name: "Técnicas de Aplicação", url: "/tecnicas-de-aplicacao" },
        { name: "Garantia", url: "/garantia" },
        { name: "Preparação de Superfícies", url: "/preparacao-de-superficies" },
        { name: "Cuidados e Manutenção", url: "/cuidados-e-manutencao" }
      ]
    },
    {
      title: "Contato",
      links: [
        { name: "Fale Conosco", url: "/contato" },
        { name: "Representantes", url: "/contato" },
        { name: "Lojas", url: "/contato" },
        { name: "Parcerias", url: "/contato" },
        { name: "Fornecedores", url: "/contato" }
      ]
    }
  ];

  const contactInfo = [
    {
      icon: "ri-phone-line",
      title: "Telefones",
      value: "51 98660-5758 • 51 99140-1815"
    },
    {
      icon: "ri-mail-line",
      title: "E-mail",
      value: "contato@prorevest.com.br"
    },
    {
      icon: "ri-map-pin-line",
      title: "Endereço",
      value: "CANOAS, RS - Brasil"
    }
  ];

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-blue-600"></div>
        <div className="absolute top-20 left-20 w-32 h-32 border border-orange-600/20 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-blue-600/20 rounded-full"></div>
      </div>

      {/* Imagem do construtor do site no lado direito com 50% de transparência */}
      {builderImage && (
        <img
          src={builderImage}
          alt="Construtor do site"
          className="absolute right-4 bottom-4 max-h-52 md:max-h-64 object-contain opacity-50 pointer-events-none select-none z-0 origin-bottom-right transform scale-[0.8]"
        />
      )}
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-1">
            <div className="mb-8">
              <h2 className="text-3xl font-normal text-orange-400 mb-4">Prorevest</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Transformando ambientes há mais de 20 anos com tintas de alta qualidade e formulações sustentáveis. O futuro das cores está aqui.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-normal">Siga-nos</h3>
              <div className="flex space-x-4">
                <a className="w-12 h-12 flex items-center justify-center bg-gray-800 rounded-lg hover:text-blue-400 transition-all duration-300 hover:scale-110 hover:bg-gray-700 cursor-pointer" href="#" target="_blank" rel="noopener noreferrer">
                  <i className="ri-facebook-fill text-xl"></i>
                </a>
                <a className="w-12 h-12 flex items-center justify-center bg-gray-800 rounded-lg hover:text-pink-400 transition-all duration-300 hover:scale-110 hover:bg-gray-700 cursor-pointer" href="#" target="_blank" rel="noopener noreferrer">
                  <i className="ri-instagram-line text-xl"></i>
                </a>
                <a className="w-12 h-12 flex items-center justify-center bg-gray-800 rounded-lg hover:text-blue-300 transition-all duration-300 hover:scale-110 hover:bg-gray-700 cursor-pointer" href="#" target="_blank" rel="noopener noreferrer">
                  <i className="ri-linkedin-fill text-xl"></i>
                </a>
                <a className="w-12 h-12 flex items-center justify-center bg-gray-800 rounded-lg hover:text-red-400 transition-all duration-300 hover:scale-110 hover:bg-gray-700 cursor-pointer" href="#" target="_blank" rel="noopener noreferrer">
                  <i className="ri-youtube-fill text-xl"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {footerLinks.map((section, index) => (
                <div key={index}>
                  <h3 className="text-lg font-normal mb-6 text-orange-400">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link to={link.url} className="text-gray-300 hover:text-white transition-colors duration-300">
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-12 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-12 h-12 flex items-center justify-center bg-orange-600 rounded-xl">
                  <i className={`${info.icon} text-xl`}></i>
                </div>
                <div>
                  <h4 className="font-normal">{info.title}</h4>
                  <p className="text-gray-300">{info.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400">© 2025 Prorevest. Todos os direitos reservados.</div>
            <div className="flex flex-wrap items-center space-x-6">
              <Link to="/contato" className="text-gray-400 hover:text-white transition-colors">Política de Privacidade</Link>
              <Link to="/contato" className="text-gray-400 hover:text-white transition-colors">Termos de Uso</Link>
              <Link to="/contato" className="text-gray-400 hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
