import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Navbar from "../../components/Navbar";
import { PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Footer from "../../components/Footer";
import AlertBanner from "../../components/AlertBanner"; // Importa el componente

export default function ProfilePage() {
  const router = useRouter();
  const { uuid } = router.query;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Estado edición
  const [editing, setEditing] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        router.push("/auth");
        return;
      }

      const userId = sessionData.session.user.id;
      setCurrentUserId(userId);

      // Traer perfil con descripción
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("name, avatar_url, role, description")
        .eq("user_id", uuid)
        .single();

      if (error || !profileData) {
        setProfile(null);
        setLoading(false);
        return;
      }
      setProfile(profileData);
      setDescriptionInput(profileData.description || "");

      // Traer seguidores y siguiendo
      const { count: followers } = await supabase
        .from("follows")
        .select("*", { count: "exact" })
        .eq("following_id", uuid);

      const { count: following } = await supabase
        .from("follows")
        .select("*", { count: "exact" })
        .eq("follower_id", uuid);

      setFollowersCount(followers || 0);
      setFollowingCount(following || 0);

      // Verificar si current user sigue a este usuario
      const { data: existingFollow } = await supabase
        .from("follows")
        .select("*")
        .eq("follower_id", userId)
        .eq("following_id", uuid)
        .single();

      setIsFollowing(!!existingFollow);
      setLoading(false);
    };

    if (uuid) fetchProfile();
  }, [uuid, router]);

  const handleFollowToggle = async () => {
    if (!currentUserId || currentUserId === uuid) return;

    if (isFollowing) {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", currentUserId)
        .eq("following_id", uuid);
      setIsFollowing(false);
      setFollowersCount((prev) => prev - 1);
    } else {
      await supabase.from("follows").insert([
        { follower_id: currentUserId, following_id: uuid },
      ]);
      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1);
    }
  };

  const handleSaveDescription = async () => {
    // Guardar en Supabase
    await supabase
      .from("profiles")
      .update({ description: descriptionInput })
      .eq("user_id", uuid);
    setProfile({ ...profile, description: descriptionInput });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Perfil no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      <AlertBanner /> {/* Banner de avisos */}
      <Navbar />

      <div className="mt-12 w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col items-center">
        {/* Foto de perfil */}
        <img
          src={profile.avatar_url || "/icons/logo.webp"}
          alt="Avatar"
          className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-white shadow-lg"
        />

        {/* Nombre y rol */}
        <div className="flex items-center space-x-2 mb-2">
          <h2 className="text-2xl font-bold">{profile.name}</h2>
          {profile.role && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {profile.role}
            </span>
          )}
        </div>

        {/* Descripción editable */}
        <div className="flex flex-col items-center mb-4 w-full">
          {editing ? (
            <div className="w-full flex flex-col items-center space-y-2">
              <textarea
                className="w-full p-2 rounded-lg bg-gray-700 text-white focus:outline-none"
                rows={3}
                value={descriptionInput}
                onChange={(e) => setDescriptionInput(e.target.value)}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveDescription}
                  className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 rounded text-white"
                >
                  <CheckIcon className="w-5 h-5 mr-1" />
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setDescriptionInput(profile.description || "");
                    setEditing(false);
                  }}
                  className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-white"
                >
                  <XMarkIcon className="w-5 h-5 mr-1" />
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-center">
              {profile.description && (
                <p className="text-gray-300 text-center">{profile.description}</p>
              )}
              {currentUserId === uuid && (
                <PencilIcon
                  className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition"
                  onClick={() => setEditing(true)}
                />
              )}
            </div>
          )}
        </div>

        {/* Seguidores y siguiendo estilo TikTok */}
        <div className="flex justify-around w-full mb-6">
          <div className="flex flex-col items-center">
            <p className="font-bold text-lg">{followersCount}</p>
            <p className="text-gray-400 text-sm">Seguidores</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="font-bold text-lg">{followingCount}</p>
            <p className="text-gray-400 text-sm">Siguiendo</p>
          </div>
        </div>

        {/* Botón seguir / dejar de seguir */}
        {currentUserId !== uuid && (
          <button
            onClick={handleFollowToggle}
            className={`w-full py-3 rounded-full font-semibold transition text-lg ${
              isFollowing
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            {isFollowing ? "Dejar de seguir" : "Seguir"}
          </button>
        )}
      </div>
      <Footer />
    </div>
  );
}
