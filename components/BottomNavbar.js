// components/BottomNavbar.js
import { useState } from "react";
import { useRouter } from "next/router";
import React from "react";

// NavButtons definidos fuera del componente
const navButtons = [
  { icon: "https://encantia.online/icons/home.webp", name: "Inicio", url: "/" },
  { icon: "https://encantia.online/icons/books.webp", name: "Libros", url: "/libros" },
  { icon: "https://encantia.online/icons/events.webp", name: "Eventos", url: "/eventos" },
  { icon: "https://encantia.online/icons/music.webp", name: "Musica", url: "/musica" },
  { icon: "https://encantia.online/icons/users.webp", name: "Usuarios", url: "/usuarios" },
  { icon: "https://encantia.online/icons/discord.webp", name: "Discord", url: "https://discord.gg/BCrvMHxQRW" },
];

const BottomNavbar = ({ userProfile, handleSignOut }) => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="fixed bottom-3 left-1/2 transform -translate-x-1/2 flex items-center bg-gray-900 p-2 rounded-full w-max z-50">
      {/* Logo optimizado */}
      <img src="https://encantia.online/icons/icon.png" alt="Logo" className="h-13 w-auto" loading="lazy" />

      {/* Botones de navegación */}
      {navButtons.map((button, index) => (
        <div key={index} className="relative group">
          <button
            onClick={() => router.push(button.url)}
            className="p-2 rounded-full bg-gray-800 text-white text-xl transition-transform"
          >
            <img src={button.icon} alt={button.name} className="w-8 h-8" loading="lazy" />
          </button>
          <span className="absolute bottom-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-xs rounded px-2 py-1 transition-opacity">
            {button.name}
          </span>
        </div>
      ))}

      {/* Dropdown del usuario */}
      {userProfile && (
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-2 rounded-full bg-gray-800 text-white text-xl transition-transform"
          >
            <img
              src={userProfile.avatar_url || "/icons/default-avatar.png"}
              alt="Avatar"
              className="w-8 h-8 rounded-full"
              loading="lazy"
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm rounded-lg shadow-md mt-2 w-40">
              <button
                onClick={() => router.push(`/account`)}
                className="w-full text-left px-4 py-2 hover:bg-gray-700"
              >
                Configuración
              </button>
              <button
                onClick={() => router.push(`/profile/${userProfile.user_id}`)}
                className="w-full text-left px-4 py-2 hover:bg-gray-700"
              >
                Ver mi perfil
              </button>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-700"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Memoizamos el componente para evitar renders innecesarios
export default React.memo(BottomNavbar);


