// Layout.jsx — Rajshahi Tuition Media
// Wraps every route: global "tk-*" design-system styles + Header + page
// content + Footer. Import once in App.jsx and wrap each <Route element>.
//
// Usage:
//   <Route path="/" element={<Layout><HomePage /></Layout>} />

import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
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

      <Header />
      <div className="pb-24 sm:pb-0">{children}</div>
      <Footer />
    </div>
  );
}
