import { useEffect, useState } from "react";
import Script from "next/script";
import "../styles/globals.css";
import { supabase } from "../utils/supabaseClient";

export default function App({ Component, pageProps }) {
  const [maintenance, setMaintenance] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔍 Obtener el estado actual de mantenimiento
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
      setMaintenance(maintenanceData.maintenance || false);
      setMessage(maintenanceData.message || "");
      setLoading(false);
    }

    init();

    // 🔁 Suscripción en tiempo real a cambios de la tabla settings
    const channel = supabase
      .channel("settings-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "settings", filter: "id=eq.1" },
        (payload) => {
          const data = payload.new;
          if (data) {
            setMaintenance(data.maintenance);
            setMessage(data.message || "");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ⏳ Estado de carga inicial
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">Cargando...</p>
      </div>
    );
  }

  // 🚧 Modo mantenimiento (sin CSS externo)
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

        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">🚧 Mantenimiento 🚧</h1>
            <p className="text-gray-700">{message}</p>
          </div>
        </div>
      </>
    );
  }

  // ✅ Modo normal (por ejemplo, UserArea.js)
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

