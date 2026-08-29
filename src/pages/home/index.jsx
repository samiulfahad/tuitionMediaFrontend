// HomePage.jsx — Rajshahi Tuition Media
// Bangla landing page — Rajshahi City edition.
// Hero (split layout + floating CV mockup) + trust marquee + how-it-works +
// subjects + stats + testimonial + gradient CTA band + rich footer.
//
// Fonts: "Baloo Da 2" (display) + "Hind Siliguri" (body), self-hosted via
// @fontsource (no runtime Google Fonts request). Make sure these are
// imported once in your app entry (e.g. main.jsx):
//
//   import "@fontsource/baloo-da-2/500.css";
//   import "@fontsource/baloo-da-2/600.css";
//   import "@fontsource/baloo-da-2/700.css";
//   import "@fontsource/baloo-da-2/800.css";
//   import "@fontsource/hind-siliguri/400.css";
//   import "@fontsource/hind-siliguri/500.css";
//   import "@fontsource/hind-siliguri/600.css";
//   import "@fontsource/hind-siliguri/700.css";
//
// Swap the <a href> tags for React Router <Link> if this sits inside a router.
// Zero extra dependencies — all icons are inline SVG.
//
// Contact model: the system is open (guardians CAN reach every tutor) but a
// tutor's raw phone/email is never shown or given out — every "contact"
// action routes through the platform's WhatsApp admin line, which relays
// the guardian to the tutor. Copy below reflects that everywhere it
// mentions getting in touch — no "call/email them directly" language.

import { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Scroll-reveal hook
// ---------------------------------------------------------------------------
function useInView(options = { threshold: 0.2 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, inView];
}

function useScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

// ---------------------------------------------------------------------------
// Count-up number (for the stats band)
// ---------------------------------------------------------------------------
function CountUp({ to, duration = 1400, suffix = "" }) {
  const [ref, inView] = useInView({ threshold: 0.5 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = null;
    let frame;
    const step = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * to));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className="tk-stat-number">
      {value.toLocaleString("bn-BD")}
      {suffix}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Signature motif: hand-drawn marker underline / circle, stroke-animated
// ---------------------------------------------------------------------------
function MarkerUnderline({ delay = 0 }) {
  return (
    <svg
      className="tk-marker"
      style={{ animationDelay: `${delay}ms` }}
      viewBox="0 0 240 24"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M4 15.5C40 8 90 6 120 10.5C150 15 190 18.5 236 9"
        fill="none"
        stroke="#F0A202"
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MarkerCircle({ delay = 0 }) {
  return (
    <svg
      className="tk-marker-circle"
      style={{ animationDelay: `${delay}ms` }}
      viewBox="0 0 220 90"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M108 6C55 2 14 20 10 45C6 70 55 86 112 85C169 84 212 68 210 44C208 21 165 5 118 6"
        fill="none"
        stroke="#0E7C61"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Inline icon set (no external icon library required)
// ---------------------------------------------------------------------------
const Icon = {
  cap: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 3 1 8l11 5 9-4.09V17h2V8L12 3Z" fill="currentColor" />
      <path d="M5 10.7V15c0 1.66 3.13 3 7 3s7-1.34 7-3v-4.3l-7 3.18-7-3.18Z" fill="currentColor" opacity=".55" />
    </svg>
  ),
  search: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  ),
  shield: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  chat: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
    </svg>
  ),
  doc: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6M9 13h6M9 17h6M9 9h1" />
    </svg>
  ),
  pin: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  users: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  building: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <rect x="4" y="2" width="16" height="20" rx="1" />
      <path d="M9 22v-4h6v4M9 6h1M14 6h1M9 10h1M14 10h1M9 14h1M14 14h1" />
    </svg>
  ),
  map: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M9 20 3 17V4l6 3 6-3 6 3v13l-6-3-6 3Z" />
      <path d="M9 7v13M15 4v13" />
    </svg>
  ),
  star: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2Z" />
    </svg>
  ),
  check: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="m20 6-11 11L4 12" />
    </svg>
  ),
  quote: (p) => (
    <svg viewBox="0 0 32 24" fill="currentColor" {...p}>
      <path d="M9.5 0C4.3 2.7 0 8.2 0 14.6 0 20 3.6 24 8.4 24c4 0 6.8-3 6.8-6.7 0-3.6-2.5-6.1-5.8-6.1-.7 0-1.3.1-1.7.3C8.4 7 11.6 3 16.4.9L9.5 0Zm17.1 0C21.4 2.7 17 8.2 17 14.6c0 5.4 3.6 9.4 8.4 9.4 4 0 6.8-3 6.8-6.7 0-3.6-2.5-6.1-5.8-6.1-.7 0-1.2.1-1.7.3C25.5 7 28.7 3 33.5.9L26.6 0Z" />
    </svg>
  ),
  // Real WhatsApp glyph — used wherever we point to the platform's
  // WhatsApp-relay contact flow (this inline icon set has no brand icons).
  whatsapp: (p) => (
    <svg viewBox="0 0 32 32" fill="currentColor" {...p}>
      <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.393.703 4.62 1.918 6.49L4 29l7.72-1.879A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.75a9.7 9.7 0 0 1-4.95-1.356l-.355-.21-4.583 1.115 1.148-4.463-.232-.365A9.66 9.66 0 0 1 6.25 15c0-5.38 4.375-9.75 9.754-9.75 5.38 0 9.746 4.37 9.746 9.75s-4.367 9.75-9.746 9.75Zm5.34-7.297c-.293-.147-1.734-.857-2.003-.955-.269-.098-.464-.147-.66.147-.196.293-.756.955-.928 1.152-.171.196-.342.22-.635.073-.293-.147-1.236-.456-2.354-1.454-.87-.776-1.457-1.735-1.629-2.028-.171-.293-.018-.451.129-.597.132-.132.293-.343.44-.514.147-.171.196-.293.293-.489.098-.196.049-.367-.024-.514-.073-.147-.66-1.593-.905-2.183-.238-.573-.481-.495-.66-.504l-.562-.01c-.196 0-.514.073-.783.367-.269.293-1.026 1.003-1.026 2.448 0 1.445 1.05 2.842 1.196 3.038.147.196 2.067 3.155 5.008 4.424.7.302 1.246.483 1.672.618.702.223 1.342.191 1.848.116.564-.084 1.734-.708 1.979-1.392.244-.684.244-1.27.171-1.392-.073-.122-.269-.196-.562-.343Z" />
    </svg>
  ),
  lock: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  ),
  phone: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  ),
};

