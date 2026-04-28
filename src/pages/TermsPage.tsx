import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const TermsPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEOHead 
        title="Terms of Use — ValidZen"
        description="Terms of service and conditions of use for the ValidZen website."
      />
      <Header />
      <main className="flex-1 py-12 md:py-24">
        <div className="container max-w-3xl">
          <Link 
            to="/dashboard" 
            className="mb-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-secondary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Return to Blueprint
          </Link>

          <motion.article 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-sm md:prose-base max-w-none prose-headings:text-title prose-headings:font-bold prose-headings:italic prose-p:text-muted-foreground prose-p:italic prose-strong:text-foreground prose-h2:mt-12 prose-h2:mb-6"
          >
            <h1 className="mb-10 text-4xl font-bold text-title tracking-tight md:text-5xl">Terms of Use</h1>
            
            <p className="text-lg leading-relaxed">
              These terms of service regulate the use of this site and all Discovery Journeys. By accessing them, you agree to these terms. 
              Please regularly check our terms of service for updates as we evolve our methodology.
            </p>

            <h2 className="text-2xl font-bold">Site Access</h2>
            <p className="text-lg leading-relaxed">
              To embark on our Journeys, the user may be asked for some personal information 
              such as name, email, and others. If we believe the information is not correct or true, we have 
              the right to refuse and/or archive access at any time without prior notice to preserve the integrity of our data.
            </p>

            <h2 className="text-2xl font-bold">Restrictions on Use</h2>
            <p className="text-lg leading-relaxed">
              You may only use this site for purposes permitted by us. You may not use it for 
              any other purpose, especially commercial, without our prior consent. Do not associate 
              our brands with any other. Do not expose our name, logo, or trademark improperly 
              in a way that causes confusion regarding our clinical-grade insights.
            </p>

            <h2 className="text-2xl font-bold">Ownership of Information</h2>
            <p className="text-lg leading-relaxed">
              The content of the site and the Personal Blueprints cannot be copied, distributed, published, uploaded, posted, or 
              transmitted by any other means without our prior consent, unless the purpose 
              is solely for dissemination of your personal evolution.
            </p>

            <h2 className="text-2xl font-bold">Hyperlinks</h2>
            <p className="text-lg leading-relaxed">
              This site may contain links to other websites that are not maintained or related to our 
              company. We are not responsible for the content of these links. The user completely 
              assumes the risk of accessing these hyperlinks.
            </p>

            <h2 className="text-2xl font-bold">Comments & Testimonials</h2>
            <p className="text-lg leading-relaxed">
              By posting any comment or testimonial on our site, you authorize its publication in 
              any place we desire, in order to cooperate with the dissemination of our self-mastery tools.
            </p>

            <h2 className="text-2xl font-bold">Legal Disclaimer</h2>
            <p className="text-lg leading-relaxed">
              The information obtained when using our Journeys is not complete and does not cover all issues, topics, or 
              facts that may be relevant to your clinical goals. Our Journeys are guided for self-reflection and do not replace professional medical advice.
            </p>
            <p className="text-lg leading-relaxed">
              The content is provided "as is" and without warranties of any kind. 
              The content of this site is not the final word on any subject, and we can make improvements to our interpretation logic at any time.
            </p>

            <h2 className="text-2xl font-bold">Limitation of Liability</h2>
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-60 leading-relaxed">
              THE COMPANY, ITS BRANCHES, AFFILIATES, LICENSORS, SERVICE PROVIDERS, CONTENT PROVIDERS, 
              EMPLOYEES, AGENTS, ADMINISTRATORS, AND DIRECTORS SHALL NOT BE LIABLE FOR ANY INCIDENTAL, 
              DIRECT, INDIRECT, PUNITIVE, ACTUAL, CONSEQUENTIAL, SPECIAL, EXEMPLARY, OR ANY OTHER TYPE OF DAMAGE...
            </p>

            <div className="mt-16 pt-10 border-t border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
              <p>ZGC Media Services — ValidZen Global</p>
              <p>Contact: continentemedia@gmail.com</p>
              <p>This policy is effective as of April 22, 2026.</p>
            </div>
          </motion.article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;
