import { Layout } from "../components/Layout";

export default function TermosDeUso() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Termos de Uso</h1>
        <p className="text-sm text-gray-500 mb-8">Última atualização: 17 de outubro de 2025</p>

        <div className="prose prose-gray max-w-none">
          <p>
            Estes Termos regulam o acesso e uso do site e do Studio ProRevest
            ("Serviços"). Ao utilizar os Serviços, você concorda integralmente com
            estes Termos.
          </p>

          <h2>1. Aceitação</h2>
          <p>
            O uso dos Serviços implica a aceitação destes Termos e da nossa
            <a href="/politica-de-privacidade"> Política de Privacidade</a>.
            Se você não concordar, não utilize os Serviços.
          </p>

          <h2>2. Cadastro e Conta</h2>
          <ul>
            <li>Você deve fornecer informações verdadeiras e atualizadas.</li>
            <li>Você é responsável por manter suas credenciais em sigilo.</li>
            <li>Notifique-nos imediatamente sobre uso não autorizado da sua conta.</li>
          </ul>

          <h2>3. Uso do Studio</h2>
          <ul>
            <li>O Studio oferece recursos de design, visualização e organização de projetos.</li>
            <li>Recursos podem ser ajustados, atualizados ou descontinuados a qualquer tempo.</li>
            <li>Não é permitido usar os Serviços para atividades ilícitas, violação de direitos ou engenharia reversa.</li>
          </ul>

          <h2>4. Conteúdos do Usuário</h2>
          <p>
            Você mantém a titularidade sobre os conteúdos enviados (imagens, fotos,
            projetos). Ao enviar, você declara possuir os direitos necessários e
            concede à ProRevest licença limitada, não exclusiva e gratuita para
            processar, armazenar e exibir tais conteúdos com a finalidade de prestar os
            Serviços. Você é responsável pelos conteúdos que publica e pelos direitos
            de terceiros eventualmente envolvidos.
          </p>

          <h2>5. Propriedade Intelectual</h2>
          <p>
            Todo o software, marcas, logotipos, layouts e conteúdos de titularidade da
            ProRevest ou de seus licenciantes permanecem protegidos por leis de
            propriedade intelectual. Não é concedido ao usuário nenhum direito de uso
            além do estritamente necessário para fruir os Serviços.
          </p>

          <h2>6. Disponibilidade e Responsabilidade</h2>
          <p>
            Envidamos esforços razoáveis para manter os Serviços disponíveis e seguros,
            mas não garantimos operação ininterrupta, livre de erros ou vulnerabilidades.
            Na máxima extensão permitida por lei, não nos responsabilizamos por perdas
            indiretas, lucros cessantes, danos decorrentes de indisponibilidades ou
            conteúdos de terceiros.
          </p>

          <h2>7. Pagamentos e Planos</h2>
          <p>
            Caso sejam oferecidos planos pagos, as condições específicas (preços,
            recursos, cobrança, cancelamento) serão apresentadas no momento da
            contratação. O não pagamento poderá resultar na suspensão ou limitação de
            funcionalidades.
          </p>

          <h2>8. Suspensão e Encerramento</h2>
          <p>
            Podemos suspender ou encerrar contas em caso de violação destes Termos,
            uso abusivo ou ordens judiciais/administrativas. Você pode encerrar sua
            conta a qualquer momento.
          </p>

          <h2>9. Alterações</h2>
          <p>
            Estes Termos podem ser atualizados periodicamente. A versão vigente estará
            sempre disponível nesta página, com a data da última atualização.
          </p>

          <h2>10. Lei Aplicável e Foro</h2>
          <p>
            Aplica-se a legislação brasileira. Fica eleito o foro do domicílio do
            usuário para dirimir controvérsias, salvo disposição legal em contrário.
          </p>

          <h2>11. Contato</h2>
          <p>
            Para dúvidas ou solicitações, utilize a página <a href="/contato">/contato</a>.
          </p>
        </div>
      </div>
    </Layout>
  );
}