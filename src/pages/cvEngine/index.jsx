// TutorCv.jsx
// Create + Manage/Edit CV in one file — form fields, the create flow, and the
// manage/edit flow all live here behind a tab switcher.
// Styled to match the "টিউশন খাতা" (Tuition Khata) brand system from
// HomePage.jsx: warm paper background, Baloo Da 2 / Hind Siliguri type,
// marigold + leaf accents, tk-card lift, dotted-paper motif.
// Also includes brand-matched skeleton loading in place of plain "Loading..." text.
// Success/error feedback for create, edit, and delete now goes through the
// shared <Popup /> component instead of inline banners.
//
// Fonts: "Baloo Da 2" (display) + "Hind Siliguri" (body), self-hosted via
// @fontsource and imported once in the app entry (main.jsx):
//
//   import "@fontsource/baloo-da-2/500.css";
//   import "@fontsource/baloo-da-2/600.css";
//   import "@fontsource/baloo-da-2/700.css";
//   import "@fontsource/baloo-da-2/800.css";
//   import "@fontsource/hind-siliguri/400.css";
//   import "@fontsource/hind-siliguri/500.css";
//   import "@fontsource/hind-siliguri/600.css";
//   import "@fontsource/hind-siliguri/700.css";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  GraduationCap,
  Layers,
  BookMarked,
  Phone,
  Mail,
  ArrowLeft,
  Search,
  KeyRound,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Trash2,
  X,
  FilePlus2,
} from "lucide-react";
import tutorCvApi from "../../api/tutorCv";
import Popup from "../../components/Popup"; // adjust path to wherever Popup.jsx lives in your project

const GENDER_OPTIONS = ["male", "female", "other"];

// ---------------------------------------------------------------------------
// Signature motif (same hand-drawn marker used on the homepage hero)
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

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------
const inputCls =
  "w-full rounded-xl border border-[color:var(--ink)]/15 bg-white px-3.5 py-2.5 text-sm text-[color:var(--ink)] shadow-sm transition-all placeholder:text-[color:var(--ink-soft)]/60 focus:border-[color:var(--marigold)] focus:outline-none focus:ring-4 focus:ring-[color:var(--marigold)]/15";

function Field({ label, children, required, hint }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[color:var(--ink)]">
        {label} {required && <span className="text-[color:var(--marigold-dark)]">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="mt-1 block text-xs text-[color:var(--ink-soft)]/80">{hint}</span>}
    </label>
  );
}

function SectionCard({ icon: Icon, title, subtitle, children }) {
  return (
    <section className="tk-card rounded-2xl border border-[color:var(--ink)]/10 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--marigold)]/15 to-[color:var(--leaf)]/15 text-[color:var(--ink)]">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="tk-display text-sm font-semibold text-[color:var(--ink)]">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-[color:var(--ink-soft)]">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex cursor-pointer select-none items-center justify-between gap-4">
      <div>
        <span className="text-sm font-semibold text-[color:var(--ink)]">{label}</span>
        {description && <p className="text-xs text-[color:var(--ink-soft)]">{description}</p>}
      </div>
      <span className="relative inline-flex h-6 w-11 flex-shrink-0 items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="absolute inset-0 rounded-full bg-[color:var(--ink)]/15 transition-colors peer-checked:bg-[color:var(--leaf)]" />
        <span className="absolute left-1 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

// Pure — returns the updated object. Callers wrap it: onChange(set(values, path, value)).
function set(values, path, value) {
  const next = structuredClone(values);
  const keys = path.split(".");
  let cur = next;
  for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
  cur[keys[keys.length - 1]] = value;
  return next;
}

function get(values, path) {
  return path.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), values);
}

