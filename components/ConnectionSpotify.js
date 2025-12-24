import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ConnectionSpotify({ userId }) {
  const [connected, setConnected] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [track, setTrack] = useState(null);

  useEffect(() => {
    const fetchConnection = async () => {
      const { data } = await supabase
        .from("connections")
        .select("id, is_public, current_track")
        .eq("user_id", userId)
        .eq("provider", "spotify")
        .single();

      if (data) {
        setConnected(true);
        setIsPublic(data.is_public);
        setTrack(data.current_track ? JSON.parse(data.current_track) : null);
      }
    };
    fetchConnection();
  }, [userId]);

  const handleConnect = () => {
    window.location.href = `/api/oauth/spotify?user_id=${userId}`;
  };

  const togglePublic = async () => {
    const { error } = await supabase
      .from("connections")
      .update({ is_public: !isPublic })
      .eq("user_id", userId)
      .eq("provider", "spotify");

    if (!error) setIsPublic(!isPublic);
  };

  return (
    <div className="flex items-center justify-between bg-gray-700 p-3 rounded">
      <div className="flex flex-col">
        <span className="capitalize">Spotify</span>
        {track && <span className="text-sm text-gray-300">🎵 {track.name} - {track.artist}</span>}
      </div>
      <div className="flex items-center space-x-2">
        {connected && (
          <label className="flex items-center space-x-1 text-sm">
            <input type="checkbox" checked={isPublic} onChange={togglePublic} />
            <span>Público</span>
          </label>
        )}
        <button
          onClick={handleConnect}
          className="px-3 py-1 bg-blue-500 rounded hover:bg-blue-600 text-white"
        >
          {connected ? "Actualizar" : "Conectar"}
        </button>
      </div>
    </div>
  );
}
