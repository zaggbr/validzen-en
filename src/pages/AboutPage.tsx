import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const AboutPage = () => {
  const { t, localePath } = useI18n();

  return (
    <div className="flex min-h-screen flex-col">
      <SEOHead 
        title={`${t("common.about")} — ValidZen`}
        description="Somos uma publisher house independente, dedicada à curadoria de conteúdos de alta qualidade e inovação."
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
            <h1 className="mb-6 text-3xl font-bold text-title md:text-4xl">Quem Somos</h1>
            
            <p>
              Somos uma publisher house independente, dedicada à curadoria de conteúdos de alta qualidade, 
              consultoria técnica especializada em inovação e comunicação.
            </p>

            <p>
              Com mais de 20 anos de experiência em projetos criativos, atendemos a uma ampla variedade 
              de públicos, oferecendo material personalizado e envolvendo que ressoa em diferentes audiências.
            </p>

            <p>
              Operamos marcas como <strong>Validzen</strong>, <strong>Educta.online</strong>, 
              <strong>Educta.com.br</strong>, <strong>ContinenteMedia</strong>, <strong>PainelSaúde</strong>, 
              entre outras.
            </p>

            <p>
              Nossa especialidade é entender as necessidades únicas e criar experiências que informam, 
              entretêm e inspiram.
            </p>

            <p>
              Trabalhamos temáticas personalizadas para marcas e influenciadores, utilizando os melhores 
              recursos tecnológicos para explorar ideias inovadoras, conceitos e narrativas. Nosso trabalho 
              é fundamentado em princípios éticos e jornalísticos, garantindo que cada peça de conteúdo 
              seja confiável e impactante.
            </p>

            <p>
              Algumas de nossas recomendações de produtos podem incluir comissões, infomerciais e ativos 
              comerciais proprietários - como infoprodutos e consultoria, sempre garantida a lisura e que 
              isso não afeta nosso compromisso com a manutenção de altos padrões de qualidade. Cada 
              recomendação é feita seguindo diretrizes éticas para assegurar a integridade e o valor para o 
              nosso público.
            </p>
          </motion.article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
