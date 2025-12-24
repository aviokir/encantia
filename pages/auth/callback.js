import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/home");
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-400">
      Autenticando...
    </div>
  );
}
