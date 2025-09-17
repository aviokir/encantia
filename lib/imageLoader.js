// lib/imageLoader.js
export const supabaseLoader = ({ src, width, quality }) => {
  // Reemplaza el dominio de Supabase con tu dominio
  const url = src.replace(
    'https://gibvptdakkudvhkgoyko.supabase.co',
    'https://storage.encantia.online'
  );

  return `${url}?w=${width}&q=${quality || 75}`;
};
