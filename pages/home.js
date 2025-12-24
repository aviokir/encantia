import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const [userName, setUserName] = useState(""); // nombre del usuario
  const router = useRouter();

  useEffect(() => {
    const getUserName = async () => {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        router.push("/auth");
        return;
      }

      const userId = sessionData.session.user.id;

      // Traemos el name desde la tabla profiles
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("name")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
        setUserName(sessionData.session.user.email); // fallback
      } else {
        setUserName(profile?.name || sessionData.session.user.email);
      }
    };

    getUserName();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar />

      {userName && (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-6xl mx-auto my-6 text-center">
          <h2 className="text-2xl font-semibold mb-2">Bienvenido, {userName}</h2>
          <p className="text-gray-300">Sección Inicio</p>
        </div>
      )}
      <Footer />
    </div>
  );
}
