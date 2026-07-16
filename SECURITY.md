# Security Policy

## Reporting a vulnerability

**Please do not report security issues through public GitHub issues, pull requests, or discussions.**

Report privately via one of:

1. **GitHub Security Advisories** — [open a private report](https://github.com/Optiminastic/signalor-web/security/advisories/new) (preferred; keeps the whole discussion private until a fix ships).
2. **Email** — <security@optiminastic.com>

Please include:

- What the issue is and where (file/route/endpoint).
- Steps to reproduce, ideally a minimal PoC.
- What an attacker could achieve with it.

### What to expect

|                              |                                                                 |
| ---------------------------- | --------------------------------------------------------------- |
| First response               | within 3 business days                                          |
| Triage + severity assessment | within 7 business days                                          |
| Fix target                   | severity-dependent; critical issues are prioritised immediately |

We'll keep you updated as we work, and we're happy to credit you in the advisory once a fix is released (tell us if you'd prefer to stay anonymous).

## Scope

This repository is the Signalor **web front end**. The analyzer backend is a separate, proprietary service — issues there are still very welcome via the same private channels, just note that the code isn't in this repo.

**In scope:** authentication/session handling, authorization gaps in this app's routes and API handlers, XSS/CSRF/SSRF, secret exposure, dependency vulnerabilities that are actually reachable here.

**Out of scope:** volumetric DoS, missing best-practice headers with no demonstrated impact, automated-scanner output with no working PoC, social engineering, and issues in third-party services we merely integrate with (report those to the vendor).

## Please don't

- Access, modify, or exfiltrate data that isn't yours.
- Run tests against our production environment or real customer accounts — use a local instance (`NEXT_PUBLIC_USE_STUBS=true` runs the whole UI with no infrastructure).
- Publicly disclose before a fix has shipped.

## A note on secrets

If you ever find a live credential in this repository or its history, treat it as an incident and report it privately and immediately — do not open an issue or PR containing it. `.env*` is gitignored and the history has been audited, but a fresh pair of eyes is always welcome.
