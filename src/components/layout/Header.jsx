// Header.jsx — Rajshahi Tuition Media
// Desktop (sm and up): sticky top navbar that animates in on scroll-up and
// slides out on scroll-down.
// Mobile (below sm): fixed bottom navbar — টিউটর হোন (left), টিউটর খুঁজুন
// as a raised rounded FAB with a label underneath (center), মেনু (right)
// opening a slide-in drawer.

import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { GraduationCap, Search, FileText, KeyRound, Menu, X } from "lucide-react";

function useScrollDirection(threshold = 12) {
  const [direction, setDirection] = useState("");
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const current = window.pageYOffset;
      if (current <= threshold) {
        setDirection("");
        setLastScroll(current);
        return;
      }
      if (current > lastScroll && direction !== "down") {
        setDirection("down");
      } else if (current < lastScroll && direction === "down") {
        setDirection("up");
      }
      setLastScroll(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScroll, direction, threshold]);

  return direction;
}

const NavItem = ({ to, end, icon: Icon, label, onClick }) => (
  <NavLink to={to} end={end} onClick={onClick} className="flex-1 h-full flex items-center justify-center">
    {({ isActive }) => (
      <div
        className={`flex flex-col items-center justify-center gap-1 ${
          isActive ? "text-[color:var(--leaf)]" : "text-[color:var(--ink-soft)]"
        }`}
      >
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
            isActive ? "bg-[color:var(--leaf)]/10" : ""
          }`}
        >
          <Icon className="w-5 h-5" strokeWidth={isActive ? 2.4 : 2} />
        </div>
        <span className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`}>{label}</span>
      </div>
    )}
  </NavLink>
);

export default function Header() {
  const scrollDirection = useScrollDirection();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 640) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* ─── Desktop top navbar — sm and up, animates in on scroll-up ───── */}
      <header
        className={`tk-nav fixed left-0 right-0 top-0 z-30 hidden bg-[color:var(--paper)]/95 shadow-[0_4px_20px_-8px_rgba(31,42,94,0.15)] backdrop-blur transition-all duration-500 ease-out sm:block ${
          scrollDirection === "down" ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--marigold)] to-[color:var(--leaf)] text-white shadow-md">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="tk-display text-xl font-bold tracking-tight text-[color:var(--ink)]">
              Rajshahi Tuition Media
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              to="/manage-cv"
              className="text-sm font-medium text-[color:var(--ink-soft)] hover:text-[color:var(--ink)]"
            >
              সিভি এডিট করুন
            </Link>
            <Link
              to="/create-cv"
              className="inline-flex items-center rounded-full border border-[color:var(--ink)]/15 px-4 py-2 text-sm font-semibold text-[color:var(--ink)] hover:border-[color:var(--ink)]/40"
            >
              টিউটর হোন
            </Link>
            <Link
              to="/find-tutor"
              className="tk-btn-primary inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white"
            >
              টিউটর খুঁজুন
            </Link>
          </nav>
        </div>
      </header>
      {/* Spacer so content doesn't jump under the fixed desktop header */}
      <div className="hidden h-[48px] sm:block" />

      {/* Small fixed brand strip on mobile — bottom bar replaces the rest */}
      <div className="tk-nav sticky top-0 z-30 flex items-center justify-center bg-[color:var(--paper)]/95 px-5 py-3 shadow-[0_4px_20px_-8px_rgba(31,42,94,0.15)] backdrop-blur sm:hidden">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[color:var(--marigold)] to-[color:var(--leaf)] text-white">
            <GraduationCap className="h-4 w-4" />
          </span>
          <span className="tk-display text-base font-bold text-[color:var(--ink)]">Rajshahi Tuition Media</span>
        </Link>
      </div>

      {/* ─── Mobile bottom navbar — below sm, Be a Tutor / Search FAB / Menu ─ */}
      <div className="sm:hidden">
        <nav className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3">
          <div className="relative mx-auto flex h-16 max-w-md items-center rounded-3xl border border-[color:var(--ink)]/10 bg-white/95 px-1 shadow-[0_10px_30px_-8px_rgba(31,42,94,0.25)] backdrop-blur-xl">
            <NavItem to="/create-cv" icon={FileText} label="টিউটর হোন" />

            {/* Raised center FAB — Search Tutor, with a label underneath so it
                matches the other two nav items instead of floating unlabeled */}
            <div className="flex-1 h-full flex flex-col items-center justify-center">
              <Link
                to="/find-tutor"
                aria-label="টিউটর খুঁজুন"
                className="tk-btn-primary -mt-8 flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-[color:var(--marigold)]/40 ring-4 ring-white active:scale-95 transition-transform duration-150"
              >
                <Search className="h-6 w-6 text-white" strokeWidth={2.5} />
              </Link>
              <span className="mt-1 text-[10px] font-medium text-[color:var(--ink-soft)]">টিউটর খুঁজুন</span>
            </div>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex-1 h-full flex items-center justify-center"
              aria-label={menuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
              aria-expanded={menuOpen}
            >
              <div
                className={`flex flex-col items-center justify-center gap-1 ${
                  menuOpen ? "text-[color:var(--ink)]" : "text-[color:var(--ink-soft)]"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    menuOpen ? "bg-[color:var(--ink)]/10" : ""
                  }`}
                >
                  {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </div>
                <span className={`text-[10px] ${menuOpen ? "font-bold" : "font-medium"}`}>মেনু</span>
              </div>
            </button>
          </div>
        </nav>
      </div>

      {/* ─── Mobile menu backdrop + drawer ───────────────────────────────── */}
      {menuOpen && (
        <div
          className="sm:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <div
        className={`sm:hidden fixed top-0 right-0 z-50 h-full w-72 max-w-[85vw] bg-white/95 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex h-full flex-col">
          <div className="flex-shrink-0 bg-gradient-to-br from-[color:var(--marigold)] to-[color:var(--marigold-dark)] p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/20 ring-1 ring-white/30">
                  <GraduationCap className="h-5 w-5 text-white" />
                </span>
                <span className="text-base font-semibold text-white">Rajshahi Tuition Media</span>
              </div>
              <button
                onClick={closeMenu}
                className="grid h-9 w-9 place-items-center rounded-lg bg-white/20 hover:bg-white/30"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            <Link
              to="/manage-cv"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[color:var(--ink)] hover:bg-[color:var(--ink)]/5"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[color:var(--ink)]/5">
                <KeyRound className="h-4 w-4" />
              </span>
              সিভি এডিট করুন
            </Link>
            <Link
              to="/find-tutor"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[color:var(--ink)] hover:bg-[color:var(--ink)]/5"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[color:var(--ink)]/5">
                <Search className="h-4 w-4" />
              </span>
              টিউটর খুঁজুন
            </Link>
            <Link
              to="/create-cv"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[color:var(--ink)] hover:bg-[color:var(--ink)]/5"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[color:var(--ink)]/5">
                <FileText className="h-4 w-4" />
              </span>
              টিউটর হিসেবে যোগ দিন
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
