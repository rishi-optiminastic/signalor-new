import { env } from '@fe/lib/env'

export const apiVersion = env.NEXT_PUBLIC_SANITY_API_VERSION

const rawDataset = env.NEXT_PUBLIC_SANITY_DATASET ?? ''
const rawProjectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''

// True only when Sanity is actually configured. Read-side code keys off this to
// skip fetching (and returns empty) rather than hitting the placeholder client.
export const sanityConfigured = Boolean(rawDataset && rawProjectId)

// `createClient()` throws "Configuration must contain projectId" on an empty
// value at module load, which would crash the whole build when the Sanity env
// vars aren't set (e.g. a preview deploy). Use harmless placeholders when
// unconfigured so the module loads; `sanityConfigured` stays false and reads
// return empty, and the Studio page surfaces a readable "missing vars" error.
export const dataset = rawDataset || 'production'
export const projectId = rawProjectId || 'unconfigured'

export const sanityConfigError =
  !rawDataset && !rawProjectId
    ? 'Missing NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET'
    : !rawDataset
      ? 'Missing NEXT_PUBLIC_SANITY_DATASET'
      : !rawProjectId
        ? 'Missing NEXT_PUBLIC_SANITY_PROJECT_ID'
        : ''
