# Mobile Screens Map (Phase 1)

This maps the Functional Requirements and Screenflows to concrete mobile screens/routes in the current Expo Router app. It guides dev, QA, and stakeholders on scope coverage.

## Onboarding & Identity
- /onboarding/language → Language selection (Splash+Language)
- /onboarding/otp → Mobile number + OTP verification
- /onboarding/consent → Consent for data sharing and notifications
- /onboarding/farmer-id → Link/Verify 16-digit Farmer ID (Option A)
  - Option B (search by mobile/land) → /onboarding/farmer-id-search (TBD)
- /onboarding/registration → Profile KYC (personal, land, crops, livestock, bank masked)

## Home Dashboard
- /(tabs) → Home cards and quick actions
  - Cards: My Schemes, Fertilizer Near Me, Sell Produce, MSP Centers, Apply for Loan/Subsidy, Notifications, Grievances/Helpdesk, My Profile

## Schemes
- /govt-schemes → Catalog + filters (Eligible, All, Category)
- /scheme/[id] → Details (benefits, subsidy %, docs, last date) (TBD)
- /scheme/[id]/apply → Request form with auto-filled fields (TBD)

## Requests
- /loan-request → Loan/Subsidy/Grant request form
- /fertilizer-request → Express interest (qty, item, PACS)
- /sell-produce → Commodity, qty, location, date (TBD)
- /procurement-status → MSP/FCI info and pre-registration
- /requests → My requests list + status timeline (TBD)

## Fertilizer & Inputs Availability
- /pacs-services or /fertilizer → Inventory snapshots by PACS with filter (info only)

## Notifications
- /notifications → Inbox

## Helpdesk/Grievance
- /helpdesk → Ticket create
- /helpdesk/[id] → Ticket status & timeline (TBD)

## Profile & ID
- /profile → Profile overview & actions (Download ID Card)
- /id-card → Generate/Share ID card (image)

## Settings
- /settings → Debug toggles (mock OTP), language, accessibility (TBD for full)

## Gaps / Next-up Screens
- Farmer ID search by land/mobile (+ result confirm)
- Scheme details and apply flows
- Requests list and timeline detail
- Helpdesk ticket detail
- PACS map view + nearby filter
