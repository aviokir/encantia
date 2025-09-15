import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";

export default function Profiles() {
  const [userProfile, setUserProfile] = useState(null);
  const [allProfiles, setAllProfiles] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState({});
  const router = useRouter();

  const fetchUserProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileData) setUserProfile(profileData);
  }, []);

  const fetchAllProfiles = useCallback(async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("user_id, name, avatar_url, role");

    if (!error && data) setAllProfiles(data);
  }, []);

  const fetchOnlineUsers = useCallback(async () => {
    const { data, error } = await supabase
      .storage
      .from("status")
      .download("online.json");

    if (error) return;

    const text = await data.text();
    try {
      const parsed = JSON.parse(text);
      setOnlineUsers(parsed);
    } catch {}
  }, []);

  useEffect(() => {
    fetchUserProfile();
    fetchAllProfiles();
    fetchOnlineUsers();

    const interval = setInterval(fetchOnlineUsers, 5000);
    return () => clearInterval(interval);
  }, [fetchUserProfile, fetchAllProfiles, fetchOnlineUsers]);

  const isUserOnline = (userId) => {
    const timestamp = onlineUsers[userId];
    return timestamp && Date.now() - timestamp < 10000;
  };

  const groupedProfiles = allProfiles.reduce((acc, profile) => {
    const role = profile.role?.trim() || "Usuarios";
    if (!acc[role]) acc[role] = [];
    acc[role].push(profile);
    return acc;
  }, {});

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Perfiles agrupados */}
      <div className="p-4 mt-0">
        <h2 className="text-xl font-semibold mb-4">Perfiles de usuarios por rol</h2>
        {Object.entries(groupedProfiles).map(([role, profiles]) => (
          <div key={role} className="mb-6">
            <h3 className="text-lg font-bold mb-2 capitalize">{role}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {profiles.map((profile) => (
                <div
                  key={profile.user_id}
                  className="bg-gray-800 rounded-lg p-4 flex items-center space-x-4"
                >
                  <img
                    src={profile.avatar_url || "https://i.ibb.co/d0mWy0kP/perfildef.png"}
                    alt={profile.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{profile.name}</p>
                    <p className="text-sm mt-1">
                      {isUserOnline(profile.user_id) ? (
                        <span className="text-green-400">🟢 Online</span>
                      ) : (
                        <span className="text-red-400">🔴 Desconectado</span>
                      )}
                    </p>
                    <button
                      onClick={() => router.push(`/profile/${profile.user_id}`)}
                      className="text-sm text-blue-400 hover:underline mt-1"
                    >
                      Ver perfil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="fixed bottom-3 right-3 text-gray-400 text-xs bg-gray-900 p-2 rounded-md shadow-md z-40">
        © 2025 by Encantia is licensed under CC BY-NC-ND 4.0.
      </div>
    </div>
  );
}

