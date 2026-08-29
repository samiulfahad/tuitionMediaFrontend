import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { menu } from "./menu";

const DesktopMenu = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`hidden lg:block fixed top-0 inset-x-0 z-40 border-b transition-colors duration-300 ${
        scrolled ? "bg-white/90 border-slate-200 shadow-sm" : "bg-white/70 border-transparent"
      } backdrop-blur-md`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AD</span>
          </div>
          <span className="text-slate-900 font-semibold text-[15px] tracking-tight">Admin Panel</span>
        </div>

        {/* Nav pill */}
        <nav className="flex items-center gap-1 rounded-full bg-slate-100 p-1">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                  }`
                }
              >
                <Icon className="w-4 h-4" strokeWidth={2} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* CTA */}
        <NavLink
          to="/create-cv"
          className="hidden xl:inline-flex flex-shrink-0 items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          + New CV
        </NavLink>
      </div>
    </header>
  );
};

export default DesktopMenu;
