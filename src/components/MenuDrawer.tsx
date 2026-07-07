import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowRight, Compass, Mail, Phone, MapPin } from "lucide-react";
import { SOCIAL_LINKS } from "../data";
import { API_BASE } from "../config";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  toggles?: Record<string, boolean>;
}

export default function MenuDrawer({ isOpen, onClose, activeSection, toggles = { experience: true, projects: true } }: MenuDrawerProps) {
  const [socialLinks, setSocialLinks] = useState(SOCIAL_LINKS);
  const [contactEmail, setContactEmail] = useState("gvrnishchalreddy@gmail.com");
  const [contactPhone, setContactPhone] = useState("+91 7013612696");
  const [contactAddress, setContactAddress] = useState("Hyderabad, Telangana, India");
  const [orbUrl, setOrbUrl] = useState("");

  const isVideoUrl = (url: string) => {
    if (!url) return false;
    return /\.(mp4|webm|ogg|mov|avi)($|\?)/i.test(url) || url.includes("/video/") || url.includes("video");
  };

  useEffect(() => {
    const fetchMenuContent = () => {
      fetch(`${API_BASE}/api/content`)
        .then(res => res.json())
        .then((data: any[]) => {
          if (Array.isArray(data)) {
            const getVal = (key: string, def: string) => {
              const found = data.find(item => item.key === key);
              return found && found.value !== undefined ? found.value : def;
            };

            setContactEmail(getVal('contact_email', 'gvrnishchalreddy@gmail.com'));
            setContactPhone(getVal('contact_phone', '+91 7013612696'));
            setContactAddress(getVal('contact_address', 'Hyderabad, Telangana, India'));
            setOrbUrl(getVal('hero_orb_url', ''));

            const updated = SOCIAL_LINKS.map(link => {
              if (link.name === "LinkedIn") {
                const found = data.find(item => item.key === 'hero_linkedin_url');
                if (found && found.value) return { ...link, url: found.value };
              }
              if (link.name === "GitHub") {
                const found = data.find(item => item.key === 'hero_github_url');
                if (found && found.value) return { ...link, url: found.value };
              }
              if (link.name === "E-Mail") {
                const found = data.find(item => item.key === 'contact_email');
                if (found && found.value) return { ...link, url: `mailto:${found.value}` };
              }
              return link;
            });
            setSocialLinks(updated);
          }
        })
        .catch(err => console.error("Error loading social links in MenuDrawer:", err));
    };

    fetchMenuContent();

    window.addEventListener('refetchPortfolioData', fetchMenuContent);
    const interval = setInterval(fetchMenuContent, 10000);

    return () => {
      window.removeEventListener('refetchPortfolioData', fetchMenuContent);
      clearInterval(interval);
    };
  }, []);

  const baseMenuItems = [
    { name: "Home", target: "home" },
    ...(toggles.experience !== false ? [{ name: "Experiences", target: "services" }] : []),
    { name: "About", target: "about" },
    ...(toggles.projects !== false ? [{ name: "Projects", target: "projects" }] : []),
    { name: "Contact", target: "contact" }
  ];

  const menuItems = baseMenuItems.map((item, index) => ({
    num: `0${index + 1}`,
    name: item.name,
    target: item.target
  }));

  const handleLinkClick = (target: string) => {
    onClose();
    setTimeout(() => {
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 450); // wait for exit animation to complete or start smoothly
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.3, delay: 0.2, ease: "easeIn" } }
  };

  const panelVariants = {
    hidden: { y: "-100%" },
    visible: { 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: [0.76, 0, 0.24, 1],
        staggerChildren: 0.08,
        delayChildren: 0.2
      } 
    },
    exit: { 
      y: "-100%", 
      transition: { 
        duration: 0.5, 
        ease: [0.76, 0, 0.24, 1] 
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { y: -20, opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="menu-overlay-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 overflow-hidden bg-black/90 overlay-blur"
        >
          <motion.div
            id="menu-content-panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid-bg relative h-full w-full bg-primary-dark/95 text-white flex flex-col justify-between p-6 md:p-12 lg:p-20 overflow-y-auto"
          >
            {/* Header section inside menu */}
            <div className="flex items-center justify-between w-full border-b border-white/5 pb-6">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-accent-pink animate-spin-slow" />
                <span className="font-display font-bold text-lg tracking-wider">G V R NISHCHAL REDDY</span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded uppercase font-mono tracking-widest text-neutral-400">PORTFOLIO</span>
              </div>
              <div className="text-right text-xs text-neutral-400 hidden sm:block font-mono">
                [ INNOVATIVE DESIGN AND CUTTING-EDGE DEVELOPMENT ]
              </div>
              <button
                id="close-menu-button"
                onClick={onClose}
                className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white hover:text-black transition-colors duration-300"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
              </button>
            </div>

            {/* Core Body: Grid showing fluid elements & Navigation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center my-auto py-8">
              {/* Left Column: Liquid metallic orb element */}
              <div className="hidden lg:flex lg:col-span-4 justify-center items-center relative">
                <motion.div 
                  className="absolute inset-0 bg-accent-pink/10 rounded-full blur-3xl"
                  animate={{
                    scale: [1, 1.2, 0.9, 1],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  animate={{
                    y: [-15, 15, -15],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative z-10 w-72 h-72 xl:w-80 xl:h-80 rounded-full overflow-hidden border border-white/10 shadow-2xl"
                >
                  {isVideoUrl(orbUrl) ? (
                    <video
                      src={orbUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover saturate-125 hover:scale-110 transition-transform duration-500 cursor-pointer"
                    />
                  ) : (
                    <img
                      src={orbUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop"}
                      alt="Iridescent Liquid Metallic Abstract Fluid"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover saturate-125 hover:scale-110 transition-transform duration-500 cursor-pointer"
                    />
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-primary-dark/80 via-transparent to-transparent pointer-events-none" />
                </motion.div>
              </div>

              {/* Center Right Column: Links */}
              <nav className="col-span-1 lg:col-span-5 flex flex-col space-y-4 md:space-y-6">
                {menuItems.map((item) => {
                  const isCurrent = activeSection === item.target;
                  return (
                    <motion.div
                      key={item.target}
                      variants={itemVariants}
                      className="group relative flex items-center"
                    >
                      <button
                        onClick={() => handleLinkClick(item.target)}
                        className="text-left font-syne text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight transition-all duration-300 flex items-center gap-4 text-neutral-400 hover:text-white hover:translate-x-3 w-full"
                      >
                        <span className="font-mono text-sm tracking-widest text-neutral-600 group-hover:text-neutral-400 transition-colors duration-300">
                          / {item.num}
                        </span>
                        <span className={isCurrent ? "text-white underline decoration-accent-pink decoration-2 underline-offset-8" : ""}>
                          {item.name}
                        </span>
                        <ArrowRight className="h-6 w-6 opacity-0 group-hover:opacity-100 text-accent-pink -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                      </button>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Right Column: Address and direct contact details */}
              <div className="col-span-1 lg:col-span-3 flex flex-col space-y-8 pl-0 lg:pl-10 lg:border-l border-white/5 py-2">
                <div>
                  <h4 className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase mb-3">Get in Touch</h4>
                  <a href={`mailto:${contactEmail}`} className="group flex items-center gap-2 hover:text-accent-pink transition-colors duration-300 font-medium my-1 mb-4">
                    <Mail className="h-4 w-4 text-neutral-500 group-hover:text-accent-pink" />
                    <span>{contactEmail}</span>
                  </a>
                  <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="group flex items-center gap-2 hover:text-accent-blue transition-colors duration-300 font-medium my-1 mb-4">
                    <Phone className="h-4 w-4 text-neutral-500 group-hover:text-accent-blue" />
                    <span>{contactPhone}</span>
                  </a>
                  <div className="flex gap-2 text-sm text-neutral-300 font-light leading-relaxed">
                    <MapPin className="h-4 w-4 text-neutral-500 shrink-0 mt-0.5" />
                    <p className="whitespace-pre-line">{contactAddress}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase mb-3">Connect</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-neutral-300">
                    {socialLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.url}
                        className="hover:text-accent-pink transition-colors duration-200 py-1"
                      >
                        // {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer inside menu */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-6 text-[10px] font-mono text-neutral-500 space-y-2 sm:space-y-0 w-full">
              <div>MADE WITH ♡ BY G V R NISHCHAL REDDY</div>
              <div>COPYRIGHT © 2026 G V R NISHCHAL REDDY. ALL RIGHTS RESERVED.</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
