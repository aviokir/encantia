import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AlertBanner from "../components/AlertBanner"; // Importa el componente

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timers, setTimers] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Traer eventos
  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: false });

      if (error) console.error("Error fetching events:", error.message);
      else setEvents(data);

      setLoading(false);
    };

    fetchEvents();
  }, []);

  // Actualizar cuenta atrás
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers = {};
      events.forEach((event) => {
        const now = new Date();
        const eventDate = new Date(event.date);
        const diff = eventDate - now;

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          const seconds = Math.floor((diff / 1000) % 60);

          newTimers[event.id] = { days, hours, minutes, seconds };
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
        <p>Cargando eventos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <AlertBanner /> {/* Banner de avisos */}
      <Navbar />

      <main className="w-full max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <p className="text-center col-span-full text-gray-300">No hay eventos aún.</p>
        ) : (
          events.map((event) => {
            const timer = timers[event.id];
            return (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="cursor-pointer bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col transform hover:scale-105 transition"
              >
                {event.cover && (
                  <img
                    src={event.cover}
                    alt={event.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4 flex flex-col flex-1">
                  <h2 className="text-xl font-bold mb-2">{event.name}</h2>
                  <p className="text-gray-400 mb-1">
                    {new Date(event.date).toLocaleString()}
                  </p>
                  {timer ? (
                    <p className="text-yellow-400 mb-2 font-semibold">
                      ⏳ {timer.days}d {timer.hours}h {timer.minutes}m {timer.seconds}s
                    </p>
                  ) : (
                    <p className="text-green-400 mb-2 font-semibold">Evento ya comenzó / pasado</p>
                  )}
                  <p className="text-gray-300 flex-1">{event.description}</p>
                  {event.winner && (
                    <p className="text-green-400 font-semibold mt-auto">
                      Ganador: {event.winner}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Modal de evento estilo TikTok */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-3xl bg-gray-900 rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-white text-3xl font-bold z-50 hover:text-gray-300"
            >
              &times;
            </button>

            {/* Cover grande */}
            {selectedEvent.cover && (
              <div className="relative w-full h-96 md:h-[30rem]">
                <img
                  src={selectedEvent.cover}
                  alt={selectedEvent.name}
                  className="w-full h-full object-cover"
                />
                {/* Overlay semitransparente para contenido encima del cover */}
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 text-white">
                  <h2 className="text-3xl font-bold">{selectedEvent.name}</h2>
                  <p>{new Date(selectedEvent.date).toLocaleString()}</p>
                  {timers[selectedEvent.id] ? (
                    <p className="text-yellow-400 font-semibold text-lg">
                      ⏳ {timers[selectedEvent.id].days}d {timers[selectedEvent.id].hours}h {timers[selectedEvent.id].minutes}m {timers[selectedEvent.id].seconds}s
                    </p>
                  ) : (
                    <p className="text-green-400 font-semibold text-lg">Evento ya comenzó / pasado</p>
                  )}
                </div>
              </div>
            )}

            {/* Contenido extra debajo del cover */}
            <div className="p-6 flex flex-col space-y-4 overflow-y-auto">
              <p className="text-gray-300">{selectedEvent.description}</p>

              {selectedEvent.info && (
                <div className="bg-gray-800 p-4 rounded-lg text-gray-200">
                  <h3 className="font-semibold mb-2">Información adicional</h3>
                  <p>{selectedEvent.info}</p>
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
