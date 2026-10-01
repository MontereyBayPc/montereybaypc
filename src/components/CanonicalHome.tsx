import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { SITE_URL, findSeoRoute, noindexRoutes } from "@/seo/routes";

type Props = {
  title?: string;
  description?: string;
};

// Per-page head tags with a self-referencing canonical URL.
const CanonicalHome = ({ title, description }: Props) => {
  const { pathname } = useLocation();
  const meta = findSeoRoute(pathname);
  const t = title ?? meta?.title;
  const d = description ?? meta?.description;
  const path = pathname !== "/" ? pathname.replace(/\/+$/, "") : "/";
  const url = `${SITE_URL}${path}`;
  const noindex = noindexRoutes.some((r) => r.path === path);
  return (
    <Helmet>
      {t ? <title>{t}</title> : null}
      {d ? <meta name="description" content={d} /> : null}
      {t ? <meta property="og:title" content={t} /> : null}
      {d ? <meta property="og:description" content={d} /> : null}
      <meta property="og:url" content={url} />
      {noindex ? <meta name="robots" content="noindex" /> : null}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default CanonicalHome;
