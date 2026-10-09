import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft, Inbox, Mail, MailOpen, Phone, Reply, Trash2 } from 'lucide-react'
import { useAdmin } from '../context'
import { adminPost } from '../api'
import { Avatar, Button, Card, ConfirmDialog, CopyButton, EmptyState, PageHeader, SearchInput, Segmented } from '../ui'
import { dateTime, parseDate, relative } from '../format'

export default function Messages() {
  const { messages, run } = useAdmin()
  const [params, setParams] = useSearchParams()
  const filter = params.get('filter') || 'all'
  const query = params.get('q') || ''
  const openId = Number(params.get('open')) || null
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [busy, setBusy] = useState(false)

  const setParam = (key, value, fallback) => {
    const next = new URLSearchParams(params)
    if (!value || value === fallback) next.delete(key)
    else next.set(key, String(value))
    setParams(next, { replace: true })
  }

  const unreadCount = messages.filter((m) => !m.isRead).length
  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return messages
      .filter((m) => (filter === 'unread' ? !m.isRead : true))
      .filter((m) => !q || [m.name, m.email, m.phone, m.message].some((v) => String(v ?? '').toLowerCase().includes(q)))
      .sort((a, b) => parseDate(b.createdAt) - parseDate(a.createdAt))
  }, [messages, filter, query])

  const open = openId ? messages.find((m) => m.id === openId) : null

  // Opening an unread message marks it read once (also covers deep links from search
  // and notifications). Tracking the id stops "Mark unread" from being undone instantly.
  const autoRead = useRef(null)
  useEffect(() => {
    if (!open || open.isRead || autoRead.current === open.id) return
    autoRead.current = open.id
    run(() => adminPost('message-read', { id: open.id }))
  }, [open, run])
  const openMessage = (id) => {
    autoRead.current = null
    setParam('open', id)
  }

  const toggleRead = () =>
    run(() => adminPost(open.isRead ? 'message-unread' : 'message-read', { id: open.id }), open.isRead ? 'Marked as unread' : 'Marked as read')

  const remove = async () => {
    setBusy(true)
    const ok = await run(() => adminPost('message-delete', { id: open.id }), 'Message deleted')
    setBusy(false)
    if (ok) {
      setConfirmDelete(false)
      setParam('open', null)
    }
  }

  const replyHref = open
    ? `mailto:${open.email}?subject=${encodeURIComponent('Re: Your enquiry to Ibrali Tours & Travel')}&body=${encodeURIComponent(
      `Dear ${open.name},\n\nThank you for contacting Ibrali Tours & Travel.\n\n\n\n— On ${dateTime(open.createdAt)} you wrote:\n> ${open.message.replace(/\n/g, '\n> ')}`
    )}`
    : ''

  return (
    <div>
      <PageHeader eyebrow="Operations" title="Messages" description="Enquiries sent through the website's contact form." />

      <Card className="overflow-hidden">
        <div className="grid lg:grid-cols-[380px_minmax(0,1fr)] lg:h-[calc(100vh-232px)] lg:min-h-[560px]">
          {/* List */}
          <div className={`flex flex-col min-h-0 border-[#E3DCCD] lg:border-r ${open ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-4 space-y-3 border-b border-[#E3DCCD]">
              <Segmented
                label="Message filter"
                value={filter}
                onChange={(v) => setParam('filter', v, 'all')}
                options={[{ value: 'all', label: 'All', count: messages.length }, { value: 'unread', label: 'Unread', count: unreadCount }]}
              />
              <SearchInput value={query} onChange={(v) => setParam('q', v)} placeholder="Search messages" />
            </div>
            <ul className="flex-1 overflow-y-auto">
              {list.length === 0 && (
                <li>
                  <EmptyState
                    compact
                    icon={Inbox}
                    title={messages.length ? 'No messages here' : 'No messages yet'}
                    description={messages.length ? 'Try another filter or search.' : 'Contact-form enquiries will appear here.'}
                  />
                </li>
              )}
              {list.map((m) => {
                const active = m.id === openId
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => openMessage(m.id)}
                      className={`relative w-full text-left flex gap-3 px-4 py-3.5 border-b border-[#F2EDE5] transition-colors ${active ? 'bg-[#FAF7F1]' : 'hover:bg-[#FDFBF7]'}`}
                    >
                      {active && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#E75A08]" />}
                      <Avatar name={m.name} size={38} tone={m.isRead ? 'neutral' : 'brand'} />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline gap-2">
                          <span className={`truncate text-sm ${m.isRead ? 'font-medium text-[#4A4540]' : 'font-semibold text-[#1C1A17]'}`}>{m.name}</span>
                          <span className="ml-auto text-xs text-[#7A7268] whitespace-nowrap">{relative(m.createdAt)}</span>
                        </span>
                        <span className="block text-xs text-[#7A7268] truncate">{m.email}</span>
                        <span className={`block text-[13px] mt-1 line-clamp-2 ${m.isRead ? 'text-[#7A7268]' : 'text-[#4A4540]'}`}>{m.message}</span>
                      </span>
                      {!m.isRead && <span className="w-2 h-2 rounded-full bg-[#E75A08] mt-1.5 flex-shrink-0" aria-label="Unread" />}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Reading pane */}
          <div className={`min-h-0 flex-col ${open ? 'flex' : 'hidden lg:flex'}`}>
            {!open ? (
              <div className="flex-1 flex items-center justify-center">
                <EmptyState
                  icon={Mail}
                  title={openId ? 'Message not found' : 'Select a message'}
                  description={openId ? 'It may have been deleted.' : 'Choose an enquiry from the list to read and reply.'}
                />
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b border-[#E3DCCD]">
                  <button type="button" onClick={() => setParam('open', null)} className="lg:hidden inline-flex items-center gap-1.5 text-sm font-semibold text-[#6B6560] mr-2">
                    <ArrowLeft size={16} /> Inbox
                  </button>
                  <a href={replyHref} className="inline-flex items-center gap-2 h-9 px-4 rounded-full bg-[#E75A08] hover:bg-[#C2470A] text-white text-sm font-semibold transition-colors">
                    <Reply size={16} /> Reply by email
                  </a>
                  {open.phone && (
                    <a href={`tel:${open.phone}`} className="inline-flex items-center gap-2 h-9 px-4 rounded-full border border-[#D9CFBF] bg-white text-sm font-semibold text-[#4A4540] hover:bg-[#FAF7F1]">
                      <Phone size={16} /> Call
                    </a>
                  )}
                  <Button size="sm" icon={open.isRead ? Mail : MailOpen} onClick={toggleRead} className="!h-9">
                    {open.isRead ? 'Mark unread' : 'Mark read'}
                  </Button>
                  <Button size="sm" variant="ghost" icon={Trash2} onClick={() => setConfirmDelete(true)} className="!h-9 ml-auto !text-[#B42318] hover:!bg-[#FEF3F2]">
                    Delete
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6">
                  <div className="flex items-start gap-4">
                    <Avatar name={open.name} size={48} />
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-semibold text-[#1C1A17]">{open.name}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#6B6560] mt-0.5">
                        <span className="flex items-center gap-0.5">
                          <a href={`mailto:${open.email}`} className="hover:text-[#C2470A] break-all">{open.email}</a>
                          <CopyButton value={open.email} label="Copy email" />
                        </span>
                        {open.phone && (
                          <span className="flex items-center gap-0.5">
                            <a href={`tel:${open.phone}`} className="hover:text-[#C2470A]">{open.phone}</a>
                            <CopyButton value={open.phone} label="Copy phone" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#7A7268] mt-1">Received {dateTime(open.createdAt)}</p>
                    </div>
                  </div>
                  <div className="mt-6 rounded-xl border border-[#E3DCCD] bg-[#FDFBF7] p-5">
                    <p className="text-[15px] text-[#4A4540] leading-relaxed whitespace-pre-wrap break-words">{open.message}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this message?"
        description={open ? `The enquiry from ${open.name} will be permanently removed.` : ''}
        confirmLabel="Delete message"
        busy={busy}
        onConfirm={remove}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  )
}
