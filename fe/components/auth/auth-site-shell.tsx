import Image from "next/image";
import Link from "next/link";

import { cn } from "@fe/lib/utils";
import { Diamond } from "@fe/components/ui/intersection-diamonds";

export function AuthMarketingPanel() {
  return (
    <aside className="relative hidden min-h-svh flex-col overflow-hidden border-l border-black/6 bg-muted p-7 xl:p-9 lg:flex">
      <div className="pointer-events-none absolute inset-0 opacity-25">
        <svg
          className="absolute left-1/2 top-1/2 h-[min(340px,72%)] w-[min(340px,72%)] -translate-x-1/2 -translate-y-[42%]"
          viewBox="0 0 400 400"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M200 80 C 120 80 80 140 80 200 C 80 280 140 320 200 320 C 280 320 320 260 320 200 C 320 120 260 80 200 80"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="6 10"
            className="text-muted-foreground"
          />
          <circle cx="200" cy="120" r="22" className="fill-white stroke-border" strokeWidth="1" />
          <circle cx="110" cy="220" r="18" className="fill-white stroke-border" strokeWidth="1" />
          <circle cx="290" cy="210" r="18" className="fill-white stroke-border" strokeWidth="1" />
          <text
            x="200"
            y="126"
            textAnchor="middle"
            fill="#737373"
            fontFamily="system-ui, sans-serif"
            fontSize="14"
            fontWeight="600"
          >
            S
          </text>
        </svg>
      </div>

      <div className="relative shrink-0">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Answer-engine visibility
        </p>
        <h2 className="mt-2.5 max-w-[280px] text-lg font-semibold leading-snug tracking-tight text-foreground xl:max-w-xs xl:text-xl">
          See how your brand shows up in AI search, and fix what holds you back.
        </h2>
      </div>

      <div className="absolute bottom-[-2rem] left-7 right-[-9rem] top-[11.5rem] z-10 overflow-hidden rounded-tl-xl shadow-lg xl:left-9">
        <Image
          src="/carousel1.png"
          alt="AI search surfaces preview"
          width={1877}
          height={892}
          className="pointer-events-none block h-full w-full select-none object-cover object-left-top"
        />
      </div>
    </aside>
  );
}

type AuthSiteShellProps = {
  children: React.ReactNode;
  /** Inner column max width (auth forms use max-w-[360px], onboarding may be wider) */
  contentClassName?: string;
  /** Very light grid on the form column (used for onboarding). */
  subtleGrid?: boolean;
  /** Override the right-hand panel. Defaults to the marketing panel. */
  rightPanel?: React.ReactNode;
};

export function AuthSiteShell({
  children,
  contentClassName = "",
  subtleGrid = false,
  rightPanel,
}: AuthSiteShellProps) {
  return (
    <div className="auth-page min-h-svh w-full  text-[13px]  leading-normal lg:grid lg:h-svh lg:grid-cols-2 lg:overflow-hidden lg:bg-white">
      {/* LEFT SIDE — scrolls on its own when the step content is taller than the
          viewport (e.g. the Next.js install step fully expanded), so the page
          itself never scrolls and the right illustration stays fixed. */}
      <div className="relative flex min-h-svh flex-col  justify-center px-4 py-8 sm:px-5 lg:h-svh lg:min-h-0 lg:overflow-y-auto lg:bg-white lg:px-10 xl:px-14">
        {/* FRAME WRAPPER */}
        <div className="relative w-full py-4 flex flex-col justify-center lg:min-h-full">
          {/* Detached Frame Lines */}

          {/* TOP */}
          {/* TOP */}
          <div className="absolute top-4 -left-8 -right-8 h-px bg-black/6" />

          {/* BOTTOM */}
          <div className="absolute bottom-4 -left-8 -right-8 h-px bg-black/6" />

          {/* LEFT */}
          <div className="absolute left-4 -top-8 -bottom-8 w-px bg-black/6" />

          {/* RIGHT */}
          <div className="absolute right-4 -top-8 -bottom-8 w-px bg-black/6" />

          {/* Diamond markers at the 4 frame corners */}
          <Diamond style={{ top: "calc(1rem - 2.5px)", left: "calc(1rem - 2.5px)" }} />
          <Diamond style={{ top: "calc(1rem - 2.5px)", right: "calc(1rem - 2.5px)" }} />
          <Diamond style={{ bottom: "calc(1rem - 2.5px)", left: "calc(1rem - 2.5px)" }} />
          <Diamond style={{ bottom: "calc(1rem - 2.5px)", right: "calc(1rem - 2.5px)" }} />

          {/* Optional subtle grid */}
          {/* {subtleGrid && (
            <div
              className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40"
              aria-hidden
            />
          )} */}
          {/* <LogoComp className="absolute top-4 left-4" /> */}

          {/* CONTENT */}
          <div className={cn("relative z-10 mx-auto w-[360px]", contentClassName)}>
            {/* Logo */}
            <Link
              href="/"
              className="mb-5 flex justify-center outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring"
            ></Link>

            <div className="rounded-lg border border-black/6 bg-white p-6 shadow-xs sm:p-7 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      {rightPanel ?? <AuthMarketingPanel />}
    </div>
  );
}
