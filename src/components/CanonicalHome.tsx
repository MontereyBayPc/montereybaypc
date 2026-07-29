import { Helmet } from "react-helmet-async";

type Props = {
  title?: string;
  description?: string;
};

const CanonicalHome = ({ title, description }: Props) => (
  <Helmet>
    {title ? <title>{title}</title> : null}
    {description ? <meta name="description" content={description} /> : null}
    {title ? <meta property="og:title" content={title} /> : null}
    {description ? <meta property="og:description" content={description} /> : null}
    <link rel="canonical" href="/" />
  </Helmet>
);

export default CanonicalHome;
