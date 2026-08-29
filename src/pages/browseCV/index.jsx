// TutorBrowse.jsx
// Guardian-facing tutor directory — টিউশন খাতা visual language.
// Contact info (phone/email) is never requested from the API and never
// rendered here — the backend strips it at the query level. The WhatsApp
// button below routes to a fixed admin number (not the tutor's own number),
// carrying the tutor's short public cvId + education summary so the admin
// team can trace them in the tutor_cvs collection (never the raw Mongo _id).

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  UserRound,
  GraduationCap,
  BookOpen,
  Building2,
  BadgeCheck,
} from "lucide-react";
import tutorCvApi from "../../api/tutorCv";

// lucide-react has no brand icons, so the actual WhatsApp glyph is inlined here.
function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" {...props}>
      <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.393.703 4.62 1.918 6.49L4 29l7.72-1.879A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.75a9.7 9.7 0 0 1-4.95-1.356l-.355-.21-4.583 1.115 1.148-4.463-.232-.365A9.66 9.66 0 0 1 6.25 15c0-5.38 4.375-9.75 9.754-9.75 5.38 0 9.746 4.37 9.746 9.75s-4.367 9.75-9.746 9.75Zm5.34-7.297c-.293-.147-1.734-.857-2.003-.955-.269-.098-.464-.147-.66.147-.196.293-.756.955-.928 1.152-.171.196-.342.22-.635.073-.293-.147-1.236-.456-2.354-1.454-.87-.776-1.457-1.735-1.629-2.028-.171-.293-.018-.451.129-.597.132-.132.293-.343.44-.514.147-.171.196-.293.293-.489.098-.196.049-.367-.024-.514-.073-.147-.66-1.593-.905-2.183-.238-.573-.481-.495-.66-.504l-.562-.01c-.196 0-.514.073-.783.367-.269.293-1.026 1.003-1.026 2.448 0 1.445 1.05 2.842 1.196 3.038.147.196 2.067 3.155 5.008 4.424.7.302 1.246.483 1.672.618.702.223 1.342.191 1.848.116.564-.084 1.734-.708 1.979-1.392.244-.684.244-1.27.171-1.392-.073-.122-.269-.196-.562-.343Z" />
    </svg>
  );
}

