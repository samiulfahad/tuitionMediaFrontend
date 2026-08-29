import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import WhatsAppIcon from "../WhatsAppIcon";


export default function Footer() {
  return (
    <footer className="border-t border-[rgba(31,42,94,0.08)] px-5 py-14">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--marigold)] to-[color:var(--leaf)] text-white">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="tk-display text-lg font-bold text-[color:var(--ink)]">Rajshahi Tuition Media</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-[color:var(--ink-soft)]">
            রাজশাহী শহরের অভিভাবক ও শিক্ষার্থীদের সঠিক গৃহশিক্ষক খুঁজে পাওয়ার সবচেয়ে সহজ মাধ্যম।
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
          
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-[color:var(--ink)]">লিংক</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-[color:var(--ink-soft)]">
            <Link to="/find-tutor" className="hover:text-[color:var(--ink)]">
              টিউটর খুঁজুন
            </Link>
            <Link to="/create-cv" className="hover:text-[color:var(--ink)]">
              টিউটর হোন
            </Link>
            <Link to="/manage-cv" className="hover:text-[color:var(--ink)]">
              সিভি এডিট করুন
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-[color:var(--ink)]">যোগাযোগ</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-[color:var(--ink-soft)]">
            <span>support@rajshahituitionmedia.com</span>
            <span>রাজশাহী, বাংলাদেশ</span>
            <span className="flex items-center gap-1.5 text-xs">
              <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" /> সব টিউটর-অনুরোধ হোয়াটসঅ্যাপে হ্যান্ডেল হয়
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-[rgba(31,42,94,0.08)] pt-6 text-center text-xs text-[color:var(--ink-soft)]">
        <p>© {new Date().getFullYear()} Rajshahi Tuition Media। রাজশাহী শহরের জন্য তৈরি।</p>
        <p className="mt-2">
          Developed By{" "}
          
           <a href="https://web.facebook.com/SamiulFahad1234/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[color:var(--ink)] hover:underline"
          >
            Samiul Fahad
          </a>
        </p>
      </div>
    </footer>
  );
}