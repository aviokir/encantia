import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";
import Navbar from "../../components/Navbar";
import ConnectionSpotify from "../../components/ConnectionSpotify"; // componente de ejemplo
import Footer from "../../components/Footer";
import AlertBanner from "../../components/AlertBanner"; // Importa el componente

export default function SettingsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    avatar_url: "",
    role: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        router.push("/auth");
        return;
      }

      const uid = sessionData.session.user.id;
      setUserId(uid);

      const { data, error } = await supabase
        .from("profiles")
        .select("name, avatar_url, role, description")
        .eq("user_id", uid)
        .single();

      if (error) console.error("Error fetching profile:", error.message);
      else
        setProfileData({
          name: data.name || "",
          avatar_url: data.avatar_url || "",
          role: data.role || "",
          description: data.description || "",
        });

      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        name: profileData.name,
        role: profileData.role,
        description: profileData.description,
      })
      .eq("user_id", userId);

    if (error) console.error("Error guardando cambios:", error.message);
    else alert("Cambios guardados correctamente!");
    setSaving(false);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}.${fileExt}`;
    const filePath = `${fileName}`;

    // Subir al bucket avatars
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) console.error("Error subiendo avatar:", uploadError.message);

    // Obtener URL pública
    const { data: publicData, error: urlError } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    if (urlError) console.error("Error obteniendo URL pública:", urlError.message);

    const publicUrl = publicData.publicUrl;

    // Guardar automáticamente en la DB
    const { error } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("user_id", userId);

    if (!error) setProfileData((prev) => ({ ...prev, avatar_url: publicUrl }));

    setUploading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <AlertBanner /> {/* Banner de avisos */}
      <Navbar />
      <div className="mt-12 flex w-full max-w-5xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-lg">
        {/* Sidebar */}
        <div className="w-1/4 border-r border-white/20 flex flex-col p-4 space-y-2">
          <button
            className={`text-left p-2 rounded hover:bg-white/20 ${
              activeTab === "general" ? "bg-white/20 font-bold" : ""
            }`}
            onClick={() => setActiveTab("general")}
          >
            General
          </button>
          <button
            className={`text-left p-2 rounded hover:bg-white/20 ${
              activeTab === "connections" ? "bg-white/20 font-bold" : ""
            }`}
            onClick={() => setActiveTab("connections")}
          >
            Conexiones
          </button>
        </div>

        {/* Contenido */}
        <div className="w-3/4 p-6 flex flex-col space-y-4">
          {activeTab === "general" && (
            <>
              <h1 className="text-2xl font-bold mb-4">Configuración General</h1>

              {/* Avatar */}
              <div className="flex flex-col items-center">
                {profileData.avatar_url && (
                  <img
                    src={`${profileData.avatar_url}?t=${Date.now()}`} // cache-busting
                    alt="Avatar"
                    className="w-24 h-24 rounded-full mb-2 object-cover border-2 border-white"
                  />
                )}
                <label className="cursor-pointer px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white">
                  {uploading ? "Subiendo..." : "Subir foto"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Nombre */}
              <div className="flex flex-col">
                <label className="mb-1 text-gray-300">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  className="p-2 rounded bg-gray-700 text-white focus:outline-none"
                />
              </div>

              {/* Rol */}
              <div className="flex flex-col">
                <label className="mb-1 text-gray-300">Rol</label>
                <input
                  type="text"
                  name="role"
                  value={profileData.role}
                  onChange={handleChange}
                  className="p-2 rounded bg-gray-700 text-white focus:outline-none"
                />
              </div>

              {/* Descripción */}
              <div className="flex flex-col">
                <label className="mb-1 text-gray-300">Descripción</label>
                <textarea
                  name="description"
                  value={profileData.description}
                  onChange={handleChange}
                  rows={3}
                  className="p-2 rounded bg-gray-700 text-white focus:outline-none"
                />
              </div>

              {/* Guardar cambios */}
              <button
                onClick={handleSave}
                disabled={saving || uploading}
                className={`w-full py-3 rounded-full font-semibold text-lg ${
                  saving || uploading ? "bg-gray-600" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </>
          )}

          {activeTab === "connections" && (
            <>
              <h1 className="text-2xl font-bold mb-4">Conexiones</h1>
              <p className="text-gray-300 mb-2">
                Conecta tus cuentas para mostrar tu actividad o música escuchada.
              </p>
              <ConnectionSpotify userId={userId} />
              {/* Aquí podrías agregar Discord, YouTube, etc. de forma similar */}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
