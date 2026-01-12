import "@/styles/globals.css";
import Script from "next/script";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />

      <Script
        async
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9595319009090131"
        crossOrigin="anonymous"
      />
    </>
  );
}
