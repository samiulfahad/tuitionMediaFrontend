import { Outlet } from "react-router-dom";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* <DesktopMenu /> */}
      <MobileMenu />

      <div className="flex-1 flex flex-col pb-16 lg:pb-0 lg:pt-16">
        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-xs text-slate-400 text-center">
              © {new Date().getFullYear()} Admin Panel. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
