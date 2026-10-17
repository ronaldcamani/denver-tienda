import { clx } from "@modules/common/components/ui"

// Version web del logo del afiche de DENVER. Reemplazar por el vector
// original cuando este disponible.
const Logo = ({ className }: { className?: string }) => {
  return (
    <span className={clx("flex items-center gap-x-2", className)}>
      <svg viewBox="0 0 48 40" className="w-10 h-9 shrink-0" aria-hidden="true">
        <defs>
          <linearGradient id="denver-estrella" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7CCBFF" />
            <stop offset="1" stopColor="#1F6BFF" />
          </linearGradient>
        </defs>
        <path
          d="M4 39 L21 1 L27 1 L44 39 L36 39 L24 12 L12 39 Z"
          fill="url(#denver-estrella)"
        />
        <path d="M0 25 L47 9 L26 22 L31 31 Z" fill="#E6F4FF" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="text-[22px] font-black tracking-wide text-white">
          DENVER
        </span>
        <span className="text-[10px] font-bold tracking-[0.42em] text-lapiz-400 mt-0.5">
          LIBRERIA
        </span>
      </span>
    </span>
  )
}

export default Logo
