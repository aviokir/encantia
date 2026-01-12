// components/PrivacyPolicy.js
import React from 'react';

const PrivacyPolicy = () => {
  const currentYear = new Date().getFullYear();
  const lastUpdate = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <article className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
          
          {/* Header con gradiente de Tailwind */}
          <header className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 py-16 px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Política de Privacidad
            </h1>
            <div className="h-1.5 w-24 bg-indigo-500 mx-auto rounded-full mb-6"></div>
            <p className="text-indigo-200 uppercase tracking-[0.2em] text-sm font-semibold">
              Encantia &bull; Compromiso de Seguridad
            </p>
          </header>

          <div className="p-8 md:p-16 space-y-12 text-slate-600 leading-relaxed">
            
            <section>
              <p className="text-xl text-slate-500 italic border-l-4 border-indigo-500 pl-6">
                "En Encantia, nos tomamos en serio la protección de sus datos personales. Esta política detalla cómo gestionamos su información de manera transparente y segura."
              </p>
            </section>

            {/* Grid de Secciones */}
            <div className="grid gap-12">
              
              <section className="group">
                <div className="flex items-center mb-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-600 text-white font-bold mr-4 group-hover:scale-110 transition-transform">1</span>
                  <h2 className="text-2xl font-bold text-slate-900">Información Recogida</h2>
                </div>
                <p>Podemos solicitar datos como su nombre, correo electrónico y detalles de facturación. Esto ocurre únicamente cuando es necesario para procesar pedidos o mejorar su experiencia en nuestra plataforma.</p>
              </section>

              <section className="group">
                <div className="flex items-center mb-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-600 text-white font-bold mr-4 group-hover:scale-110 transition-transform">2</span>
                  <h2 className="text-2xl font-bold text-slate-900">Uso de los Datos</h2>
                </div>
                <p>La información se emplea para mantener un registro de usuarios y pedidos. Es posible que enviemos correos con ofertas especiales, los cuales puede cancelar en cualquier momento mediante el enlace de desuscripción.</p>
              </section>

              {/* Caja de Cookies con Tailwind decorativo */}
              <section className="relative overflow-hidden bg-slate-900 rounded-2xl p-8 text-slate-300 shadow-inner">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0 1 1 0 002 0zM4.5 5A1.5 1.5 0 104.5 8 1.5 1.5 0 004.5 5zM15 8a1 1 0 110-2 1 1 0 010 2zM9 13a1 1 0 110-2 1 1 0 010 2zM15 13a1 1 0 100-2 1 1 0 000 2zM5 13a1 1 0 110-2 1 1 0 010 2zM12 9a1 1 0 100-2 1 1 0 000 2z"></path></svg>
                </div>
                <h3 className="text-white font-bold text-xl mb-3">Política de Cookies</h3>
                <p className="text-sm leading-relaxed">
                  Utilizamos cookies para analizar el tráfico web. Usted tiene el control total para aceptar o rechazar su uso desde la configuración de su navegador.
                </p>
              </section>

              <section className="group">
                <div className="flex items-center mb-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-600 text-white font-bold mr-4 group-hover:scale-110 transition-transform">3</span>
                  <h2 className="text-2xl font-bold text-slate-900">Seguridad y Control</h2>
                </div>
                <p>Encantia no venderá ni distribuirá su información sin su permiso explícito, salvo por orden judicial. Contamos con protocolos avanzados para evitar accesos no autorizados.</p>
              </section>

            </div>
          </div>

          <footer className="bg-slate-50 border-t border-slate-100 p-8 text-center">
            <p className="text-slate-400 text-sm tracking-wide">
              &copy; {currentYear} <strong>ENCANTIA</strong> &bull; Todos los derechos reservados.
            </p>
            <p className="text-indigo-600 font-medium text-xs mt-2 uppercase">
              Última actualización: {lastUpdate}
            </p>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
