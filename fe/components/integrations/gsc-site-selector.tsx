"use client";

import { useEffect, useState } from "react";
import { Button } from "@fe/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@fe/components/ui/select";
import { getGSCSites, selectGSCSite, syncGSCData, type GSCSite } from "@fe/lib/api/integrations";

interface GSCSiteSelectorProps {
  email: string;
  onSiteSelected: () => void;
}

/** Pretty-print a GSC property: domain properties come through as `sc-domain:example.com`. */
function siteLabel(site: GSCSite): string {
  if (site.site_url.startsWith("sc-domain:")) {
    return `${site.site_url.replace("sc-domain:", "")} (Domain)`;
  }
  return site.site_url;
}

export function GSCSiteSelector({ email, onSiteSelected }: GSCSiteSelectorProps) {
  const [sites, setSites] = useState<GSCSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUrl, setSelectedUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return;
    getGSCSites(email)
      .then(({ sites: s }) => setSites(s))
      .catch((err) => {
        setError(err?.response?.data?.error || "Failed to load Search Console properties.");
      })
      .finally(() => setLoading(false));
  }, [email]);

  async function handleSave() {
    if (!selectedUrl) return;
    setSaving(true);
    setError(null);
    try {
      await selectGSCSite(email, selectedUrl);
      // Trigger initial data sync
      await syncGSCData(email).catch(() => {});
      onSiteSelected();
    } catch {
      setError("Failed to save property selection.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading Search Console properties...</p>;
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (sites.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No verified Search Console properties found for this Google account.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Select a Search Console property</label>
      <Select value={selectedUrl} onValueChange={setSelectedUrl}>
        <SelectTrigger className="h-9 w-full border-border bg-background text-sm focus:ring-0 focus:border-border">
          <SelectValue placeholder="Choose a property..." />
        </SelectTrigger>
        <SelectContent>
          {sites.map((s) => (
            <SelectItem key={s.site_url} value={s.site_url}>
              {siteLabel(s)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleSave} disabled={!selectedUrl || saving} size="sm">
        {saving ? "Saving..." : "Save & Sync Data"}
      </Button>
    </div>
  );
}
