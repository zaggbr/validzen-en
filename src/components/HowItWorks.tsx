import { Compass, MessageCircleQuestion, Map, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const steps = [
    {
      icon: Compass,
      title: "Map Your Agency",
      description: "Start with our core Journeys to identify your predominant emotional and psychological patterns.",
    },
    {
      icon: MessageCircleQuestion,
      title: "Deep Pattern Explorations",
      description: "Explore specific themes like anxiety, purpose, and connection with our specialized clinical-grade tools.",
    },
    {
      icon: Map,
      title: "Visualize Your Evolution",
      description: "Track your discoveries on your Personal Blueprint and see how your internal agency grows over time.",
    },
    {
      icon: BookOpen,
      title: "Guided Self-Mastery",
      description: "Receive personalized self-mastery paths and content to help you navigate your unique challenges.",
    },
  ];

  return (
    <section className="bg-card/50 py-24 md:py-32 border-y border-border/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <h2 className="mb-4 text-4xl font-black text-title italic tracking-tight md:text-5xl">
            The Discovery Path
          </h2>
          <p className="mx-auto max-w-lg text-lg text-muted-foreground italic leading-relaxed">
            A structured, human-centric journey to self-mastery and clarity in a complex world.
          </p>
        </motion.div>

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col items-center text-center"
            >
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-secondary/10 text-secondary shadow-lg shadow-secondary/5 transition-all group-hover:scale-110 group-hover:bg-secondary group-hover:text-white">
                <step.icon className="h-8 w-8" />
              </div>
              <span className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-secondary/60">
                Phase {i + 1}
              </span>
              <h3 className="mb-4 text-xl font-black text-title italic">{step.title}</h3>
              <p className="text-md text-muted-foreground italic leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
