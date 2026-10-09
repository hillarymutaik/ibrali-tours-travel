import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ImageOff, Map as MapIcon, Pencil, Plus } from 'lucide-react'
import { useAdmin } from '../context'
import { adminPost } from '../api'
import { Badge, Button, Card, Drawer, EmptyState, Field, PageHeader, SearchInput, Segmented, Toggle } from '../ui'
import { isEarned, money, num } from '../format'
import { PACKAGE_CATEGORIES } from '../status'
import { inputCls, rowCls, tdCls, textareaCls, thCls } from '../styles'

const BLANK = {
  title: '', destination: '', price: '', duration: 3, category: 'safari', difficulty: 'Easy',
  maxTravelers: 10, bestTime: 'Year-round', image: '', description: '', isActive: true,
}

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

function validate(form) {
  const errors = {}
  if (!form.title.trim()) errors.title = 'Enter a package name'
  if (!form.destination.trim()) errors.destination = 'Enter a destination'
  if (!(Number(form.price) > 0)) errors.price = 'Enter a price above zero'
  if (!(Number(form.duration) >= 1)) errors.duration = 'At least 1 day'
  if (!(Number(form.maxTravelers) >= 1)) errors.maxTravelers = 'At least 1 traveller'
  if (form.image && !/^https?:\/\//i.test(form.image.trim())) errors.image = 'Use a full image URL starting with http:// or https://'
  return errors
}

function PackageForm({ initial, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(initial)
  const [touched, setTouched] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const errors = validate(form)
  const show = (k) => (touched ? errors[k] : undefined)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    setTouched(true)
    if (Object.keys(errors).length) return
    onSubmit({
      ...form,
      title: form.title.trim(),
      destination: form.destination.trim(),
      image: form.image.trim(),
      price: Number(form.price),
      duration: Number(form.duration),
      maxTravelers: Number(form.maxTravelers),
    })
  }

  return (
    <form id="package-form" onSubmit={submit} className="space-y-5" noValidate>
      <div className="rounded-xl overflow-hidden border border-[#E3DCCD] bg-[#FAF7F1] aspect-[16/7] flex items-center justify-center">
        {form.image && !imageFailed ? (
          <img src={form.image} alt="" className="w-full h-full object-cover" onError={() => setImageFailed(true)} onLoad={() => setImageFailed(false)} />
        ) : (
          <span className="flex flex-col items-center gap-2 text-sm text-[#7A7268]">
            <ImageOff size={22} />
            {form.image ? 'Image could not be loaded' : 'Add an image URL to preview it'}
          </span>
        )}
      </div>

      <Field label="Package name" htmlFor="p-title" error={show('title')}>
        <input id="p-title" className={inputCls} value={form.title} onChange={set('title')} placeholder="e.g. Masai Mara Migration Safari" />
      </Field>
      <Field label="Destination" htmlFor="p-dest" error={show('destination')}>
        <input id="p-dest" className={inputCls} value={form.destination} onChange={set('destination')} placeholder="e.g. Masai Mara, Kenya" />
      </Field>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Price (USD)" htmlFor="p-price" error={show('price')} hint="Per person">
          <input id="p-price" type="number" min="1" inputMode="decimal" className={inputCls} value={form.price} onChange={set('price')} />
        </Field>
        <Field label="Duration (days)" htmlFor="p-days" error={show('duration')}>
          <input id="p-days" type="number" min="1" className={inputCls} value={form.duration} onChange={set('duration')} />
        </Field>
        <Field label="Max group size" htmlFor="p-max" error={show('maxTravelers')}>
          <input id="p-max" type="number" min="1" className={inputCls} value={form.maxTravelers} onChange={set('maxTravelers')} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Category" htmlFor="p-cat">
          <select id="p-cat" className={inputCls} value={form.category} onChange={set('category')}>
            {[...new Set([...PACKAGE_CATEGORIES, form.category])].map((c) => <option key={c} value={c}>{capitalize(c)}</option>)}
          </select>
        </Field>
        <Field label="Difficulty" htmlFor="p-diff">
          <select id="p-diff" className={inputCls} value={form.difficulty} onChange={set('difficulty')}>
            {['Easy', 'Medium', 'Hard'].map((d) => <option key={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Best time to go" htmlFor="p-best">
          <input id="p-best" className={inputCls} value={form.bestTime} onChange={set('bestTime')} placeholder="e.g. Jun–Oct" />
        </Field>
      </div>

      <Field label="Image URL" htmlFor="p-img" error={show('image')}>
        <input id="p-img" className={inputCls} value={form.image} onChange={(e) => { setImageFailed(false); set('image')(e) }} placeholder="https://…" />
      </Field>

      <Field label="Description" htmlFor="p-desc" hint={`${form.description.length} characters`}>
        <textarea id="p-desc" rows={4} className={textareaCls} value={form.description} onChange={set('description')} placeholder="What makes this trip special?" />
      </Field>

      <div className="flex items-start justify-between gap-4 rounded-xl border border-[#E3DCCD] p-4">
        <div>
          <p className="text-sm font-semibold text-[#4A4540]">Visible on the website</p>
          <p className="text-[13px] text-[#7A7268] mt-0.5">Hidden packages can't be booked.</p>
        </div>
        <Toggle checked={form.isActive} onChange={(v) => setForm((f) => ({ ...f, isActive: v }))} label="Visible on the website" />
      </div>

      <div className="flex justify-end gap-2.5 pt-1 sm:hidden">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" loading={saving}>Save package</Button>
      </div>
    </form>
  )
}

export default function Packages() {
  const { packages, bookings, run } = useAdmin()
  const [params, setParams] = useSearchParams()
  const [visibility, setVisibility] = useState('all')
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | package
  const [saving, setSaving] = useState(false)

  // Deep link from search: ?open=<id> opens the editor
  const openId = Number(params.get('open')) || null
  const [handledOpen, setHandledOpen] = useState(null)
  if (openId && openId !== handledOpen) {
    setHandledOpen(openId)
    const p = packages.find((x) => x.id === openId)
    if (p) setEditing(p)
  }

  const stats = useMemo(() => {
    const m = new Map()
    for (const b of bookings) {
      const s = m.get(b.packageId) ?? { count: 0, revenue: 0 }
      s.count += 1
      if (isEarned(b)) s.revenue += b.totalPrice
      m.set(b.packageId, s)
    }
    return m
  }, [bookings])

  const categories = [...new Set(packages.map((p) => p.category))].sort()
  const filtered = packages.filter((p) => {
    if (visibility === 'live' && !p.isActive) return false
    if (visibility === 'hidden' && p.isActive) return false
    if (category !== 'all' && p.category !== category) return false
    const q = query.trim().toLowerCase()
    return !q || [p.title, p.destination, p.category].some((v) => String(v ?? '').toLowerCase().includes(q))
  })

  const close = () => {
    setEditing(null)
    if (openId) {
      const next = new URLSearchParams(params)
      next.delete('open')
      setParams(next, { replace: true })
    }
  }

  const save = async (form) => {
    setSaving(true)
    const isNew = editing === 'new'
    const ok = await run(() => adminPost('package-save', { ...form, id: isNew ? undefined : editing.id }), isNew ? `“${form.title}” created` : `“${form.title}” saved`)
    setSaving(false)
    if (ok) close()
  }

  const toggle = (p) =>
    run(() => adminPost('package-toggle', { id: p.id }), p.isActive ? `“${p.title}” is now hidden` : `“${p.title}” is now live`)

  const live = packages.filter((p) => p.isActive).length

  return (
    <div>
      <PageHeader
        eyebrow="Catalogue"
        title="Packages"
        description={`${num(live)} live · ${num(packages.length - live)} hidden — prices and availability used for bookings.`}
        actions={<Button variant="primary" icon={Plus} onClick={() => setEditing('new')}>New package</Button>}
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-3 p-4 border-b border-[#E3DCCD]">
          <Segmented
            label="Visibility"
            value={visibility}
            onChange={setVisibility}
            options={[
              { value: 'all', label: 'All', count: packages.length },
              { value: 'live', label: 'Live', count: live },
              { value: 'hidden', label: 'Hidden', count: packages.length - live },
            ]}
          />
          <SearchInput value={query} onChange={setQuery} placeholder="Search packages or destinations" className="flex-1" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputCls} lg:w-48`} aria-label="Category">
            <option value="all">All categories</option>
            {categories.map((c) => <option key={c} value={c}>{capitalize(c)}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={MapIcon}
            title={packages.length ? 'No packages match' : 'No packages yet'}
            description={packages.length ? 'Try a different search or filter.' : 'Create the first package to start taking bookings.'}
            action={!packages.length && <Button variant="primary" icon={Plus} onClick={() => setEditing('new')}>New package</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px]">
              <thead>
                <tr>
                  <th className={thCls}>Package</th>
                  <th className={thCls}>Category</th>
                  <th className={`${thCls} text-right`}>Duration</th>
                  <th className={`${thCls} text-right`}>Price</th>
                  <th className={`${thCls} text-right`}>Bookings</th>
                  <th className={`${thCls} text-right`}>Revenue</th>
                  <th className={thCls}>Live</th>
                  <th className={`${thCls} w-16`}><span className="sr-only">Edit</span></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const s = stats.get(p.id) ?? { count: 0, revenue: 0 }
                  return (
                    <tr key={p.id} className={`${rowCls} hover:bg-[#FAF7F1]`}>
                      <td className={tdCls}>
                        <div className="flex items-center gap-3">
                          {p.image ? (
                            <img src={p.image} alt="" className="w-14 h-10 rounded-md object-cover flex-shrink-0 bg-[#F2EDE5]" />
                          ) : (
                            <span className="w-14 h-10 rounded-md bg-[#F2EDE5] flex items-center justify-center text-[#9C9890] flex-shrink-0"><ImageOff size={16} /></span>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-[#1C1A17] truncate max-w-[280px]">{p.title}</p>
                            <p className="text-xs text-[#7A7268] truncate max-w-[280px]">{p.destination}</p>
                          </div>
                        </div>
                      </td>
                      <td className={tdCls}>
                        <Badge>{capitalize(p.category)}</Badge>
                        <span className="text-xs text-[#7A7268] ml-2">{p.difficulty}</span>
                      </td>
                      <td className={`${tdCls} text-right tabular-nums whitespace-nowrap`}>{p.duration} day{p.duration === 1 ? '' : 's'}</td>
                      <td className={`${tdCls} text-right font-medium text-[#1C1A17] tabular-nums`}>{money(p.price)}</td>
                      <td className={`${tdCls} text-right tabular-nums`}>{num(s.count)}</td>
                      <td className={`${tdCls} text-right tabular-nums`}>{money(s.revenue)}</td>
                      <td className={tdCls}>
                        <div className="flex items-center gap-2">
                          <Toggle checked={p.isActive} onChange={() => toggle(p)} label={`${p.title} visible on the website`} />
                          <span className="text-xs text-[#7A7268] w-10">{p.isActive ? 'Live' : 'Hidden'}</span>
                        </div>
                      </td>
                      <td className={tdCls}>
                        <Button size="sm" variant="ghost" icon={Pencil} onClick={() => setEditing(p)} aria-label={`Edit ${p.title}`}>Edit</Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Drawer
        open={!!editing}
        onClose={close}
        width={600}
        title={editing === 'new' ? 'New package' : 'Edit package'}
        subtitle={editing && editing !== 'new' ? editing.title : 'Add a trip to the catalogue'}
        footer={
          <div className="hidden sm:flex gap-2.5">
            <Button onClick={close}>Cancel</Button>
            <Button type="submit" form="package-form" variant="primary" loading={saving}>
              {editing === 'new' ? 'Create package' : 'Save changes'}
            </Button>
          </div>
        }
      >
        {editing && (
          <PackageForm
            key={editing === 'new' ? 'new' : editing.id}
            initial={editing === 'new' ? BLANK : {
              ...BLANK,
              ...editing,
              price: editing.price,
              image: editing.image ?? '',
              description: editing.description ?? '',
              bestTime: editing.bestTime ?? '',
            }}
            onSubmit={save}
            onCancel={close}
            saving={saving}
          />
        )}
      </Drawer>
    </div>
  )
}