function YearInput({ value, onChange, placeholder }) {
  return (
    <input
      className={inputCls}
      type="text"
      inputMode="numeric"
      maxLength={4}
      placeholder={placeholder || "e.g. 2022"}
      value={value ?? ""}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
        onChange(digits === "" ? undefined : digits.length === 4 ? Number(digits) : digits);
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Skeleton loading — mirrors SectionCard's shape so the page doesn't "pop"
// once real content arrives.
// ---------------------------------------------------------------------------
function SkeletonSectionCard({ fields = 4 }) {
  return (
    <section className="rounded-2xl border border-[color:var(--ink)]/10 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="tk-skel h-10 w-10 flex-shrink-0 rounded-xl" />
        <div className="flex-1 space-y-2 pt-1">
          <span className="tk-skel block h-3.5 w-28 rounded-full" />
          <span className="tk-skel block h-3 w-44 rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <span className="tk-skel block h-3 w-20 rounded-full" />
            <span className="tk-skel block h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </section>
  );
}

function CvFormSkeleton() {
  return (
    <div className="space-y-5">
      <SkeletonSectionCard fields={6} />
      <SkeletonSectionCard fields={4} />
      <SkeletonSectionCard fields={4} />
      <SkeletonSectionCard fields={2} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// SSC / HSC
// ---------------------------------------------------------------------------
function SscHscSection({ title, subtitle, prefix, values, onChange, boards }) {
  return (
    <SectionCard icon={GraduationCap} title={title} subtitle={subtitle}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Passing Year" required>
          <YearInput
            value={get(values, `${prefix}.passingYear`)}
            onChange={(v) => onChange(set(values, `${prefix}.passingYear`, v))}
          />
        </Field>
        <Field label="Group" required>
          <select
            className={inputCls}
            value={get(values, `${prefix}.group`) || ""}
            onChange={(e) => onChange(set(values, `${prefix}.group`, e.target.value))}
          >
            <option value="">Select group</option>
            <option value="science">Science</option>
            <option value="commerce">Commerce</option>
            <option value="arts">Arts / Humanities</option>
          </select>
        </Field>
        <Field label="Result (GPA / Division)" required>
          <input
            className={inputCls}
            placeholder="e.g. 5.00"
            value={get(values, `${prefix}.result`) || ""}
            onChange={(e) => onChange(set(values, `${prefix}.result`, e.target.value))}
          />
        </Field>
        <Field label="Board">
          <select
            className={inputCls}
            value={get(values, `${prefix}.board`) || ""}
            onChange={(e) => onChange(set(values, `${prefix}.board`, e.target.value))}
          >
            <option value="">Select board</option>
            {boards.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </SectionCard>
  );
}

// ---------------------------------------------------------------------------
// Bachelor's / Master's
// ---------------------------------------------------------------------------
function DegreeSection({ title, prefix, enabled, onToggle, values, onChange, institutes }) {
  return (
    <SectionCard icon={Layers} title={title} subtitle="Optional — toggle on if applicable">
      <Toggle checked={enabled} onChange={onToggle} label={enabled ? "Included in profile" : "Not added yet"} />

      {enabled && (
        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-[color:var(--ink)]/10 pt-5 sm:grid-cols-2">
          <Field label="Degree Name">
            <input
              className={inputCls}
              placeholder="e.g. BSc (Honours)"
              value={get(values, `${prefix}.degreeName`) || ""}
              onChange={(e) => onChange(set(values, `${prefix}.degreeName`, e.target.value))}
            />
          </Field>
          <Field label="Major / Subject">
            <input
              className={inputCls}
              value={get(values, `${prefix}.major`) || ""}
              onChange={(e) => onChange(set(values, `${prefix}.major`, e.target.value))}
            />
          </Field>
          <Field label="Institution">
            <select
              className={inputCls}
              value={get(values, `${prefix}.institution`) || ""}
              onChange={(e) => onChange(set(values, `${prefix}.institution`, e.target.value))}
            >
              <option value="">Select institute</option>
              {institutes.map((i) => (
                <option key={i._id} value={i._id}>
                  {i.name}
                </option>
              ))}
            </select>
          </Field>
          <label className="flex items-center gap-2 self-end pb-2.5 sm:col-span-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-[color:var(--ink)]/20 text-[color:var(--leaf)] focus:ring-[color:var(--leaf)]/40"
              checked={!!get(values, `${prefix}.isRunning`)}
              onChange={(e) => {
                const isRunning = e.target.checked;
                let next = set(values, `${prefix}.isRunning`, isRunning);
                if (isRunning) {
                  next = set(next, `${prefix}.result`, "");
                  next = set(next, `${prefix}.passingYear`, undefined);
                }
                onChange(next);
              }}
            />
            <span className="text-sm text-[color:var(--ink-soft)]">Currently running</span>
          </label>
          {!get(values, `${prefix}.isRunning`) && (
            <>
              <Field label="Result">
                <input
                  className={inputCls}
                  placeholder="CGPA / Class"
                  value={get(values, `${prefix}.result`) || ""}
                  onChange={(e) => onChange(set(values, `${prefix}.result`, e.target.value))}
                />
              </Field>
              <Field label="Passing Year">
                <YearInput
                  value={get(values, `${prefix}.passingYear`)}
                  onChange={(v) => onChange(set(values, `${prefix}.passingYear`, v))}
                />
              </Field>
            </>
          )}
        </div>
      )}
    </SectionCard>
  );
}

// ---------------------------------------------------------------------------
// Subjects picker — chip-style, one card per class level
//
// For levels with departments (SSC/HSC — hasGroup: true), a tutor can select
// *multiple* departments (Science / Commerce / Arts) at once. The subject
// chips shown below are the deduped union of every selected department's
// subject list, and subjects are picked individually from that combined
// pool — no more being locked into a single group's subjects.
// ---------------------------------------------------------------------------
const DEPARTMENT_OPTIONS = [
  { key: "science", label: "Science" },
  { key: "commerce", label: "Commerce" },
  { key: "arts", label: "Arts / Humanities" },
];

function unionSubjectsForGroups(level, groups) {
  if (!groups || groups.length === 0) return [];
  const seen = new Set();
  const list = [];
  groups.forEach((g) => {
    (level.groups[g] || []).forEach((subject) => {
      if (!seen.has(subject)) {
        seen.add(subject);
        list.push(subject);
      }
    });
  });
  return list;
}

function SubjectsPicker({ classLevels, selected, onChange }) {
  const findEntry = (key) => selected.find((s) => s.classLevel === key);

  const toggleLevel = (level, checked) => {
    if (checked) {
      onChange([...selected, { classLevel: level.key, groups: [], subjects: [] }]);
    } else {
      onChange(selected.filter((s) => s.classLevel !== level.key));
    }
  };

  const toggleDepartment = (level, dept, checked) => {
    onChange(
      selected.map((s) => {
        if (s.classLevel !== level.key) return s;
        const groups = checked ? [...(s.groups || []), dept] : (s.groups || []).filter((g) => g !== dept);
        // Drop any previously-picked subjects that no longer belong to any
        // of the still-selected departments.
        const allowed = new Set(unionSubjectsForGroups(level, groups));
        const subjects = s.subjects.filter((subj) => allowed.has(subj));
        return { ...s, groups, subjects };
      }),
    );
  };

  const toggleSubject = (levelKey, subject, checked) => {
    onChange(
      selected.map((s) => {
        if (s.classLevel !== levelKey) return s;
        const subjects = checked ? [...s.subjects, subject] : s.subjects.filter((x) => x !== subject);
        return { ...s, subjects };
      }),
    );
  };

  return (
    <SectionCard
      icon={BookMarked}
      title="Classes & Subjects"
      subtitle="Select every class level and subject you can teach"
    >
      <div className="space-y-3">
        {classLevels.map((level) => {
          const entry = findEntry(level.key);
          const isChecked = !!entry;
          const selectedGroups = entry?.groups || [];
          const subjectList = level.hasGroup ? unionSubjectsForGroups(level, selectedGroups) : level.subjects;

          return (
            <div
              key={level.key}
              className={`rounded-xl border p-4 transition-colors ${
                isChecked
                  ? "border-[color:var(--marigold)]/40 bg-[color:var(--marigold)]/5"
                  : "border-[color:var(--ink)]/10 bg-[color:var(--paper-deep)]/40"
              }`}
            >
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[color:var(--ink)]/20 text-[color:var(--leaf)] focus:ring-[color:var(--leaf)]/40"
                  checked={isChecked}
                  onChange={(e) => toggleLevel(level, e.target.checked)}
                />
                <span className="text-sm font-semibold text-[color:var(--ink)]">{level.label}</span>
              </label>

              {isChecked && level.hasGroup && (
                <div className="mt-3">
                  <p className="mb-1.5 text-xs font-medium text-[color:var(--ink-soft)]">
                    Departments (select all that apply)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {DEPARTMENT_OPTIONS.map(({ key, label }) => {
                      const active = selectedGroups.includes(key);
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => toggleDepartment(level, key, !active)}
                          className={`tk-chip rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                            active
                              ? "border-[color:var(--leaf)] bg-[color:var(--leaf)] text-white shadow-sm"
                              : "border-[color:var(--ink)]/10 bg-white text-[color:var(--ink-soft)] hover:border-[color:var(--leaf)]/50 hover:text-[color:var(--leaf)]"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {isChecked && level.hasGroup && selectedGroups.length === 0 && (
                <p className="mt-2 text-xs text-[color:var(--marigold-dark)]">
                  Select at least one department to see subjects.
                </p>
              )}

              {isChecked && subjectList.length > 0 && (
                <div className="mt-3">
                  {level.hasGroup && (
                    <p className="mb-1.5 text-xs font-medium text-[color:var(--ink-soft)]">Subjects</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {subjectList.map((subject) => {
                      const active = entry.subjects.includes(subject);
                      return (
                        <button
                          key={subject}
                          type="button"
                          onClick={() => toggleSubject(level.key, subject, !active)}
                          className={`tk-chip rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                            active
                              ? "border-[color:var(--marigold)] bg-[color:var(--marigold)] text-white shadow-sm"
                              : "border-[color:var(--ink)]/10 bg-white text-[color:var(--ink-soft)] hover:border-[color:var(--marigold)]/50 hover:text-[color:var(--marigold-dark)]"
                          }`}
                        >
                          {subject}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {isChecked && (level.hasGroup ? selectedGroups.length > 0 : true) && entry.subjects.length === 0 && (
                <p className="mt-2 text-xs text-[color:var(--margin-red)]">
                  Select at least one subject for this class.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

// ---------------------------------------------------------------------------
// Full CV form fields (Personal Info, SSC/HSC, degrees, subjects)
// ---------------------------------------------------------------------------
function TutorCvFormFields({ values, onChange, meta, institutes }) {
  return (
    <div className="space-y-5">
      <SectionCard icon={User} title="Personal Info" subtitle="How guardians will identify and reach you">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full Name" required>
            <input
              className={inputCls}
              value={values.fullName || ""}
              onChange={(e) => onChange(set(values, "fullName", e.target.value))}
            />
          </Field>
          <Field label="Gender">
            <select
              className={inputCls}
              value={values.gender || ""}
              onChange={(e) => onChange(set(values, "gender", e.target.value))}
            >
              <option value="">Select</option>
              {GENDER_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g[0].toUpperCase() + g.slice(1)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Phone Number" required hint="11 digits, starting with 01 — e.g. 01712345678">
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--ink-soft)]/60" />
              <input
                className={`${inputCls} pl-9`}
                placeholder="01XXXXXXXXX"
                inputMode="numeric"
                maxLength={11}
                value={values.phone || ""}
                onChange={(e) => onChange(set(values, "phone", e.target.value.replace(/\D/g, "").slice(0, 11)))}
              />
            </div>
          </Field>
          <Field label="Email">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--ink-soft)]/60" />
              <input
                type="email"
                className={`${inputCls} pl-9`}
                value={values.email || ""}
                onChange={(e) => onChange(set(values, "email", e.target.value))}
              />
            </div>
          </Field>
          <Field label="Years of Experience">
            <input
              type="number"
              min="0"
              className={inputCls}
              value={values.experienceYears ?? ""}
              onChange={(e) => onChange(set(values, "experienceYears", Number(e.target.value)))}
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Short Bio" hint="A couple of sentences guardians will see on your profile">
            <textarea
              className={inputCls}
              rows={3}
              maxLength={500}
              value={values.bio || ""}
              onChange={(e) => onChange(set(values, "bio", e.target.value))}
            />
          </Field>
        </div>
      </SectionCard>

      <SscHscSection
        title="SSC Info"
        subtitle="Secondary School Certificate"
        prefix="academicQualification.ssc"
        values={values}
        onChange={onChange}
        boards={meta.boards}
      />
      <SscHscSection
        title="HSC Info"
        subtitle="Higher Secondary Certificate"
        prefix="academicQualification.hsc"
        values={values}
        onChange={onChange}
        boards={meta.boards}
      />

      <DegreeSection
        title="Bachelor's (Undergraduate) Degree"
        prefix="academicQualification.bachelor"
        enabled={!!values.academicQualification.bachelor}
        onToggle={(checked) => onChange(set(values, "academicQualification.bachelor", checked ? {} : undefined))}
        values={values}
        onChange={onChange}
        institutes={institutes}
      />

      <DegreeSection
        title="Master's (Graduation) Degree"
        prefix="academicQualification.masters"
        enabled={!!values.academicQualification.masters}
        onToggle={(checked) => onChange(set(values, "academicQualification.masters", checked ? {} : undefined))}
        institutes={institutes}
        values={values}
        onChange={onChange}
      />

      <SubjectsPicker
        classLevels={meta.classLevels}
        selected={values.teachingSubjects}
        onChange={(subjects) => onChange({ ...values, teachingSubjects: subjects })}
      />
    </div>
  );
}

function emptyTutorCvValues() {
  return {
    fullName: "",
    gender: "",
    phone: "",
    email: "",
    bio: "",
    experienceYears: "",
    academicQualification: { ssc: {}, hsc: {}, bachelor: undefined, masters: undefined },
    teachingSubjects: [],
  };
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------
function validatePassingYears(aq) {
  const isValidYear = (y) => typeof y === "number" && Number.isInteger(y) && y >= 1000 && y <= 9999;

  if (!isValidYear(aq.ssc?.passingYear)) return "Enter a valid 4-digit SSC passing year.";
  if (!isValidYear(aq.hsc?.passingYear)) return "Enter a valid 4-digit HSC passing year.";
  if (aq.bachelor && !aq.bachelor.isRunning && !isValidYear(aq.bachelor.passingYear)) {
    return "Enter a valid 4-digit Bachelor's passing year.";
  }
  if (aq.masters && !aq.masters.isRunning && !isValidYear(aq.masters.passingYear)) {
    return "Enter a valid 4-digit Master's passing year.";
  }
  return null;
}

function validateTeachingSubjects(values, meta) {
  if (values.teachingSubjects.length === 0) {
    return "Select at least one class/subject you can teach.";
  }
  const emptyLevel = values.teachingSubjects.find((s) => s.subjects.length === 0);
  if (emptyLevel) {
    const level = meta.classLevels.find((c) => c.key === emptyLevel.classLevel);
    return `Select at least one subject for ${level?.label || emptyLevel.classLevel}.`;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Tab switcher
// ---------------------------------------------------------------------------
function ModeTabs({ mode, onChange }) {
  return (
    <div className="inline-flex rounded-full bg-[color:var(--ink)]/5 p-1">
      <button
        type="button"
        onClick={() => onChange("create")}
        className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
          mode === "create" ? "bg-white text-[color:var(--ink)] shadow-sm" : "text-[color:var(--ink-soft)]"
        }`}
      >
        <FilePlus2 className="h-3.5 w-3.5" /> সিভি তৈরি করুন
      </button>
      <button
        type="button"
        onClick={() => onChange("manage")}
        className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
          mode === "manage" ? "bg-white text-[color:var(--ink)] shadow-sm" : "text-[color:var(--ink-soft)]"
        }`}
      >
        <KeyRound className="h-3.5 w-3.5" /> সিভি এডিট করুন
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Create flow
// ---------------------------------------------------------------------------
function CreateFlow({ meta, institutes }) {
  const [values, setValues] = useState(emptyTutorCvValues());
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [createdCv, setCreatedCv] = useState(null);
  // Popup state: { type: "success" | "error", message: string } | null
  const [popup, setPopup] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!/^01\d{9}$/.test(values.phone || "")) {
      setError("Enter a valid 11 digit phone number starting with 01 (e.g. 01712345678).");
      return;
    }
    if (!/^\d{5,6}$/.test(pin)) {
      setError("PIN must be 5 or 6 digits.");
      return;
    }
    if (pin !== confirmPin) {
      setError("PIN and Confirm PIN do not match.");
      return;
    }
    const subjectsError = validateTeachingSubjects(values, meta);
    if (subjectsError) {
      setError(subjectsError);
      return;
    }
    const yearError = validatePassingYears(values.academicQualification);
    if (yearError) {
      setError(yearError);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...values,
        email: values.email?.trim() ? values.email.trim() : undefined,
        experienceYears: values.experienceYears === "" ? undefined : Number(values.experienceYears),
        pin,
      };
      const cv = await tutorCvApi.create(payload);
      setCreatedCv(cv);
      setPopup({ type: "success", message: "Your CV has been created successfully." });
    } catch (err) {
      setError(err.message);
      setPopup({ type: "error", message: err.message || "Something went wrong while creating your CV." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {popup && <Popup type={popup.type} message={popup.message} onClose={() => setPopup(null)} />}

      {createdCv ? (
        <div className="tk-fade-up mx-auto max-w-lg">
          <div className="tk-dotgrid relative overflow-hidden rounded-2xl border border-[color:var(--ink)]/10 bg-white p-8 text-center shadow-sm">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[color:var(--leaf)]/10 text-[color:var(--leaf)]">
              <CheckCircle2 className="h-6 w-6" />
            </span>
            <h2 className="tk-display mt-4 text-lg font-bold text-[color:var(--ink)]">CV Created Successfully</h2>
            <p className="mt-2 text-sm text-[color:var(--ink-soft)]">Your Tutor ID is</p>
            <p className="mt-1 text-3xl font-bold tracking-[0.15em] text-[color:var(--ink)]">{createdCv.cvId}</p>
            <p className="mt-1 text-xs text-[color:var(--ink-soft)]">Keep this number for your reference.</p>
            <p className="mt-4 rounded-xl bg-[color:var(--marigold)]/10 p-3 text-sm text-[color:var(--ink-soft)]">
              Please save your PIN somewhere safe — you'll need your phone number/email and this PIN to update or delete
              your CV later. We do not store your PIN and cannot recover it for you.
            </p>
            <button
              type="button"
              onClick={() => {
                setCreatedCv(null);
                setValues(emptyTutorCvValues());
                setPin("");
                setConfirmPin("");
              }}
              className="mt-6 rounded-full border border-[color:var(--ink)]/15 px-4 py-2 text-sm font-semibold text-[color:var(--ink)] hover:border-[color:var(--ink)]/40"
            >
              Create another CV
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="tk-fade-up mx-auto max-w-3xl space-y-5">
          <div>
            <h1 className="tk-display text-xl font-bold text-[color:var(--ink)]">
              <span className="tk-word">
                Create Tutor CV
                <MarkerUnderline />
              </span>
            </h1>
            <p className="mt-2 text-sm text-[color:var(--ink-soft)]">
              Fill in your teaching profile — guardians will use it to find and contact you directly.
            </p>
          </div>

          <TutorCvFormFields values={values} onChange={setValues} meta={meta} institutes={institutes} />

          <SectionCard
            icon={KeyRound}
            title="Set a CV PIN"
            subtitle="You'll use this later, along with your phone/email, to update or delete this CV."
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-[color:var(--ink)]">PIN *</span>
                <input
                  className={`${inputCls} mt-1.5`}
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[color:var(--ink)]">Confirm PIN *</span>
                <input
                  className={`${inputCls} mt-1.5`}
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                />
              </label>
            </div>
          </SectionCard>

          {error && (
            <p className="flex items-center gap-2 rounded-xl bg-[color:var(--margin-red)]/10 p-3 text-sm text-[color:var(--margin-red)]">
              <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="tk-btn-primary w-full rounded-full py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Create CV"}
          </button>
        </form>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Manage / Edit flow (search -> pin -> edit)
// ---------------------------------------------------------------------------
function ManageFlow({ meta, institutes }) {
  const [step, setStep] = useState("search");

  const [searchBy, setSearchBy] = useState("phone");
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const [pin, setPin] = useState("");
  const [cvValues, setCvValues] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  // Popup state: { type: "success" | "error", message: string } | null
  const [popup, setPopup] = useState(null);

  const [showChangePin, setShowChangePin] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmNewPin, setConfirmNewPin] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    setError("");
    setResults(null);
    try {
      const res = await tutorCvApi.search({ [searchBy]: searchValue.trim() });
      if (res.length === 0) setError("No CV found with that information.");
      setResults(res);
    } catch (err) {
      setError(err.message);
    }
  }

  function selectResult(id) {
    setSelectedId(id);
    setStep("pin");
    setError("");
    setPin("");
  }

  async function handleVerifyPin(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const cv = await tutorCvApi.verifyPin(selectedId, pin);
      setStep("edit");
      // cvValues is set after the step flips so the edit screen can show its
      // own skeleton for the brief gap between verifying and normalizing data.
      setCvValues({
        ...cv,
        experienceYears: cv.experienceYears ?? "",
        academicQualification: {
          ssc: cv.academicQualification.ssc || {},
          hsc: cv.academicQualification.hsc || {},
          bachelor: cv.academicQualification.bachelor,
          masters: cv.academicQualification.masters,
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setError("");

    const subjectsError = validateTeachingSubjects(cvValues, meta);
    if (subjectsError) {
      setError(subjectsError);
      return;
    }
    const yearError = validatePassingYears(cvValues.academicQualification);
    if (yearError) {
      setError(yearError);
      return;
    }

    setBusy(true);
    try {
      const { _id, createdAt, updatedAt, status, ...editable } = cvValues;
      await tutorCvApi.update(selectedId, {
        ...editable,
        email: editable.email?.trim() ? editable.email.trim() : undefined,
        experienceYears: editable.experienceYears === "" ? undefined : Number(editable.experienceYears),
        pin,
      });
      setPopup({ type: "success", message: "Your CV has been updated successfully." });
    } catch (err) {
      setError(err.message);
      setPopup({ type: "error", message: err.message || "Something went wrong while updating your CV." });
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to permanently delete this CV? This cannot be undone.")) return;
    setError("");
    setBusy(true);
    try {
      await tutorCvApi.remove(selectedId, pin);
      resetToSearch();
      setPopup({ type: "success", message: "Your CV has been deleted." });
    } catch (err) {
      setError(err.message);
      setPopup({ type: "error", message: err.message || "Something went wrong while deleting your CV." });
    } finally {
      setBusy(false);
    }
  }

  function resetToSearch() {
    setStep("search");
    setResults(null);
    setSelectedId(null);
    setCvValues(null);
    setSearchValue("");
    setError("");
  }

  async function handleChangePin(e) {
    e.preventDefault();
    setError("");
    if (newPin !== confirmNewPin) {
      setError("New PIN and Confirm PIN do not match.");
      return;
    }
    setBusy(true);
    try {
      await tutorCvApi.changePin(selectedId, currentPin, newPin);
      setPin(newPin);
      setShowChangePin(false);
      setCurrentPin("");
      setNewPin("");
      setConfirmNewPin("");
      setPopup({ type: "success", message: "PIN updated successfully." });
    } catch (err) {
      setError(err.message);
      setPopup({ type: "error", message: err.message || "Something went wrong while changing your PIN." });
    } finally {
      setBusy(false);
    }
  }

  function renderStep() {
    // Step: search
    if (step === "search") {
      return (
        <div className="tk-fade-up mx-auto max-w-xl">
          <div className="mb-5">
            <h1 className="tk-display text-xl font-bold text-[color:var(--ink)]">Find Your CV</h1>
            <p className="mt-1 text-sm text-[color:var(--ink-soft)]">
              Search by the phone number or email you registered with.
            </p>
          </div>

          <SectionCard icon={Search} title="Search" subtitle="Choose how to look up your CV">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="inline-flex rounded-full bg-[color:var(--ink)]/5 p-1">
                <button
                  type="button"
                  onClick={() => setSearchBy("phone")}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    searchBy === "phone" ? "bg-white text-[color:var(--ink)] shadow-sm" : "text-[color:var(--ink-soft)]"
                  }`}
                >
                  <Phone className="h-3.5 w-3.5" /> Phone
                </button>
                <button
                  type="button"
                  onClick={() => setSearchBy("email")}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    searchBy === "email" ? "bg-white text-[color:var(--ink)] shadow-sm" : "text-[color:var(--ink-soft)]"
                  }`}
                >
                  <Mail className="h-3.5 w-3.5" /> Email
                </button>
              </div>

              <input
                className={inputCls}
                placeholder={searchBy === "phone" ? "01XXXXXXXXX" : "you@example.com"}
                inputMode={searchBy === "phone" ? "numeric" : "email"}
                maxLength={searchBy === "phone" ? 11 : undefined}
                value={searchValue}
                onChange={(e) =>
                  setSearchValue(searchBy === "phone" ? e.target.value.replace(/\D/g, "").slice(0, 11) : e.target.value)
                }
              />

              <button className="tk-btn-primary w-full rounded-full py-2.5 text-sm font-bold text-white">Search</button>
            </form>
          </SectionCard>

          {error && (
            <p className="mt-4 flex items-center gap-2 rounded-xl bg-[color:var(--margin-red)]/10 p-3 text-sm text-[color:var(--margin-red)]">
              <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
            </p>
          )}

          {results && results.length > 0 && (
            <ul className="mt-4 space-y-2">
              {results.map((r) => (
                <li key={r._id}>
                  <button
                    type="button"
                    onClick={() => selectResult(r._id)}
                    className="tk-card flex w-full items-center justify-between rounded-2xl border border-[color:var(--ink)]/10 bg-white p-4 text-left shadow-sm"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--ink)]">{r.fullName}</p>
                      <p className="mt-0.5 text-xs text-[color:var(--ink-soft)]">{r.maskedPhone || r.maskedEmail}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 flex-shrink-0 text-[color:var(--ink-soft)]" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    // Step: pin
    if (step === "pin") {
      return (
        <div className="tk-fade-up mx-auto max-w-sm">
          <SectionCard icon={KeyRound} title="Enter CV PIN" subtitle="Confirm it's you before editing this CV">
            <form onSubmit={handleVerifyPin} className="space-y-4">
              <input
                className={`${inputCls} text-center text-lg tracking-[0.3em]`}
                type="password"
                inputMode="numeric"
                maxLength={6}
                placeholder="••••••"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              />
              <button
                disabled={busy}
                className="tk-btn-primary w-full rounded-full py-2.5 text-sm font-bold text-white disabled:opacity-50"
              >
                {busy ? "Verifying..." : "Verify PIN"}
              </button>
            </form>
          </SectionCard>

          <button
            onClick={resetToSearch}
            className="mt-4 text-sm font-medium text-[color:var(--ink-soft)] hover:text-[color:var(--ink)]"
          >
            Back to search
          </button>

          {error && (
            <p className="mt-4 flex items-center gap-2 rounded-xl bg-[color:var(--margin-red)]/10 p-3 text-sm text-[color:var(--margin-red)]">
              <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
            </p>
          )}
        </div>
      );
    }

    // Step: edit — skeleton fills the brief gap while cvValues normalizes
    if (!cvValues) {
      return (
        <div className="mx-auto max-w-3xl space-y-5">
          <div className="flex items-center justify-between">
            <span className="tk-skel block h-6 w-40 rounded-full" />
            <span className="tk-skel block h-8 w-28 rounded-full" />
          </div>
          <CvFormSkeleton />
        </div>
      );
    }

    return (
      <div className="tk-fade-up mx-auto max-w-3xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h1 className="tk-display text-xl font-bold text-[color:var(--ink)]">Edit CV</h1>
            {cvValues.cvId && (
              <span className="rounded-full bg-[color:var(--ink)]/5 px-2.5 py-1 font-mono text-xs font-semibold text-[color:var(--ink-soft)]">
                #{cvValues.cvId}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowChangePin(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--ink)]/15 bg-white px-3.5 py-1.5 text-xs font-semibold text-[color:var(--leaf)] shadow-sm hover:border-[color:var(--leaf)]/40"
          >
            <KeyRound className="h-3.5 w-3.5" /> Change PIN
          </button>
        </div>

        {error && (
          <p className="flex items-center gap-2 rounded-xl bg-[color:var(--margin-red)]/10 p-3 text-sm text-[color:var(--margin-red)]">
            <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
          </p>
        )}

        {showChangePin && (
          <section className="rounded-2xl border border-[color:var(--ink)]/10 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[color:var(--marigold)]/15 to-[color:var(--leaf)]/15 text-[color:var(--ink)]">
                  <KeyRound className="h-5 w-5" />
                </span>
                <h2 className="tk-display text-sm font-semibold text-[color:var(--ink)]">Change PIN</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowChangePin(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-[color:var(--ink-soft)] hover:bg-[color:var(--ink)]/5 hover:text-[color:var(--ink)]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleChangePin} className="space-y-3">
              <input
                className={inputCls}
                type="password"
                inputMode="numeric"
                maxLength={6}
                placeholder="Current PIN"
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ""))}
              />
              <input
                className={inputCls}
                type="password"
                inputMode="numeric"
                maxLength={6}
                placeholder="New PIN (5-6 digits)"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
              />
              <input
                className={inputCls}
                type="password"
                inputMode="numeric"
                maxLength={6}
                placeholder="Confirm New PIN"
                value={confirmNewPin}
                onChange={(e) => setConfirmNewPin(e.target.value.replace(/\D/g, ""))}
              />
              <div className="flex gap-2 pt-1">
                <button
                  disabled={busy}
                  className="tk-btn-primary rounded-full px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                >
                  Save New PIN
                </button>
                <button
                  type="button"
                  onClick={() => setShowChangePin(false)}
                  className="rounded-full border border-[color:var(--ink)]/15 px-4 py-2 text-sm font-medium text-[color:var(--ink-soft)] hover:bg-[color:var(--ink)]/5"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <form onSubmit={handleUpdate} className="space-y-5">
          <TutorCvFormFields values={cvValues} onChange={setCvValues} meta={meta} institutes={institutes} />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={busy}
              className="tk-btn-primary flex-1 rounded-full py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              {busy ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--margin-red)]/30 px-4 py-3 text-sm font-semibold text-[color:var(--margin-red)] transition-colors hover:bg-[color:var(--margin-red)]/10 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" /> Delete CV
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <>
      {popup && <Popup type={popup.type} message={popup.message} onClose={() => setPopup(null)} />}
      {renderStep()}
    </>
  );
}

// ---------------------------------------------------------------------------
// Main export: tabbed page hosting both flows, sharing one meta/institutes fetch
// ---------------------------------------------------------------------------
export default function CVEngine() {
  const navigate = useNavigate();
  const location = useLocation();

  // Tab is derived from the URL, not just local state, so a direct link like
  // "/manage-cv" (e.g. the সিভি এডিট করুন link on the homepage) opens straight
  // into the Manage tab instead of always landing on Create.
  const mode = location.pathname.startsWith("/manage-cv") ? "manage" : "create";
  const setMode = (next) => navigate(next === "manage" ? "/manage-cv" : "/create-cv");

  const [meta, setMeta] = useState(null);
  const [institutes, setInstitutes] = useState([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    Promise.all([tutorCvApi.getMeta(), tutorCvApi.getInstitutes()])
      .then(([metaRes, institutesRes]) => {
        setMeta(metaRes);
        setInstitutes(institutesRes);
      })
      .catch((err) => setLoadError(err.message));
  }, []);

  return (
    <div lang="bn" className="tk-root tk-dotgrid min-h-screen px-5 py-8 sm:py-12">
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
        .tk-root h1, .tk-root h2, .tk-root h3, .tk-root .tk-display {
          font-family: "Baloo Da 2", "Hind Siliguri", sans-serif;
        }
        .tk-dotgrid {
          background-image: radial-gradient(rgba(31,42,94,0.14) 1.4px, transparent 1.4px);
          background-size: 22px 22px;
        }
        .tk-marker {
          position: absolute; left: -2%; right: -2%; bottom: -0.15em; width: 104%; height: 0.5em;
          stroke-dasharray: 320; stroke-dashoffset: 320; animation: tk-draw 0.7s ease-out forwards;
        }
        @keyframes tk-draw { to { stroke-dashoffset: 0; } }
        .tk-word { position: relative; display: inline-block; white-space: nowrap; }
        .tk-fade-up { opacity: 0; transform: translateY(14px); animation: tk-fade-up 0.5s ease-out forwards; }
        @keyframes tk-fade-up { to { opacity: 1; transform: translateY(0); } }
        .tk-card { transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
        .tk-card:hover { transform: translateY(-3px); box-shadow: 0 16px 32px -14px rgba(31,42,94,0.22); }
        .tk-btn-primary {
          background: linear-gradient(135deg, var(--marigold), var(--marigold-dark));
          background-size: 200% 200%; background-position: 0% 50%;
          transition: background-position 0.4s ease, transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 10px 24px -8px rgba(240,162,2,0.5);
        }
        .tk-btn-primary:hover { background-position: 100% 50%; transform: translateY(-2px); box-shadow: 0 14px 28px -8px rgba(240,162,2,0.6); }
        /* Skeleton shimmer, matched to the paper palette */
        .tk-skel {
          position: relative;
          overflow: hidden;
          background: var(--paper-deep);
        }
        .tk-skel::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent);
          animation: tk-shimmer 1.6s infinite;
        }
        @keyframes tk-shimmer { 100% { transform: translateX(100%); } }
        @media (prefers-reduced-motion: reduce) {
          .tk-marker, .tk-fade-up, .tk-skel::after {
            animation: none !important; opacity: 1 !important; transform: none !important; stroke-dashoffset: 0 !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-3xl">
        {loadError && (
          <p className="mb-5 flex items-center gap-2 rounded-xl bg-[color:var(--margin-red)]/10 p-3 text-sm text-[color:var(--margin-red)]">
            <AlertCircle className="h-4 w-4 flex-shrink-0" /> {loadError}
          </p>
        )}

        {!meta ? (
          <CvFormSkeleton />
        ) : mode === "create" ? (
          <CreateFlow meta={meta} institutes={institutes} />
        ) : (
          <ManageFlow meta={meta} institutes={institutes} />
        )}
      </div>
    </div>
  );
}
