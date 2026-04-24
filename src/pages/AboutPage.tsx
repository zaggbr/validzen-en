import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEOHead 
        title="About Us — ValidZen"
        description="ValidZen is an independent discovery hub dedicated to psychological agency and self-mastery."
      />
      <Header />
      <main className="flex-1 py-12 md:py-24">
        <div className="container max-w-3xl">
          <Link 
            to="/dashboard" 
            className="mb-12 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-secondary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Return to Blueprint
          </Link>

          <motion.article 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-sm md:prose-base max-w-none prose-headings:text-title prose-headings:font-black prose-headings:italic prose-p:text-muted-foreground prose-p:italic prose-strong:text-foreground"
          >
            <h1 className="mb-10 text-4xl font-black text-title italic tracking-tight md:text-5xl">Our Methodology</h1>
            
            <p className="text-lg leading-relaxed">
              ValidZen is a project by an independent publishing house dedicated to curating high-quality content 
              and specialized technical consultancy in innovation, psychological agency, and communication.
            </p>

            <p className="text-lg leading-relaxed">
              With over 20 years of experience in creative projects, we serve a global audience, 
              offering personalized and engaging Journeys that resonate across different cultures and perspectives.
            </p>

            <p className="text-lg leading-relaxed">
              We operate several brands focused on education, mental wellbeing, and technology, 
              including <strong>ValidZen</strong>, <strong>Educta</strong>, and <strong>ContinenteMedia</strong>.
            </p>

            <p className="text-lg leading-relaxed">
              Our specialty is understanding the unique needs of the modern mind and creating experiences that inform, 
              guide, and inspire deep self-mastery.
            </p>

            <p className="text-lg leading-relaxed">
              We work on personalized themes for brands and influencers, using advanced 
              technological resources to explore innovative ideas, concepts, and narratives. Our work 
              is grounded in ethical principles, ensuring that every Discovery and Blueprint 
              is reliable and impactful.
            </p>

            <p className="text-lg leading-relaxed">
              Some of our product recommendations may include affiliate links, sponsored content, 
              or proprietary commercial assets—such as info-products and consultancy. We guarantee 
              that this does not affect our commitment to maintaining high standards of quality. Each 
              recommendation is made following ethical guidelines to ensure integrity and value for 
              our community.
            </p>
          </motion.article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
