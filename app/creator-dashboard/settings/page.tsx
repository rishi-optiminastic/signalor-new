'use client'

import { useEffect, useState } from 'react'
import { z } from 'zod'

import {
  AUDIENCE_SIZES,
  CountrySelect,
  FieldLabel,
  PAYOUT_METHODS,
  SocialPlatformsField,
} from '@fe/components/creator/creator-form-fields'
import { Check, Loader2, Save } from '@fe/components/icons'
import { Button } from '@fe/components/ui/button'
import { Input } from '@fe/components/ui/input'
import { updateMyCreatorProfile } from '@fe/lib/api/partners-program'
import type { AudienceSize, PayoutMethod, SocialEntry } from '@fe/lib/api/partners-program'
import { cn } from '@fe/lib/utils'

import { useCreator } from '../_components/creator-context'

const settingsSchema = z.object({
  name: z.string().trim().min(1, "Name can't be empty."),
  social_platforms: z
    .array(z.object({ platform: z.string(), handle: z.string().trim().min(1) }))
    .min(1, 'Add at least one social platform with a handle.'),
  payout_details: z.string().trim().min(3, 'Add the details we need to pay you.'),
})

export default function CreatorSettingsPage() {
  const { profile, loading, refresh } = useCreator()

  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [socials, setSocials] = useState<SocialEntry[]>([])
  const [audience, setAudience] = useState<AudienceSize>('')
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>('wise')
  const [payoutDetails, setPayoutDetails] = useState('')

  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!profile) return
    setName(profile.name)
    setCountry(profile.country)
    setSocials(profile.social_platforms)
    setAudience(profile.audience_size)
    setPayoutMethod(profile.payout_method)
    setPayoutDetails(profile.payout_details)
  }, [profile])

  if (loading || !profile) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
      </div>
    )
  }

  const activePayout = PAYOUT_METHODS.find(p => p.value === payoutMethod) ?? PAYOUT_METHODS[0]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return
    setError(null)
    const parsed = settingsSchema.safeParse({
      name,
      social_platforms: socials.map(s => ({ ...s, handle: s.handle.trim() })).filter(s => s.handle),
      payout_details: payoutDetails,
    })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Please review the form.')
      return
    }

    setSaving(true)
    try {
      await updateMyCreatorProfile({
        email: profile.email,
        name: parsed.data.name,
        country,
        social_platforms: parsed.data.social_platforms,
        audience_size: audience || undefined,
        payout_method: payoutMethod,
        payout_details: parsed.data.payout_details,
      })
      await refresh()
      setSavedAt(Date.now())
      window.setTimeout(() => setSavedAt(null), 2500)
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(detail || "Couldn't save changes.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">Profile & payout</h1>
        <p className="text-muted-foreground mt-1 text-[13px]">
          Update how you appear publicly and how we send your earnings. Email and code are fixed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identity card */}
        <div className="border-border bg-card rounded-xl border p-5">
          <p className="text-foreground text-[13px] font-semibold">Identity</p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Shown on your public dashboard at /creators-program/{profile.code}.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Email (locked)</FieldLabel>
              <Input
                value={profile.email}
                disabled
                className="border-border bg-muted/40 h-10 cursor-not-allowed text-[13px]"
              />
            </div>
            <div>
              <FieldLabel>Creator code (locked)</FieldLabel>
              <Input
                value={profile.code}
                disabled
                className="border-border bg-muted/40 h-10 cursor-not-allowed font-mono text-[13px]"
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel>Full name</FieldLabel>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jane Creator"
                className="border-border bg-background h-10 text-[13px]"
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel>Country</FieldLabel>
              <CountrySelect value={country} onChange={setCountry} />
            </div>
          </div>
        </div>

        {/* Channels card */}
        <div className="border-border bg-card rounded-xl border p-5">
          <p className="text-foreground text-[13px] font-semibold">Channels</p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Add the platforms where you'll share Signalor. Shown publicly.
          </p>
          <div className="mt-4">
            <SocialPlatformsField value={socials} onChange={setSocials} />
          </div>

          <div className="mt-5">
            <FieldLabel>Audience size (optional)</FieldLabel>
            <div className="flex flex-wrap gap-1.5">
              {AUDIENCE_SIZES.map(b => {
                const on = audience === b.value
                return (
                  <button
                    key={b.value}
                    type="button"
                    onClick={() => setAudience(on ? '' : b.value)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                      on
                        ? 'border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-700/60 dark:bg-orange-950/30 dark:text-orange-200'
                        : 'border-border bg-card text-muted-foreground hover:border-foreground/40',
                    )}
                  >
                    {b.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Payout card */}
        <div className="border-border bg-card rounded-xl border p-5">
          <p className="text-foreground text-[13px] font-semibold">Payout</p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Stored privately. Never shown on your public dashboard.
          </p>

          <div className="mt-4">
            <FieldLabel>Method</FieldLabel>
            <div className="flex flex-wrap gap-1.5">
              {PAYOUT_METHODS.map(p => {
                const on = payoutMethod === p.value
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPayoutMethod(p.value)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                      on
                        ? 'border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-700/60 dark:bg-orange-950/30 dark:text-orange-200'
                        : 'border-border bg-card text-muted-foreground hover:border-foreground/40',
                    )}
                  >
                    {p.label}
                  </button>
                )
              })}
            </div>
            <p className="text-muted-foreground mt-2 text-[11px]">{activePayout.hint}</p>
          </div>

          <div className="mt-4">
            <FieldLabel>Payout details</FieldLabel>
            <textarea
              value={payoutDetails}
              onChange={e => setPayoutDetails(e.target.value)}
              placeholder={activePayout.placeholder}
              rows={payoutMethod === 'bank' || payoutMethod === 'other' ? 3 : 2}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground w-full resize-y rounded-md border px-3 py-2 text-[13px] leading-relaxed focus:ring-2 focus:ring-orange-400/40 focus:outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="border-destructive/30 bg-destructive/10 text-destructive dark:border-destructive/40 dark:bg-destructive/30 dark:text-destructive rounded-md border px-3 py-2 text-xs">
            {error}
          </div>
        )}

        <div className="border-border bg-background/80 sticky bottom-0 flex flex-wrap items-center justify-end gap-3 border-t py-4 backdrop-blur">
          {savedAt ? (
            <p className="text-success dark:text-success inline-flex items-center gap-1.5 text-xs font-medium">
              <Check className="size-3.5" />
              Saved
            </p>
          ) : null}
          <Button
            type="submit"
            disabled={saving}
            className="bg-foreground text-background h-10 gap-2 text-[13px] font-semibold hover:opacity-90"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
