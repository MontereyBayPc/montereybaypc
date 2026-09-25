import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import CanonicalHome from "@/components/CanonicalHome";
import Breadcrumbs from "@/components/Breadcrumbs";
import NotFound from "./NotFound";
import { BUSINESS } from "@/lib/business";

type Section = { h: string; p: string[] };
type Doc = { title: string; intro: string; sections: Section[] };

const docs: Record<string, Doc> = {
  warranty: {
    title: "Warranty & Support",
    intro: "What you can expect from us after you take your PC home.",
    sections: [
      { h: "Warranty", p: ["We do not offer our own warranty on builds. Individual components keep the manufacturer warranty they ship with, and we are happy to help you file a claim with the manufacturer if a part fails."] },
      { h: "Technical support", p: ["Every PC purchase includes technical support. If something is not working right, or you just have a question, reach out and we will help you sort it out."] },
      { h: "How to get help", p: [`Email ${BUSINESS.email} or call ${BUSINESS.phone}. Include your name, what you bought, and a short description of the problem.`] },
    ],
  },
  returns: {
    title: "Returns & Refunds",
    intro: "How returns, cancellations, and refunds work.",
    sections: [
      { h: "Prebuilt PCs", p: ["If there is a problem with your prebuilt PC at pickup or delivery, let us know right away and we will make it right."] },
      { h: "Custom builds", p: ["Custom builds are made from parts ordered for you. Contact us as early as possible if you need to cancel so we can see what options are available."] },
      { h: "Refunds", p: ["Approved refunds are sent back to the original payment method through Stripe."] },
      { h: "Questions", p: [`Email ${BUSINESS.email} and we will walk you through it.`] },
    ],
  },
  shipping: {
    title: "Pickup & Delivery",
    intro: "We serve the Monterey Bay area only. We do not ship nationwide.",
    sections: [
      { h: "Local pickup", p: [`Free pickup in ${BUSINESS.city}, ${BUSINESS.region}. We will contact you to schedule a time once your PC is ready.`] },
      { h: "Local delivery", p: ["Delivery within 30 miles is available for $75. We bring the PC to your door."] },
      { h: "Turnaround", p: ["Custom PCs usually take 1-2 weeks to build, test, and prepare."] },
      { h: "Service area", p: [BUSINESS.serviceArea + "."] },
    ],
  },
  terms: {
    title: "Terms of Service",
    intro: "The basic rules for using this website and buying from us.",
    sections: [
      { h: "Orders", p: ["Placing an order means you agree to pay the listed price plus any applicable sales tax and delivery fee. Prices and availability can change."] },
      { h: "Payments", p: ["Payments are processed securely by Stripe. We never see or store your full card number."] },
      { h: "Your own parts", p: ["When you bring your own parts, you are responsible for their condition and compatibility. We will tell you about any issues we find."] },
      { h: "Contact", p: [`Questions about these terms can go to ${BUSINESS.email}.`] },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    intro: "What information we collect and how we use it.",
    sections: [
      { h: "What we collect", p: ["When you order or contact us, we collect your name, email, phone number, and address so we can complete your order and reach you."] },
      { h: "Payments", p: ["Card details are handled by Stripe. We do not store card information."] },
      { h: "How we use it", p: ["We only use your information to fulfill orders, provide support, and answer your questions. We do not sell your information."] },
      { h: "Requests", p: [`To ask about or delete your information, email ${BUSINESS.email}.`] },
    ],
  },
  accessibility: {
    title: "Accessibility",
    intro: "We want everyone to be able to use this website.",
    sections: [
      { h: "Our approach", p: ["We aim to keep the site readable, keyboard friendly, and usable with screen readers."] },
      { h: "Need help?", p: [`If anything on the site is hard to use, email ${BUSINESS.email} or call ${BUSINESS.phone} and we will help you directly.`] },
    ],
  },
};

const Legal = () => {
  const { slug = "" } = useParams();
  const doc = docs[slug];
  if (!doc) return <NotFound />;
  return (
    <Layout>
      <CanonicalHome title={`${doc.title} | ${BUSINESS.name}`} description={doc.intro} />
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <Breadcrumbs items={[{ label: doc.title }]} />
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-4">{doc.title}</h1>
          <p className="text-muted-foreground text-lg mb-12">{doc.intro}</p>
          <div className="space-y-10">
            {doc.sections.map((s) => (
              <div key={s.h} className="border-t border-border pt-6">
                <h2 className="font-heading text-xl font-semibold text-foreground mb-3">{s.h}</h2>
                {s.p.map((t) => <p key={t} className="text-muted-foreground leading-relaxed">{t}</p>)}
              </div>
            ))}
          </div>
          <div className="mt-14 flex flex-wrap gap-3">
            {Object.entries(docs).filter(([k]) => k !== slug).map(([k, d]) => (
              <Link key={k} to={`/legal/${k}`} className="btn-outline">{d.title}</Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export const legalSlugs = Object.keys(docs);
export default Legal;
