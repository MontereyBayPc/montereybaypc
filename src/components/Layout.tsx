import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import MobileActionBar from "./MobileActionBar";

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <ScrollToTop />
    <Navbar />
    <main className="flex-1 pt-16 lg:pt-20">{children}</main>
    <Footer />
    <div className="h-20 lg:hidden" aria-hidden />
    <MobileActionBar />
  </div>
);

export default Layout;
