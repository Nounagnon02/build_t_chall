import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { NAV_LINKS } from '../../utils/constants';

function NavDropdown({ item }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center gap-1 text-sm uppercase tracking-wider font-medium transition-colors duration-200 group text-charbon/70 hover:text-charbon"
      >
        {item.label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-champagne transition-all duration-300 group-hover:w-full" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-sm shadow-glass-strong border border-perle overflow-hidden"
          >
            <div className="py-2">
              {item.children.map((child) => (
                <Link
                  key={child.path}
                  to={child.path}
                  onClick={() => setOpen(false)}
                  className="block px-5 py-2.5 text-sm text-charbon/70 hover:text-champagne hover:bg-ivory transition-colors uppercase tracking-wider font-medium"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    setMobileOpen(false);
    setMobileToolsOpen(false);
  }, [location]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-perle/70">
      <nav className="section-container flex items-center justify-between h-16 sm:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center group min-w-0" aria-label="Accueil">
          <img
            src="/logo.jpeg"
            alt="Ever After Events"
            className="h-9 sm:h-11 w-auto max-w-[140px] object-contain shrink-0"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) =>
            link.children ? (
              <NavDropdown key={link.label} item={link} navScrolled={true} />
            ) : (
              <Link
                key={link.path}
                to={link.path}
                className="relative text-sm uppercase tracking-wider font-medium transition-colors duration-200 group text-charbon/70 hover:text-charbon"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-champagne transition-all duration-300 group-hover:w-full" />
              </Link>
            )
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <Link
              to="/client"
              className="hidden sm:flex items-center gap-2 text-sm uppercase tracking-wider font-medium transition-colors text-charbon/70 hover:text-champagne"
            >
              <User size={18} />
              <span>Espace Client</span>
            </Link>
          ) : (
            <Link
              to="/rendez-vous"
              className="hidden sm:flex items-center gap-2 rounded-full border border-champagne/40 bg-champagne/10 px-4 py-2 text-sm uppercase tracking-wider font-medium text-charbon transition-colors hover:bg-champagne/20"
            >
              <User size={18} />
              <span>Demander un devis</span>
            </Link>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 -mr-1 rounded-full transition-colors text-charbon hover:bg-charbon/5"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-perle overflow-hidden"
          >
            <div className="section-container py-5 sm:py-6 space-y-3 sm:space-y-4">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <button
                      onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
                      className="flex items-center justify-between w-full py-2.5 text-charbon/80 hover:text-champagne uppercase text-sm tracking-wider font-medium transition-colors"
                    >
                      {link.label}
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${mobileToolsOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <AnimatePresence>
                      {mobileToolsOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 border-l-2 border-perle mt-2 space-y-1">
                            {link.children.map((child) => (
                              <Link
                                key={child.path}
                                to={child.path}
                                className="block py-2 text-charbon/60 hover:text-champagne text-xs uppercase tracking-wider transition-colors"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block py-2 text-charbon/80 hover:text-champagne uppercase text-sm tracking-wider font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
              <hr className="border-perle" />
              {user ? (
                <>
                  <Link to="/client" className="block py-2 text-champagne uppercase text-sm tracking-wider font-medium">
                    Mon espace client
                  </Link>
                  <button onClick={logout} className="block py-2 text-charbon/50 uppercase text-sm tracking-wider">
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link to="/rendez-vous" className="block py-2 text-champagne uppercase text-sm tracking-wider font-medium">
                  Demander un devis
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
