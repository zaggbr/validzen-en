import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const PrivacyPage = () => {
  const { t, localePath } = useI18n();

  return (
    <div className="flex min-h-screen flex-col">
      <SEOHead 
        title={`${t("common.privacy")} — ValidZen`}
        description="Política de Privacidade do ZGC Media Services e nossa conduta em relação aos seus dados."
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
            <h1 className="mb-6 text-3xl font-bold text-title md:text-4xl">Política de Privacidade</h1>
            
            <p>
              A sua privacidade é importante para nós. É política do <strong>ZGC Media Services</strong> respeitar 
              a sua privacidade em relação a qualquer informação sua que possamos coletar em qualquer site 
              que possuímos e operamos.
            </p>

            <p>
              Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. 
              Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que 
              estamos coletando e como será usado.
            </p>

            <p>
              Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. 
              Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis para evitar perdas 
              e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
            </p>

            <p>
              Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, 
              exceto quando exigido por lei.
            </p>

            <h2>Compromisso do Usuário</h2>
            <p>
              O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o 
              ZGC Media Services oferece no site:
            </p>
            <ul>
              <li>Não se envolver em atividades que sejam ilegais ou contrárias à boa fé e à ordem pública;</li>
              <li>Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, ou contra os direitos humanos;</li>
              <li>Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) do site.</li>
            </ul>

            <h2>Mais informações</h2>
            <p>
              Esperemos que esteja esclarecido e, como mencionado anteriormente, se houver algo que você não 
              tem certeza se precisa ou não, geralmente é mais seguro deixar os cookies ativados, caso interaja 
              com um dos recursos que você usa em nosso site.
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

export default PrivacyPage;
