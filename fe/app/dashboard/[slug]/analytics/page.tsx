"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useSession } from "@fe/lib/auth-client";
import {
  disconnectGA,
  disconnectGSC,
  getGAAuthUrl,
  getGSCAuthUrl,
  getIntegrationStatus,
  type IntegrationInfo,
} from "@fe/lib/api/integrations";
import { useRun } from "../_components/run-context";
import { GAPropertySelector } from "@fe/components/integrations/ga-property-selector";
import { GATrafficTab } from "@fe/components/integrations/ga-traffic-tab";
import { GSCSiteSelector } from "@fe/components/integrations/gsc-site-selector";
import { GSCPerformanceTab } from "@fe/components/integrations/gsc-performance-tab";
import { Loader2, AlertCircle, Unplug, PlugZap } from "@fe/components/icons";
import { SignalorLoader } from "@fe/components/ui/signalor-loader";

export default function ProjectAnalyticsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const email = session?.user?.email ?? "";

  const { run } = useRun();
  const [integrations, setIntegrations] = useState<IntegrationInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [connectingGSC, setConnectingGSC] = useState(false);
  const [disconnectingGSC, setDisconnectingGSC] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gaIntegration = integrations.find((i) => i.provider === "google_analytics" && i.is_active);
  const hasProperty = !!gaIntegration?.metadata?.property_id;

  const gscIntegration = integrations.find(
    (i) => i.provider === "google_search_console" && i.is_active,
  );
  const hasSite = !!gscIntegration?.metadata?.site_url;

  const loadIntegrations = useCallback(async () => {
    if (!email) return;
    try {
      const data = await getIntegrationStatus(email);
      setIntegrations(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    loadIntegrations();
  }, [loadIntegrations]);

  // The GSC OAuth callback redirects back here with ?gsc=connected|error.
  useEffect(() => {
    if (searchParams.get("gsc") === "connected") loadIntegrations();
    else if (searchParams.get("gsc") === "error") {
      setError("Failed to connect Google Search Console.");
    }
  }, [searchParams, loadIntegrations]);

  async function handleConnect() {
    if (!email) return;
    setConnecting(true);
    setError(null);
    try {
      const { auth_url } = await getGAAuthUrl(email);
      window.location.href = auth_url;
    } catch {
      setError("Failed to start Google Analytics connection.");
      setConnecting(false);
    }
  }

  async function handleDisconnect() {
    if (!email) return;
    setDisconnecting(true);
    setError(null);
    try {
      await disconnectGA(email);
      setIntegrations((prev) => prev.filter((i) => i.provider !== "google_analytics"));
    } catch {
      setError("Failed to disconnect Google Analytics.");
    } finally {
      setDisconnecting(false);
    }
  }

  async function handleConnectGSC() {
    if (!email) return;
    setConnectingGSC(true);
    setError(null);
    try {
      const returnTo = typeof window !== "undefined" ? window.location.pathname : "/";
      const { auth_url } = await getGSCAuthUrl(email, returnTo);
      window.location.href = auth_url;
    } catch {
      setError("Failed to start Google Search Console connection.");
      setConnectingGSC(false);
    }
  }

  async function handleDisconnectGSC() {
    if (!email) return;
    setDisconnectingGSC(true);
    setError(null);
    try {
      await disconnectGSC(email);
      setIntegrations((prev) => prev.filter((i) => i.provider !== "google_search_console"));
    } catch {
      setError("Failed to disconnect Google Search Console.");
    } finally {
      setDisconnectingGSC(false);
    }
  }

  return (
    <div className="px-2 py-2 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
        <p className="text-xs mt-1 text-muted-foreground">
          Connect Google Analytics and review traffic for this project.
        </p>
        {run?.url && <p className="mt-2 text-xs text-muted-foreground">{run.url}</p>}
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl bg-primary/10 border border-primary/30 px-5 py-4 text-sm text-primary">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* GA Card */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="mb-1">
          <h3 className="text-base font-semibold text-foreground">Google Analytics</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            GA4 setup and page-specific traffic for this project.
          </p>
        </div>

        <div className="mt-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <SignalorLoader size="sm" label="Checking connection..." />
            </div>
          ) : gaIntegration ? (
            <div className="space-y-4">
              <div className="rounded-xl p-3 border border-border bg-background">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-[var(--feature-emerald)]" />
                    <span className="text-sm font-medium text-foreground">Connected</span>
                    {typeof gaIntegration.metadata?.property_name === "string" &&
                      gaIntegration.metadata.property_name && (
                        <span className="text-sm text-muted-foreground">
                          , {gaIntegration.metadata.property_name}
                        </span>
                      )}
                  </div>
                  <button
                    onClick={handleDisconnect}
                    disabled={disconnecting}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 hover:bg-primary/10 transition disabled:opacity-50"
                  >
                    <Unplug className="w-3 h-3" />
                    {disconnecting ? "Disconnecting..." : "Disconnect"}
                  </button>
                </div>
              </div>

              {!hasProperty ? (
                <GAPropertySelector email={email} onPropertySelected={loadIntegrations} />
              ) : (
                <GATrafficTab email={email} analyzedUrl={run?.url} />
              )}
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white bg-primary transition hover:opacity-90 disabled:opacity-50"
            >
              <PlugZap className="w-4 h-4" />
              {connecting ? "Redirecting..." : "Connect Google Analytics"}
            </button>
          )}
        </div>
      </div>

      {/* GSC Card */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="mb-1">
          <h3 className="text-base font-semibold text-foreground">Google Search Console</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Live clicks, impressions, queries, and index status for this project.
          </p>
        </div>

        <div className="mt-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <SignalorLoader size="sm" label="Checking connection..." />
            </div>
          ) : gscIntegration ? (
            <div className="space-y-4">
              <div className="rounded-xl p-3 border border-border bg-background">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-[#22c55e]" />
                    <span className="text-sm font-medium text-foreground">Connected</span>
                    {typeof gscIntegration.metadata?.site_url === "string" &&
                      gscIntegration.metadata.site_url && (
                        <span className="text-sm text-muted-foreground">
                          , {gscIntegration.metadata.site_url as string}
                        </span>
                      )}
                  </div>
                  <button
                    onClick={handleDisconnectGSC}
                    disabled={disconnectingGSC}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 hover:bg-primary/10 transition disabled:opacity-50"
                  >
                    <Unplug className="w-3 h-3" />
                    {disconnectingGSC ? "Disconnecting..." : "Disconnect"}
                  </button>
                </div>
              </div>

              {!hasSite ? (
                <GSCSiteSelector email={email} onSiteSelected={loadIntegrations} />
              ) : (
                <GSCPerformanceTab email={email} analyzedUrl={run?.url} />
              )}
            </div>
          ) : (
            <button
              onClick={handleConnectGSC}
              disabled={connectingGSC}
              className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white bg-primary transition hover:opacity-90 disabled:opacity-50"
            >
              <PlugZap className="w-4 h-4" />
              {connectingGSC ? "Redirecting..." : "Connect Google Search Console"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
