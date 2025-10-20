import { useEffect, useState } from "react";
import Script from "next/script";
import "../styles/globals.css";
import { supabase } from "../utils/supabaseClient";

export default function App({ Component, pageProps }) {
  const [maintenance, setMaintenance] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Función para obtener estado de mantenimiento
  async function checkMaintenance() {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("maintenance, message")
        .eq("id", 1)
        .single();

      if (error || !data) {
        console.warn("No se encontró configuración de mantenimiento:", error);
        return { maintenance: false, message: "" };
      }

      return data;
    } catch (err) {
      console.error("Error en checkMaintenance:", err);
      return { maintenance: false, message: "" };
    }
  }

  useEffect(() => {
    async function init() {
      const maintenanceData = await checkMaintenance();
      console.log("Resultado de mantenimiento:", maintenanceData);
      setMaintenance(maintenanceData.maintenance || false);
      setMessage(maintenanceData.message || "");
      setLoading(false); // 🔑 Esto asegura que la página avance
    }

    init();
  }, []);

  // Pantalla de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  // Página de mantenimiento
  if (maintenance) {
    return (
      <>
        <Script
          src="https://web.cmp.usercentrics.eu/modules/autoblocker.js"
          strategy="afterInteractive"
        />
        <Script
          id="usercentrics-cmp"
          src="https://web.cmp.usercentrics.eu/ui/loader.js"
          data-settings-id="E0yLicy4fkb4pH"
          strategy="afterInteractive"
        />

        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4">🚧 Mantenimiento 🚧</h1>
            <p className="text-gray-700 whitespace-pre-line">{message}</p>
          </div>
        </div>
      </>
    );
  }

  // Página normal
  return (
    <>
      <Script
        src="https://web.cmp.usercentrics.eu/modules/autoblocker.js"
        strategy="afterInteractive"
      />
      <Script
        id="usercentrics-cmp"
        src="https://web.cmp.usercentrics.eu/ui/loader.js"
        data-settings-id="E0yLicy4fkb4pH"
        strategy="afterInteractive"
      />

      <Component {...pageProps} />
    </>
  );
}
