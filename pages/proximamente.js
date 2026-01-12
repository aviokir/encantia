import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AlertBanner from "../components/AlertBanner";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        router.push("/auth");
        return;
      }
      setLoading(false);
    };

    checkUser();
  }, [router]);

  // Mientras verifica la sesión, podemos mostrar un estado vacío o un loader
  if (loading) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <AlertBanner /> 
      <Navbar />

      {/* Sección de Página en Desarrollo */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl max-w-lg w-full text-center border border-gray-700">
          <div className="mb-6 flex justify-center">
            {/* Icono de construcción/reloj */}
            <div className="bg-yellow-500/10 p-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="Length12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Página en Desarrollo
          </h1>
          
          <p className="text-gray-400 text-lg mb-8">
            Estamos trabajando para mejorar tu experiencia. Esta sección no está disponible por el momento.
          </p>
          
          <div className="py-3 px-6 bg-gray-900/50 rounded-lg border border-gray-700 inline-block">
            <span className="text-sm font-medium text-gray-300">
              ⚠️ Por favor, pruebe de nuevo más tarde.
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
