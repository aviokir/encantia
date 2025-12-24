import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

export default function Auth() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login"); // login | register
  const [errorMsg, setErrorMsg] = useState("");
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false);

  // Verifica si hay sesión activa
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setAlreadyLoggedIn(true);
      }
    });
  }, []);

  // Maneja login o registro
  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg("");

    let result;

    if (mode === "login") {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }

    setLoading(false);

    if (result.error) {
      setErrorMsg(result.error.message);
      return;
    }

    const session = result.data.session;

    if (session) {
      router.push("/home");
    } else if (mode === "register") {
      setErrorMsg(
        "Registro exitoso. Revisa tu correo para confirmar tu cuenta."
      );
    } else {
      setErrorMsg("No se pudo iniciar sesión. Revisa tu email y contraseña.");
    }
  };

  const signInWithProvider = (provider) => {
    supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  if (alreadyLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
        <div className="w-full max-w-sm bg-neutral-900 rounded-2xl p-8 shadow-xl text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Ya estás logueado</h1>
          <p className="text-neutral-400 mb-6">Serás redirigido a Home.</p>
          <button
            onClick={() => router.push("/home")}
            className="w-full rounded-lg bg-white py-2 font-medium text-black hover:opacity-90 transition"
          >
            Ir a Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm bg-neutral-900 rounded-2xl p-8 shadow-xl">
        {/* Título */}
        <h1 className="text-2xl font-bold text-white text-center mb-2">
          Bienvenido
        </h1>

        <h2 className="text-lg text-neutral-400 text-center mb-6">
          {mode === "login" ? "Inicia sesión" : "Regístrate"}
        </h2>

        {/* Formulario */}
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg bg-neutral-800 px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20"
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              className="w-full rounded-lg bg-neutral-800 px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-sm text-neutral-400 hover:text-white"
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          {/* Error */}
          {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}

          {/* Botón principal */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-lg bg-white py-2 font-medium text-black hover:opacity-90 transition"
          >
            {mode === "login" ? "Iniciar sesión" : "Registrarse"}
          </button>

          {/* Toggle login/registro */}
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="w-full text-sm text-neutral-400 hover:text-white transition"
          >
            {mode === "login"
              ? "¿No tienes cuenta? Regístrate"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px w-full bg-neutral-700" />
          <span className="text-xs text-neutral-500">O</span>
          <div className="h-px w-full bg-neutral-700" />
        </div>

        {/* OAuth */}
        <div className="space-y-2">
          <OAuthButton onClick={() => signInWithProvider("google")}>
            Continuar con Google
          </OAuthButton>
          <OAuthButton onClick={() => signInWithProvider("discord")}>
            Continuar con Discord
          </OAuthButton>
          <OAuthButton onClick={() => signInWithProvider("spotify")}>
            Continuar con Spotify
          </OAuthButton>
        </div>
      </div>
    </div>
  );
}

function OAuthButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg bg-neutral-800 py-2 text-white hover:bg-neutral-700 transition"
    >
      {children}
    </button>
  );
}
