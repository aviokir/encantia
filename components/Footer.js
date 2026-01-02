// components/Footer.js
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Quienes somos */}
        <div>
          <h3 className="text-white font-bold mb-4">Quienes somos</h3>
          <ul className="space-y-2">
            <li>
              <a href="/team" className="hover:text-white transition">Equipo</a>
            </li>
          </ul>
        </div>

        {/* Empleo */}
        <div>
          <h3 className="text-white font-bold mb-4">Empleo</h3>
          <ul className="space-y-2">
            <li>
              <a href="https://jobs.encantia.xyz/" className="hover:text-white transition">Trabaja con Nosotros</a>
            </li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="text-white font-bold mb-4">Contacto</h3>
          <ul className="space-y-2">
            <li>
              <a href="mailto:info@encantia.online" className="hover:text-white transition">Email</a>
            </li>
          </ul>
        </div>

        {/* Redes sociales */}
        <div>
          <h3 className="text-white font-bold mb-4">Redes sociales</h3>
          <ul className="space-y-2">
          </ul>
        </div>
      </div>

      <div className="mt-10 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Encantia. Todos los derechos reservados.
      </div>
    </footer>
  );
}


