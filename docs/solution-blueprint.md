# UP Farmer App: Solution Blueprint (Phase 1)

## Overview
Single-window farmer app for ~2.5 Cr farmers integrating 7,500+ PACS and multiple departments. Phase 1 is advisory-only (no payments), focusing on onboarding, identity, discovery, requests, and notifications. Each farmer is identified by a 16-digit Farmer ID.

## Personas
- Farmer (Mobile)
- PACS Staff (Web + Mobile)
- FPO/Buyer (Web)
- Department Officer (Web)
- State Admin/Nodal (Web)
- SI/API Providers, Helpdesk

## Phase 1 Scope (Mobile)
- Onboarding: Language → OTP → Consent → Link/Verify 16-digit Farmer ID → Optional eKYC
- Profile: personal, landholding, crops, livestock, bank (masked)
- Discovery: Schemes catalog with eligibility hints
- Requests: Loan/Subsidy, Fertilizer interest, Sell Produce, MSP Pre-registration
- Notifications Center: in-app, with SMS/WhatsApp/IVR fallback via backend campaigns
- Helpdesk/Grievance: ticket creation + tracking

## High-level Architecture
- Mobile App: Expo RN + Expo Router; multilingual; offline cache; push notifications
- API Gateway/Backend: BFF (GraphQL or REST) + Integration Layer (adapters per dept)
- Adapters: Agriculture, Cooperation/PACS, NABARD/AIF, FCI/MSP, Fertilizer, DigiLocker, Aadhaar (per policy)
- Auth: Phone-OTP; device tokens; server issues app JWT; RBAC via claims
- Data: Farmer, PACS, District/Block, Requests, Schemes, InventorySummaries, Notifications, Tickets
- Messaging: Event bus for notifications/workflows
- Storage: Object storage (docs), RDBMS for transactional, Redis for cache

## Data Model (core, simplified)
- Farmer(id16, uid, phone, name, district, block, pacsId?, landholdings[], crops[], livestock[], bankMasked, consent)
- Pacs(id, name, district, block, lat, lng)
- Request(id, farmerId16, type: ['loan','fert','sell','msp','grievance'], payload, status, assigneeRef, timeline[])
- Scheme(id, title, dept, ruleset, documents[], cutoffDate)
- InventorySummary(pacsId, item, qty, etaDate)
- Notification(id, channel, target, payload, readAt?)
- Ticket(id, farmerId16, category, message, media[], status, sla)

## API Contracts (BFF)
- Auth
  - POST /auth/otp/send { phone }
  - POST /auth/otp/verify { phone, code } → { uid, token }
- Identity
  - POST /identity/farmer-id/validate { id16 } → { ok, profile? }
  - GET  /identity/lookup?phone=... → { candidates[] }
  - POST /identity/link { uid, id16 }
- Profile
  - GET/PUT /profile { ... }
- Discovery
  - GET /schemes?district=&category=&eligibleOnly=
  - GET /schemes/:id
- Requests
  - POST /requests { type, payload }
  - GET  /requests?mine
  - GET  /requests/:id
- Fertilizer
  - GET /pacs/inventory?district=&block=&item=
  - POST /requests/fertilizer-interest { pacsId, item, qty }
- MSP/Procurement
  - GET /msp/centers?crop=&district=&block=
  - POST /requests/msp-interest { centerId, crop, qty, date }
- Sell Produce
  - POST /requests/sell { commodity, qty, location, date }
- Notifications
  - GET /notifications
  - POST /notifications/read { ids[] }
- Grievance
  - POST /tickets { category, message, media[] }
  - GET  /tickets?mine

## Eligibility & Rule Engine
- Rules can be defined by attribute expressions (age, landSize, crop, geography)
- BFF computes a shortlist; details page shows why eligible/not

## Security & Compliance
- RBAC; consent tracking; audit trails per status change
- PII minimization; encryption in-transit and at-rest
- OWASP MASVS-aligned mobile security practices

## Offline & Performance
- Cache catalogs (schemes, inventory summaries, etc.)
- Queue requests locally for retry
- Pagination + delta sync
- Device-friendly payloads; CDN for images

## Observability
- Structured logs with correlation IDs per request
- Metrics: OTP success, request throughput, latencies, notification CTR
- Tracing across adapters

## Phase 1 Roadmap (12 weeks)
1. Foundations (Week 1-2)
   - Auth (OTP), consent, Farmer ID link/validate
   - App shell, navigation, i18n, typography, accessibility
2. Profile & Discovery (Week 3-4)
   - Profile screens + local cache
   - Schemes catalog + details; basic eligibility hints
3. Requests v1 (Week 5-7)
   - Loan/Subsidy, Fertilizer interest, Sell Produce, MSP pre-reg flows
   - Request list + status timeline
4. Notifications & Helpdesk (Week 8-9)
   - Notification center + read/unread
   - Helpdesk ticketing
5. Integrations & Adapters (Week 10-11)
   - PACS inventory, MSP centers, Schemes sync
6. Hardening (Week 12)
   - Security, load testing, crash-free > 99.5%, beta in 2 districts

## Traceability (Requirements → Features)
- Single window info/request → Home cards + Request modules
- No payments → Advisory flows only in UI + contracts
- Real-time data → Adapters + caching
- Routing & tracking → Request model + status timeline + inboxes
- Scale → API Gateway + async adapters + caching
- Multilingual → i18n provider + font scaling + TTS-ready
- Offline → local cache and queued requests

## Open Questions
- Aadhaar/eKYC scope & policy approvals
- Dept API SLAs and data freshness guarantees
- Notification channels (WhatsApp/IVR) compliance
- Farmer ID: creation vs validation authority and API specifics
