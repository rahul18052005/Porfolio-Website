import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUp,
  Check,
  Copy,
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import { NAV_LINKS, PROFILE } from '../../data/portfolioData';
import SplitTextReveal from '../ui/SplitTextReveal';
import MagneticButton from '../ui/MagneticButton';

export default function ContactSection({ onNavigate }) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [statusMessage, setStatusMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [istTime, setIstTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      try {
        const now = new Date();
        setIstTime(
          new Intl.DateTimeFormat('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          }).format(now)
        );
      } catch {
        setIstTime('IST');
      }
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback: open mail client
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      setStatus('error');
      setStatusMessage('Please fill in your name, email, and message.');
      return;
    }

    setStatus('sending');
    setStatusMessage('');

    // If a Formspree/custom webhook endpoint is configured via env, submit directly
    if (PROFILE.contactFormEndpoint) {
      try {
        const res = await fetch(PROFILE.contactFormEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(formState),
        });
        if (!res.ok) throw new Error('Submission failed');
        setStatus('sent');
        setStatusMessage('Message transmitted successfully. Rahul will reply shortly.');
        setFormState({ name: '', email: '', subject: '', message: '' });
        return;
      } catch {
        // Gracefully fall back to prefilled mailto launch below
      }
    }

    // Reliable zero-backend fallback: open pre-filled email draft & show clear confirmation
    const subjectLine = encodeURIComponent(
      formState.subject.trim() || `Portfolio Inquiry from ${formState.name.trim()}`
    );
    const bodyText = encodeURIComponent(
      `Name: ${formState.name.trim()}\nEmail: ${formState.email.trim()}\n\n${formState.message.trim()}`
    );
    window.location.href = `mailto:${PROFILE.email}?subject=${subjectLine}&body=${bodyText}`;

    setStatus('sent');
    setStatusMessage(
      'Email draft prepared in your mail client — you can also reach me directly at rahulhor2024@gmail.com.'
    );
    setFormState({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section
      id="contact"
      className="relative pt-28 pb-12 md:pt-36 md:pb-14 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto"
    >
      <div className="relative z-10">
        <p className="font-mono text-[11px] tracking-[0.26em] text-cyanGlow uppercase mb-4">
          07 // CONTACT
        </p>

        <SplitTextReveal
          as="h2"
          text="LET'S BUILD SOMETHING INTELLIGENT."
          liquid
          className="font-display font-extrabold uppercase text-pearl text-4xl sm:text-6xl lg:text-[5rem] leading-[0.9] tracking-tight max-w-4xl"
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Direct Channels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 space-y-5"
          >
            <div className="obsidian-glass rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-mist">
                  Direct Email
                </span>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={`mailto:${PROFILE.email}`}
                    data-cursor="OPEN"
                    className="text-lg sm:text-xl text-pearl hover:text-cyanGlow transition-colors break-all"
                  >
                    {PROFILE.email}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    data-cursor="COPY"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-white/15 text-xs font-mono text-mist hover:text-pearl hover:border-cyanGlow/50 transition-colors"
                    aria-label="Copy email address"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-turquoise" />
                        <span className="text-turquoise">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="border-t border-white/[0.08] pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-mist flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-cyanGlow" />
                    Phone
                  </span>
                  <a
                    href={PROFILE.phoneHref}
                    data-cursor="OPEN"
                    className="mt-1.5 block text-sm sm:text-base text-pearl hover:text-cyanGlow transition-colors"
                  >
                    {PROFILE.phone}
                  </a>
                </div>

                <div>
                  <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-mist flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-magentaGlow" />
                    Location
                  </span>
                  <p className="mt-1.5 text-sm text-pearl/90">{PROFILE.location}</p>
                </div>
              </div>

              {/* Action Buttons: Email CTA + LinkedIn + GitHub + Resume */}
              <div className="border-t border-white/[0.08] pt-5 flex flex-wrap items-center gap-3">
                <MagneticButton
                  as="a"
                  href={`mailto:${PROFILE.email}`}
                  cursorLabel="OPEN"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-cyanGlow/55 bg-cyanGlow/15 text-pearl hover:bg-cyanGlow/25 transition-all font-mono text-[11px] tracking-[0.15em] uppercase"
                >
                  <Mail className="w-3.5 h-3.5 text-cyanGlow" />
                  <span>Email Me</span>
                </MagneticButton>

                <MagneticButton
                  as="a"
                  href={PROFILE.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  cursorLabel="OPEN"
                  aria-label="LinkedIn Profile"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/15 bg-white/[0.03] text-pearl hover:border-cyanGlow/50 hover:text-cyanGlow transition-colors font-mono text-[11px] tracking-[0.15em] uppercase"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </MagneticButton>

                <MagneticButton
                  as="a"
                  href={PROFILE.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  cursorLabel="OPEN"
                  aria-label="GitHub Profile"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/15 bg-white/[0.03] text-pearl hover:border-cyanGlow/50 hover:text-cyanGlow transition-colors font-mono text-[11px] tracking-[0.15em] uppercase"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </MagneticButton>

                <MagneticButton
                  as="a"
                  href={PROFILE.resumePdfPath}
                  download="Rahul_Hor_Resume.pdf"
                  cursorLabel="OPEN"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/15 bg-black/50 text-mist hover:text-pearl hover:border-white/35 transition-colors font-mono text-[11px] tracking-[0.15em] uppercase"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Resume PDF</span>
                </MagneticButton>
              </div>
            </div>
          </motion.div>

          {/* Right Functional Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-7 obsidian-glass rounded-3xl p-6 sm:p-8 space-y-5"
            noValidate
          >
            <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-mist pb-3 border-b border-white/[0.08]">
              <span>TRANSMIT INQUIRY</span>
              <span className="text-turquoise">RESPONSE &lt; 24H</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block font-mono text-[10px] tracking-[0.18em] uppercase text-mist mb-2"
                >
                  Your Name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) =>
                    setFormState((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Ada Lovelace"
                  className="w-full rounded-xl bg-black/60 border border-white/15 px-4 py-3 text-sm text-pearl placeholder:text-mist/40 focus:border-cyanGlow focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block font-mono text-[10px] tracking-[0.18em] uppercase text-mist mb-2"
                >
                  Email Address *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) =>
                    setFormState((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="you@domain.com"
                  className="w-full rounded-xl bg-black/60 border border-white/15 px-4 py-3 text-sm text-pearl placeholder:text-mist/40 focus:border-cyanGlow focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-subject"
                className="block font-mono text-[10px] tracking-[0.18em] uppercase text-mist mb-2"
              >
                Subject
              </label>
              <input
                id="contact-subject"
                type="text"
                value={formState.subject}
                onChange={(e) =>
                  setFormState((p) => ({ ...p, subject: e.target.value }))
                }
                placeholder="AI/ML Engineering Opportunity / Collaboration"
                className="w-full rounded-xl bg-black/60 border border-white/15 px-4 py-3 text-sm text-pearl placeholder:text-mist/40 focus:border-cyanGlow focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block font-mono text-[10px] tracking-[0.18em] uppercase text-mist mb-2"
              >
                Message *
              </label>
              <textarea
                id="contact-message"
                rows={4}
                required
                value={formState.message}
                onChange={(e) =>
                  setFormState((p) => ({ ...p, message: e.target.value }))
                }
                placeholder="Tell me about the project, role, or engineering challenge..."
                className="w-full rounded-xl bg-black/60 border border-white/15 px-4 py-3 text-sm text-pearl placeholder:text-mist/40 focus:border-cyanGlow focus:outline-none transition-colors resize-y"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <MagneticButton
                type="submit"
                disabled={status === 'sending'}
                cursorLabel="SEND"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full border border-cyanGlow/60 bg-cyanGlow/15 text-pearl hover:bg-cyanGlow/25 transition-all font-mono text-xs tracking-[0.16em] uppercase disabled:opacity-60"
              >
                <Send className="w-3.5 h-3.5 text-cyanGlow" />
                <span>{status === 'sending' ? 'Sending...' : 'Send Message'}</span>
              </MagneticButton>

              {statusMessage && (
                <p
                  role="status"
                  className={`font-mono text-[11px] ${
                    status === 'error' ? 'text-magentaGlow' : 'text-turquoise'
                  }`}
                >
                  {statusMessage}
                </p>
              )}
            </div>
          </motion.form>
        </div>

        {/* Minimal Animated Footer */}
        <footer className="mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 font-mono text-[11px] tracking-[0.16em] text-mist uppercase">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-pearl font-medium">{PROFILE.name}</span>
            <span className="text-white/20">/</span>
            <span>Purba Bardhaman, IN · {istTime} IST</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {NAV_LINKS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                data-cursor="VIEW"
                className="hover:text-cyanGlow transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          <MagneticButton
            type="button"
            onClick={() => onNavigate('hero')}
            cursorLabel="TOP"
            aria-label="Back to top"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/15 text-pearl hover:border-cyanGlow/60 hover:text-cyanGlow transition-colors"
          >
            <span>Top</span>
            <ArrowUp className="w-3 h-3" />
          </MagneticButton>
        </footer>
      </div>
    </section>
  );
}

