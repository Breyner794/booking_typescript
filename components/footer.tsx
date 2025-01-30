const Footer = () => {
  return (
    <div className="footer-container mt-8 p-6 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Columna 1 - Aerolinea Express */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white/90">Aerolinea Express</h3>
          <p className="text-sm text-gray-300/80 leading-relaxed">
            Tu viaje comienza con nosotros. Conectando destinos con seguridad y confort.
          </p>
        </div>

        {/* Columna 2 - Enlaces Rápidos */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white/90">Enlaces Rápidos</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-sm text-gray-300/80 hover:text-white/90 transition-colors">
                Reservar Vuelo
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-gray-300/80 hover:text-white/90 transition-colors">
                Estado del Vuelo
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-gray-300/80 hover:text-white/90 transition-colors">
                Destinos
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-gray-300/80 hover:text-white/90 transition-colors">
                Ofertas Especiales
              </a>
            </li>
          </ul>
        </div>

        {/* Columna 3 - Contacto */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white/90">Contacto</h3>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2 text-sm text-gray-300/80">
              <span className="text-white/60">📞</span>
              <span>1-800-AEROEXPRESS</span>
            </li>
            <li className="flex items-center space-x-2 text-sm text-gray-300/80">
              <span className="text-white/60">✉️</span>
              <span>info@aerolineaexpress.com</span>
            </li>
            <li className="flex items-center space-x-2 text-sm text-gray-300/80">
              <span className="text-white/60">⏰</span>
              <span>24/7 Servicio al Cliente</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 my-4"></div>

      <div className="text-center text-sm text-gray-400/80">
        <p>&copy; {new Date().getFullYear()} Aerolinea Express. Todos los derechos reservados.</p>
      </div>
    </div>
  );
};

export default Footer;