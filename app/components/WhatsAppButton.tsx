import React from 'react';

export const WhatsAppButton: React.FC = () => {
  const whatsappNumber = "5551986605758";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed left-5 bottom-5 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center group"
      aria-label="Fale conosco pelo WhatsApp"
      style={{ zIndex: 9999 }}
    >
      <img
        src="/images/svg/whatsapp.svg"
        alt="WhatsApp"
        className="w-7 h-7"
        style={{ filter: 'brightness(0) invert(1)' }} // Deixa o ícone branco
      />
      <span className="absolute left-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm rounded px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        Fale conosco no WhatsApp
      </span>
    </a>
  );
};

export default WhatsAppButton;