function useBanglaFonts() {
  useEffect(() => {
    if (document.getElementById("tk-fonts")) return;
    const link = document.createElement("link");
    link.id = "tk-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@500;600;700;800&family=Hind+Siliguri:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

const GROUP_LABELS_BN = { science: "বিজ্ঞান", commerce: "বাণিজ্য", arts: "মানবিক" };
const OID_RE = /^[0-9a-fA-F]{24}$/;

// Fixed admin WhatsApp number — digits only, country code, no leading 0.
// 01723939836 -> 8801723939836
const ADMIN_WHATSAPP = "8801723939836";

function initials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
}

function levelLabel(meta, key) {
  return meta?.classLevels.find((c) => c.key === key)?.label || key;
}

// `institution` on bachelor/masters is free text, but some records were
// saved with a Mongo _id (from an earlier institute-picker). Resolve it to
// a real name via the institutes list; if it's an id we can't resolve,
// hide it rather than showing raw hex.
function institutionLabel(institution, institutes) {
  if (!institution) return null;
  if (!OID_RE.test(institution)) return institution;
  const match = institutes.find((i) => i._id === institution);
  return match ? match.name : null;
}

function headlineQualification(tutor, institutes) {
  const q = tutor.academicQualification;
  if (!q) return null;
  const deg = q.masters?.degreeName ? q.masters : q.bachelor?.degreeName ? q.bachelor : null;
  if (deg) {
    const inst = institutionLabel(deg.institution, institutes);
    const label = [deg.degreeName, deg.major].filter(Boolean).join(", ");
    const suffix = deg.isRunning ? "(চলমান)" : deg.passingYear || "";
    return [label, inst, suffix].filter(Boolean).join(" · ");
  }
  if (q.hsc) {
    return `এইচএসসি${q.hsc.group ? ` (${GROUP_LABELS_BN[q.hsc.group] || q.hsc.group})` : ""}${
      q.hsc.passingYear ? ` · ${q.hsc.passingYear}` : ""
    }`;
  }
  return null;
}

// Builds a wa.me link with a prefilled message carrying enough info for the
// admin to look the tutor up by their short cvId in the tutor_cvs
// collection — no phone/email, and no raw Mongo _id, is ever exposed
// client-side.
function buildWhatsAppLink(tutor, meta) {
  const q = tutor.academicQualification;
  const eduLines = [];

  if (q?.masters?.degreeName) {
    eduLines.push(`মাস্টার্স: ${[q.masters.degreeName, q.masters.major].filter(Boolean).join(", ")}`);
  } else if (q?.bachelor?.degreeName) {
    eduLines.push(`স্নাতক: ${[q.bachelor.degreeName, q.bachelor.major].filter(Boolean).join(", ")}`);
  }
  if (q?.hsc) {
    eduLines.push(
      `এইচএসসি: ${q.hsc.group ? `(${GROUP_LABELS_BN[q.hsc.group] || q.hsc.group}) ` : ""}${q.hsc.board || ""} · রেজাল্ট ${
        q.hsc.result || "—"
      } · ${q.hsc.passingYear || ""}`,
    );
  }
  if (q?.ssc) {
    eduLines.push(
      `এসএসসি: ${q.ssc.group ? `(${GROUP_LABELS_BN[q.ssc.group] || q.ssc.group}) ` : ""}${q.ssc.board || ""} · রেজাল্ট ${
        q.ssc.result || "—"
      } · ${q.ssc.passingYear || ""}`,
    );
  }

  const subjectLines = (tutor.teachingSubjects || [])
    .map(
      (e) =>
        `${levelLabel(meta, e.classLevel)}${e.group ? ` (${GROUP_LABELS_BN[e.group] || e.group})` : ""}: ${e.subjects.join(", ")}`,
    )
    .join("\n");

  const message = [
    `আমি এই টিউটরের ব্যাপারে জানতে চাই:`,
    ``,
    `নাম: ${tutor.fullName}`,
    `টিউটর আইডি: ${tutor.cvId || tutor._id}`,
    tutor.experienceYears != null ? `অভিজ্ঞতা: ${tutor.experienceYears} বছর` : null,
    eduLines.length ? `` : null,
    ...eduLines,
    subjectLines ? `` : null,
    subjectLines ? `পড়ানোর বিষয়:\n${subjectLines}` : null,
  ]
    .filter((l) => l !== null)
    .join("\n");

  return `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

// ---------------------------------------------------------------------------
// Detail modal — sticky header, only the body scrolls (thin themed
// scrollbar), fixed-height sheet so it doesn't stretch oddly on tall content.
// ---------------------------------------------------------------------------
function TutorDetailModal({ tutor, meta, institutes, onClose }) {
  if (!tutor) return null;
  const q = tutor.academicQualification;

  const degreeRow = (label, deg) => {
    if (!deg || (!deg.degreeName && !deg.isRunning)) return null;
    const inst = institutionLabel(deg.institution, institutes);
    return (
      <div className="flex items-start justify-between gap-3 border-b border-[color:var(--ink)]/8 py-2.5 last:border-0">
        <div>
          <p className="text-sm font-semibold text-[color:var(--ink)]">{label}</p>
          <p className="text-xs text-[color:var(--ink-soft)]">
            {[deg.degreeName, deg.major, inst].filter(Boolean).join(" · ") || "তথ্য দেওয়া হয়নি"}
          </p>
          {deg.result && <p className="text-xs text-[color:var(--ink-soft)]">রেজাল্ট: {deg.result}</p>}
        </div>
        <span className="shrink-0 text-xs font-medium text-[color:var(--ink-soft)]">
          {deg.isRunning ? "চলমান" : deg.passingYear || ""}
        </span>
      </div>
    );
  };

  const sscHscRow = (label, entry) => {
    if (!entry) return null;
    return (
      <div className="border-b border-[color:var(--ink)]/8 py-2.5 last:border-0">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-[color:var(--ink)]">
            {label}
            {entry.group && (
              <span className="ml-1.5 font-normal text-[color:var(--ink-soft)]">
                ({GROUP_LABELS_BN[entry.group] || entry.group})
              </span>
            )}
          </p>
          <span className="shrink-0 text-xs font-medium text-[color:var(--ink-soft)]">
            পাসের বছর: {entry.passingYear || "—"}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-[color:var(--ink-soft)]">
          <span>বোর্ড: {entry.board || "উল্লেখ নেই"}</span>
          <span>রেজাল্ট (জিপিএ): {entry.result || "উল্লেখ নেই"}</span>
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[color:var(--ink)]/40 backdrop-blur-sm sm:items-center sm:p-5"
      onClick={onClose}
    >
      <div
        className="tk-glow flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-[color:var(--paper)] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header — stays put, only the body below scrolls */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[color:var(--ink)]/8 bg-[color:var(--paper)] px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[color:var(--ink)] to-[color:var(--ink-2)] text-lg font-bold text-white">
              {initials(tutor.fullName)}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <p className="tk-display text-lg font-bold leading-tight text-[color:var(--ink)]">{tutor.fullName}</p>
                {tutor.cvId && (
                  <span className="rounded-full bg-[color:var(--ink)]/5 px-2 py-0.5 font-mono text-[11px] font-semibold text-[color:var(--ink-soft)]">
                    #{tutor.cvId}
                  </span>
                )}
              </div>
              <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-[color:var(--leaf)]">
                <BadgeCheck className="h-3.5 w-3.5" />
                {tutor.experienceYears != null ? `${tutor.experienceYears} বছরের অভিজ্ঞতা` : "অভিজ্ঞতা উল্লেখ নেই"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[color:var(--ink-soft)] hover:bg-[color:var(--ink)]/5"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="tk-modal-scroll flex-1 overflow-y-auto px-6 py-5">
          {tutor.bio && (
            <p className="rounded-2xl bg-white p-4 text-sm leading-relaxed text-[color:var(--ink-soft)]">{tutor.bio}</p>
          )}

          {q && (
            <div className={tutor.bio ? "mt-5" : ""}>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[color:var(--ink-soft)]">
                <GraduationCap className="h-3.5 w-3.5" /> শিক্ষাগত যোগ্যতা
              </p>
              <div className="rounded-2xl bg-white px-4">
                {degreeRow("মাস্টার্স", q.masters)}
                {degreeRow("স্নাতক (অনার্স/ডিগ্রি)", q.bachelor)}
                {sscHscRow("এইচএসসি", q.hsc)}
                {sscHscRow("এসএসসি", q.ssc)}
              </div>
            </div>
          )}

          {tutor.teachingSubjects?.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[color:var(--ink-soft)]">
                <BookOpen className="h-3.5 w-3.5" /> পড়ানোর বিষয়
              </p>
              <div className="space-y-3">
                {tutor.teachingSubjects.map((entry) => (
                  <div key={`${entry.classLevel}-${entry.group || "x"}`} className="rounded-2xl bg-white p-4">
                    <p className="text-sm font-semibold text-[color:var(--ink)]">
                      {levelLabel(meta, entry.classLevel)}
                      {entry.group && (
                        <span className="ml-1.5 font-normal text-[color:var(--ink-soft)]">
                          ({GROUP_LABELS_BN[entry.group] || entry.group})
                        </span>
                      )}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {entry.subjects.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-[color:var(--marigold)]/10 px-2.5 py-1 text-xs font-medium text-[color:var(--marigold-dark)]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <a
            href={buildWhatsAppLink(tutor, meta)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 text-sm font-bold text-white shadow-sm shadow-[#25D366]/40 transition-transform hover:-translate-y-0.5"
          >
            <WhatsAppIcon className="h-4.5 w-4.5" /> হোয়াটসঅ্যাপে যোগাযোগ করুন
          </a>

          <p className="mt-3 flex items-center gap-1.5 rounded-xl bg-[color:var(--ink)]/5 p-3 text-xs text-[color:var(--ink-soft)]">
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            টিউটরের সরাসরি যোগাযোগের তথ্য এখানে দেখানো হয় না — উপরের বাটনে ক্লিক করলে আমাদের টিমের সাথে যোগাযোগ হবে,
            যারা টিউটরের সাথে সংযোগ করিয়ে দেবে।
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tutor card
//
// Fixed height so every card in the grid is identical regardless of how
// much content a tutor has — headline, bio, and chip rows each reserve a
// constant amount of space (empty/invisible when absent) rather than
// letting the card grow or shrink with content.
// ---------------------------------------------------------------------------
function TutorCard({ tutor, meta, institutes, onView }) {
  const headline = headlineQualification(tutor, institutes);
  const chips = tutor.teachingSubjects?.[0]?.subjects || [];
  const visibleChips = chips.slice(0, 3);
  const extraChipCount = chips.length - visibleChips.length;

  return (
    <div className="tk-card relative flex h-[260px] flex-col gap-2.5 rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-start gap-2.5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--ink)] to-[color:var(--ink-2)] text-xs font-bold text-white">
          {initials(tutor.fullName)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[color:var(--ink)]">{tutor.fullName}</p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-[color:var(--leaf)]">
            <BadgeCheck className="h-3 w-3" />
            {tutor.experienceYears != null ? `${tutor.experienceYears} বছরের অভিজ্ঞতা` : "অভিজ্ঞতা উল্লেখ নেই"}
          </p>
          <p className="mt-0.5 font-mono text-[11px] font-semibold text-[color:var(--ink-soft)]">
            {tutor.cvId ? `টিউটর আইডি: #${tutor.cvId}` : <span className="opacity-0">—</span>}
          </p>
        </div>
      </div>

      {/* Headline — reserves one line even when empty */}
      <p className="flex min-h-[1.1rem] items-center gap-1.5 text-xs font-medium text-[color:var(--ink-soft)]">
        {headline ? (
          <>
            <GraduationCap className="h-3.5 w-3.5 shrink-0 text-[color:var(--ink)]/50" />
            <span className="min-w-0 flex-1 truncate">{headline}</span>
          </>
        ) : (
          <span className="opacity-0">—</span>
        )}
      </p>

      {/* Bio — reserves two lines even when empty */}
      <p className="line-clamp-2 min-h-[2rem] text-xs text-[color:var(--ink-soft)]">
        {tutor.bio || <span className="opacity-0">—</span>}
      </p>

      {/* Subject chips — fixed-height row, clipped rather than wrapping the card taller */}
      <div className="h-[22px] overflow-hidden">
        {visibleChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {tutor.teachingSubjects[0] && (
              <span className="tk-chip rounded-full bg-[color:var(--ink)]/5 px-2 py-0.5 text-[10px] font-medium text-[color:var(--ink-soft)]">
                {levelLabel(meta, tutor.teachingSubjects[0].classLevel)}
              </span>
            )}
            {visibleChips.map((s) => (
              <span
                key={s}
                className="tk-chip rounded-full bg-[color:var(--marigold)]/10 px-2 py-0.5 text-[10px] font-medium text-[color:var(--marigold-dark)]"
              >
                {s}
              </span>
            ))}
            {extraChipCount > 0 && (
              <span className="rounded-full bg-[color:var(--ink)]/5 px-2 py-0.5 text-[10px] font-medium text-[color:var(--ink-soft)]">
                +{extraChipCount}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-auto flex gap-1.5 pt-0.5">
        <button
          type="button"
          onClick={() => onView(tutor)}
          className="tk-btn-leaf flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold text-white"
        >
          বিস্তারিত দেখুন
        </button>
        <a
          href={buildWhatsAppLink(tutor, meta)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label="হোয়াটসঅ্যাপে যোগাযোগ করুন"
          title="হোয়াটসঅ্যাপে যোগাযোগ করুন"
          className="flex shrink-0 items-center justify-center rounded-full bg-[#25D366] px-3.5 text-white shadow-sm shadow-[#25D366]/40 transition-transform hover:-translate-y-0.5"
        >
          <WhatsAppIcon className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Filter bar — single line, always visible, no toggle.
// ---------------------------------------------------------------------------
const inputCls =
  "rounded-lg border border-[color:var(--ink)]/12 bg-white px-2.5 py-1.5 text-xs text-[color:var(--ink)] shadow-sm transition-all focus:border-[color:var(--marigold)] focus:outline-none focus:ring-4 focus:ring-[color:var(--marigold)]/15";

function FilterBar({ meta, institutes, filters, updateFilter, selectedLevel, availableSubjects, onSubmit, onClear }) {
  return (
    <section className="rounded-xl bg-white p-2.5 shadow-sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-wrap items-center gap-2"
      >
        <span className="flex shrink-0 items-center gap-1.5 pr-1 text-xs font-semibold text-[color:var(--ink)]">
          <SlidersHorizontal className="h-3.5 w-3.5 text-[color:var(--marigold-dark)]" />
          ফিল্টার
        </span>

        <select
          className={`${inputCls} min-w-[112px]`}
          value={filters.classLevel}
          onChange={(e) => updateFilter("classLevel", e.target.value)}
        >
          <option value="">যেকোনো ক্লাস</option>
          {meta?.classLevels.map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </select>

        {selectedLevel?.hasGroup && (
          <select
            className={`${inputCls} min-w-[96px]`}
            value={filters.group}
            onChange={(e) => updateFilter("group", e.target.value)}
          >
            <option value="">যেকোনো গ্রুপ</option>
            {meta?.sscHscGroups.map((g) => (
              <option key={g} value={g}>
                {GROUP_LABELS_BN[g] || g}
              </option>
            ))}
          </select>
        )}

        {availableSubjects.length > 0 && (
          <select
            className={`${inputCls} min-w-[100px]`}
            value={filters.subject}
            onChange={(e) => updateFilter("subject", e.target.value)}
          >
            <option value="">যেকোনো বিষয়</option>
            {availableSubjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        )}

        <select
          className={`${inputCls} min-w-[112px]`}
          value={filters.institute}
          onChange={(e) => updateFilter("institute", e.target.value)}
        >
          <option value="">যেকোনো প্রতিষ্ঠান</option>
          {institutes.map((i) => (
            <option key={i._id} value={i._id}>
              {i.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="0"
          placeholder="অভিজ্ঞতা (বছর)"
          className={`${inputCls} w-28`}
          value={filters.minExperience}
          onChange={(e) => updateFilter("minExperience", e.target.value)}
        />

        <button type="submit" className="tk-btn-primary rounded-lg px-3.5 py-1.5 text-xs font-bold text-white">
          খুঁজুন
        </button>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 rounded-lg border border-[color:var(--ink)]/12 px-2.5 py-1.5 text-xs font-medium text-[color:var(--ink-soft)] hover:bg-[color:var(--ink)]/5"
        >
          <X className="h-3.5 w-3.5" /> মুছুন
        </button>
      </form>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function BrowseCV() {
  useBanglaFonts();
  const navigate = useNavigate();

  const [meta, setMeta] = useState(null);
  const [institutes, setInstitutes] = useState([]);
  const [filters, setFilters] = useState({
    classLevel: "",
    group: "",
    subject: "",
    institute: "",
    minExperience: "",
  });
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTutor, setActiveTutor] = useState(null);

  useEffect(() => {
    Promise.all([tutorCvApi.getMeta(), tutorCvApi.getInstitutes()])
      .then(([m, i]) => {
        setMeta(m);
        setInstitutes(i);
      })
      .catch((err) => setError(err.message));
  }, []);

  const selectedLevel = useMemo(
    () => meta?.classLevels.find((c) => c.key === filters.classLevel) || null,
    [meta, filters.classLevel],
  );

  const availableSubjects = useMemo(() => {
    if (!selectedLevel) return [];
    if (!selectedLevel.hasGroup) return selectedLevel.subjects;
    return filters.group ? selectedLevel.groups[filters.group] || [] : [];
  }, [selectedLevel, filters.group]);

  async function runSearch(targetPage = 1) {
    setLoading(true);
    setError("");
    try {
      const params = { page: targetPage, limit: 12 };
      if (filters.classLevel) params.classLevel = filters.classLevel;
      if (filters.group) params.group = filters.group;
      if (filters.subject) params.subject = filters.subject;
      if (filters.institute) params.institute = filters.institute;
      if (filters.minExperience !== "") params.minExperience = Number(filters.minExperience);

      const res = await tutorCvApi.browse(params);
      setResult(res);
      setPage(targetPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (meta) runSearch(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta]);

  function updateFilter(key, value) {
    setFilters((f) => {
      const next = { ...f, [key]: value };
      if (key === "classLevel") {
        next.group = "";
        next.subject = "";
      }
      if (key === "group") next.subject = "";
      return next;
    });
  }

  function clearFilters() {
    setFilters({ classLevel: "", group: "", subject: "", institute: "", minExperience: "" });
  }

  return (
    <div lang="bn" className="tk-root min-h-screen">
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
        }
        .tk-root h1, .tk-root h2, .tk-root .tk-display { font-family: "Baloo Da 2", "Hind Siliguri", sans-serif; }
        .tk-dotgrid { background-image: radial-gradient(rgba(31,42,94,0.16) 1.4px, transparent 1.4px); background-size: 22px 22px; }
        .tk-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .tk-card:hover { transform: translateY(-4px); box-shadow: 0 16px 32px -12px rgba(31,42,94,0.25); }
        .tk-chip { transition: transform 0.2s ease; }
        .tk-btn-primary {
          background: linear-gradient(135deg, var(--marigold), var(--marigold-dark));
          box-shadow: 0 10px 24px -8px rgba(240,162,2,0.55);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .tk-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 28px -8px rgba(240,162,2,0.65); }
        .tk-btn-leaf {
          background: linear-gradient(135deg, var(--leaf), #095c48);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 8px 18px -8px rgba(14,124,97,0.5);
        }
        .tk-btn-leaf:hover { transform: translateY(-2px); box-shadow: 0 12px 22px -8px rgba(14,124,97,0.6); }
        .tk-glow { box-shadow: 0 30px 80px -20px rgba(31,42,94,0.35); }
        .tk-modal-scroll::-webkit-scrollbar { width: 6px; }
        .tk-modal-scroll::-webkit-scrollbar-track { background: transparent; }
        .tk-modal-scroll::-webkit-scrollbar-thumb { background: rgba(31,42,94,0.15); border-radius: 999px; }
        .tk-modal-scroll { scrollbar-width: thin; scrollbar-color: rgba(31,42,94,0.15) transparent; }
      `}</style>

      <div className="tk-dotgrid px-5 py-8 sm:py-10">
        <div className="mx-auto max-w-5xl space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold sm:text-2xl">টিউটর খুঁজুন</h1>
              <p className="mt-1 text-sm text-[color:var(--ink-soft)]">
                ক্লাস, বিষয় ও অভিজ্ঞতা অনুযায়ী টিউটর বাছাই করুন।
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[color:var(--ink)]/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-[color:var(--ink-soft)] shadow-sm hover:border-[color:var(--marigold)] hover:text-[color:var(--ink)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> ফিরে যান
            </button>
          </div>

          <FilterBar
            meta={meta}
            institutes={institutes}
            filters={filters}
            updateFilter={updateFilter}
            selectedLevel={selectedLevel}
            availableSubjects={availableSubjects}
            onSubmit={() => runSearch(1)}
            onClear={() => {
              clearFilters();
              runSearch(1);
            }}
          />

          {error && (
            <p className="rounded-xl bg-[color:var(--margin-red)]/10 p-3 text-sm text-[color:var(--margin-red)]">
              {error}
            </p>
          )}

          {loading && <p className="text-sm text-[color:var(--ink-soft)]">টিউটর খোঁজা হচ্ছে...</p>}

          {!loading && result && result.items.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[color:var(--ink)]/15 bg-white p-10 text-center">
              <UserRound className="mx-auto h-8 w-8 text-[color:var(--ink)]/25" />
              <p className="mt-3 text-sm text-[color:var(--ink-soft)]">
                এই ফিল্টারে কোনো টিউটর পাওয়া যায়নি। ফিল্টার বদলে আবার চেষ্টা করুন।
              </p>
            </div>
          )}

          {!loading && result && result.items.length > 0 && (
            <>
              <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {result.items.map((tutor) => (
                  <TutorCard
                    key={tutor._id}
                    tutor={tutor}
                    meta={meta}
                    institutes={institutes}
                    onView={setActiveTutor}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-[color:var(--ink-soft)]">
                  পৃষ্ঠা {result.page} / {result.totalPages} · মোট {result.total} জন টিউটর
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => runSearch(page - 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[color:var(--ink)]/12 bg-white px-3 py-1.5 text-xs font-medium text-[color:var(--ink-soft)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> আগে
                  </button>
                  <button
                    type="button"
                    disabled={page >= result.totalPages}
                    onClick={() => runSearch(page + 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[color:var(--ink)]/12 bg-white px-3 py-1.5 text-xs font-medium text-[color:var(--ink-soft)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    পরে <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {activeTutor && (
        <TutorDetailModal
          tutor={activeTutor}
          meta={meta}
          institutes={institutes}
          onClose={() => setActiveTutor(null)}
        />
      )}
    </div>
  );
}
