import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/router";
import BottomNavbar from "../../components/BottomNavbar"; // <- importamos el componente

const Perfil = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const { uuid } = router.query;

  const isOwnProfile = currentUser?.id === uuid;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user && !error) setCurrentUser(user);
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!uuid) return;

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", uuid)
          .single();

        if (error) throw error;
        setUserProfile(data);
        setNewDescription(data.description || "");
      } catch (err) {
        console.error("Error al cargar perfil:", err);
        setErrorMessage("No se pudo cargar el perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [uuid]);

  useEffect(() => {
    if (!uuid) return;

    const fetchFollowers = async () => {
      try {
        const { data: followersData, error } = await supabase
          .from("followers")
          .select("follower_id")
          .eq("followed_id", uuid);

        if (error) throw error;

        setFollowersCount(followersData.length);

        if (followersData.length) {
          const ids = followersData.map(f => f.follower_id);
          const { data: profiles, error: error2 } = await supabase
            .from("profiles")
            .select("name, avatar_url")
            .in("user_id", ids);

          if (error2) throw error2;
          setFollowers(profiles);
        } else {
          setFollowers([]);
        }
      } catch (err) {
        console.error("Error cargando seguidores:", err);
        setErrorMessage("No se pudo cargar los seguidores.");
      }
    };

    fetchFollowers();
  }, [uuid]);

  useEffect(() => {
    if (!currentUser || !uuid) return;

    const checkFollowStatus = async () => {
      const { data, error } = await supabase
        .from("followers")
        .select("id")
        .eq("follower_id", currentUser.id)
        .eq("followed_id", uuid);

      if (!error) setIsFollowing(data.length > 0);
    };

    checkFollowStatus();
  }, [currentUser, uuid]);

  const handleSaveDescription = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ description: newDescription })
        .eq("user_id", currentUser.id);

      if (error) throw error;

      setUserProfile(prev => ({ ...prev, description: newDescription }));
      setIsEditing(false);
    } catch (err) {
      console.error("Error al guardar descripción:", err);
      setErrorMessage("Hubo un error al guardar la descripción.");
    }
  };

  const handleFollow = async () => {
    try {
      const { error } = await supabase
        .from("followers")
        .insert([{ follower_id: currentUser.id, followed_id: uuid }]);

      if (error) throw error;

      setIsFollowing(true);
      setFollowersCount(prev => prev + 1);
    } catch (err) {
      console.error("Error al seguir:", err);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const openFollowersModal = () => setIsFollowersModalOpen(true);
  const closeFollowersModal = () => setIsFollowersModalOpen(false);

  if (loading) return <div className="text-white p-6">Cargando...</div>;
  if (errorMessage) return <div className="text-red-500 p-6">{errorMessage}</div>;

  return (
    <div className="bg-gray-900 min-h-screen text-white relative">
      {/* Perfil */}
      <div className="flex flex-col items-center p-6">
        <img
          src={userProfile.avatar_url || "https://i.ibb.co/d0mWy0kP/perfildef.png"}
          alt="Avatar"
          className="w-32 h-32 rounded-full mb-4"
        />
        <h1 className="text-3xl font-semibold">{userProfile.name}</h1>
        <p className="mt-2 text-lg text-gray-300">Rol: {userProfile.role || "Sin rol"}</p>

        <div className="mt-4 w-full max-w-xl text-center">
          {!isEditing ? (
            <p className="text-gray-300">
              {userProfile.description || "Este usuario no ha agregado una descripción."}
            </p>
          ) : (
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full p-4 bg-gray-700 rounded-md resize-none h-32"
              placeholder="Escribe tu nueva descripción..."
            />
          )}
        </div>

        {isOwnProfile && (
          isEditing ? (
            <div className="flex gap-4 mt-4">
              <button onClick={handleSaveDescription} className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-400">Guardar</button>
              <button onClick={() => setIsEditing(false)} className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-400">Cancelar</button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="mt-4 bg-yellow-500 px-4 py-2 rounded-lg hover:bg-yellow-400">Editar Descripción</button>
          )
        )}

        {!isOwnProfile && !isFollowing && (
          <button onClick={handleFollow} className="mt-6 bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-400">
            Seguir
          </button>
        )}

        <div className="mt-6 text-lg text-gray-300">
          <span className="cursor-pointer hover:underline" onClick={openFollowersModal}>
            {followersCount} {followersCount === 1 ? "seguidor" : "seguidores"}
          </span>
        </div>
      </div>

      {/* Modal de seguidores */}
      {isFollowersModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={closeFollowersModal}>
          <div
            className="bg-gray-900 p-6 rounded-lg w-96 max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Seguidores</h2>
            <ul className="space-y-4">
              {followers.map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <img
                    src={f.avatar_url || "https://i.ibb.co/d0mWy0kP/perfildef.png"}
                    alt={f.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <span>{f.name}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={closeFollowersModal}
              className="mt-4 w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Navbar reutilizable */}
      <BottomNavbar userProfile={userProfile} handleSignOut={handleSignOut} />

      {/* Copyright */}
      <div className="fixed bottom-3 right-3 text-gray-400 text-xs bg-gray-900 p-2 rounded-md shadow-md z-40">
        © 2025 by Encantia is licensed under CC BY-NC-ND 4.0.
      </div>
    </div>
  );
};

export default Perfil;
