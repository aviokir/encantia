import { useEffect, useState } from "react";
import Script from "next/script";
import "../styles/globals.css";
import { supabase } from "../utils/supabaseClient";

export default function App({ Component, pageProps }) {
  const [maintenance, setMaintenance] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // 📦 Leer el estado actual
  async function fetchMaintenance() {
    const { data, error } = await supabase
      .from("settings")
      .select("maintenance, message")
      .eq("id", 1)
      .single();

    if (error) {
      console.error("Error al obtener mantenimiento:", error);
      return { maintenance: false, message: "" };
    }

    return data || { maintenance: false, message: "" };
  }

  useEffect(() => {
    let mounted = true;

    async function init() {
      const data = await fetchMaintenance();
      if (!mounted) return;
      setMaintenance(data.maintenance);
      setMessage(data.message);
      setLoading(false);
    }

    init();

    // ⚡ Suscripción realtime
    const channel = supabase
      .channel("realtime:settings:id=eq.1")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "settings", filter: "id=eq.1" },
        (payload) => {
          const newData = payload.new;
          console.log("🔄 Cambio detectado:", newData);
          setMaintenance(newData.maintenance);
          setMessage(newData.message);
        }
      )
      .subscribe((status) => {
        console.log("📡 Estado de canal:", status);
      });

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // ⏳ Mientras carga la primera lectura
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg">Cargando...</p>
      </div>
    );
  }

  // 🚧 Si está activo el mantenimiento
  if (maintenance) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <h1 className="text-2xl font-bold mb-4">🚧 En mantenimiento 🚧</h1>
          <p className="text-gray-700">{message}</p>
        </div>
      </div>
    );
  }

  // ✅ Página normal
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

