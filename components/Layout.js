// components/Layout.js
import Head from "next/head";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Encantia - Libros, música y eventos culturales</title>
        <meta name="description" content="Encantia es una comunidad cultural dedicada a libros, música y eventos." />
        <meta name="keywords" content="libros, música, eventos, cultura, Encantia" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Encantia",
              "url": "https://encantia.online",
              "logo": "https://encantia.online/logo.png",
              "description": "Encantia es una comunidad donde se descubren libros, música y eventos culturales.",
            }),
          }}
        />
      </Head>
      <main>{children}</main>
    </>
  );
}
