import { Link, useLocation } from "react-router-dom";
import { Phone } from "lucide-react";
import Layout from "@/components/Layout";
import CanonicalHome from "@/components/CanonicalHome";
import Breadcrumbs from "@/components/Breadcrumbs";
import LeadForm from "@/components/LeadForm";
import { findInfoPage } from "@/data/info-pages";
import { BUSINESS } from "@/lib/business";
import NotFound from "./NotFound";

const InfoPage = () => {
  const { pathname } = useLocation();
  const page = findInfoPage(pathname.replace(/\/$/, ""));
  if (!page) return <NotFound />;

  return (
    <Layout>
      <CanonicalHome title={page.title} description={page.description} />
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <Breadcrumbs items={[{ label: page.h1 }]} />
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-4">{page.h1}</h1>
          <p className="text-muted-foreground text-lg mb-12">{page.intro}</p>

          {page.sections.map((s) => (
            <div key={s.h} className="mb-12">
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">{s.h}</h2>
              <ul className="grid gap-3">
                {s.items.map((i) => (
                  <li key={i} className="border border-border rounded-2xl p-4 text-foreground">{i}</li>
                ))}
              </ul>
            </div>
          ))}

          {page.form ? (
            <>
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">{page.form.heading}</h2>
              <LeadForm kind={page.form.kind} messagePlaceholder={page.form.placeholder} submitLabel={page.form.submit} checklist={page.form.checklist} />
            </>
          ) : (
            <div className="flex flex-wrap gap-4">
              <Link to="/quote" className="btn-brand">Get a Quote</Link>
              <Link to="/prebuilts" className="btn-outline">Browse Builds</Link>
            </div>
          )}
          <a href={BUSINESS.phoneHref} className="mt-8 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <Phone className="w-4 h-4" /> Or call {BUSINESS.phone}
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default InfoPage;
