/* Shared Tailwind class strings for the admin console — the website's theme:
   warm sand surfaces, #E3DCCD hairlines, ebony ink and Ibrali orange accents. */

export const cardCls = 'bg-white rounded-2xl border border-[#E3DCCD] shadow-[0_1px_2px_rgba(28,26,23,0.05)]'

export const inputCls =
  'w-full h-10 px-3.5 rounded-xl border border-[#E3DCCD] bg-white text-sm text-[#1C1A17] placeholder:text-[#9C9890] ' +
  'transition-colors focus-visible:outline-none focus:border-[#E75A08] focus:ring-4 focus:ring-[#E75A08]/15'

export const textareaCls = inputCls.replace('h-10', 'min-h-[96px] py-2.5') + ' resize-y leading-relaxed'

export const labelCls = 'block text-sm font-medium text-[#4A4540] mb-1.5'

export const thCls = 'px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[1.2px] text-[#7A7268] whitespace-nowrap bg-[#FAF7F1] border-b border-[#E3DCCD]'
export const tdCls = 'px-4 py-3.5 text-sm text-[#6B6560] align-middle'
export const rowCls = 'border-b border-[#F0EBE3] last:border-0 transition-colors'
