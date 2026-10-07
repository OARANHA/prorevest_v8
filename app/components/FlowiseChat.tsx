import React, { useEffect, useState } from 'react';

export const FlowiseChat: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [BubbleChat, setBubbleChat] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    
    const importFlowise = async () => {
      try {
        const { BubbleChat: FlowiseBubbleChat } = await import('flowise-embed-react');
        setBubbleChat(() => FlowiseBubbleChat);
      } catch (error) {
        console.error('Erro ao carregar o componente Flowise:', error);
      }
    };
    
    importFlowise();
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const observer = new MutationObserver(() => {
      // Focar especificamente nos labels do formulário de captura de leads
      const labels = document.querySelectorAll('.flowise-form-field label, .flowise-chat-form label, [class*="form"] label');
      const inputs = document.querySelectorAll('.flowise-form-field input, .flowise-chat-form input');
      const buttons = document.querySelectorAll('.flowise-form-button, .flowise-send-button, [class*="form"] button');
      
      const translations: { [key: string]: string } = {
        'Name': 'Nome',
        'Full Name': 'Nome Completo',
        'Email Address': 'Email',
        'Email': 'Email',
        'Phone': 'Telefone',
        'Phone Number': 'Número de Telefone',
        'Message': 'Mensagem',
        'Send': 'Enviar',
        'Submit': 'Enviar',
        'Start Chat': 'Iniciar Chat'
      };
      
      // Traduzir labels
      labels.forEach(label => {
        const text = label.textContent?.trim();
        if (text && translations[text]) {
          label.textContent = translations[text];
        }
      });
      
      // Traduzir placeholders
      inputs.forEach(input => {
        const placeholder = input.getAttribute('placeholder');
        if (placeholder && translations[placeholder]) {
          input.setAttribute('placeholder', translations[placeholder]);
        }
      });
      
      // Traduzir botões
      buttons.forEach(button => {
        const text = button.textContent?.trim();
        if (text && translations[text]) {
          button.textContent = translations[text];
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, [isClient]);

  if (!isClient || !BubbleChat) {
    return null;
  }

  return (
    <BubbleChat
      chatflowid="a54cd8ce-235d-4803-8ec4-8d7ee1dcc0a4"
      apiHost="https://agent.28facil.com.br"
      chatflowConfig={{
        // Configurações para ocultar mensagens de sistema/debug
        showAgentMessages: false,
        showTimestamp: false,
        hideSystemMessages: true
      }}
      theme={{
        button: {
          backgroundColor: '#F97316',
          right: 20,
          bottom: 20,
          size: 56,
          dragAndDrop: true,
          iconColor: 'white',
          customIconSrc: 'https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg',
          autoWindowOpen: {
            autoOpen: false,
            openDelay: 3,
            autoOpenOnMobile: false
          }
        },
        tooltip: {
          showTooltip: true,
          tooltipMessage: 'Precisa de ajuda? Fale conosco! 🎨',
          tooltipBackgroundColor: '#F97316',
          tooltipTextColor: 'white',
          tooltipFontSize: 14
        },
        disclaimer: {
          title: 'Assistente Virtual Pro Revest',
          message: "Bem-vindo ao nosso assistente virtual! Ao usar este chat, você concorda com nossos <a target=\"_blank\" href=\"/termos-de-uso\">Termos de Uso</a> e <a target=\"_blank\" href=\"/politica-de-privacidade\">Política de Privacidade</a>",
          textColor: '#1F2937',
          buttonColor: '#F97316',
          buttonText: 'Iniciar Conversa',
          buttonTextColor: 'white',
          blurredBackgroundColor: 'rgba(249, 115, 22, 0.1)',
          backgroundColor: 'white'
        },
        customCSS: `
          .flowise-chatbot-container {
            font-family: 'Inter', sans-serif;
          }
          .flowise-chatbot-message {
            border-radius: 12px;
          }
          .flowise-chatbot-button {
            box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
            transition: all 0.3s ease;
          }
          .flowise-chatbot-button:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(249, 115, 22, 0.4);
          }
          /* Ocultar mensagens de sistema/debug */
          .flowise-chatbot-system-message,
          .flowise-chatbot-debug-message,
          .flowise-chatbot-process-message {
            display: none !important;
          }
        `,
        chatWindow: {
          showTitle: true,
          showAgentMessages: false,
          title: 'Assistente Pro Revest 🎨',
          titleAvatarSrc: 'https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg',
          welcomeMessage: 'Olá! Sou o assistente virtual da Pro Revest. Estou aqui para ajudar você com dúvidas sobre nossos produtos, cores, aplicações e muito mais. Como posso ajudar hoje?',
          errorMessage: 'Desculpe, ocorreu um erro. Por favor, tente novamente.',
          backgroundColor: '#ffffff',
          backgroundImage: '',
          height: 650,
          width: 380,
          fontSize: 14,
          starterPrompts: [
            "Quais produtos vocês recomendam para área externa?",
            "Como faço para escolher a cor ideal?",
            "Quais são os benefícios dos produtos Pro Revest?",
            "Como preparar a superfície antes da aplicação?"
          ],
          starterPromptFontSize: 13,
          clearChatOnReload: false,
          sourceDocsTitle: 'Fontes:',
          renderHTML: true,
          botMessage: {
            backgroundColor: '#FEF3E2',
            textColor: '#1F2937',
            showAvatar: true,
            avatarSrc: 'https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg'
          },
          userMessage: {
            backgroundColor: '#F97316',
            textColor: '#ffffff',
            showAvatar: true,
            avatarSrc: 'https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png'
          },
          textInput: {
            placeholder: 'Digite sua pergunta aqui...',
            backgroundColor: '#ffffff',
            textColor: '#1F2937',
            sendButtonColor: '#F97316',
            maxChars: 500,
            maxCharsWarningMessage: 'Você excedeu o limite de caracteres. Por favor, digite menos de 500 caracteres.',
            autoFocus: true,
            sendMessageSound: false,
            sendSoundLocation: 'send_message.mp3',
            receiveMessageSound: false,
            receiveSoundLocation: 'receive_message.mp3'
          },
          feedback: {
            color: '#1F2937'
          },
          dateTimeToggle: {
            date: true,
            time: true
          },
          footer: {
            textColor: '#6B7280',
            text: 'Desenvolvido por',
            company: '28web',
            companyLink: 'https://28web.com.br'
          }
        }
      }}
    />
  );
};

export default FlowiseChat;
