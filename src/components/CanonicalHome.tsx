import { Helmet } from "react-helmet-async";

const CanonicalHome = () => (
  <Helmet>
    <link rel="canonical" href="/" />
  </Helmet>
);

export default CanonicalHome;
