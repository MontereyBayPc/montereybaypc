import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MessageSquare } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Layout>
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
          <SectionHeading label="Contact" title="Get in Touch" description="Have a question or want a custom quote? Drop us a message." />
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-xl p-8 flex flex-col gap-5"
          >
            <div>
              <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Name</label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Your name"
                className="bg-secondary border-border focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="your@email.com"
                className="bg-secondary border-border focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Message</label>
              <Textarea
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="Tell us about your project or question..."
                rows={5}
                className="bg-secondary border-border focus:border-primary"
              />
            </div>
            <Button type="submit" className="w-full font-heading font-bold uppercase tracking-wider gradient-rgb-bg text-primary-foreground hover:opacity-90">
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </motion.form>

          <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-muted-foreground">
            <a href="mailto:hello@montereybaypc.com" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Mail className="w-4 h-4" /> hello@montereybaypc.com
            </a>
            <a href="https://discord.gg" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
              <MessageSquare className="w-4 h-4" /> Discord
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
