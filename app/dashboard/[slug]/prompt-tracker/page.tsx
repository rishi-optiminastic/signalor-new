import { redirect } from 'next/navigation'

// Prompt Tracking is now a tab inside Visibility (Monitoring). Keep this route
// working by redirecting to the consolidated tabbed page for this brand.
export default async function PromptTrackerRedirect({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<never> {
  const { slug } = await params
  redirect(`/dashboard/${slug}/visibility?tab=prompts`)
}
