'use client'

import { AppSidebar } from '@fe/components/navigation/app-sidebar'
import { SettingsNav } from '@fe/components/settings/settings-nav'
import { Card, CardDescription, CardHeader, CardTitle } from '@fe/components/ui/card'

export default function BillingSettingsPage() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="border-border/60 bg-background/30 flex h-full w-full overflow-hidden border">
        <AppSidebar />
        <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6">
            <SettingsNav />
            <div>
              <h1 className="text-2xl font-bold">Billing</h1>
              <p className="text-muted-foreground mt-1">
                Manage your subscription and payment details.
              </p>
            </div>
            <Card className="glass-card border-border/70">
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>Billing management coming soon.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
