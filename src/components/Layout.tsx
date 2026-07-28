import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <ScrollToTop />
    <Navbar />
    <main className="flex-1 pt-16 lg:pt-20">{children}</main>
    <Footer />
  </div>
);

export default Layout;
