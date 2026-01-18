import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Formulario() {
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre) {
      setMensaje("Por favor, ingresa un nombre");
      return;
    }

    const { data, error } = await supabase
      .from("amores")
      .insert([{ nombre }]);

    if (error) {
      setMensaje("Error al guardar: " + error.message);
    } else {
      setMensaje(`¡Gracias! Guardamos el nombre: ${nombre}`);
      setNombre(""); // Limpiar input
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-200 to-purple-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">
          ¿Cuál es el nombre del chico que te gusta/ama?
        </h1>
        <input
          type="text"
          placeholder="Nombre del chico"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <button
          type="submit"
          className="w-full bg-pink-500 text-white p-3 rounded-lg hover:bg-pink-600 transition-colors"
        >
          Guardar
        </button>
        {mensaje && <p className="mt-4 text-center text-gray-700">{mensaje}</p>}
      </form>
    </div>
  );
}
