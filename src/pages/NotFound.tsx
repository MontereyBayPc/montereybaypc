import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";

const NotFound = () => (
  <Layout>
    <Helmet>
      <title>Page Not Found | Monterey Bay PCs</title>
      <meta name="robots" content="noindex" />
    </Helmet>
    <section className="min-h-[70vh] flex items-center">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <p className="font-heading text-8xl lg:text-9xl font-bold text-foreground/10 select-none">404</p>
        <h1 className="font-heading text-3xl lg:text-5xl font-bold text-foreground -mt-6">This page failed POST.</h1>
        <p className="text-muted-foreground mt-4 max-w-md mx-auto">The page you are looking for does not exist or has moved.</p>
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <Link to="/" className="btn-brand">Back to Home <ArrowRight className="w-4 h-4" /></Link>
          <Link to="/prebuilts" className="btn-outline">Browse Builds</Link>
        </div>
      </div>
    </section>
  </Layout>
);

export default NotFound;
