import { ReactNode } from "react";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dark flex-grow flex flex-col w-full bg-zinc-950 text-zinc-50" style={{ '--foreground': '#f5f5f7', '--color-foreground': '#f5f5f7' } as React.CSSProperties}>
      {children}
    </div>
  );
}
