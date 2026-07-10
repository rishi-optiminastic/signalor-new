import { z } from 'zod'

import { apiClient } from './client'

// Backend may return null/omit these for accounts that haven't set them yet.
// Coerce to "" so getProfile never throws and the form still prefills the
// fields that DO have values (see issue #22).
const nullableStr = z
  .string()
  .nullish()
  .transform(v => v ?? '')

const profileDataSchema = z.object({
  email: z.string(),
  first_name: nullableStr,
  last_name: nullableStr,
  phone_number: nullableStr,
  /** Pre-signed B2 URL when the user has uploaded a photo, else null. */
  photo_url: z.string().nullable(),
  /** Dashboard product tour shown once per user. Optional for back-comat with
   *  older backends that don't return it yet (treated as not-seen). */
  has_seen_product_tour: z.boolean().optional().default(false),
})

const updatedFieldsSchema = z.object({
  updated: z.array(z.string()),
})

const photoUrlSchema = z.object({
  photo_url: z.string().nullable(),
})

export type ProfileData = z.infer<typeof profileDataSchema>

export async function getProfile(email: string): Promise<ProfileData> {
  const { data } = await apiClient.get('/api/account/profile/', { params: { email } })
  return profileDataSchema.parse(data)
}

export async function updateProfile(
  email: string,
  fields: {
    first_name?: string
    last_name?: string
    phone_number?: string
    has_seen_product_tour?: boolean
  },
): Promise<{ updated: string[] }> {
  const { data } = await apiClient.patch('/api/account/profile/', { email, ...fields })
  return updatedFieldsSchema.parse(data)
}

export async function uploadProfilePhoto(
  email: string,
  file: File,
): Promise<{ photo_url: string | null }> {
  const form = new FormData()
  form.append('email', email)
  form.append('photo', file)
  // Override the instance default Content-Type=application/json with `undefined`
  // so axios/the browser sets `multipart/form-data; boundary=…` itself. Setting
  // it to a bare "multipart/form-data" omits the boundary and corrupts the body
  // (the root cause of "Photo upload failed" in issue #22).
  const { data } = await apiClient.post('/api/account/profile/photo/', form, {
    headers: { 'Content-Type': undefined },
  })
  return photoUrlSchema.parse(data)
}

export async function deleteProfilePhoto(email: string): Promise<{ photo_url: string | null }> {
  const { data } = await apiClient.delete('/api/account/profile/photo/', { data: { email } })
  return photoUrlSchema.parse(data)
}
