import { useState, useEffect, useCallback } from "react";
import { supabase } from "../utils/supabaseClient";
import BottomNavbar from "../components/BottomNavbar";
import { useRouter } from "next/router";

// Colores pastel más oscuros para los roles
const roleColors = {
  mod: "bg-blue-300 text-blue-900",
  web: "bg-cyan-300 text-cyan-900",
  marketing: "bg-pink-300 text-pink-900",
  editor: "bg-purple-300 text-purple-900",
  trial_mod: "bg-indigo-300 text-indigo-900",
  modeler: "bg-green-300 text-green-900",
  builder: "bg-yellow-300 text-yellow-900",
  dev: "bg-red-300 text-red-900",
  designer: "bg-teal-300 text-teal-900",
  voice: "bg-orange-300 text-orange-900",
  compositor: "bg-fuchsia-300 text-fuchsia-900",
  hoster: "bg-emerald-300 text-emerald-900",
  admin: "bg-gray-300 text-gray-900",
  co_owner: "bg-lime-300 text-lime-900",
  manager: "bg-sky-300 text-sky-900",
  owner: "bg-black text-white",
  bot: "bg-zinc-300 text-zinc-900",
};

// Iconos por rol
const roleIcons = {
  owner: "https://www.encantia.online/icons/owner.webp",
  mod: "https://www.encantia.online/icons/mod.webp",
  marketing: "https://www.encantia.online/icons/marketing.webp",
  hoster: "https://www.encantia.online/icons/hoster.webp",
  builder: "https://www.encantia.online/icons/builder.webp",
  dev: "https://www.encantia.online/icons/dev.webp",
  designer: "https://www.encantia.online/icons/designer.webp",
  web: "https://www.encantia.online/icons/web.webp",
  editor: "https://www.encantia.online/icons/editor.webp",
  voice: "https://www.encantia.online/icons/voice.webp",
  compositor: "https://www.encantia.online/icons/compositor.webp",
  manager: "https://www.encantia.online/icons/manager.webp",
};

// Orden de los roles para mostrar
const allRoles = [
  "owner", "co_owner", "admin", "manager", "mod", "trial_mod", "web",
  "marketing", "editor", "modeler", "builder", "dev", "designer",
  "voice", "compositor", "hoster", "bot"
];

export default function TeamPage() {
  const [userProfile, setUserProfile] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const router = useRouter();

  // Obtener perfil del usuario
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

  // Obtener alertas
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

  // Obtener miembros del equipo
  const fetchTeam = useCallback(async () => {
    const { data, error } = await supabase.from("team").select("*");
    if (!error) setTeamMembers(data);
  }, []);

  useEffect(() => {
    fetchUserProfile();
    fetchAlertMessage();
    fetchTeam();
  }, [fetchUserProfile, fetchAlertMessage, fetchTeam]);

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

  if (!userProfile) {
    return (
      <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center text-white">
        {renderAlert()}
        <div className="font-bold text-lg mt-8">Cargando perfil...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {renderAlert()}

      {/* Equipo */}
      <div className="p-6 mt-4">
        <h1 className="text-3xl font-bold text-center mb-8">Nuestro Equipo</h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center"
            >
              <img
                src={member.avatar_url || "/default-avatar.png"}
                alt={member.username}
                className="w-24 h-24 rounded-full mb-4 border-2 border-gray-700 object-cover"
              />

              {/* Nombre + link con hover azul */}
              <div className="flex items-center justify-center mt-2">
                <h2 className="text-xl font-semibold">{member.username}</h2>
                {member.link && member.link.trim() !== "" && (
                  <a
                    href={member.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-blue-500 transition-colors duration-200"
                  >
                    <img
                      src="https://www.encantia.online/icons/link.webp"
                      alt="link"
                      className="w-4 h-4"
                    />
                  </a>
                )}
              </div>

              {/* Roles con iconos y tamaño más grande */}
              <div className="flex flex-wrap gap-3 justify-center mt-4">
                {allRoles.map(
                  (role) =>
                    member[role] && (
                      <span
                        key={role}
                        className={`px-4 py-2 text-sm font-medium rounded-full flex items-center gap-2 ${
                          roleColors[role] || "bg-gray-300 text-gray-900"
                        }`}
                      >
                        {roleIcons[role] && (
                          <img
                            src={roleIcons[role]}
                            alt={role}
                            className="w-5 h-5"
                          />
                        )}
                        {role.replace("_", " ")}
                      </span>
                    )
                )}
              </div>
            </div>
          ))}
        </div>

        {teamMembers.length === 0 && (
          <p className="text-center text-gray-400 mt-8">
            No hay miembros del equipo todavía.
          </p>
        )}
      </div>

      {/* Bottom Navbar */}
      <BottomNavbar userProfile={userProfile} handleSignOut={handleSignOut} />

      {/* Copyright */}
      <div className="fixed bottom-3 right-3 text-gray-400 text-xs bg-gray-900 p-2 rounded-md shadow-md">
        © 2025 by Encantia is licensed under CC BY-NC-ND 4.0.
      </div>
    </div>
  );
}
