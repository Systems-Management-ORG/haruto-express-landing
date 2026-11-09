import { Contact } from "./contact";
import { Faq } from "./faq";
import { Hero } from "./hero";
import { MotionLayer } from "./motion-layer";
import { PricingTeaser } from "./pricing-teaser";
import { Process } from "./process";
import { Routes } from "./routes";
import { Services } from "./services";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { Why } from "./why";

// Home is a hub: each section is a short overview that links to its own page. The full pricing
// tables and policy details live on their dedicated routes, so the home page stays scannable.
export function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Why />
        <Services />
        <Routes />
        <PricingTeaser />
        <Process />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
      <MotionLayer />
    </>
  );
}
