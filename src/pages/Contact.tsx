import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import CanonicalHome from "@/components/CanonicalHome";
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
      toast.error(result.error.issues[0].message);
      return;
    }
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Layout>
      <CanonicalHome />
      <section className="py-16 lg:py-24 min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto items-center">
            {/* Left side - Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "3rem" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-px bg-foreground/40 mb-8"
              />
              <h1 className="font-heading text-4xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Let's
                <br />
                <span className="text-muted-foreground">Talk</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-10 max-w-sm">
                Have a question or want a custom quote? We'd love to hear from you.
              </p>

              <motion.a
                href="mailto:montereybaypc@gmail.com"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="group flex items-center gap-4 p-5 rounded-2xl border border-border hover:border-foreground/30 transition-all duration-500 bg-card/30 hover:bg-card/60"
              >
                <div className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-background" />
                </div>
                <div>
                  <span className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Email Us</span>
                  <span className="text-foreground font-medium group-hover:tracking-wider transition-all duration-300">montereybaypc@gmail.com</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform duration-300" />
              </motion.a>
            </motion.div>

            {/* Right side - Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-foreground/5 to-transparent -z-10" />
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Name</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors duration-300 text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Email</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors duration-300 text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Message</label>
                  <Textarea
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us about your project..."
                    rows={4}
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors duration-300 text-foreground resize-none"
                  />
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    type="submit"
                    className="w-full font-heading font-bold uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 rounded-full py-6 text-sm hover:scale-[1.02] transition-all duration-300"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </motion.div>
              </div>
            </motion.form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
