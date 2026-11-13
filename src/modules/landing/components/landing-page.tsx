import { Contact } from "./contact";
import { Faq } from "./faq";
import { GoodsTiles } from "./goods-tiles";
import { Guides } from "./guides";
import { Hero } from "./hero";
import { MotionLayer } from "./motion-layer";
import { PricingTeaser } from "./pricing-teaser";
import { Routes } from "./routes";
import { ServiceCards } from "./service-cards";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { SkyTow } from "./sky-tow";
import { Why } from "./why";

// Home is a hub: each section is a short overview that links to its own page. The full pricing
// tables and policy details live on their dedicated routes, so the home page stays scannable.
// Section data (which pages, images and icons) lives in ../home-data.ts.
export function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <SkyTow />
        <ServiceCards />
        <GoodsTiles />
        <Why />
        <Routes />
        <PricingTeaser />
        <Guides />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
      <MotionLayer />
    </>
  );
}
