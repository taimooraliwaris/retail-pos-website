# Product claims and evidence matrix

Last checked on 2026-10-25 against the mobile README, pubspec.yaml, main.dart, and app_theme.dart. This is a foundation-level audit, not a full feature-by-feature code or physical-device audit. Re-check this matrix against the mobile repository and tests whenever the app changes.

| Area | Evidence/status | Allowed public wording | Not allowed yet |
|---|---|---|---|
| Product name | Mobile README names Retail POS Mobile | “Retail POS Mobile” | Invented company/legal identity |
| Development stage | README says Sprint 0 establishes the foundation before business-feature development | “In foundation development” / “Pre-launch” | “Production-ready”, “available now”, or “trusted by stores” |
| Platform | Android is the primary V1 target; iOS scaffold retained | “Android-first” | Claiming a public iOS release |
| Independent architecture | README says app must not share another POS product's databases, auth, APIs, storage, credentials, or runtime services | “Being developed as an independent product with a separate data boundary” | Claiming a live integration with another POS |
| Checkout, payments, receipts | Planned; no public workflow verified here | “Planned direction” | Claiming current payment or receipt functionality |
| Inventory and stock movement | Planned; no public workflow verified here | “Planned direction” | “Real-time stock” or guaranteed stock accuracy |
| Till and cash control | Planned; no public workflow verified here | “Planned direction” | Claiming current cash-in/out or closeout |
| Offline operation and sync | Architecture goal; business workflows not publicly released | “Being designed for offline-first operation” | Claiming offline selling is available or conflict-free |
| Roles and device admission | Planned; no public end-to-end workflow verified | “Planned direction” | Claiming current permission enforcement or device revocation |
| Customers, suppliers, reports | Planned; no public workflow verified | “Planned direction” | Claiming reports or ledgers are available |
| Security posture | Production security evidence not published | “Security details will be published as evidence becomes available” | Certification, compliance, audit, encryption, backup, or security guarantees without evidence |
| APK availability | No approved public APK linked by this website | “Public download is not available yet” | Linking a debug, unsigned, private, or untested APK |
| Pricing and pilot | No public model confirmed | “Pricing and pilot access have not been announced” | Invented pricing or a non-functional signup promise |

## Publishing rule
If code, tests, or behavior contradict this matrix, pause the page update and verify the app before changing public wording. Planned features stay labelled as planned until evidence is reviewed.
