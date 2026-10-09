/* Shared Tailwind class strings for the admin console (neutral corporate
   grays + the Ibrali orange as the single UI accent). */

export const cardCls = 'bg-white rounded-xl border border-[#EAECF0] shadow-[0_1px_2px_rgba(16,24,40,0.05)]'

export const inputCls =
  'w-full h-10 px-3.5 rounded-lg border border-[#D0D5DD] bg-white text-sm text-[#101828] placeholder:text-[#98A2B3] ' +
  'shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-colors focus-visible:outline-none focus:border-[#F2843A] focus:ring-4 focus:ring-[#E75A08]/15'

export const textareaCls = inputCls.replace('h-10', 'min-h-[96px] py-2.5') + ' resize-y leading-relaxed'

export const labelCls = 'block text-sm font-medium text-[#344054] mb-1.5'

export const thCls = 'px-4 py-3 text-left text-xs font-medium text-[#475467] whitespace-nowrap bg-[#F9FAFB] border-b border-[#EAECF0]'
export const tdCls = 'px-4 py-3.5 text-sm text-[#475467] align-middle'
export const rowCls = 'border-b border-[#EAECF0] last:border-0 transition-colors'
