// components/BottomNavbar.js
import { useState } from "react";
import { useRouter } from "next/router";

const BottomNavbar = ({ userProfile, handleSignOut }) => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navButtons = [
    { icon: "/icons/home.png", name: "Inicio", url: '/' },
    { icon: "/icons/books.png", name: "Libros", url: '/libros' },
    { icon: "/icons/events.png", name: "Eventos", url: '/eventos' },
    { icon: "/icons/music.png", name: "Musica", url: '/musica' },
    { icon: "/icons/users.png", name: "Usuarios", url: '/usuarios' },
    { icon: "/icons/discord.png", name: "Discord", url: 'https://discord.gg/BCrvMHxQRW' }
  ];

  return (
    <div className="fixed bottom-3 left-1/2 transform -translate-x-1/2 flex items-center bg-gray-900 p-2 rounded-full shadow-lg space-x-4 w-max z-50">
      <img src="/icons/icon.png" alt="Logo" className="h-13 w-auto" />
      {navButtons.map((button, index) => (
        <div key={index} className="relative group">
          <button
            onClick={() => router.push(button.url)}
            className="p-2 rounded-full bg-gray-800 text-white text-xl transition-transform transform group-hover:scale-110"
          >
            <img src={button.icon} alt={button.name} className="w-8 h-8" />
          </button>
          <span className="absolute bottom-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-xs rounded px-2 py-1 transition-opacity">
            {button.name}
          </span>
        </div>
      ))}

      {userProfile && (
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-2 rounded-full bg-gray-800 text-white text-xl hover:scale-110 transition-transform"
          >
            <img
              src={userProfile.avatar_url || 'https://i.ibb.co/d0mWy0kP/perfildef.png'}
              alt="Avatar"
              className="w-8 h-8 rounded-full"
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

export default BottomNavbar;
