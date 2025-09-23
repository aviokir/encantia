import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { supabase } from "./../../../../utils/supabaseClient";
import BottomNavbar from "./../../../../components/BottomNavbar"; // <- Importamos el componente

export default function Navbar() {
  const [userProfile, setUserProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [nickname, setNickname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isProfileExisting, setIsProfileExisting] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const router = useRouter();

  const fetchUserProfile = useCallback(async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) return;

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileData) setUserProfile(profileData);
  }, []);

  const fetchUsers = useCallback(async () => {
    const { data, error } = await supabase.from("profiles").select("*");
    if (!error) setUsers(data);
  }, []);

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

  useEffect(() => {
    fetchUserProfile();
    fetchUsers();
    fetchAlertMessage();
  }, [fetchUserProfile, fetchUsers, fetchAlertMessage]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) router.push("/");
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);

    if (uploadError) {
      setErrorMessage("Error al subir la imagen.");
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    setAvatarUrl(publicUrlData.publicUrl);
  };

  const handleProfileSubmit = async () => {
    setErrorMessage("");
    setIsProfileExisting(false);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      setErrorMessage("No se pudo obtener el usuario.");
      return;
    }

    const existingUser = users.find(
      (u) => u.name.toLowerCase() === nickname.toLowerCase()
    );
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
      .from("profiles")
      .upsert([newProfile], { onConflict: ["user_id"] });

    if (!upsertError) {
      setUserProfile(newProfile);
      router.push("/");
    } else {
      setErrorMessage(upsertError.message);
    }
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
      <div className="bg-gray-900 min-h-screen flex flex-col items-center">
        {renderAlert()}
        <div className="text-white font-bold text-lg mt-8 mb-4">
          ¡Hola! Completa tu perfil
        </div>
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="p-2 mb-4 text-white bg-gray-800 placeholder-gray-400 rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="p-2 mb-4 text-white bg-gray-800 rounded"
        />
        <button
          onClick={handleProfileSubmit}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Guardar perfil
        </button>
        {isProfileExisting && (
          <div className="text-red-500 mt-2">Este nombre ya está en uso.</div>
        )}
        {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      {renderAlert()}

      {/* Navbar reutilizable */}
      <BottomNavbar userProfile={userProfile} handleSignOut={handleSignOut} />

      {/* Aquí va el formulario de Fetu Team */}
      <div className="flex justify-center p-4">
        <TeamForm />
      </div>

      <div className="fixed bottom-3 right-3 text-gray-400 text-xs bg-gray-900 p-2 rounded-md shadow-md">
        © 2025 by Encantia is licensed under CC BY-NC-ND 4.0.
      </div>
    </div>
  );
}

/* ========================
   SUBCOMPONENTE TeamForm
   ======================== */
function TeamForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    email: "",
    discordUser: "",
    role: "",
    infoLink: "",
    privacyAccepted: false,
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.privacyAccepted) {
      setErrorMessage("Debes aceptar la casilla de confianza para enviar.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("fetu_team_members").insert([
      {
        full_name: formData.fullName,
        age: formData.age,
        email: formData.email,
        discord_user: formData.discordUser,
        role: formData.role,
        info_link: formData.infoLink,
      },
    ]);

    setLoading(false);

    if (error) {
      setErrorMessage("Hubo un error al enviar el formulario.");
    } else {
      setSuccessMessage("Formulario enviado con éxito 🎉");
      setFormData({
        fullName: "",
        age: "",
        email: "",
        discordUser: "",
        role: "",
        infoLink: "",
        privacyAccepted: false,
      });
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-8 max-w-lg w-full text-white">
      <h1 className="text-2xl font-bold text-center mb-2">
        ¿Trabajas en Fetu Team?
      </h1>
      <p className="text-gray-300 text-center mb-4">
        Rellene este formulario si trabaja en Fetu Team, esto sirve para aparecer
        en la página{" "}
        <a
          href="https://www.encantia.online/team"
          className="text-blue-400 underline"
        >
          https://www.encantia.online/team
        </a>
      </p>
      <div className="bg-yellow-200 text-yellow-900 text-sm p-3 rounded-lg mb-6">
        <strong>Advertencia:</strong> Tu privacidad es nuestra prioridad. Toda tu
        información personal (Nombres y apellidos, edad, correo electrónico...
        etc) se mantendrá estrictamente confidencial y protegida en nuestra base
        de datos. El acceso está limitado a una sola persona del equipo de Fetu
        Team.
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Nombres y Apellidos"
          required
          className="w-full p-2 rounded-lg bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Edad"
          required
          className="w-full p-2 rounded-lg bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Correo Electrónico"
          required
          className="w-full p-2 rounded-lg bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="discordUser"
          value={formData.discordUser}
          onChange={handleChange}
          placeholder="Usuario de Discord"
          required
          className="w-full p-2 rounded-lg bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="Rol actual en Fetu Studios / Fetu Team"
          required
          className="w-full p-2 rounded-lg bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="url"
          name="infoLink"
          value={formData.infoLink}
          onChange={handleChange}
          placeholder="Link de tu información (ej: https://solo.to/user)"
          required
          className="w-full p-2 rounded-lg bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            name="privacyAccepted"
            checked={formData.privacyAccepted}
            onChange={handleChange}
            className="w-4 h-4 rounded text-blue-500 focus:ring-blue-400"
          />
          <span>
            Confirmo que confío en que mi información personal quedará guardada
            de manera segura.
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Enviar Formulario"}
        </button>
      </form>

      {errorMessage && (
        <div className="text-red-500 text-sm mt-4">{errorMessage}</div>
      )}
      {successMessage && (
        <div className="text-green-500 text-sm mt-4">{successMessage}</div>
      )}
    </div>
  );
}
