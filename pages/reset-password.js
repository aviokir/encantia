import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      setMessage('Ingresa tu correo electrónico.');
      return;
    }

    setLoading(true);
    setMessage('');

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Revisa tu correo electrónico para restablecer tu contraseña.');
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="p-6 max-w-md w-full rounded bg-gray-700">
        <div className="flex justify-center mb-4">
          <img
            src="/icons/icon.png"
            alt="Logo"
            className="h-20 w-20"
          />
        </div>

        <h1 className="text-2xl mb-4 text-white text-center">Restablecer contraseña</h1>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full rounded mb-2 bg-gray-600 text-white placeholder-gray-300"
        />
        <button
          onClick={handleReset}
          disabled={loading}
          className="bg-blue-600 text-white p-2 w-full rounded"
        >
          {loading ? 'Enviando...' : 'Enviar enlace'}
        </button>
        {message && <p className="mt-2 text-white text-center">{message}</p>}
      </div>
    </div>
  );
}
