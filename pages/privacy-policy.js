/**
 * Renderiza la Política de Privacidad de Encantia.
 * @param {string} elementId - El ID del contenedor donde se insertará el HTML.
 */
function renderPrivacyPolicy(elementId) {
    const container = document.getElementById(elementId);
    if (!container) return;

    const lastUpdate = new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    const htmlContent = `
    <div class="max-w-4xl mx-auto my-10 px-4 font-sans antialiased text-slate-700">
        <article class="bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-100">
            
            <header class="bg-gradient-to-r from-slate-900 to-slate-800 py-12 px-8 text-center">
                <h1 class="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
                    Política de Privacidad
                </h1>
                <div class="h-1 w-20 bg-indigo-500 mx-auto rounded-full"></div>
                <p class="text-slate-400 mt-4 uppercase tracking-widest text-xs font-bold">Encantia Protección de Datos</p>
            </header>

            <div class="p-8 md:p-14 space-y-12">
                
                <section class="prose prose-slate max-w-none">
                    <p class="text-xl leading-relaxed text-slate-500 italic">
                        "En <span class="text-slate-900 font-semibold not-italic">Encantia</span>, no solo protegemos tus datos, protegemos tu confianza."
                    </p>
                </section>

                <div class="grid gap-12">
                    
                    <section class="flex flex-col md:flex-row gap-6">
                        <div class="md:w-1/3">
                            <h2 class="text-indigo-600 font-bold uppercase tracking-wider text-sm">01. Recopilación</h2>
                            <p class="text-slate-900 font-extrabold text-lg">Qué datos obtenemos</p>
                        </div>
                        <div class="md:w-2/3 text-slate-600 leading-relaxed">
                            <p>Recogemos información personal esencial para tu experiencia: nombre, email y datos de facturación. Solo solicitamos lo estrictamente necesario para procesar tus pedidos.</p>
                        </div>
                    </section>

                    <section class="flex flex-col md:flex-row gap-6">
                        <div class="md:w-1/3">
                            <h2 class="text-indigo-600 font-bold uppercase tracking-wider text-sm">02. Finalidad</h2>
                            <p class="text-slate-900 font-extrabold text-lg">Uso de la información</p>
                        </div>
                        <div class="md:w-2/3 text-slate-600 leading-relaxed">
                            <p>Utilizamos tus datos para mejorar nuestro servicio y enviarte ofertas exclusivas. <strong>Puedes darte de baja de nuestras comunicaciones en cualquier momento</strong> con un solo clic.</p>
                        </div>
                    </section>

                    <section class="bg-slate-50 border-l-4 border-indigo-500 p-8 rounded-r-xl shadow-sm">
                        <h3 class="text-slate-900 font-bold mb-2 flex items-center">
                            <svg class="w-5 h-5 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0 1 1 0 002 0zM4.5 5A1.5 1.5 0 104.5 8 1.5 1.5 0 004.5 5zM15 8a1 1 0 110-2 1 1 0 010 2zM9 13a1 1 0 110-2 1 1 0 010 2zM15 13a1 1 0 100-2 1 1 0 000 2zM5 13a1 1 0 110-2 1 1 0 010 2zM12 9a1 1 0 100-2 1 1 0 000 2z"></path><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.286 4.647a6 6 0 0111.066 3.033 6.002 6.002 0 01-7.066 7.066 6.002 6.002 0 01-7.066-7.066 6 6 0 013.066-3.033z" clip-rule="evenodd"></path></svg>
                            Gestión de Cookies
                        </h3>
                        <p class="text-sm text-slate-600">Usamos cookies para analizar el tráfico y personalizar tu navegación. Tienes el control total para desactivarlas desde la configuración de tu navegador.</p>
                    </section>

                    <section class="flex flex-col md:flex-row gap-6">
                        <div class="md:w-1/3">
                            <h2 class="text-indigo-600 font-bold uppercase tracking-wider text-sm">03. Seguridad</h2>
                            <p class="text-slate-900 font-extrabold text-lg">Protección total</p>
                        </div>
                        <div class="md:w-2/3 text-slate-600 leading-relaxed">
                            <p>Encantia no venderá ni distribuirá tus datos a terceros. Mantenemos nuestros sistemas actualizados para evitar cualquier acceso no autorizado, cumpliendo con los estándares legales vigentes.</p>
                        </div>
                    </section>

                </div>
            </div>

            <footer class="bg-slate-50 border-t border-slate-100 p-8 text-center text-slate-400 text-xs tracking-widest">
                <p class="mb-2 uppercase">&copy; ${new Date().getFullYear()} Encantia - Todos los derechos reservados</p>
                <p>Última actualización: <span class="text-slate-600 font-bold">${lastUpdate}</span></p>
            </footer>
        </article>
    </div>
    `;

    container.innerHTML = htmlContent;
}

// Para usarlo, solo necesitas un <div id="app"></div> en tu HTML y llamar a la función:
// renderPrivacyPolicy('app');
