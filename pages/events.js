import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AlertBanner from "../components/AlertBanner";

/* =========================
   CONFIGURACIÓN DE STATUS
========================= */
const EVENT_STATUS = {
  confirmado: {
    label: "Confirmado",
    color: "bg-green-600 text-white",
  },
  suspendido: {
    label: "Suspendido",
    color: "bg-red-600 text-white",
  },
  pendiente: {
    label: "Pendiente de validación",
    color: "bg-yellow-500 text-black",
  },
  finalizado: {
    label: "Finalizado",
    color: "bg-gray-600 text-white",
  },
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timers, setTimers] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);

  /* =========================
     TRAER EVENTOS
  ========================= */
  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: false });

      if (error) console.error(error.message);
      else setEvents(data);

      setLoading(false);
    };

    fetchEvents();
  }, []);

  /* =========================
     CUENTA ATRÁS
  ========================= */
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers = {};
      events.forEach((event) => {
        const now = new Date();
        const eventDate = new Date(event.date);
        const diff = eventDate - now;

        if (diff > 0) {
          newTimers[event.id] = {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60),
          };
        } else {
          newTimers[event.id] = null;
        }
      });
      setTimers(newTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [events]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Cargando eventos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <AlertBanner />
      <Navbar />

      {/* =========================
         GRID DE EVENTOS
      ========================= */}
      <main className="w-full max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <p className="text-center col-span-full text-gray-400">
            No hay eventos aún.
          </p>
        ) : (
          events.map((event) => {
            const timer = timers[event.id];
            const status = EVENT_STATUS[event.status];

            return (
              <div
                key={event.id}
                onClick={() =>
                  event.status !== "suspendido" && setSelectedEvent(event)
                }
                className={`bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col transition
                  ${
                    event.status === "suspendido"
                      ? "opacity-60 cursor-not-allowed"
                      : "cursor-pointer hover:scale-105"
                  }
                `}
              >
                {event.cover && (
                  <img
                    src={event.cover}
                    alt={event.name}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-4 flex flex-col flex-1">
                  {/* STATUS */}
                  {status && (
                    <span
                      className={`mb-2 px-3 py-1 rounded-full text-xs font-semibold w-fit ${status.color}`}
                    >
                      {status.label}
                    </span>
                  )}

                  <h2 className="text-xl font-bold mb-1">{event.name}</h2>
                  <p className="text-gray-400 mb-2">
                    {new Date(event.date).toLocaleString()}
                  </p>

                  {timer ? (
                    <p className="text-yellow-400 font-semibold mb-2">
                      ⏳ {timer.days}d {timer.hours}h {timer.minutes}m{" "}
                      {timer.seconds}s
                    </p>
                  ) : (
                    <p className="text-green-400 font-semibold mb-2">
                      Evento iniciado / pasado
                    </p>
                  )}

                  <p className="text-gray-300 flex-1">
                    {event.description}
                  </p>

                  {event.winner && (
                    <p className="text-green-400 font-semibold mt-3">
                      Ganador: {event.winner}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* =========================
         MODAL DE EVENTO
      ========================= */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-3xl bg-gray-900 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-3xl font-bold hover:text-gray-300"
            >
              &times;
            </button>

            {selectedEvent.cover && (
              <div className="relative w-full h-96">
                <img
                  src={selectedEvent.cover}
                  alt={selectedEvent.name}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
                  {/* STATUS */}
                  {EVENT_STATUS[selectedEvent.status] && (
                    <span
                      className={`mb-2 px-4 py-1 rounded-full text-sm font-semibold w-fit ${
                        EVENT_STATUS[selectedEvent.status].color
                      }`}
                    >
                      {EVENT_STATUS[selectedEvent.status].label}
                    </span>
                  )}

                  <h2 className="text-3xl font-bold">
                    {selectedEvent.name}
                  </h2>
                  <p>{new Date(selectedEvent.date).toLocaleString()}</p>
                </div>
              </div>
            )}

            <div className="p-6 space-y-4 overflow-y-auto">
              <p className="text-gray-300">
                {selectedEvent.description}
              </p>

              {selectedEvent.info && (
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-1">
                    Información adicional
                  </h3>
                  <p className="text-gray-300">{selectedEvent.info}</p>
                </div>
              )}

              {selectedEvent.winner && (
                <p className="text-green-400 font-semibold">
                  Ganador: {selectedEvent.winner}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
