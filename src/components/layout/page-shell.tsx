type PageShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageShell({ children, className }: PageShellProps) {
  return <main className={`mx-auto w-full max-w-6xl px-6 ${className ?? ""}`}>{children}</main>;
}
