import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router';

export default function UpdatePassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { access_token } = router.query;

  const handleUpdate = async () => {
    if (!password) {
      setMessage('Ingresa una contraseña.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser(
      { password },
      access_token ? { accessToken: access_token } : {}
    );

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Contraseña actualizada con éxito.');
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

        <h1 className="text-2xl mb-4 text-white text-center">Nueva contraseña</h1>

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full rounded mb-2 bg-gray-600 text-white placeholder-gray-300"
        />
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-blue-600 text-white p-2 w-full rounded"
        >
          {loading ? 'Actualizando...' : 'Actualizar contraseña'}
        </button>
        {message && <p className="mt-2 text-white text-center">{message}</p>}
      </div>
    </div>
  );
}
