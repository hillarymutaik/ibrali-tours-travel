import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AtSign, ClipboardCopy, Download, Trash2 } from 'lucide-react'
import { useAdmin, usePaged, useToast } from '../context'
import { adminPost } from '../api'
import { Button, Card, ConfirmDialog, CopyButton, EmptyState, PageHeader, Pagination, SearchInput } from '../ui'
import { dateShort, downloadCsv, inWindow, num, parseDate, relative, todayStamp } from '../format'
import { rowCls, tdCls, thCls } from '../styles'

export default function Subscribers() {
  const { subscribers, run, prefs } = useAdmin()
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') || ''
  const [removing, setRemoving] = useState(null)
  const [busy, setBusy] = useState(false)

  const setQuery = (v) => {
    const next = new URLSearchParams(params)
    if (v) next.set('q', v); else next.delete('q')
    setParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return subscribers
      .filter((s) => !q || s.email.toLowerCase().includes(q))
      .sort((a, b) => parseDate(b.createdAt) - parseDate(a.createdAt))
  }, [subscribers, query])
  const paged = usePaged(filtered, prefs.pageSize, `${query}|${prefs.pageSize}`)

  const now = new Date()
  const monthAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29)
  const recent = subscribers.filter((s) => inWindow(s.createdAt, monthAgo, new Date(now.getTime() + 86400000))).length

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(filtered.map((s) => s.email).join(', '))
      toast.success(`${filtered.length} email address${filtered.length === 1 ? '' : 'es'} copied`)
    } catch {
      toast.error('Could not copy to the clipboard')
    }
  }

  const remove = async () => {
    setBusy(true)
    const ok = await run(() => adminPost('subscriber-delete', { id: removing.id }), `${removing.email} unsubscribed`)
    setBusy(false)
    if (ok) setRemoving(null)
  }

  return (
    <div>
      <PageHeader
        title="Newsletter subscribers"
        description="People who signed up for travel inspiration on the website."
        actions={
          <>
            <Button icon={ClipboardCopy} onClick={copyAll} disabled={!filtered.length}>Copy emails</Button>
            <Button
              icon={Download}
              disabled={!filtered.length}
              onClick={() => downloadCsv(`ibrali-subscribers-${todayStamp()}.csv`, filtered, [
                { key: 'email', label: 'Email' },
                { key: 'createdAt', label: 'Subscribed at' },
              ])}
            >
              Export CSV
            </Button>
          </>
        }
      />

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <Card className="p-5">
          <p className="text-sm font-medium text-[#475467]">Total subscribers</p>
          <p className="text-[30px] font-semibold text-[#101828] leading-tight mt-2">{num(subscribers.length)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-[#475467]">Joined in the last 30 days</p>
          <p className="text-[30px] font-semibold text-[#101828] leading-tight mt-2">{num(recent)}</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-[#EAECF0]">
          <SearchInput value={query} onChange={setQuery} placeholder="Search by email" />
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={AtSign} title={subscribers.length ? 'No subscribers match' : 'No subscribers yet'} description={subscribers.length ? 'Try another search.' : 'Sign-ups from the website newsletter form will appear here.'} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px]">
                <thead>
                  <tr>
                    <th className={thCls}>Email</th>
                    <th className={thCls}>Subscribed</th>
                    <th className={`${thCls} w-24`}><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {paged.pageItems.map((s) => (
                    <tr key={s.id} className={`${rowCls} hover:bg-[#F9FAFB]`}>
                      <td className={tdCls}>
                        <span className="flex items-center gap-1">
                          <a href={`mailto:${s.email}`} className="font-medium text-[#101828] hover:text-[#C2470A]">{s.email}</a>
                          <CopyButton value={s.email} label="Copy email" />
                        </span>
                      </td>
                      <td className={tdCls}>
                        <p className="text-[#344054]">{dateShort(s.createdAt)}</p>
                        {relative(s.createdAt) !== dateShort(s.createdAt) && <p className="text-xs text-[#667085]">{relative(s.createdAt)}</p>}
                      </td>
                      <td className={`${tdCls} text-right`}>
                        <Button size="sm" variant="ghost" icon={Trash2} onClick={() => setRemoving(s)} className="!text-[#B42318] hover:!bg-[#FEF3F2]">
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={paged.page} pageCount={paged.pageCount} total={paged.total} pageSize={paged.pageSize} onPage={paged.setPage} />
          </>
        )}
      </Card>

      <ConfirmDialog
        open={!!removing}
        title="Remove this subscriber?"
        description={removing ? `${removing.email} will stop receiving the newsletter. Use this for unsubscribe requests.` : ''}
        confirmLabel="Remove subscriber"
        busy={busy}
        onConfirm={remove}
        onCancel={() => setRemoving(null)}
      />
    </div>
  )
}
