import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const TermsPage = () => {
  const { t, localePath } = useI18n();

  return (
    <div className="flex min-h-screen flex-col">
      <SEOHead 
        title={`${t("common.terms")} — ValidZen`}
        description="Termos de serviço e condições de uso do site ValidZen."
      />
      <Header />
      <main className="flex-1 bg-background py-12">
        <div className="container max-w-3xl">
          <Link 
            to={localePath("/")} 
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-secondary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> {t("quiz.back")}
          </Link>

          <motion.article 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose-validzen"
          >
            <h1 className="mb-6 text-3xl font-bold text-title md:text-4xl">Termos de Uso</h1>
            
            <p>
              Estes termos de serviço regulam o uso deste site. Ao acessá-lo você concorda com estes termos. 
              Por favor, consulte regularmente os nossos termos de serviço.
            </p>

            <h2>Acesso ao site</h2>
            <p>
              Para acessar o conteúdo deste site poder ser solicitado ao usuário algumas informações pessoais 
              como nome, e-mail e outros. Se acharmos que as informações não são corretas ou verdadeiras, temos 
              o direito de recusar e/ou cancelar o acesso a qualquer tempo, sem notificação prévia.
            </p>

            <h2>Restrições ao uso</h2>
            <p>
              Você só poderá usar este site para propósitos permitidos por nós. Você não poderá usá-lo em 
              qualquer outro objetivo, especialmente comercial, sem o nosso consentimento prévio. Não associe 
              nossas marcas a nenhuma outra. Não exponha nosso nome, logotipo, logomarca entre outros, 
              indevidamente e de forma a causar confusão.
            </p>

            <h2>Propriedade da informação</h2>
            <p>
              O conteúdo do site não pode ser copiado, distribuído, publicado, carregado, postado ou 
              transmitido por qualquer outro meio sem o nosso consentimento prévio, a não ser que a finalidade 
              seja apenas a divulgação.
            </p>

            <h2>Hyperlinks</h2>
            <p>
              Este site pode conter links para outros websites que não são mantidos ou relacionados à nossa 
              empresa. Não somos responsáveis pelo conteúdo destes links. O usuário assume completamente o 
              risco ao acessar estes hyperlinks.
            </p>

            <h2>Comentários</h2>
            <p>
              Ao postar algum comentário ou depoimento em nosso site você autoriza a publicação do mesmo em 
              qualquer lugar que desejarmos, a fim de cooperar com a divulgação de nossos produtos.
            </p>

            <h2>Aviso legal</h2>
            <p>
              A informação obtida ao usar este site não é completa e não cobre todas as questões, tópicos ou 
              fatos que possam ser relevantes para seus objetivos. O uso deste site é de sua total responsabilidade.
            </p>
            <p>
              O conteúdo é oferecido como está e sem garantias de qualquer tipo, expressas ou implícitas. 
              O conteúdo deste site não é palavra final sobre qualquer assunto, e podemos fazer melhorias a qualquer momento.
            </p>
            <p>
              Você entende que nossa empresa não pode e não garante que arquivos disponíveis para download 
              da Internet estejam livres de vírus, worms, cavalos de Tróia ou outro código que possa manifestar 
              propriedades contaminadoras ou destrutivas.
            </p>

            <h2>Limitação de responsabilidade</h2>
            <p className="text-xs uppercase font-bold">
              A EMPRESA, SUAS FILIAIS, AFILIADOS, LICENCIANTES, PROVEDORES DE SERVIÇO, PROVEDORES DE CONTEÚDO, 
              EMPREGADOS, AGENTES, ADMINISTRADORES E DIRETORES NÃO SERÃO RESPONSÁVEIS POR QUALQUER DANO EVENTUAL, 
              DIRETO, INDIRETO, PUNITIVO, REAL, CONSEQUENTE, ESPECIAL, EXEMPLAR OU DE QUALQUER OUTRO TIPO...
            </p>

            <div className="mt-10 pt-10 border-t border-border text-xs text-muted-foreground">
              <p>ZGC Media Services</p>
              <p>CNPJ: 51.186.693/0001-90</p>
              <p>Contato: atendimento@educta.com.br</p>
              <p>Esta política é efetiva a partir de 15 de Março 2026.</p>
            </div>
          </motion.article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;
