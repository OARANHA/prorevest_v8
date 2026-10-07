import { Layout } from "../components/Layout";

export default function PoliticaDePrivacidade() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de Privacidade</h1>
        <p className="text-sm text-gray-500 mb-8">Última atualização: 17 de outubro de 2025</p>

        <div className="prose prose-gray max-w-none">
          <p>
            Valorizamos a sua privacidade. Esta Política descreve como coletamos, usamos,
            armazenamos e compartilhamos seus dados pessoais ao utilizar o site e o
            Studio ProRevest ("Serviços"). Ao usar nossos Serviços, você concorda com
            as práticas descritas aqui.
          </p>

          <h2>1. Controlador e Contato</h2>
          <p>
            A ProRevest é a controladora dos dados pessoais tratados por meio dos
            Serviços. Em caso de dúvidas ou solicitações relacionadas à privacidade,
            entre em contato pela página <a href="/contato">/contato</a>.
          </p>

          <h2>2. Dados que Coletamos</h2>
          <ul>
            <li>
              Dados de conta: nome completo, e-mail, senha (armazenada de forma segura pelo provedor de autenticação).
            </li>
            <li>
              Dados de perfil opcionais: telefone, empresa, cargo, CPF/CNPJ (quando informados pelo usuário).
            </li>
            <li>
              Conteúdo enviado: imagens, fotos de ambientes, projetos e demais arquivos que você optar por subir.
            </li>
            <li>
              Dados técnicos: endereço IP, identificadores de dispositivo, navegador, páginas acessadas, data e hora, cookies e tecnologias similares.
            </li>
          </ul>

          <h2>3. Finalidades do Tratamento</h2>
          <ul>
            <li>Criar e gerenciar sua conta e preferências.</li>
            <li>Viabilizar o uso do Studio ProRevest (ex.: salvar projetos).</li>
            <li>Comunicar novidades, suporte e informações relevantes sobre os Serviços.</li>
            <li>Melhorar desempenho, segurança, confiabilidade e experiência do usuário.</li>
            <li>Atender obrigações legais e prevenir fraudes/abusos.</li>
          </ul>

          <h2>4. Bases Legais</h2>
          <p>
            Tratamos dados com base em: execução de contrato (uso dos Serviços),
            legítimo interesse (melhoria e segurança), cumprimento de obrigação legal
            e consentimento quando aplicável (ex.: comunicações de marketing, cookies não essenciais).
          </p>

          <h2>5. Compartilhamento</h2>
          <p>
            Podemos compartilhar dados com provedores de serviços essenciais
            (hospedagem, autenticação, análise de uso, armazenamento de arquivos),
            sempre sob contratos e medidas de segurança. Não vendemos seus dados.
          </p>

          <h2>6. Armazenamento e Segurança</h2>
          <p>
            Adotamos medidas técnicas e organizacionais razoáveis para proteger os dados.
            Apesar dos esforços, nenhum sistema é 100% seguro. Recomendamos usar senhas
            fortes e manter suas credenciais em sigilo.
          </p>

          <h2>7. Direitos do Titular (LGPD)</h2>
          <p>
            Você tem direito de acessar, corrigir, atualizar e excluir seus dados,
            além de solicitar portabilidade, informações sobre compartilhamento e
            revisão de decisões automatizadas, quando aplicável. Para exercer, use a
            página <a href="/contato">/contato</a>.
          </p>

          <h2>8. Cookies e Tecnologias Similares</h2>
          <p>
            Utilizamos cookies essenciais ao funcionamento do site e, quando
            necessário, cookies de analytics e experiência. Você pode gerenciar cookies
            nas configurações do navegador. Cookies não essenciais podem depender de
            consentimento.
          </p>

          <h2>9. Imagens e Conteúdo Enviado</h2>
          <p>
            Ao enviar imagens e conteúdos ao Studio, você declara possuir direitos
            sobre tais materiais e autoriza seu processamento para execução das
            funcionalidades (ex.: visualização, renders, prévias). Você permanece
            titular dos seus conteúdos; consulte também os <a href="/termos-de-uso">Termos de Uso</a>.
          </p>

          <h2>10. Retenção</h2>
          <p>
            Mantemos dados pelo tempo necessário para cumprir as finalidades descritas
            e obrigações legais. Você pode solicitar exclusão da conta e conteúdos,
            observadas limitações legais e técnicas.
          </p>

          <h2>11. Transferências Internacionais</h2>
          <p>
            Alguns provedores podem operar fora do Brasil. Nesses casos, adotamos
            salvaguardas adequadas, alinhadas às legislações aplicáveis.
          </p>

          <h2>12. Alterações desta Política</h2>
          <p>
            Podemos atualizar esta Política periodicamente. A versão vigente estará
            sempre disponível nesta página, com a data da última atualização.
          </p>

          <h2>13. Contato</h2>
          <p>
            Para exercer seus direitos ou tirar dúvidas, acesse <a href="/contato">/contato</a>.
          </p>
        </div>
      </div>
    </Layout>
  );
}