import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Image from "next/image";
import Footer from "../components/Footer";
import AlertBanner from "../components/AlertBanner"; // Banner de avisos

export default function Team() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      const { data, error } = await supabase.from("team").select("*");

      if (error) console.error("Error fetching team:", error.message);
      else setTeam(data);

      setLoading(false);
    };

    fetchTeam();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Cargando equipo...</p>
      </div>
    );
  }

  const rolesList = [
    "mod", "web", "marketing", "editor", "trial_mod", "modeler", "builder",
    "dev", "designer", "voice", "compositor", "hoster", "admin",
    "co_owner", "manager", "owner", "bot"
  ];

  const exRolesList = rolesList.map(role => `ex_${role}`);

  const anyDomainLoader = ({ src }) => src;

  // Separar empleados y ex-empleados
  const empleados = team.filter(member => rolesList.some(role => member[role]));
  const exEmpleados = team.filter(member => exRolesList.some(role => member[role]));

  // Función para mostrar roles
  const renderRoles = (member, list) => (
    list.map(role => member[role] ? (
      <span
        key={role}
        className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
        title={role.replace("ex_", "")}
      >
        {role.startsWith("ex_") ? `Ex-${role.slice(3)}` : role}
      </span>
    ) : null)
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <AlertBanner />
      <Navbar />

      <main className="w-full max-w-6xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {empleados.length === 0 && exEmpleados.length === 0 ? (
          <p className="text-center col-span-full text-gray-300">No hay miembros en el equipo.</p>
        ) : (
          <>
            {/* Empleados */}
            {empleados.map(member => (
              <div
                key={member.id}
                className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transition transform cursor-pointer"
              >
                {member.avatar_url ? (
                  <div className="relative w-28 h-28 mb-4">
                    <Image
                      loader={anyDomainLoader}
                      src={member.avatar_url}
                      alt={member.username}
                      fill
                      className="rounded-full object-cover border-2 border-gray-600"
                    />
                  </div>
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                    <span className="text-gray-400 text-2xl">?</span>
                  </div>
                )}
                <h2 className="text-xl font-bold mb-2">{member.username}</h2>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {renderRoles(member, rolesList)}
                </div>
              </div>
            ))}

            {/* Ex-Empleados */}
            {exEmpleados.map(member => (
              <div
                key={member.id + "-ex"}
                className="bg-gray-700 rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transition transform cursor-pointer opacity-80"
              >
                {member.avatar_url ? (
                  <div className="relative w-28 h-28 mb-4">
                    <Image
                      loader={anyDomainLoader}
                      src={member.avatar_url}
                      alt={member.username}
                      fill
                      className="rounded-full object-cover border-2 border-gray-600"
                    />
                  </div>
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gray-600 flex items-center justify-center mb-4">
                    <span className="text-gray-400 text-2xl">?</span>
                  </div>
                )}
                <h2 className="text-xl font-bold mb-2">{member.username}</h2>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {renderRoles(member, exRolesList)}
                </div>
              </div>
            ))}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
