import { motion } from "framer-motion";

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
}

const SectionHeading = ({ label, title, description }: SectionHeadingProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="text-center mb-12 lg:mb-16"
  >
    {label && (
      <span className="font-display text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-3 block">
        {label}
      </span>
    )}
    <h2 className="font-heading text-3xl lg:text-5xl font-bold text-foreground">{title}</h2>
    {description && (
      <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">{description}</p>
    )}
  </motion.div>
);

export default SectionHeading;
