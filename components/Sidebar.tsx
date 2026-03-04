"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/patients", label: "Patients", icon: "👥" },
  { href: "/records", label: "Medical Records", icon: "📋" },
  { href: "/status", label: "Status Tracking", icon: "📊" },
  { href: "/accessibility", label: "Accessibility", icon: "♿" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 flex flex-col"
      style={{ backgroundColor: "var(--sidebar-bg)", color: "var(--sidebar-text)" }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-3xl">♿</span>
          <div>
            <h1 className="text-xl font-bold text-white">AccessiCare</h1>
            <p className="text-xs text-slate-400">Medical Records &amp; Accessibility</p>
          </div>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="text-lg" aria-hidden="true">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 text-xs text-slate-400">
        <p>AccessiCare v1.0</p>
        <p className="mt-1">Empowering differently-abled lives</p>
      </div>
    </aside>
  );
}
