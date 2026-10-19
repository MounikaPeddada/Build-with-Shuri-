export default function TopBar() {
  return (
    <header className="flex h-12 shrink-0 items-center bg-ink px-4 text-white">
      <div className="flex items-center gap-3">
        <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
          <rect width="26" height="26" rx="6" fill="#0b7a85" />
          <path d="M5 17 H10 L13 8 L16 18 H21" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[15px] font-semibold tracking-tight">Build with Shuri</span>
        <span className="hidden text-sm text-white/60 sm:inline">Untitled circuit</span>
      </div>
    </header>
  );
}
