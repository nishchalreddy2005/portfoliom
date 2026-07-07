import React, { useState, FormEvent, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowUp, Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, Sparkles, Clock, Briefcase, Cpu, Globe } from "lucide-react";
import { SOCIAL_LINKS } from "../data";
import emailjs from "@emailjs/browser";
import { API_BASE } from "../config";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [socialLinks, setSocialLinks] = useState(SOCIAL_LINKS);

  // Custom contact settings states
  const [availabilityStatus, setAvailabilityStatus] = useState("Available for Opportunities");
  const [availabilityColor, setAvailabilityColor] = useState("green");
  const [responseTime, setResponseTime] = useState("< 24 Hours");
  const [location, setLocation] = useState("Hyderabad, India");
  const [focusTags, setFocusTags] = useState<string[]>(["Full Stack Development", "AI-Powered Applications"]);
  const [preferredRoles, setPreferredRoles] = useState<string[]>(["Software Engineer", "Frontend Engineer", "Full Stack Developer"]);
  const [contactEmail, setContactEmail] = useState("gvrnishchalreddy@gmail.com");
  const [contactPhone, setContactPhone] = useState("+91 7013612696");
  const [contactAddress, setContactAddress] = useState("Hyderabad, Telangana, India");
  const [footerTitle, setFooterTitle] = useState("Let's Build Something Exceptional Together");
  const [footerSubtitle, setFooterSubtitle] = useState("Available for Opportunities in Software Engineering & Full Stack Development");
  const [consultationsLabel, setConsultationsLabel] = useState("// CONSULTATIONS");
  const [consultationsTitle, setConsultationsTitle] = useState("Let's talk\nabout your\nproject.");
  const [consultationsDescription, setConsultationsDescription] = useState("Have an idea, brief, or active technical requirement? Drop me a message or write directly to my inbox. I usually reply within 24 hours.");

  useEffect(() => {
    const fetchContact = () => {
      fetch(`${API_BASE}/api/content`)
        .then(res => res.json())
        .then((data: any[]) => {
          if (Array.isArray(data)) {
            const updated = SOCIAL_LINKS.map(link => {
              if (link.name === "LinkedIn") {
                const found = data.find(item => item.key === 'hero_linkedin_url');
                if (found && found.value) return { ...link, url: found.value };
              }
              if (link.name === "GitHub") {
                const found = data.find(item => item.key === 'hero_github_url');
                if (found && found.value) return { ...link, url: found.value };
              }
              return link;
            });
            setSocialLinks(updated);

            // Contact settings mapping
            const getVal = (key: string, def: string) => {
              const found = data.find(item => item.key === key);
              return found && found.value !== undefined ? found.value : def;
            };

            setAvailabilityStatus(getVal('contact_availability_status', 'Available for Opportunities'));
            setAvailabilityColor(getVal('contact_availability_color', 'green'));
            setResponseTime(getVal('contact_response_time', '< 24 Hours'));
            setLocation(getVal('contact_location', 'Hyderabad, India'));
            setContactEmail(getVal('contact_email', 'gvrnishchalreddy@gmail.com'));
            setContactPhone(getVal('contact_phone', '+91 7013612696'));
            setContactAddress(getVal('contact_address', 'Hyderabad, Telangana, India'));
            setFooterTitle(getVal('contact_footer_title', "Let's Build Something Exceptional Together"));
            setFooterSubtitle(getVal('contact_footer_subtitle', 'Available for Opportunities in Software Engineering & Full Stack Development'));
            setConsultationsLabel(getVal('contact_consultations_label', '// CONSULTATIONS'));
            setConsultationsTitle(getVal('contact_consultations_title', "Let's talk\nabout your\nproject."));
            setConsultationsDescription(getVal('contact_consultations_description', 'Have an idea, brief, or active technical requirement? Drop me a message or write directly to my inbox. I usually reply within 24 hours.'));

            const focusVal = getVal('contact_focus_tags', '');
            if (focusVal) {
              setFocusTags(focusVal.split(',').map((t: string) => t.trim()));
            } else {
              setFocusTags([]);
            }
            const rolesVal = getVal('contact_preferred_roles', '');
            if (rolesVal) {
              setPreferredRoles(rolesVal.split(',').map((t: string) => t.trim()));
            } else {
              setPreferredRoles([]);
            }
          }
        })
        .catch(err => console.error("Error loading social links in Contact:", err));
    };

    fetchContact();

    window.addEventListener('refetchPortfolioData', fetchContact);
    const interval = setInterval(fetchContact, 10000);

    return () => {
      window.removeEventListener('refetchPortfolioData', fetchContact);
      clearInterval(interval);
    };
  }, []);

  // Floating label focus states
  const [nameFocus, setNameFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [messageFocus, setMessageFocus] = useState(false);

  // Parallax states for NISHCHAL signature
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSignatureMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20; // Max ~20px offset
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    setMousePos({ x, y });
  };

  const handleSignatureMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      return;
    }

    setSending(true);
    setErrorMessage(null);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "gy4lcyn";
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || serviceId === "YOUR_SERVICE_ID" || !publicKey || publicKey === "YOUR_PUBLIC_KEY") {
      console.warn(
        "EmailJS is not fully configured in your .env file. Running UI UX simulation fallback..."
      );
      setTimeout(() => {
        setSending(false);
        setSubmitted(true);
        setName("");
        setEmail("");
        setMessage("");
      }, 1500);
      return;
    }

    try {
      const templateParams = {
        name: name,
        email: email,
        message: message,
      };

      const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);

      if (response.status === 200) {
        setSubmitted(true);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        throw new Error("Message transmission failed.");
      }
    } catch (err: any) {
      console.error("EmailJS Error:", err);
      setErrorMessage("Could not transmit inquiry. Please email gvrnishchalreddy@gmail.com directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative bg-primary-dark pt-16 md:pt-24 pb-8 border-t border-white/5 cursor-default overflow-hidden"
    >
      <style>{`
        @keyframes btnSweep {
          0% { transform: translateX(-150%) skewX(-15deg); }
          50% { transform: translateX(150%) skewX(-15deg); }
          100% { transform: translateX(150%) skewX(-15deg); }
        }
        .btn-sweep-overlay {
          animation: btnSweep 3s ease-in-out infinite;
        }

        @keyframes goldShimmerSweep {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .giant-signature-shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 213, 79, 0.05) 0%,
            rgba(255, 213, 79, 0.75) 50%,
            rgba(255, 213, 79, 0.05) 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: goldShimmerSweep 13.5s linear infinite;
        }

        @keyframes signaturePulse {
          0%, 100% {
            filter: drop-shadow(0 0 10px rgba(255, 213, 79, 0.06)) drop-shadow(0 0 2px rgba(255, 213, 79, 0.15));
            -webkit-text-stroke: 1.5px rgba(255, 213, 79, 0.25);
          }
          50% {
            filter: drop-shadow(0 0 20px rgba(255, 213, 79, 0.15)) drop-shadow(0 0 5px rgba(255, 213, 79, 0.3));
            -webkit-text-stroke: 1.5px rgba(255, 213, 79, 0.45);
          }
        }

        .giant-signature-outline {
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(255, 213, 79, 0.25);
          text-shadow: 
            1px 1px 0px rgba(255, 213, 79, 0.05),
            2px 2px 0px rgba(255, 213, 79, 0.03),
            3px 3px 6px rgba(255, 213, 79, 0.1);
          animation: signaturePulse 8s ease-in-out infinite;
          transition: -webkit-text-stroke 0.4s ease, filter 0.4s ease, text-shadow 0.4s ease;
        }
        .giant-signature-outline:hover {
          -webkit-text-stroke: 1.5px rgba(255, 213, 79, 0.7);
          text-shadow: 
            1px 1px 0px rgba(255, 213, 79, 0.1),
            2px 2px 0px rgba(255, 213, 79, 0.08),
            3px 3px 12px rgba(255, 213, 79, 0.25);
          filter: drop-shadow(0 0 25px rgba(255, 213, 79, 0.25)) drop-shadow(0 0 6px rgba(255, 213, 79, 0.5));
          animation: none;
        }
      `}</style>

      {/* Background Effect: Option D - Minimal gold particles drifting slowly */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`bg-particle-${i}`}
            initial={{ 
              opacity: 0.05 + Math.random() * 0.1, 
              x: `${Math.random() * 100}%`, 
              y: `${Math.random() * 100}%` 
            }}
            animate={{
              y: ["0%", "100%", "0%"],
              x: ["0%", `${Math.random() * 100}%`, "0%"],
              opacity: [0.05, 0.2, 0.05]
            }}
            transition={{
              duration: 25 + Math.random() * 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-1 h-1 bg-[#FFD54F] rounded-full blur-[0.5px]"
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

        {/* Upper Grid Layout: Let's Talk block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left Column: Direct coordinates and info */}
          <div className="lg:col-span-4 flex flex-col space-y-8 text-left">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-3"
            >
              <span className="font-sans text-[10px] text-[#FFD54F] tracking-widest uppercase block font-bold">{consultationsLabel}</span>
              <h2 className="font-syne font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-[1.05] uppercase" style={{ whiteSpace: "pre-line" }}>
                {consultationsTitle}
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed max-w-sm">
                {consultationsDescription}
              </p>
            </motion.div>
          </div>

          {/* Right Column: Inquiry Input Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-8 bg-white/2 border border-white/10 backdrop-blur-xl p-8 md:p-10 rounded-2xl relative lg:mt-14 shadow-[0_0_50px_rgba(255,213,79,0.03),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:border-[#FFD54F]/25 hover:shadow-[0_0_50px_rgba(255,213,79,0.08),inset_0_1px_1px_rgba(255,255,255,0.08)] transition-all duration-500"
          >
            {submitted ? (
              <div className="py-16 flex flex-col justify-center items-center text-center space-y-4">
                <motion.div 
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="h-16 w-16 rounded-full bg-[#FFD54F]/10 flex items-center justify-center border border-[#FFD54F]/30 shadow-[0_0_20px_rgba(255,213,79,0.2)]"
                >
                  <CheckCircle2 className="h-8 w-8 text-[#FFD54F]" />
                </motion.div>
                <h3 className="font-syne font-black text-xl text-white uppercase tracking-wider">✓ Message Sent</h3>
                <p className="text-neutral-400 text-xs font-light max-w-sm leading-relaxed">
                  Thank you for reaching out. I have been notified of your message and will review your technical inquiry shortly.
                </p>
              </div>
            ) : (
              <>
                {/* Form introduction header */}
                <div className="mb-8 text-left space-y-2">
                  <span className="font-syne text-[10px] text-[#FFD54F] tracking-[0.25em] uppercase font-black block">// INITIATE CONTACT</span>
                  <h4 className="font-sans text-neutral-300 text-xs sm:text-sm font-medium leading-relaxed">
                    Tell me about your project, startup, product, or technical requirement.
                  </h4>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-8 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name Input with Floating Label */}
                  <div className="relative pt-2 w-full">
                    <input
                      id="form-name"
                      type="text"
                      required
                      value={name}
                      onFocus={() => setNameFocus(true)}
                      onBlur={() => setNameFocus(false)}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                      className="peer w-full bg-white/2 border border-neutral-800 hover:border-neutral-700 focus:border-[#FFD54F] rounded-xl px-4 py-3.5 text-xs text-white placeholder-transparent focus:outline-none focus:shadow-[0_0_15px_rgba(255,213,79,0.2)] transition-all duration-300 ease-out"
                    />
                    <label 
                      htmlFor="form-name" 
                      className={`absolute left-4 select-none pointer-events-none transition-all duration-300 origin-left px-1.5
                        ${(name || nameFocus) 
                          ? "top-0 text-[10px] text-[#FFD54F] font-bold uppercase tracking-widest bg-primary-dark -translate-y-1/2 scale-90" 
                          : "top-[23px] -translate-y-1/2 text-neutral-500 text-xs"
                        }
                      `}
                    >
                      Your Name
                    </label>
                  </div>

                  {/* Email Input with Floating Label */}
                  <div className="relative pt-2 w-full">
                    <input
                      id="form-email"
                      type="email"
                      required
                      value={email}
                      onFocus={() => setEmailFocus(true)}
                      onBlur={() => setEmailFocus(false)}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="peer w-full bg-white/2 border border-neutral-800 hover:border-neutral-700 focus:border-[#FFD54F] rounded-xl px-4 py-3.5 text-xs text-white placeholder-transparent focus:outline-none focus:shadow-[0_0_15px_rgba(255,213,79,0.2)] transition-all duration-300 ease-out"
                    />
                    <label 
                      htmlFor="form-email" 
                      className={`absolute left-4 select-none pointer-events-none transition-all duration-300 origin-left px-1.5
                        ${(email || emailFocus) 
                          ? "top-0 text-[10px] text-[#FFD54F] font-bold uppercase tracking-widest bg-primary-dark -translate-y-1/2 scale-90" 
                          : "top-[23px] -translate-y-1/2 text-neutral-500 text-xs"
                        }
                      `}
                    >
                      Email Address
                    </label>
                  </div>
                </div>

                {/* Message Textarea with Floating Label */}
                <div className="relative pt-2 w-full">
                  <textarea
                    id="form-message"
                    rows={6}
                    required
                    value={message}
                    onFocus={() => setMessageFocus(true)}
                    onBlur={() => setMessageFocus(false)}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Message"
                    className="peer w-full bg-white/2 border border-neutral-800 hover:border-neutral-700 focus:border-[#FFD54F] rounded-xl p-4 text-xs text-white placeholder-transparent focus:outline-none focus:shadow-[0_0_15px_rgba(255,213,79,0.2)] transition-all duration-300 ease-out resize-none"
                  />
                  <label 
                    htmlFor="form-message" 
                    className={`absolute left-4 select-none pointer-events-none transition-all duration-300 origin-left px-1.5
                      ${(message || messageFocus) 
                        ? "top-0 text-[10px] text-[#FFD54F] font-bold uppercase tracking-widest bg-primary-dark -translate-y-1/2 scale-90" 
                        : "top-7 text-neutral-500 text-xs"
                      }
                    `}
                  >
                    Message
                  </label>
                </div>

                {errorMessage && (
                  <div className="text-accent-pink font-mono text-[10px] uppercase tracking-wider text-center mt-2 animate-pulse">
                    {errorMessage}
                  </div>
                )}

                {/* Premium Animated Submit Button */}
                <motion.button
                  id="submit-contact"
                  type="submit"
                  disabled={sending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group relative overflow-hidden w-full font-syne text-[13px] uppercase tracking-widest font-black py-5 rounded-xl transition-all flex items-center justify-center gap-2 focus:outline-none border select-none ${
                    sending ? "opacity-75 cursor-not-allowed" : "cursor-pointer"
                  } ${
                    submitted 
                      ? "bg-[#FFD54F]/10 border-[#FFD54F] text-[#FFD54F] shadow-[0_0_20px_rgba(255,213,79,0.15)]"
                      : "bg-white text-black border-transparent hover:bg-neutral-200"
                  }`}
                >
                  {/* Subtle sweep overlay */}
                  {!submitted && !sending && (
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#FFD54F]/25 to-transparent pointer-events-none btn-sweep-overlay w-[100px] z-0" />
                  )}

                  {sending ? (
                    <>
                      <span className="animate-spin h-3.5 w-3.5 border-2 border-neutral-500 border-t-black rounded-full shrink-0" />
                      <span>Initiating Transmission...</span>
                    </>
                  ) : (
                    <>
                      <span>Initiate Contact</span>
                      <Send className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </motion.button>
              </form>
              </>
            )}
          </motion.div>
        </div>

        {/* Horizontal Availability Dashboard Card - Sketch layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="mt-14 border border-[#FFD54F]/25 bg-white/3 backdrop-blur-xl p-6 md:p-8 rounded-2xl relative shadow-lg hover:-translate-y-1 transition-all duration-300 w-full"
        >
          {/* Gold light corner reflection highlight */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFD54F]/5 rounded-bl-full pointer-events-none filter blur-md" />

          {/* Status Header */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/5 mb-6">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                availabilityColor === 'green' ? 'bg-green-400' :
                availabilityColor === 'red' ? 'bg-red-400' :
                availabilityColor === 'yellow' ? 'bg-yellow-400' :
                'bg-blue-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${
                availabilityColor === 'green' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]' :
                availabilityColor === 'red' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' :
                availabilityColor === 'yellow' ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]' :
                'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]'
              }`}></span>
            </span>
            <span className={`text-[10px] font-syne font-black tracking-widest uppercase ${
              availabilityColor === 'green' ? 'text-green-400' :
              availabilityColor === 'red' ? 'text-red-400' :
              availabilityColor === 'yellow' ? 'text-yellow-400' :
              'text-blue-400'
            }`}>
              {availabilityStatus}
            </span>
          </div>

          {/* 2-Column Split Content Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-xs font-sans">
            {/* Left side: Response Time, Location, Focus & Roles */}
            <div className="md:col-span-7 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex gap-2">
                  <Clock className="w-4 h-4 text-[#FFD54F]/70 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[8px] text-neutral-500 uppercase tracking-wider block mb-0.5">Response Time</span>
                    <span className="text-white font-bold">{responseTime}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Globe className="w-4 h-4 text-[#FFD54F]/70 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[8px] text-neutral-500 uppercase tracking-wider block mb-0.5">Location</span>
                    <span className="text-white font-bold">{location}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 flex gap-2">
                <Cpu className="w-4 h-4 text-[#FFD54F]/70 shrink-0 mt-0.5" />
                <div className="w-full">
                  <span className="text-[8px] text-neutral-500 uppercase tracking-wider block mb-1.5">Current Focus</span>
                  <div className="flex flex-wrap gap-1.5">
                    {focusTags.map((tag, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[9px] text-neutral-300 font-medium hover:border-[#FFD54F]/30 hover:text-white transition-all">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 flex gap-2">
                <Briefcase className="w-4 h-4 text-[#FFD54F]/70 shrink-0 mt-0.5" />
                <div className="w-full">
                  <span className="text-[8px] text-neutral-500 uppercase tracking-wider block mb-1.5">Preferred Roles</span>
                  <div className="flex flex-wrap gap-1.5">
                    {preferredRoles.map((role, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[9px] text-neutral-300 font-medium hover:border-[#FFD54F]/30 hover:text-white transition-all">{role}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Email, Phone, Detailed Location (separated by visual divider on medium+ screens) */}
            <div className="md:col-span-5 md:border-l md:border-white/5 md:pl-8 space-y-4">
              <span className="text-[8px] text-neutral-500 uppercase tracking-wider block mb-1">Direct Contacts</span>
              <a
                href={`mailto:${contactEmail}`}
                className="group flex items-center gap-3 hover:text-[#FFD54F] transition-colors font-medium text-xs text-neutral-300"
              >
                <div className="h-7 w-7 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#FFD54F]/25 group-hover:bg-[#FFD54F]/5 transition-colors shrink-0">
                  <Mail className="h-3.5 w-3.5 text-neutral-500 group-hover:text-[#FFD54F]" />
                </div>
                <span className="truncate">{contactEmail}</span>
              </a>

              <a
                href={`tel:${contactPhone.replace(/\s/g, '')}`}
                className="group flex items-center gap-3 hover:text-[#FFD54F] transition-colors font-medium text-xs text-neutral-300"
              >
                <div className="h-7 w-7 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#FFD54F]/25 group-hover:bg-[#FFD54F]/5 transition-colors shrink-0">
                  <Phone className="h-3.5 w-3.5 text-neutral-500 group-hover:text-[#FFD54F]" />
                </div>
                <span>{contactPhone}</span>
              </a>

              <div className="group flex items-start gap-3 font-medium text-xs text-neutral-300">
                <div className="h-7 w-7 rounded-full bg-white/5 flex items-center justify-center border border-white/5 transition-colors shrink-0 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-neutral-500" />
                </div>
                <p className="font-light text-neutral-400 text-[11px] leading-relaxed">
                  {contactAddress}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lower layout: Premium interactive Social platforms row mapping */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 md:mt-14 pt-6 border-t border-white/5 relative flex flex-col items-center justify-center gap-6 w-full"
        >
          {/* Social buttons with grow underline - Centered horizontally */}
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 w-full">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative font-sans text-sm sm:text-[15px] uppercase tracking-[0.18em] hover:tracking-[0.28em] text-neutral-500 hover:text-[#FFD54F] active:text-[#FFD54F] transition-all duration-300 ease-out flex flex-col items-center py-2.5 hover:-translate-y-1.5 select-none font-bold"
              >
                <span className="group-hover:drop-shadow-[0_0_8px_rgba(255,213,79,0.6)] transition-all duration-300">
                  {link.name}
                </span>
                <span className="absolute bottom-0 w-0 h-[1.5px] bg-[#FFD54F] group-hover:w-full transition-all duration-300 shadow-[0_0_8px_rgba(255,213,79,0.7)]" />
              </a>
            ))}
          </div>

          {/* Scroll to top anchor Button - Placed on the right side on desktop, stacked on mobile */}
          <button
            id="back-to-top-button"
            onClick={handleBackToTop}
            className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 group font-mono text-[9px] uppercase tracking-widest text-neutral-400 hover:text-white flex items-center gap-2 cursor-pointer focus:outline-none mt-2 md:mt-0"
          >
            <span>BACK TO TOP</span>
            <div className="h-6 w-6 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
              <ArrowUp className="h-3 w-3" />
            </div>
          </button>
        </motion.div>

        {/* Final Premium Recruiter Statement - Dedicated Spotlight Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center py-20 md:py-24 relative overflow-visible"
        >
          {/* Subtle gold divider line above the tagline */}
          <div className="w-32 h-px bg-linear-to-r from-transparent via-[#FFD54F]/35 to-transparent mx-auto mb-10" />

          <h3 className="font-syne font-black text-xl sm:text-2xl md:text-3xl text-gradient-gold tracking-[0.18em] uppercase mb-4 leading-snug">
            {footerTitle}
          </h3>
          <p className="text-neutral-400 text-[10px] sm:text-xs tracking-[0.25em] uppercase font-bold max-w-2xl mx-auto leading-relaxed">
            {footerSubtitle}
          </p>
        </motion.div>

        {/* Mega outline Text signature with Mouse Parallax & Shimmer Sweep */}
        <div className="relative mt-6 py-8 md:py-12 overflow-visible flex justify-center w-full select-none cursor-default">
          {/* Spotlight Beam - Extremely low opacity, slow horizontal sweep behind the signature */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
            <motion.div
              animate={{
                x: ["-25%", "25%", "-25%"],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute w-[150%] h-[180px] bg-[linear-gradient(90deg,transparent_20%,rgba(255,213,79,0.06)_50%,transparent_80%)] -skew-x-12 blur-3xl"
            />
          </div>

          <motion.div 
            onMouseMove={handleSignatureMouseMove}
            onMouseLeave={handleSignatureMouseLeave}
            animate={{ x: mousePos.x * 0.7, y: mousePos.y * 0.7 }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
            className="relative z-10 w-full flex justify-center"
          >
            <h1 className="font-syne font-black text-[13vw] sm:text-[11vw] md:text-[9vw] lg:text-[7.5vw] xl:text-[7rem] tracking-[0.15em] select-none pointer-events-none uppercase whitespace-nowrap giant-signature-outline giant-signature-shimmer">
              NISHCHAL
            </h1>
          </motion.div>
        </div>

        {/* Final success emotional ending statement */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-12 flex flex-col items-center justify-center text-center space-y-1 select-none"
        >
          <span className="font-syne text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#FFD54F]/85">
            Thanks for visiting.
          </span>
          <span className="font-sans text-[10px] sm:text-[11px] font-light tracking-wide text-neutral-500">
            Built with precision, curiosity, and continuous learning.
          </span>
        </motion.div>

        {/* Bottom copyright declaration block */}
        <div className="mt-8 border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center text-[9px] font-mono text-neutral-600 gap-3">
          <div>CRAFTED WITH PRECISION • G V R NISHCHAL REDDY</div>
          <a href="#/admin" className="hover:text-[#FFD54F] transition-colors cursor-pointer uppercase tracking-widest border border-white/5 px-2 py-1 rounded bg-black/20 hover:bg-[#FFD54F]/10">
            Admin Login
          </a>
          <div>© 2026 G V R NISHCHAL REDDY. ALL RIGHTS RESERVED.</div>
        </div>

      </div>
    </section>
  );
}
