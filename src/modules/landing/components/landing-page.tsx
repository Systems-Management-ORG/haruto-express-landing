import { Contact } from "./contact";
import { Faq } from "./faq";
import { Hero } from "./hero";
import { MotionLayer } from "./motion-layer";
import { Policy } from "./policy";
import { Pricing } from "./pricing";
import { Process } from "./process";
import { Routes } from "./routes";
import { Services } from "./services";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { Why } from "./why";

export function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Why />
        <Services />
        <Routes />
        <Pricing />
        <Policy />
        <Process />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
      <MotionLayer />
    </>
  );
}
