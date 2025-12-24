import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AlertBanner() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .eq("active", true);

      if (error) console.error("Error fetching alerts:", error);
      else setAlerts(data || []);
    };

    fetchAlerts();

    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="w-full flex flex-col items-center space-y-2 mt-2">
      {alerts.map((alert) => {
        let bgColor = "bg-blue-500"; // info por defecto
        if (alert.type === "error") bgColor = "bg-red-500";
        if (alert.type === "warning") bgColor = "bg-yellow-500";

        return (
          <div
            key={alert.id}
            className={`inline-block ${bgColor} text-white px-6 py-3 rounded shadow-md max-w-[90%] overflow-hidden`}
          >
            <span className="whitespace-nowrap overflow-x-auto block">
              {alert.message}
            </span>
          </div>
        );
      })}
    </div>
  );
}
