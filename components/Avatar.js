import Image from 'next/image';
import { supabaseLoader } from '../lib/imageLoader';

export default function Avatar({ url }) {
  return (
    <Image
      loader={supabaseLoader}  // Loader que transforma automáticamente la URL
      src={url}                // URL original de Supabase
      width={150}
      height={150}
      alt="Avatar"
    />
  );
}
