import { useState, useEffect } from "react";
import { Menu, Compass } from "lucide-react";
import MenuDrawer from "./MenuDrawer";

interface NavbarProps {
  activeSection: string;
  toggles?: Record<string, boolean>;
}

export default function Navbar({ activeSection, toggles = { experience: true, projects: true } }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoClick = () => {
    const element = document.getElementById("home");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const links = [
    ...(toggles.experience !== false ? [{ label: "experience", target: "services" }] : []),
    { label: "about", target: "about" },
    ...(toggles.projects !== false ? [{ label: "projects", target: "projects" }] : []),
  ];

  return (
    <>
      <header
        id="app-header"
        className={`fixed top-0 left-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-primary-dark/60 backdrop-blur-2xl py-3 border-b border-transparent [border-image:linear-gradient(to_right,transparent,rgba(212,175,55,0.6),transparent)_1]"
            : "bg-transparent py-5 border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Logo Brand Title */}
          <button
            id="logo-button"
            onClick={handleLogoClick}
            className="flex items-center gap-2 select-none group focus:outline-none"
          >
            <Compass className="h-6 w-6 text-accent-pink group-hover:rotate-180 transition-transform duration-700 ease-out shrink-0" />
            <span className="font-display font-bold text-lg md:text-xl tracking-wider text-white uppercase">
              G V R NISHCHAL REDDY
            </span>
          </button>

          {/* Quick desktop navigation nodes */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest text-neutral-300">
            {links.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  const el = document.getElementById(link.target);
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className={`uppercase border-b py-1 transition-all duration-300 ${
                  activeSection === link.target
                    ? "border-accent-pink text-white font-medium"
                    : "border-transparent text-neutral-400 hover:text-white"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action indicator trigger button */}
          <div className="flex items-center gap-4">
            <button
              id="cta-case-study"
              onClick={() => {
                const el = document.getElementById("contact");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="hidden md:block glass-card px-4 py-1.5 rounded-full hover:text-accent-pink transition-all duration-300 font-mono text-[10px] uppercase tracking-wider hover:scale-105"
            >
              [ Contact Me ]
            </button>

            {/* Hamburger action */}
            <button
              id="trigger-menu-drawer"
              onClick={() => setIsMenuOpen(true)}
              className="group relative flex items-center gap-2 border border-white/10 px-4 py-1.5 md:py-2 rounded-full overflow-hidden bg-white/5 hover:bg-white text-white hover:text-black transition-all duration-300"
              aria-label="Open navigation drawer"
            >
              <Menu className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-xs uppercase font-mono tracking-widest font-bold">Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen drawer overlay */}
      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeSection={activeSection}
        toggles={toggles}
      />
    </>
  );
}
