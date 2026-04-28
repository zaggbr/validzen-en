import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const PrivacyPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEOHead 
        title="Privacy Policy — ValidZen"
        description="Privacy Policy for ZGC Media Services and our conduct regarding your data."
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
            className="prose prose-sm md:prose-base max-w-none prose-headings:text-title prose-headings:font-bold prose-headings:not-italic prose-p:text-muted-foreground prose-p:not-italic prose-strong:text-foreground prose-li:text-muted-foreground prose-li:not-italic"
          >
            <h1 className="mb-10 text-4xl font-bold text-title tracking-tight md:text-5xl">Privacy Policy</h1>
            
            <p className="text-lg leading-relaxed">
              Your privacy is fundamental to our mission. It is the policy of <strong>ZGC Media Services</strong> to respect 
              your privacy regarding any information we may collect from you across our website, Journeys, and other platforms we own and operate.
            </p>

            <p className="text-lg leading-relaxed">
              We only ask for personal information when we truly need it to provide a specialized service or generate your Personal Blueprint. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used to enhance your self-mastery experience.
            </p>

            <p className="text-lg leading-relaxed">
              We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use, or modification.
            </p>

            <p className="text-lg leading-relaxed">
              We don’t share any personally identifying information publicly or with third-parties, except when required to by law or to process your premium membership features.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-6">User Commitment</h2>
            <p className="text-lg leading-relaxed">
              As a member of our community, you undertake to make appropriate use of the contents and information that 
              ZGC Media Services offers on the site:
            </p>
            <ul className="space-y-2">
              <li>Not to engage in activities that are illegal or contrary to good faith and public order;</li>
              <li>Not to spread propaganda or content of a racist, xenophobic nature, or against human rights;</li>
              <li>Not to cause damage to the physical (hardware) and logical (software) systems of the site.</li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-6">More information</h2>
            <p className="text-lg leading-relaxed">
              We hope this clarifies our stance on your internal agency and data privacy. If there is something that you aren't sure whether you need or not, it's usually safer to leave cookies enabled in case it does interact with one of the features you use on our site to track your evolution.
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

export default PrivacyPage;
