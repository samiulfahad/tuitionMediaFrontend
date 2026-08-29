import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ShieldCheck,
  FileText,
  KeyRound,
  Users,
  Building2,
  MapPin,
  Star,
  Check,
  Quote,
  Lock,
  Phone,
} from "lucide-react";
import WhatsAppIcon from "../../components/WhatsAppIcon";

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

const GUARDIAN_STEPS = [
  {
    title: "খুঁজুন",
    desc: "বিষয়, ক্লাস অনুযায়ী পছন্দের টিউটর খুঁজে বের করুন।",
    icon: Search,
  },
  { title: "যাচাই করুন", desc: "শিক্ষাগত যোগ্যতা ও অভিজ্ঞতা দেখে সঠিক টিউটর বেছে নিন।", icon: ShieldCheck },
  {
    title: "যোগাযোগ করুন",
    desc: "হোয়াটসঅ্যাপে আমাদের টিমকে বার্তা পাঠান — টিউটরের ফোন নম্বর সরাসরি দেখানো হয় না, আমরাই আপনাকে টিউটরের সাথে যুক্ত করে দেব।",
    icon: WhatsAppIcon,
  },
];

const TUTOR_STEPS = [
  {
    title: "সিভি তৈরি করুন",
    desc: "শিক্ষাগত যোগ্যতা ও পড়ানোর বিষয় দিয়ে ফরম পূরণ করুন — মাত্র কয়েক মিনিটে।",
    icon: FileText,
  },
  {
    title: "পিন সংরক্ষণ করুন",
    desc: "৫-৬ ডিজিটের একটি পিন সেট করুন — পরে সিভি এডিট বা মুছতে এটাই লাগবে।",
    icon: KeyRound,
  },
  {
    title: "যোগাযোগের অনুরোধ পান",
    desc: "অভিভাবকরা আপনার প্রোফাইল দেখে হোয়াটসঅ্যাপে আমাদের টিমের মাধ্যমে যোগাযোগ করবেন — আপনার ফোন নম্বর কখনো সরাসরি প্রকাশ করা হয় না।",
    icon: Users,
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

export default function HomePage() {
  const [audience, setAudience] = useState("guardian");
  const [howRef, howInView] = useInView();
  const [subjectsRef, subjectsInView] = useInView();
  const [testimonialRef, testimonialInView] = useInView({ threshold: 0.4 });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.3 });

  const steps = audience === "guardian" ? GUARDIAN_STEPS : TUTOR_STEPS;

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="tk-dotgrid relative overflow-hidden px-5 pb-24 pt-10 sm:pt-20">
        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-[color:var(--marigold)]/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[color:var(--leaf)]/15 blur-3xl" />

        <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left: copy */}
          <div className="text-center lg:text-left">
            <span className="tk-fade-up inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-[color:var(--ink-soft)] shadow-sm">
              <ShieldCheck className="h-4 w-4 text-[color:var(--leaf)]" />
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
              <Link
                to="/find-tutor"
                className="tk-btn-primary flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white"
              >
                <Search className="h-4 w-4" /> টিউটর খুঁজুন
              </Link>
              <Link
                to="/create-cv"
                className="tk-btn-leaf flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white"
              >
                <FileText className="h-4 w-4" /> টিউটর হিসেবে যোগ দিন
              </Link>
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

            <Link
              to="/manage-cv"
              className="tk-fade-up mt-6 inline-block text-sm font-medium text-[color:var(--ink-soft)] underline decoration-dotted underline-offset-4 hover:text-[color:var(--ink)]"
              style={{ animationDelay: "460ms" }}
            >
              আগে থেকেই সিভি আছে? পিন দিয়ে এডিট করুন →
            </Link>

            <div
              className="tk-fade-up mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
              style={{ animationDelay: "500ms" }}
            >
              
                <a href={`https://wa.me/${ADMIN_WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="tk-wa-pulse flex w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#25D366]/50 transition-transform hover:-translate-y-0.5 sm:w-auto"
              >
                <WhatsAppIcon className="h-5 w-5" /> হোয়াটসঅ্যাপে মেসেজ করুন
              </a>
              
               <a href={`tel:+${ADMIN_WHATSAPP}`}
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--ink)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <Phone className="h-4 w-4 text-white" />
                <span className="text-white">{ADMIN_PHONE_DISPLAY}</span>
                <span className="text-white/70">· Call Now</span>
              </a>
            </div>
          </div>

          {/* Right: floating CV mockup */}
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
                  <Star key={i} className="h-4 w-4" fill="currentColor" />
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
                <Building2 className="h-3.5 w-3.5" /> রাজশাহী কলেজ &nbsp;·&nbsp; <MapPin className="h-3.5 w-3.5" />{" "}
                শাহেব বাজার
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#25D366]/10 py-2 text-xs font-bold text-[#128C4A]">
                <WhatsAppIcon className="h-3.5 w-3.5" /> হোয়াটসঅ্যাপে যোগাযোগ করুন
              </div>
            </div>

            <div className="tk-float-slow tk-glow absolute -left-8 -top-6 flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-[color:var(--leaf)] sm:-left-10">
              <Check className="h-4 w-4 rounded-full bg-[color:var(--leaf)] p-0.5 text-white" /> যাচাইকৃত টিউটর
            </div>
            <div className="tk-float tk-glow absolute -bottom-6 -right-4 flex items-center gap-1.5 rounded-2xl bg-[color:var(--ink)] px-4 py-2.5 text-xs font-bold text-white sm:-right-8">
              <Lock className="h-3.5 w-3.5" /> নম্বর গোপন থাকে
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
                <Building2 className="h-4 w-4" /> {name}
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
            <Lock className="h-3.5 w-3.5 shrink-0" />
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
        <div className="relative mx-auto flex max-w-md items-center justify-center divide-x divide-white/20">
          {[
            { icon: Users, to: 800, suffix: "+", label: "নিবন্ধিত টিউটর" },
            { icon: Building2, to: 80, suffix: "+", label: "প্রতিষ্ঠান তালিকাভুক্ত" },
          ].map((s) => (
            <div key={s.label} className="flex flex-1 flex-col items-center gap-2 px-6 text-center sm:px-10">
              <s.icon className="h-6 w-6 text-[color:var(--marigold)]" />
              <p className="tk-display text-4xl font-extrabold sm:text-5xl">
                <CountUp to={s.to} suffix={s.suffix} />
              </p>
              <p className="text-sm text-white/70">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- TESTIMONIAL ---------------- */}
      <section ref={testimonialRef} className="px-5 py-20">
        <div
          className={`tk-stagger ${testimonialInView ? "tk-in" : ""} mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm sm:p-10`}
        >
          <Quote className="mx-auto h-8 w-8 text-[color:var(--marigold)]" fill="currentColor" />
          <p className="tk-display mt-5 text-xl font-semibold leading-relaxed text-[color:var(--ink)] sm:text-2xl">
            "মাত্র দুই দিনেই আমার মেয়ের জন্য একজন চমৎকার গণিতের টিউটর পেয়ে গেছি। প্রোফাইলেই সব তথ্য পরিষ্কারভাবে
            দেওয়া ছিল, তাই বাছাই করা সহজ হয়েছে।"
          </p>
          <div className="mt-6 flex items-center justify-center gap-1 text-[color:var(--marigold)]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4" fill="currentColor" />
            ))}
          </div>
          <p className="mt-3 text-sm font-semibold text-[color:var(--ink)]">নাজমুন নাহার</p>
          <p className="text-xs text-[color:var(--ink-soft)]">অভিভাবক, শাহেব বাজার, রাজশাহী</p>
        </div>
      </section>

      {/* ---------------- FINAL CTA ---------------- */}
      <section ref={ctaRef} className="px-5 pb-20">
        <div
          className={`tk-stagger ${ctaInView ? "tk-in" : ""} tk-dotgrid relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-[color:var(--ink)]/10 bg-white px-6 py-14 text-center shadow-[0_20px_60px_-20px_rgba(31,42,94,0.25)] sm:px-16`}
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[color:var(--marigold)]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-[color:var(--leaf)]/20 blur-3xl" />
          <p className="tk-display relative text-2xl font-bold text-black sm:text-3xl">আজই যুক্ত হোন টিউশন খাতায়</p>
          <p className="relative mx-auto mt-3 max-w-xl text-sm text-black sm:text-base">
            রাজশাহী শহরের শত শত অভিভাবক ও টিউটর ইতিমধ্যে খুঁজে পেয়েছেন তাদের সঠিক জুটি — আপনিও শুরু করুন এখনই, সম্পূর্ণ
            বিনামূল্যে।
          </p>
          <div className="relative mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/find-tutor"
              className="tk-btn-primary flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white"
            >
              <Search className="h-4 w-4" /> টিউটর খুঁজুন
            </Link>
            <Link
              to="/create-cv"
              className="flex items-center justify-center gap-2 rounded-full bg-[color:var(--ink)] px-7 py-3.5 text-sm font-bold text-white"
            >
              <FileText className="h-4 w-4" /> সিভি তৈরি করুন
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}