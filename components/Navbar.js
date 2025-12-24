import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function Navbar() {
  const router = useRouter();
  const tabs = [
    { name: "Inicio", path: "/home" },
    { name: "Eventos", path: "/events" },
    { name: "Libros", path: "/books" },
    { name: "Team", path: "/team" },
  ];

  const [avatarUrl, setAvatarUrl] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const dropdownRef = useRef();

  // Obtener avatar y userId
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return;
      const userId = sessionData.session.user.id;
      setUserId(userId);

      const { data: profile } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("user_id", userId)
        .single();

      if (profile?.avatar_url) setAvatarUrl(profile.avatar_url);
    };
    fetchProfile();
  }, []);

  // Cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="w-full py-4 flex justify-center">
        <div className="w-full max-w-6xl bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3 flex items-center justify-between shadow-md">
          {/* Logo */}
          <img
            src="/icons/logo.webp"
            alt="Logo"
            className="w-12 h-12 object-contain"
          />

          {/* Menú centrado */}
          <nav className="flex-1 flex justify-center space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => router.push(tab.path)}
                className={`px-3 py-1 rounded-lg transition ${
                  router.pathname === tab.path
                    ? "bg-white/20 font-semibold text-white"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>

          {/* Avatar / Dropdown */}
          <div className="relative" ref={dropdownRef}>
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt="Avatar"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-white hover:opacity-80 transition"
              />
            )}

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-lg z-50 text-white">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded-t-xl"
                  onClick={() => router.push("/settings/general")}
                >
                  Configuración
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                  onClick={() => router.push(`/profile/${userId}`)}
                >
                  Perfil
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded-b-xl"
                  onClick={() => setConfirmOpen(true)}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal Confirmación centrado en toda la pantalla */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold mb-4">
              ¿Estás seguro de cerrar sesión?
            </h2>
            <div className="flex justify-around">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
              >
                No
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition text-white"
              >
                Sí
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
