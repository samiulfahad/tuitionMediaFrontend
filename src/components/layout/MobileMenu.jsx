import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { menu } from "./menu";

const MobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("");

  // Primary items sit in the bottom bar directly; anything past the first
  // three lives behind the hamburger drawer.
  const primaryItems = menu.slice(0, 3);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll <= 0) {
        setScrollDirection("");
        return;
      }
      if (currentScroll > lastScroll && scrollDirection !== "down") {
        setScrollDirection("down");
      } else if (currentScroll < lastScroll && scrollDirection === "down") {
        setScrollDirection("up");
      }
      setLastScroll(currentScroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll, scrollDirection]);

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Bottom bar */}
      <div className="lg:hidden">
        <div className="h-20" />

        <nav
          className={`fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 transition-transform duration-300 ${
            scrollDirection === "down" ? "translate-y-[150%]" : "translate-y-0"
          }`}
        >
          <div className="mx-auto max-w-md h-16 px-1 flex items-center rounded-2xl bg-white border border-slate-200 shadow-lg">
            {primaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.path} to={item.path} end className="flex-1 h-full flex items-center justify-center">
                  {({ isActive }) => (
                    <div
                      className={`flex flex-col items-center justify-center gap-1 ${isActive ? "text-slate-900" : "text-slate-400"}`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${isActive ? "bg-slate-100" : ""}`}
                      >
                        <Icon className="w-5 h-5" strokeWidth={isActive ? 2.4 : 2} />
                      </div>
                      <span className={`text-[10px] ${isActive ? "font-semibold" : "font-medium"}`}>{item.label}</span>
                    </div>
                  )}
                </NavLink>
              );
            })}

            <button
              onClick={toggleMenu}
              className="flex-1 h-full flex items-center justify-center"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <div
                className={`flex flex-col items-center justify-center gap-1 ${isMenuOpen ? "text-slate-900" : "text-slate-400"}`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${isMenuOpen ? "bg-slate-100" : ""}`}
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </div>
                <span className={`text-[10px] ${isMenuOpen ? "font-semibold" : "font-medium"}`}>Menu</span>
              </div>
            </button>
          </div>
        </nav>
      </div>

      {/* Drawer overlay */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="flex flex-col h-full">
          <div className="flex-shrink-0 px-5 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AD</span>
              </div>
              <span className="text-slate-900 font-semibold text-[15px]">Admin Panel</span>
            </div>
            <button
              onClick={closeMenu}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            <div className="space-y-1">
              {menu.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                      }`
                    }
                  >
                    <Icon className="w-4.5 h-4.5" strokeWidth={2} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
