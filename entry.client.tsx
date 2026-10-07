import { StrictMode } from "react";
import { HydratedRouter } from "react-router/dom";
import { hydrateRoot } from "react-dom/client";

// Função para remover atributos data-* adicionados por extensões como Grammarly
// que causam hydration mismatch entre server e client
function cleanDOMBeforeHydration() {
  // Remove atributos específicos do Grammarly que causam hydration mismatch
  const body = document.body;
  if (body) {
    body.removeAttribute('data-new-gr-c-s-check-loaded');
    body.removeAttribute('data-gr-ext-installed');
  }
  
  // Remove qualquer outro atributo data-* que possa causar problemas
  const allElements = document.querySelectorAll('*');
  allElements.forEach(element => {
    const attributes = element.attributes;
    for (let i = attributes.length - 1; i >= 0; i--) {
      const attr = attributes[i];
      if (attr.name.startsWith('data-') && 
          (attr.name.includes('grammarly') || 
           attr.name.includes('gr-') ||
           attr.value.includes('grammarly'))) {
        element.removeAttribute(attr.name);
      }
    }
  });
}

// Observer para monitorar e remover continuamente atributos problemáticos
function setupDOMProtection() {
  // Limpa inicialmente
  cleanDOMBeforeHydration();
  
  // Configura MutationObserver para monitorar mudanças no DOM
  const observer = new MutationObserver((mutations) => {
    let needsCleanup = false;
    
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && 
          mutation.attributeName && 
          mutation.attributeName.startsWith('data-') &&
          (mutation.attributeName.includes('grammarly') || 
           mutation.attributeName.includes('gr-'))) {
        needsCleanup = true;
        break;
      }
    }
    
    if (needsCleanup) {
      // Pequeno delay para garantir que todas as mudanças sejam processadas
      setTimeout(cleanDOMBeforeHydration, 10);
    }
  });
  
  // Inicia a observação no body e em todos os elementos
  observer.observe(document.body, { 
    attributes: true, 
    attributeFilter: ['data-new-gr-c-s-check-loaded', 'data-gr-ext-installed', 'data-grammarly', 'data-gr'] 
  });
  
  // Também observa adições de elementos
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-new-gr-c-s-check-loaded', 'data-gr-ext-installed', 'data-grammarly', 'data-gr']
  });
}

// Configura proteção contínua do DOM
setupDOMProtection();

hydrateRoot(
  document,
  <StrictMode>
    <HydratedRouter />
  </StrictMode>
);
