import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { supabase } from "./../../utils/supabaseClient";
import BottomNavbar from "./../../components/BottomNavbar";

export default function Navbar() {
  const [userProfile, setUserProfile] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();

  // Datos del formulario
  const [formData, setFormData] = useState({
    nombres: "",
    correo: "",
    fecha_nacimiento: "",
    nacionalidad: "",
  });

  // Obtener perfil de usuario logueado
  const fetchUserProfile = useCallback(async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return;

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileData) setUserProfile(profileData);
  }, []);

  // Obtener mensaje de alerta activa
  const fetchAlertMessage = useCallback(async () => {
    const { data } = await supabase
      .from("alerts")
      .select("*")
      .eq("active", true)
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (data) setAlertMessage({ message: data.message, type: data.type });
  }, []);

  useEffect(() => {
    fetchUserProfile();
    fetchAlertMessage();
  }, [fetchUserProfile, fetchAlertMessage]);

  // Cerrar sesión
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) router.push("/");
  };

  // Guardar formulario en Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.nombres ||
      !formData.correo ||
      !formData.fecha_nacimiento ||
      !formData.nacionalidad
    ) {
      setMensaje("⚠️ Por favor completa todos los campos.");
      return;
    }

    const { error } = await supabase.from("personas").insert([
      {
        nombres: formData.nombres,
        correo: formData.correo,
        fecha_nacimiento: formData.fecha_nacimiento,
        nacionalidad: formData.nacionalidad,
      },
    ]);

    if (error) {
      setMensaje("❌ Error al guardar: " + error.message);
    } else {
      setMensaje("✅ Datos guardados correctamente.");
      setFormData({
        nombres: "",
        correo: "",
        fecha_nacimiento: "",
        nacionalidad: "",
      });
    }
  };

  // Render de alerta superior
  const renderAlert = () =>
    alertMessage && (
      <div
        className={`flex items-center justify-center px-4 py-3 text-sm font-medium w-full z-50 ${
          alertMessage.type === "info"
            ? "bg-blue-100 text-blue-800"
            : alertMessage.type === "success"
            ? "bg-green-100 text-green-800"
            : alertMessage.type === "warning"
            ? "bg-yellow-100 text-yellow-800"
            : alertMessage.type === "error"
            ? "bg-red-100 text-red-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        <div className="text-center">{alertMessage.message}</div>
      </div>
    );

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      {/* ALERTA ARRIBA */}
      {renderAlert()}

      {/* NAVBAR ARRIBA */}
      {userProfile && (
        <div className="sticky top-0 z-40">
          <BottomNavbar userProfile={userProfile} handleSignOut={handleSignOut} />
        </div>
      )}

      {/* FORMULARIO CENTRADO */}
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="bg-gray-800 text-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">
            Formulario de Registro
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Nombres y apellidos"
              value={formData.nombres}
              onChange={(e) =>
                setFormData({ ...formData, nombres: e.target.value })
              }
              className="p-2 rounded bg-gray-700 text-white placeholder-gray-400"
            />

            <input
              type="email"
              placeholder="Correo electrónico"
              value={formData.correo}
              onChange={(e) =>
                setFormData({ ...formData, correo: e.target.value })
              }
              className="p-2 rounded bg-gray-700 text-white placeholder-gray-400"
            />

            <input
              type="date"
              value={formData.fecha_nacimiento}
              onChange={(e) =>
                setFormData({ ...formData, fecha_nacimiento: e.target.value })
              }
              className="p-2 rounded bg-gray-700 text-white"
            />

            <input
              type="text"
              placeholder="Nacionalidad"
              value={formData.nacionalidad}
              onChange={(e) =>
                setFormData({ ...formData, nacionalidad: e.target.value })
              }
              className="p-2 rounded bg-gray-700 text-white placeholder-gray-400"
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold transition"
            >
              Enviar
            </button>
          </form>

          {mensaje && (
            <div className="text-center mt-4 text-sm text-gray-300">
              {mensaje}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-3 right-3 text-gray-400 text-xs bg-gray-900 p-2 rounded-md shadow-md">
        © 2025 by Encantia is licensed under CC BY-NC-ND 4.0.
      </div>
    </div>
  );
}
