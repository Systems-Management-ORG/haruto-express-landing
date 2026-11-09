import Script from "next/script";

// Container ID from the GTM export; the GA4 tag (G-MKQSP57SD6) fires through it.
// Override per environment with NEXT_PUBLIC_GTM_ID; set it empty to disable loading.
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-PL7NKB8J";

// The dataLayer bootstrap plus the loader for googletagmanager.com/gtm.js.
export function GoogleTagManager() {
  if (!GTM_ID) return null;
  return (
    <Script id="gtm-init" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}

// The no-JavaScript fallback; must sit at the top of <body>.
export function GoogleTagManagerNoScript() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
