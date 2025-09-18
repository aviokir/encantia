import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";
import BottomNavbar from "../components/BottomNavbar";

export default function Navbar() {
  const [userProfile, setUserProfile] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [updates, setUpdates] = useState([]);
  const router = useRouter();

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

  const fetchAlertMessage = useCallback(async () => {
    const { data, error } = await supabase
      .from("alerts")
      .select("*")
      .eq("active", true)
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (data) setAlertMessage({ message: data.message, type: data.type });
  }, []);

  const fetchUpdates = useCallback(async () => {
    const { data, error } = await supabase
      .from("updates")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) setUpdates(data);
  }, []);

  useEffect(() => {
    fetchUserProfile();
    fetchAlertMessage();
    fetchUpdates();
  }, [fetchUserProfile, fetchAlertMessage, fetchUpdates]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) router.push("/");
  };

  const renderAlert = () =>
    alertMessage && (
      <div
        className={`flex items-start sm:items-center justify-center gap-3 px-4 py-3 text-sm font-medium w-full z-50 ${
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
        <div className="text-left max-w-3xl">{alertMessage.message}</div>
      </div>
    );

  const renderStatusBadge = (status) => {
    switch (status) {
      case "En Desarrollo":
        return (
          <span className="px-2 py-1 rounded text-yellow-800 bg-yellow-100 text-xs font-semibold">
            {status}
          </span>
        );
      case "Pendiente":
        return (
          <span className="px-2 py-1 rounded text-orange-800 bg-orange-100 text-xs font-semibold">
            {status}
          </span>
        );
      case "Hecho":
        return (
          <span className="px-2 py-1 rounded text-green-800 bg-green-100 text-xs font-semibold">
            {status}
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded text-gray-800 bg-gray-100 text-xs font-semibold">
            {status}
          </span>
        );
    }
  };

  if (!userProfile) {
    return (
      <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center text-white">
        {renderAlert()}
        <div className="font-bold text-lg mt-8 mb-4">
          No se encontró un perfil asociado.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {renderAlert()}

      {/* Navbar reutilizable */}
      <BottomNavbar userProfile={userProfile} handleSignOut={handleSignOut} />

      {/* Lista de actualizaciones */}
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Actualizaciones</h2>
        <div className="space-y-3">
          {updates.length === 0 ? (
            <p className="text-gray-400">No hay actualizaciones registradas.</p>
          ) : (
            updates.map((update) => (
              <div
                key={update.id}
                className="p-4 rounded-lg bg-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold">{update.titulo}</p>
                  <p className="text-sm text-gray-400">{update.nombre}</p>
                </div>
                <div className="mt-2 sm:mt-0">{renderStatusBadge(update.estado)}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="fixed bottom-3 right-3 text-gray-400 text-xs bg-gray-900 p-2 rounded-md shadow-md">
        © 2025 by Encantia is licensed under CC BY-NC-ND 4.0.
      </div>
    </div>
  );
}
