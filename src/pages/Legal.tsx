import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import CanonicalHome from "@/components/CanonicalHome";
import Breadcrumbs from "@/components/Breadcrumbs";
import NotFound from "./NotFound";
import { BUSINESS } from "@/lib/business";
import { shippingPolicy } from "@/data/shipping-policy";

type Section = { h: string; p: string[] };
type Doc = { title: string; intro: string; sections: Section[] };

const docs: Record<string, Doc> = {
  warranty: {
    title: "Limited Workmanship Warranty & Support",
    intro: "A limited warranty on our assembly work, plus help with manufacturer part warranties.",
    sections: [
      { h: "Limited warranty", p: ["This is a LIMITED WARRANTY on our workmanship. For one (1) year from pickup or delivery, if something we assembled, wired, or installed fails because of our workmanship, we will repair it at no labor cost. This warranty is given by Monterey Bay PCs to the original purchaser and is not transferable."] },
      { h: "What is not covered", p: ["Physical damage, liquid damage, power surges, overclocking or modifications made by others, software, viruses, data loss, normal wear, and parts you supplied yourself are not covered by our workmanship warranty."] },
      { h: "Component warranties", p: ["Individual components keep their full manufacturer warranty, which is provided by the manufacturer, not by us. We will help you troubleshoot and file a claim, but we cannot guarantee a manufacturer's decision."] },
      { h: "How to make a claim", p: [`Email ${BUSINESS.email} or call ${BUSINESS.phone} with your name, order details, and a short description of the problem. We will tell you whether to bring the PC in or how to ship it. Do not send anything until we confirm.`] },
      { h: "Your state law rights", p: ["Implied warranties, including any implied warranty of merchantability or fitness for a particular purpose, are not disclaimed and apply as provided by law. This warranty gives you specific legal rights, and you may also have other rights which vary from state to state."] },
      { h: "Technical support", p: ["Every PC purchase includes technical support. If something is not working right, or you just have a question, reach out and we will help."] },
    ],
  },
  returns: {
    title: "Returns & Refunds",
    intro: "How returns, cancellations, and refunds work.",
    sections: [
      { h: "Prebuilt PCs", p: ["If there is a problem with your prebuilt PC at pickup or delivery, let us know right away and we will make it right."] },
      { h: "Return authorization", p: ["Contact us before shipping anything back for a confirmed address and safe packing instructions. Change-of-mind returns are considered case by case; we do not promise an automatic return window. We confirm eligibility, condition requirements, return shipping costs and any lawful deduction in writing. Damaged, faulty or incorrect orders are handled separately under applicable law."] },
      { h: "Custom builds", p: ["Custom builds are made from parts ordered for you. Contact us as early as possible if you need to cancel so we can see what options are available."] },
      { h: "Refunds", p: ["Approved refunds are sent back to the original payment method through Stripe."] },
      { h: "Consumer rights", p: ["See our US Shipping, Pickup & Delivery policy for damaged or missing parcels and delayed shipment cancellations. Nothing in these terms limits rights that cannot legally be waived. Your bank determines when an issued refund appears."] },
      { h: "Questions", p: [`Email ${BUSINESS.email} and we will walk you through it.`] },
    ],
  },
  shipping: shippingPolicy,
  terms: {
    title: "Terms of Service",
    intro: "The basic rules for using this website and buying from us.",
    sections: [
      { h: "Orders", p: ["Placing an order means you agree to pay the listed price plus any applicable sales tax and delivery fee. Prices and availability can change before you pay. If we made a clear pricing error, we will contact you before building and you may cancel for a full refund."] },
      { h: "Payments", p: ["Payments are processed securely by Stripe. We never see or store your full card number."] },
      { h: "Your own parts", p: ["When you bring your own parts, you are responsible for their condition and compatibility. We will tell you about any issues we find."] },
      { h: "Warranty", p: ["Our assembly work is covered by our Limited Workmanship Warranty. Components are covered by their manufacturers. See the warranty page for details."] },
      { h: "Limitation of liability", p: ["To the fullest extent allowed by law, our total liability for any claim related to an order or service is limited to the amount you paid for that order or service, and we are not liable for indirect, incidental, or consequential damages such as lost data, lost profits, or lost time.", "This does not limit liability for personal injury, fraud, gross negligence, willful misconduct, or any rights that cannot legally be limited, including your rights under California consumer protection law."] },
      { h: "Delays outside our control", p: ["We are not responsible for delays caused by events beyond our reasonable control, such as part shortages, manufacturer recalls, carrier disruptions, natural disasters, or power outages. If a delay affects your order, we will tell you and you may choose to wait or cancel an unshipped order for a refund."] },
      { h: "Governing law", p: ["These terms are governed by the laws of the State of California. Any dispute will be handled in the state or federal courts located in Monterey County, California, unless the law where you live gives you the right to bring a claim there or in small claims court."] },
      { h: "Changes", p: ["We may update these terms. The terms shown when you placed your order apply to that order. Effective October 21, 2026."] },
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
                {s.p.map((t) => <p key={t} className="text-muted-foreground leading-relaxed mb-3">{t}</p>)}
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