// Fixed admin contact number — shown directly on the homepage (unlike a
// tutor's own number, which is never exposed). English digits, country
// code, no leading 0, for the wa.me link: 01723939836 -> 8801723939836.
const ADMIN_PHONE_DISPLAY = "01723939836";
const ADMIN_WHATSAPP = "8801723939836";

// ---------------------------------------------------------------------------
// Content — scoped to Rajshahi City
// ---------------------------------------------------------------------------
const SUBJECT_GROUPS = [
  { label: "ক্লাস ১-৫", tag: "প্রাইমারি", subjects: ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান", "আইসিটি"] },
  {
    label: "ক্লাস ৬-৮",
    tag: "জুনিয়র সেকেন্ডারি",
    subjects: ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান", "বাংলাদেশ ও বিশ্বপরিচয়"],
  },
  {
    label: "এসএসসি (৯-১০)",
    tag: "সায়েন্স · কমার্স · আর্টস",
    subjects: ["পদার্থবিজ্ঞান", "রসায়ন", "জীববিজ্ঞান", "উচ্চতর গণিত", "হিসাববিজ্ঞান"],
  },
  {
    label: "এইচএসসি (১১-১২)",
    tag: "সায়েন্স · কমার্স · আর্টস",
    subjects: ["পদার্থবিজ্ঞান", "রসায়ন", "জীববিজ্ঞান", "অর্থনীতি", "হিসাববিজ্ঞান"],
  },
];

// Step 3 for guardians used to say "call or email them directly." The
// system is open — every tutor can be reached — but a tutor's raw
// phone/email is never shown, so the copy now points at the WhatsApp-relay
// flow instead.
const GUARDIAN_STEPS = [
  {
    title: "খুঁজুন",
    desc: "বিষয়, ক্লাস অনুযায়ী পছন্দের টিউটর খুঁজে বের করুন।",
    icon: Icon.search,
  },
  { title: "যাচাই করুন", desc: "শিক্ষাগত যোগ্যতা ও অভিজ্ঞতা দেখে সঠিক টিউটর বেছে নিন।", icon: Icon.shield },
  {
    title: "যোগাযোগ করুন",
    desc: "হোয়াটসঅ্যাপে আমাদের টিমকে বার্তা পাঠান — টিউটরের ফোন নম্বর সরাসরি দেখানো হয় না, আমরাই আপনাকে টিউটরের সাথে যুক্ত করে দেব।",
    icon: Icon.whatsapp,
  },
];

// Step 3 for tutors: guardians reach them through the platform, not by
// getting their number directly — matches the "no phone/email in the
// browse view" behavior on the tutor-search page.
const TUTOR_STEPS = [
  {
    title: "সিভি তৈরি করুন",
    desc: "শিক্ষাগত যোগ্যতা ও পড়ানোর বিষয় দিয়ে ফরম পূরণ করুন — মাত্র কয়েক মিনিটে।",
    icon: Icon.doc,
  },
  {
    title: "পিন সংরক্ষণ করুন",
    desc: "৫-৬ ডিজিটের একটি পিন সেট করুন — পরে সিভি এডিট বা মুছতে এটাই লাগবে।",
    icon: Icon.pin,
  },
  {
    title: "যোগাযোগের অনুরোধ পান",
    desc: "অভিভাবকরা আপনার প্রোফাইল দেখে হোয়াটসঅ্যাপে আমাদের টিমের মাধ্যমে যোগাযোগ করবেন — আপনার ফোন নম্বর কখনো সরাসরি প্রকাশ করা হয় না।",
    icon: Icon.users,
  },
];

const TRUSTED_INSTITUTES = [
  "রাজশাহী কলেজ",
  "রাজশাহী বিশ্ববিদ্যালয়",
  "রুয়েট",
  "রাজশাহী মেডিকেল কলেজ",
  "রাজশাহী ক্যাডেট কলেজ",
  "নিউ গভর্নমেন্ট ডিগ্রি কলেজ",
  "পি এন গার্লস হাই স্কুল",
  "রাজশাহী কলেজিয়েট স্কুল",
  "বরেন্দ্র বিশ্ববিদ্যালয়",
  "রাজশাহী জিলা স্কুল",
];

const RAJSHAHI_AREAS = [
  "শাহেব বাজার",
  "বোয়ালিয়া",
  "রাজপাড়া",
  "উপশহর",
  "সাহেববাজার",
  "কাজলা",
  "বিনোদপুর",
  "লক্ষ্মীপুর",
];

export default function HomePage() {
  const scrolled = useScrolled();
  const [audience, setAudience] = useState("guardian");
  const [howRef, howInView] = useInView();
  const [subjectsRef, subjectsInView] = useInView();
  const [testimonialRef, testimonialInView] = useInView({ threshold: 0.4 });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.3 });

  const steps = audience === "guardian" ? GUARDIAN_STEPS : TUTOR_STEPS;

  return (
    <div lang="bn" className="tk-root">
      <style>{`
        .tk-root {
          --paper: #FBF8F1;
          --paper-deep: #F3EDE0;
          --ink: #1F2A5E;
          --ink-2: #2B3A7A;
          --ink-soft: #565F82;
          --marigold: #F0A202;
          --marigold-dark: #C97F00;
          --leaf: #0E7C61;
          --margin-red: #C1443C;
          background: var(--paper);
          color: var(--ink);
          font-family: "Hind Siliguri", sans-serif;
          overflow-x: hidden;
        }
        .tk-root h1, .tk-root h2, .tk-root h3, .tk-root .tk-display {
          font-family: "Baloo Da 2", "Hind Siliguri", sans-serif;
        }
        .tk-dotgrid {
          background-image: radial-gradient(rgba(31,42,94,0.16) 1.4px, transparent 1.4px);
          background-size: 22px 22px;
        }
        .tk-ruled {
          background-image: repeating-linear-gradient(to bottom, transparent, transparent 35px, rgba(31,42,94,0.07) 36px);
        }
        .tk-margin-line { position: absolute; top: 0; bottom: 0; left: 48px; width: 2px; background: rgba(193,68,60,0.25); }
        .tk-marker {
          position: absolute; left: -2%; right: -2%; bottom: -0.15em; width: 104%; height: 0.5em;
          stroke-dasharray: 320; stroke-dashoffset: 320; animation: tk-draw 0.7s ease-out forwards;
        }
        .tk-marker-circle {
          position: absolute; inset: -18% -12%; width: 124%; height: 136%;
          stroke-dasharray: 420; stroke-dashoffset: 420; animation: tk-draw 0.9s ease-out forwards;
        }
        @keyframes tk-draw { to { stroke-dashoffset: 0; } }
        .tk-word { position: relative; display: inline-block; white-space: nowrap; }
        .tk-fade-up { opacity: 0; transform: translateY(18px); animation: tk-fade-up 0.7s ease-out forwards; }
        @keyframes tk-fade-up { to { opacity: 1; transform: translateY(0); } }
        .tk-stagger { opacity: 0; transform: translateY(14px); transition: opacity 0.5s ease-out, transform 0.5s ease-out; }
        .tk-stagger.tk-in { opacity: 1; transform: translateY(0); }
        .tk-card { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
        .tk-card:hover { transform: translateY(-4px); box-shadow: 0 16px 32px -12px rgba(31,42,94,0.25); }
        .tk-stat-number { font-family: "Baloo Da 2", sans-serif; }
        .tk-chip { transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease; }
        .tk-chip:hover { transform: translateY(-2px); }
        .tk-float { animation: tk-float 5s ease-in-out infinite; }
        .tk-float-slow { animation: tk-float 7s ease-in-out infinite; }
        @keyframes tk-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        .tk-btn-primary {
          background: linear-gradient(135deg, var(--marigold), var(--marigold-dark));
          background-size: 200% 200%; background-position: 0% 50%;
          transition: background-position 0.4s ease, transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 10px 24px -8px rgba(240,162,2,0.55);
        }
        .tk-btn-primary:hover { background-position: 100% 50%; transform: translateY(-2px); box-shadow: 0 14px 28px -8px rgba(240,162,2,0.65); }
        .tk-btn-leaf {
          background: linear-gradient(135deg, var(--leaf), #095c48);
          background-size: 200% 200%; background-position: 0% 50%;
          transition: background-position 0.4s ease, transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 10px 24px -8px rgba(14,124,97,0.5);
        }
        .tk-btn-leaf:hover { background-position: 100% 50%; transform: translateY(-2px); box-shadow: 0 14px 28px -8px rgba(14,124,97,0.6); }
        .tk-marquee-track { animation: tk-marquee 28s linear infinite; }
        @keyframes tk-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .tk-glow { box-shadow: 0 30px 80px -20px rgba(31,42,94,0.35); }
        .tk-nav { transition: box-shadow 0.3s ease, background-color 0.3s ease; }
        .tk-wa-pulse { animation: tk-wa-pulse 2.4s ease-in-out infinite; }
        @keyframes tk-wa-pulse {
          0%, 100% { box-shadow: 0 10px 24px -8px rgba(37,211,102,0.55), 0 0 0 0 rgba(37,211,102,0.45); }
          50% { box-shadow: 0 10px 24px -8px rgba(37,211,102,0.55), 0 0 0 10px rgba(37,211,102,0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .tk-marker, .tk-marker-circle, .tk-fade-up, .tk-stagger, .tk-float, .tk-float-slow, .tk-marquee-track, .tk-wa-pulse {
            animation: none !important; transition: none !important; opacity: 1 !important; transform: none !important; stroke-dashoffset: 0 !important;
          }
        }
      `}</style>

      {/* ---------------- NAV ---------------- */}
      <header
        className={`tk-nav sticky top-0 z-30 ${scrolled ? "bg-[color:var(--paper)]/95 shadow-[0_4px_20px_-8px_rgba(31,42,94,0.15)]" : "bg-[color:var(--paper)]/70"} backdrop-blur`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--marigold)] to-[color:var(--leaf)] text-white shadow-md">
              <Icon.cap className="h-5 w-5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="tk-display text-xl font-bold tracking-tight text-[color:var(--ink)]">
                Rajshahi Tuition Media
              </span>
            </span>
          </a>
          <nav className="flex items-center gap-3 sm:gap-4">
            <a
              href="/manage-cv"
              className="hidden text-sm font-medium text-[color:var(--ink-soft)] hover:text-[color:var(--ink)] sm:block"
            >
              সিভি এডিট করুন
            </a>
            <a
              href="/create-cv"
              className="rounded-full border border-[color:var(--ink)]/15 px-4 py-2 text-sm font-semibold text-[color:var(--ink)] hover:border-[color:var(--ink)]/40"
            >
              টিউটর হোন
            </a>
            <a href="/find-tutor" className="tk-btn-primary rounded-full px-4 py-2 text-sm font-semibold text-white">
              টিউটর খুঁজুন
            </a>
          </nav>
        </div>
      </header>

      {/* ---------------- HERO ---------------- */}
      <section className="tk-dotgrid relative overflow-hidden px-5 pb-24 pt-16 sm:pt-20">
        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-[color:var(--marigold)]/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[color:var(--leaf)]/15 blur-3xl" />

        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left: copy */}
          <div className="text-center lg:text-left">
            <span className="tk-fade-up inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-[color:var(--ink-soft)] shadow-sm">
              <Icon.shield className="h-4 w-4 text-[color:var(--leaf)]" />
              রাজশাহী শহরের সবচেয়ে নির্ভরযোগ্য টিউটর প্ল্যাটফর্ম
            </span>

            <h1
              className="tk-fade-up mt-6 text-4xl font-bold leading-[1.25] sm:text-5xl sm:leading-[1.25]"
              style={{ animationDelay: "120ms" }}
            >
              আপনার সন্তানের জন্য{" "}
              <span className="tk-word text-[color:var(--ink)]">
                সঠিক টিউটর
                <MarkerUnderline delay={650} />
              </span>{" "}
              খুঁজে নিন, অথবা নিজেই হয়ে উঠুন{" "}
              <span className="tk-word text-[color:var(--leaf)]">
                একজন টিউটর
                <MarkerCircle delay={850} />
              </span>
            </h1>

            <p
              className="tk-fade-up mx-auto mt-6 max-w-xl text-base text-[color:var(--ink-soft)] sm:text-lg lg:mx-0"
              style={{ animationDelay: "220ms" }}
            >
              ক্লাস ১ থেকে এইচএসসি পর্যন্ত — রাজশাহী শহরের প্রতিটি এলাকায় যাচাইকৃত টিউটরদের প্রোফাইল। রেজিস্ট্রেশনের
              জন্য কোনো লগইন লাগবে না — শুধু একটি সিভি আর একটি পিন। প্রতিটি টিউটরের সাথেই যোগাযোগ করা যায়, তবে ফোন
              নম্বর সরাসরি দেখানো হয় না — আমাদের হোয়াটসঅ্যাপ টিমের মাধ্যমে নিরাপদে সংযোগ ঘটে।
            </p>

            <div
              className="tk-fade-up mt-9 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
              style={{ animationDelay: "320ms" }}
            >
              <a
                href="/find-tutor"
                className="tk-btn-primary flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white"
              >
                <Icon.search className="h-4 w-4" /> টিউটর খুঁজুন
              </a>
              <a
                href="/create-cv"
                className="tk-btn-leaf flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white"
              >
                <Icon.doc className="h-4 w-4" /> টিউটর হিসেবে যোগ দিন
              </a>
            </div>

            <div
              className="tk-fade-up mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
              style={{ animationDelay: "400ms" }}
            >
              <div className="flex -space-x-3">
                {["রা", "মি", "সা", "তা"].map((initial, i) => (
                  <span
                    key={initial}
                    className="grid h-9 w-9 place-items-center rounded-full border-2 border-[color:var(--paper)] text-xs font-bold text-white shadow-sm"
                    style={{ background: ["#F0A202", "#0E7C61", "#1F2A5E", "#C1443C"][i] }}
                  >
                    {initial}
                  </span>
                ))}
              </div>
              <p className="text-sm text-[color:var(--ink-soft)]">
                <span className="tk-display font-bold text-[color:var(--ink)]">৮০০+</span> টিউটরের সাথে যুক্ত হয়েছেন
                রাজশাহীর অভিভাবকরা
              </p>
            </div>

            <a
              href="/manage-cv"
              className="tk-fade-up mt-6 inline-block text-sm font-medium text-[color:var(--ink-soft)] underline decoration-dotted underline-offset-4 hover:text-[color:var(--ink)]"
              style={{ animationDelay: "460ms" }}
            >
              আগে থেকেই সিভি আছে? পিন দিয়ে এডিট করুন →
            </a>

            <div
              className="tk-fade-up mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
              style={{ animationDelay: "500ms" }}
            >
              <a
                href={`https://wa.me/${ADMIN_WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="tk-wa-pulse flex w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#25D366]/50 transition-transform hover:-translate-y-0.5 sm:w-auto"
              >
                <Icon.whatsapp className="h-5 w-5" /> হোয়াটসঅ্যাপে মেসেজ করুন
              </a>
              <a
                href={`tel:+${ADMIN_WHATSAPP}`}
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--ink)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <Icon.phone className="h-4 w-4 text-white" />
                <span className="text-white">{ADMIN_PHONE_DISPLAY}</span>
                <span className="text-white/70">· Click to Call</span>
              </a>
            </div>
          </div>

          {/* Right: floating CV mockup — deliberately shows no phone/email,
              matching what the real browse view sends to guardians. */}
          <div className="tk-fade-up relative mx-auto w-full max-w-sm lg:mx-0" style={{ animationDelay: "260ms" }}>
            <div className="tk-glow tk-float relative rounded-3xl bg-white p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[color:var(--ink)] to-[color:var(--ink-2)] text-lg font-bold text-white">
                  রা
                </span>
                <div>
                  <p className="tk-display text-lg font-bold text-[color:var(--ink)]">রাফসান আহমেদ</p>
                  <p className="text-sm text-[color:var(--ink-soft)]">৩ বছরের অভিজ্ঞতা</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[color:var(--marigold)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon.star key={i} className="h-4 w-4" />
                ))}
                <span className="ml-1 text-xs font-semibold text-[color:var(--ink-soft)]">৪.৯</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["পদার্থবিজ্ঞান", "উচ্চতর গণিত", "এইচএসসি"].map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-[color:var(--ink)]/5 px-3 py-1 text-xs font-medium text-[color:var(--ink)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-[color:var(--ink-soft)]">
                <Icon.building className="h-3.5 w-3.5" /> রাজশাহী কলেজ &nbsp;·&nbsp;{" "}
                <Icon.map className="h-3.5 w-3.5" /> শাহেব বাজার
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#25D366]/10 py-2 text-xs font-bold text-[#128C4A]">
                <Icon.whatsapp className="h-3.5 w-3.5" /> হোয়াটসঅ্যাপে যোগাযোগ করুন
              </div>
            </div>

            <div className="tk-float-slow tk-glow absolute -left-8 -top-6 flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-[color:var(--leaf)] sm:-left-10">
              <Icon.check className="h-4 w-4 rounded-full bg-[color:var(--leaf)] p-0.5 text-white" /> যাচাইকৃত টিউটর
            </div>
            <div className="tk-float tk-glow absolute -bottom-6 -right-4 flex items-center gap-1.5 rounded-2xl bg-[color:var(--ink)] px-4 py-2.5 text-xs font-bold text-white sm:-right-8">
              <Icon.lock className="h-3.5 w-3.5" /> নম্বর গোপন থাকে
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- TRUST MARQUEE ---------------- */}
      <section className="border-y border-[rgba(31,42,94,0.08)] bg-white py-8">
        <p className="mb-5 text-center text-xs font-semibold uppercase tracking-wider text-[color:var(--ink-soft)]">
          রাজশাহী শহরের যেসব প্রতিষ্ঠানের শিক্ষার্থী ও টিউটররা যুক্ত আছেন
        </p>
        <div className="relative overflow-hidden">
          <div className="tk-marquee-track flex w-max gap-10 px-5">
            {[...TRUSTED_INSTITUTES, ...TRUSTED_INSTITUTES].map((name, i) => (
              <span
                key={i}
                className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-[color:var(--ink)]/50"
              >
                <Icon.building className="h-4 w-4" /> {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section ref={howRef} className="tk-ruled relative border-b border-[rgba(31,42,94,0.08)] px-5 py-20">
        <div className="tk-margin-line hidden sm:block" />
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <h2 className="text-2xl font-bold sm:text-3xl">এটি কীভাবে কাজ করে</h2>
            <div className="inline-flex rounded-full bg-[color:var(--ink)]/5 p-1">
              <button
                onClick={() => setAudience("guardian")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${audience === "guardian" ? "bg-white text-[color:var(--ink)] shadow-sm" : "text-[color:var(--ink-soft)]"}`}
              >
                অভিভাবকদের জন্য
              </button>
              <button
                onClick={() => setAudience("tutor")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${audience === "tutor" ? "bg-white text-[color:var(--ink)] shadow-sm" : "text-[color:var(--ink-soft)]"}`}
              >
                টিউটরদের জন্য
              </button>
            </div>
          </div>

          <ol className="relative mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="pointer-events-none absolute left-0 right-0 top-9 hidden border-t-2 border-dashed border-[color:var(--ink)]/10 sm:block" />
            {steps.map((step, i) => (
              <li
                key={step.title}
                className={`tk-stagger ${howInView ? "tk-in" : ""} tk-card relative rounded-2xl bg-white p-6 shadow-sm`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--marigold)]/15 to-[color:var(--leaf)]/15 text-[color:var(--ink)]">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <span className="tk-display text-2xl font-extrabold text-[color:var(--marigold)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-4 text-lg font-bold text-[color:var(--ink)]">{step.title}</p>
                <p className="mt-2 text-sm text-[color:var(--ink-soft)]">{step.desc}</p>
              </li>
            ))}
          </ol>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-[color:var(--ink-soft)] sm:justify-start">
            <Icon.lock className="h-3.5 w-3.5 shrink-0" />
            যোগাযোগ সবসময় খোলা থাকে — শুধু ফোন নম্বর ও ইমেইল সরাসরি প্রকাশ করা হয় না, প্রতিটি অনুরোধ আমাদের
            হোয়াটসঅ্যাপ টিমের মাধ্যমে নিরাপদে হয়।
          </p>
        </div>
      </section>

      {/* ---------------- SUBJECTS ---------------- */}
      <section ref={subjectsRef} className="px-5 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">ক্লাস ১ থেকে এইচএসসি — সব বিষয়েই টিউটর পাবেন</h2>
          <p className="mt-3 text-[color:var(--ink-soft)]">প্রতিটি ক্লাস ও গ্রুপের জন্য আলাদা টিউটর প্রোফাইল</p>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {SUBJECT_GROUPS.map((group, gi) => (
              <div
                key={group.label}
                className={`tk-stagger ${subjectsInView ? "tk-in" : ""} tk-card rounded-2xl border-l-4 bg-white p-6 text-left shadow-sm`}
                style={{
                  transitionDelay: `${gi * 100}ms`,
                  borderColor: ["#F0A202", "#0E7C61", "#1F2A5E", "#C1443C"][gi % 4],
                }}
              >
                <div className="flex items-center justify-between">
                  <p className="tk-display text-lg font-bold text-[color:var(--ink)]">{group.label}</p>
                  <span className="rounded-full bg-[color:var(--ink)]/5 px-3 py-1 text-xs font-semibold text-[color:var(--ink-soft)]">
                    {group.tag}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="tk-chip cursor-default rounded-full border border-[color:var(--ink)]/10 bg-[color:var(--paper)] px-3.5 py-1.5 text-sm font-medium text-[color:var(--ink)] hover:border-[color:var(--marigold)] hover:bg-[color:var(--marigold)]/10"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- STATS ---------------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[color:var(--ink)] to-[color:var(--ink-2)] px-5 py-16 text-white">
        <div className="tk-dotgrid pointer-events-none absolute inset-0 opacity-[0.08]" />
        <div className="relative mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { icon: Icon.users, to: 800, suffix: "+", label: "নিবন্ধিত টিউটর" },
            { icon: Icon.building, to: 80, suffix: "+", label: "প্রতিষ্ঠান তালিকাভুক্ত" },
            { icon: Icon.map, to: 30, suffix: "+", label: "ওয়ার্ডজুড়ে সেবা" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/10 p-6 text-center backdrop-blur">
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-white/15">
                <s.icon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-4xl font-extrabold">
                <CountUp to={s.to} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-sm text-white/70">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- TESTIMONIAL ---------------- */}
      <section ref={testimonialRef} className="px-5 py-20">
        <div
          className={`tk-stagger ${testimonialInView ? "tk-in" : ""} mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm sm:p-10`}
        >
          <Icon.quote className="mx-auto h-8 w-8 text-[color:var(--marigold)]" />
          <p className="tk-display mt-5 text-xl font-semibold leading-relaxed text-[color:var(--ink)] sm:text-2xl">
            "মাত্র দুই দিনেই আমার মেয়ের জন্য একজন চমৎকার গণিতের টিউটর পেয়ে গেছি। প্রোফাইলেই সব তথ্য পরিষ্কারভাবে
            দেওয়া ছিল, তাই বাছাই করা সহজ হয়েছে।"
          </p>
          <div className="mt-6 flex items-center justify-center gap-1 text-[color:var(--marigold)]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon.star key={i} className="h-4 w-4" />
            ))}
          </div>
          <p className="mt-3 text-sm font-semibold text-[color:var(--ink)]">নাজমুন নাহার</p>
          <p className="text-xs text-[color:var(--ink-soft)]">অভিভাবক, শাহেব বাজার, রাজশাহী</p>
        </div>
      </section>

      {/* ---------------- FINAL CTA ---------------- */}
      <section ref={ctaRef} className="px-5 pb-20">
        <div
          className={`tk-stagger ${ctaInView ? "tk-in" : ""} tk-dotgrid relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-[color:var(--ink)] to-[color:var(--ink-2)] px-6 py-14 text-center text-white sm:px-16`}
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[color:var(--marigold)]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-[color:var(--leaf)]/25 blur-3xl" />
          <p className="tk-display text-black relative text-2xl font-bold sm:text-3xl">আজই যুক্ত হোন টিউশন খাতায়</p>
          <p className="relative mx-auto mt-3 max-w-xl text-sm text-black sm:text-base">
            রাজশাহী শহরের শত শত অভিভাবক ও টিউটর ইতিমধ্যে খুঁজে পেয়েছেন তাদের সঠিক জুটি — আপনিও শুরু করুন এখনই, সম্পূর্ণ
            বিনামূল্যে।
          </p>
          <div className="relative mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/find-tutor"
              className="tk-btn-primary flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white"
            >
              <Icon.search className="h-4 w-4" /> টিউটর খুঁজুন
            </a>
            <a
              href="/create-cv"
              className="flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[color:var(--ink)]"
            >
              <Icon.doc className="h-4 w-4" /> সিভি তৈরি করুন
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="border-t border-[rgba(31,42,94,0.08)] px-5 py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--marigold)] to-[color:var(--leaf)] text-white">
                <Icon.cap className="h-5 w-5" />
              </span>
              <span className="tk-display text-lg font-bold text-[color:var(--ink)]">Rajshahi Tuition Media</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-[color:var(--ink-soft)]">
              রাজশাহী শহরের অভিভাবক ও শিক্ষার্থীদের সঠিক গৃহশিক্ষক খুঁজে পাওয়ার সবচেয়ে সহজ মাধ্যম।
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {RAJSHAHI_AREAS.slice(0, 5).map((area) => (
                <span
                  key={area}
                  className="rounded-full bg-[color:var(--ink)]/5 px-3 py-1 text-xs font-medium text-[color:var(--ink-soft)]"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-[color:var(--ink)]">লিংক</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-[color:var(--ink-soft)]">
              <a href="/find-tutor" className="hover:text-[color:var(--ink)]">
                টিউটর খুঁজুন
              </a>
              <a href="/create-cv" className="hover:text-[color:var(--ink)]">
                টিউটর হোন
              </a>
              <a href="/manage-cv" className="hover:text-[color:var(--ink)]">
                সিভি এডিট করুন
              </a>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-[color:var(--ink)]">যোগাযোগ</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-[color:var(--ink-soft)]">
              <span>support@rajshahituitionmedia.com</span>
              <span>রাজশাহী, বাংলাদেশ</span>
              <span className="flex items-center gap-1.5 text-xs">
                <Icon.whatsapp className="h-3.5 w-3.5 text-[#25D366]" /> সব টিউটর-অনুরোধ হোয়াটসঅ্যাপে হ্যান্ডেল হয়
              </span>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl border-t border-[rgba(31,42,94,0.08)] pt-6 text-center text-xs text-[color:var(--ink-soft)]">
          <p>© {new Date().getFullYear()} Rajshahi Tuition Media। রাজশাহী শহরের জন্য তৈরি।</p>
          <p className="mt-2">
            Developed By{" "}
            <a
              href="https://web.facebook.com/SamiulFahad1234/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[color:var(--ink)] hover:underline"
            >
              Samiul Fahad
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
