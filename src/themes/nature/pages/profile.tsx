import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Award, Coins, Settings, LogOut, Edit3, Mail, Phone, GraduationCap, Trophy } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { useI18n } from "@/lib/i18n";
import { courses } from "@/lib/data";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — د/ إيمان عمران" }, { name: "description", content: "Your profile" }] }),
  component: ProfilePage,
});

const tabs = ["courses", "points", "certs", "settings"] as const;
type Tab = typeof tabs[number];

function ProfilePage() {
  const { t, lang } = useI18n();
  const [tab, setTab] = useState<Tab>("courses");
  const my = courses.slice(0, 3);

  const tabLabels: Record<Tab, string> = {
    courses: t("my_courses"),
    points: t("my_points"),
    certs: t("certificates"),
    settings: t("settings"),
  };

  const tabIcons: Record<Tab, React.ReactNode> = {
    courses: <BookOpen className="size-4" />,
    points: <Coins className="size-4" />,
    certs: <Award className="size-4" />,
    settings: <Settings className="size-4" />,
  };

  return (
    <PageShell>
      <section className="relative overflow-hidden bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-3xl shadow-soft border p-6 md:p-8 grid md:grid-cols-[auto_1fr_auto] items-center gap-6 animate-fade-up">
            <div className="size-24 rounded-full bg-brand grid place-items-center text-brand-foreground font-black text-4xl shadow-soft animate-float">
              {lang === "ar" ? "ط" : "S"}
            </div>
            <div className="text-center md:text-start">
              <h1 className="text-2xl md:text-3xl font-black">{lang === "ar" ? "أهلاً، يا بطل!" : "Hello, Student!"}</h1>
              <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Mail className="size-4" /> student@example.com</span>
                <span className="inline-flex items-center gap-1.5"><Phone className="size-4" /> 01x xxxx xxxx</span>
                <span className="inline-flex items-center gap-1.5"><GraduationCap className="size-4" /> {lang === "ar" ? "أولى ثانوي" : "Grade 10"}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold inline-flex items-center gap-2 hover-lift">
                <Edit3 className="size-4" /> {t("edit_profile")}
              </button>
            </div>
          </div>

          {/* Stat row */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={<BookOpen />} value={my.length} label={t("my_courses")} delay={0} />
            <StatCard icon={<Coins />} value={1240} label={t("my_points")} delay={0.1} />
            <StatCard icon={<Award />} value={3} label={t("certificates")} delay={0.2} />
            <StatCard icon={<Trophy />} value={lang === "ar" ? "ذهبي" : "Gold"} label={lang === "ar" ? "المستوى" : "Level"} delay={0.3} />
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-border mb-8 overflow-x-auto">
            {tabs.map((k) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`px-5 py-3 inline-flex items-center gap-2 text-sm font-bold border-b-2 transition ${
                  tab === k ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tabIcons[k]} {tabLabels[k]}
              </button>
            ))}
          </div>

          {tab === "courses" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {my.map((c, i) => (
                <Link
                  key={c.id}
                  to="/courses/$courseId"
                  params={{ courseId: c.id }}
                  style={{ animationDelay: `${i * 0.1}s` }}
                  className="group bg-card rounded-3xl overflow-hidden shadow-card border hover-lift animate-fade-up"
                >
                  <div className="h-32 bg-gradient-to-br from-brand to-[oklch(0.72_0.18_60)] grid place-items-center">
                    <BookOpen className="size-12 text-white/80 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-extrabold leading-snug">{c.title[lang]}</h3>
                    <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${30 + i * 25}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{30 + i * 25}% {lang === "ar" ? "مكتمل" : "completed"}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {tab === "points" && (
            <div className="bg-card rounded-3xl border shadow-card p-8 text-center animate-fade-in">
              <Coins className="size-12 mx-auto text-brand animate-float" />
              <p className="mt-4 text-4xl font-black text-primary">1,240</p>
              <p className="text-muted-foreground">{lang === "ar" ? "نقطة مُتاحة" : "available points"}</p>
            </div>
          )}

          {tab === "certs" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n, i) => (
                <div key={n} style={{ animationDelay: `${i * 0.1}s` }} className="bg-card rounded-3xl border shadow-card p-6 hover-lift animate-fade-up text-center">
                  <Award className="size-12 mx-auto text-brand" />
                  <h4 className="mt-3 font-extrabold">{lang === "ar" ? `شهادة إتمام ${n}` : `Certificate ${n}`}</h4>
                  <p className="text-xs text-muted-foreground mt-1">2026</p>
                </div>
              ))}
            </div>
          )}

          {tab === "settings" && (
            <div className="max-w-xl bg-card rounded-3xl border shadow-card p-6 space-y-4 animate-fade-in">
              <Row label={t("full_name")} value="Student Name" />
              <Row label={t("email")} value="student@example.com" />
              <Row label={t("phone")} value="01x xxxx xxxx" />
              <button className="w-full mt-4 py-3 rounded-2xl bg-destructive text-destructive-foreground font-bold inline-flex items-center justify-center gap-2 hover-lift">
                <LogOut className="size-4" /> {t("logout")}
              </button>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function StatCard({ icon, value, label, delay }: { icon: React.ReactNode; value: React.ReactNode; label: string; delay: number }) {
  return (
    <div style={{ animationDelay: `${delay}s` }} className="bg-card rounded-2xl border shadow-card p-5 flex items-center gap-3 hover-lift animate-fade-up">
      <div className="size-12 rounded-xl bg-primary/10 text-primary grid place-items-center">{icon}</div>
      <div>
        <p className="text-2xl font-black leading-none">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-bold text-sm">{value}</span>
    </div>
  );
}
