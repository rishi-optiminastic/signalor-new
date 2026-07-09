'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  getAgencyMembers,
  inviteAgencyMember,
  removeAgencyMember,
  type AgencyMember,
} from '@/lib/api/agency'
import { useSession } from '@/lib/auth-client'

export interface UseAgencyMembersResult {
  members: AgencyMember[]
  isLoading: boolean
  invite: (memberEmail: string) => Promise<void>
  remove: (memberId: number) => Promise<void>
  isMutating: boolean
}

/** Loads + mutates the current admin's agency team (invite / remove). */
export function useAgencyMembers(enabled: boolean): UseAgencyMembersResult {
  const { data: session } = useSession()
  const email = session?.user?.email ?? undefined
  const qc = useQueryClient()
  const key = ['agency', 'members', email ?? '']

  const query = useQuery({
    queryKey: key,
    queryFn: () => getAgencyMembers(email as string),
    enabled: Boolean(email) && enabled,
  })

  const inviteMutation = useMutation({
    mutationFn: (memberEmail: string) => inviteAgencyMember(email as string, memberEmail),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })

  const removeMutation = useMutation({
    mutationFn: (memberId: number) => removeAgencyMember(email as string, memberId),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })

  return {
    members: query.data ?? [],
    isLoading: query.isLoading,
    invite: async (memberEmail: string) => {
      await inviteMutation.mutateAsync(memberEmail)
    },
    remove: async (memberId: number) => {
      await removeMutation.mutateAsync(memberId)
    },
    isMutating: inviteMutation.isPending || removeMutation.isPending,
  }
}
