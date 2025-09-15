import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";
import BottomNavbar from "../components/BottomNavbar"; // <- Importamos el componente

export default function Eventos() {
  const [userProfile, setUserProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [nickname, setNickname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isProfileExisting, setIsProfileExisting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventCountdowns, setEventCountdowns] = useState({});
  const router = useRouter();

  const fetchUserProfile = useCallback(async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return;

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileData) setUserProfile(profileData);
  }, []);

  const fetchUsers = useCallback(async () => {
    const { data, error } = await supabase.from('profiles').select('*');
    if (!error) setUsers(data);
  }, []);

  const fetchAlertMessage = useCallback(async () => {
    const { data } = await supabase
      .from('alerts')
      .select('*')
      .eq('active', true)
      .order('id', { ascending: false })
      .limit(1)
      .single();

    if (data) setAlertMessage({ message: data.message, type: data.type });
  }, []);

  const fetchEvents = useCallback(async () => {
    const { data, error } = await supabase
      .from('events')
      .select('id, name, date, description, cover, winner')
      .order('date', { ascending: true });

    if (!error) setEvents(data);
  }, []);

  useEffect(() => {
    fetchUserProfile();
    fetchUsers();
    fetchAlertMessage();
    fetchEvents();
  }, [fetchUserProfile, fetchUsers, fetchAlertMessage, fetchEvents]);

  const getTimeDiffString = (targetDate) => {
    const now = new Date();
    const end = new Date(targetDate);
    const diff = end - now;

    if (diff <= 0) return "¡Ya ocurrió!";

    let totalSeconds = Math.floor(diff / 1000);
    const months = Math.floor(totalSeconds / (60 * 60 * 24 * 30));
    totalSeconds %= (60 * 60 * 24 * 30);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    totalSeconds %= (60 * 60 * 24);
    const hours = Math.floor(totalSeconds / (60 * 60));
    totalSeconds %= (60 * 60);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${months}M ${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns = {};
      events.forEach(event => {
        newCountdowns[event.id] = getTimeDiffString(event.date);
      });
      setEventCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [events]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) router.push('/');
  };

  const handleProfileSubmit = async () => {
    setErrorMessage("");
    setIsProfileExisting(false);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setErrorMessage("No se pudo obtener el usuario.");
      return;
    }

    const existingUser = users.find(u => u.name.toLowerCase() === nickname.toLowerCase());
    if (existingUser) {
      setIsProfileExisting(true);
      return;
    }

    const newProfile = {
      user_id: user.id,
      name: nickname,
      avatar_url: avatarUrl,
      email: user.email,
    };

    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert([newProfile], { onConflict: ['user_id'] });

    if (!upsertError) {
      setUserProfile(newProfile);
      router.push('/');
    } else {
      setErrorMessage(upsertError.message);
    }
  };

  if (!userProfile) {
    return (
      <div className="bg-gray-900 min-h-screen flex flex-col items-center">
        {alertMessage && <div className="p-4">{alertMessage.message}</div>}
        <div className="text-white font-bold text-lg mt-8 mb-4">¡Hola! Completa tu perfil</div>
        <input type="text" placeholder="Nombre de usuario" value={nickname} onChange={(e) => setNickname(e.target.value)} className="p-2 mb-4 text-black rounded" />
        <input type="text" placeholder="URL de tu foto de perfil" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="p-2 mb-4 text-black rounded" />
        <button onClick={handleProfileSubmit} className="p-2 bg-blue-500 text-white rounded">Guardar perfil</button>
        {isProfileExisting && <div className="text-red-500 mt-2">Este nombre ya está en uso.</div>}
        {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {alertMessage && (
        <div className={`flex items-start sm:items-center justify-center gap-3 px-4 py-3 text-sm font-medium w-full z-50 ${
          alertMessage.type === 'info' ? 'bg-blue-100 text-blue-800' :
          alertMessage.type === 'success' ? 'bg-green-100 text-green-800' :
          alertMessage.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
          alertMessage.type === 'error' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          <div className="text-left max-w-3xl">{alertMessage.message}</div>
        </div>
      )}

      {/* Eventos */}
      <div className="px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Eventos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length === 0 && <p>No hay eventos próximos.</p>}
          {events.map(event => (
            <div key={event.id} className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800 shadow-lg">
              {event.cover && (
                <img
                  src={event.cover}
                  alt={`Portada de ${event.name}`}
                  className="w-full object-contain"
                  style={{ maxHeight: '300px' }}
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-1">{event.name}</h3>
                <p className="text-sm text-gray-400">
                  Empieza en: {eventCountdowns[event.id] || 'Calculando...'}
                </p>
                <p className="mt-2 text-sm">{event.description}</p>
                {event.winner && (
                  <div className="mt-4 p-2 bg-yellow-300 text-black rounded flex items-center justify-center gap-2 text-sm font-semibold">
                    👑 Ganador: {event.winner}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navbar reutilizable */}
      <BottomNavbar userProfile={userProfile} handleSignOut={handleSignOut} />

      {/* Copyright */}
      <div className="fixed bottom-3 right-3 text-gray-400 text-xs bg-gray-900 p-2 rounded-md shadow-md">
        © 2025 by Encantia is licensed under CC BY-NC-ND 4.0.
      </div>
    </div>
  );
}
