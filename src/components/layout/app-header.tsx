import Link from "next/link";
import { appNavigation } from "@/lib/constants/app";

export function AppHeader() {
  return (
    <header className="border-b border-line/80 bg-white/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-sm font-semibold text-white">
            FL
          </div>
          <div>
            <p className="text-base font-semibold tracking-tight text-ink">FrameLab</p>
            <p className="text-sm text-muted">framelab-comm</p>
          </div>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-muted">
          {appNavigation.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
