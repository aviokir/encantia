// pages/_app.js
import '../styles/globals.css';
import BottomNavbar from '../components/BottomNavbar';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

function MyApp({ Component, pageProps }) {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user) {
        const user = sessionData.session.user;
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setUserProfile(data);
      }
    };

    fetchProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserProfile(session.user); // Puedes ajustar si quieres obtener más datos del perfil
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      if (authListener && typeof authListener.unsubscribe === 'function') {
        authListener.unsubscribe();
      }
    };
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <BottomNavbar userProfile={userProfile} handleSignOut={async () => {
        await supabase.auth.signOut();
        setUserProfile(null);
      }} />
    </>
  );
}

export default MyApp;
