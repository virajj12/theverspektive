# The VerspeKtive - Functional Feature Analysis

This document outlines the **functional features that are currently NOT implemented and are yet to be built** across the platform, based directly on your business structure.

---

## 1. VERSPEKTIVE PRODUCTIONS (To Be Implemented)

While the UI foundation (animations, tabs, and base video layout) is built, the following functional systems are required to fulfill the business spec:

### TIO Originals
- **Talk It Out of Mangalore (Podcast)**: 
  - **Multilingual Support Structure**: We need database and UI logic to tag and filter episodes by language (e.g., Tulu, Kannada, English) since it is explicitly a multilingual show.
- **Taste It Out of Mangalore (Food Show)**: 
  - **Content Categorization**: We need a tagging system in the database so the frontend can distinctly separate food show episodes from podcast episodes, rather than mixing them all into one flat list.

### Verspektive Studios
- **Studios Team Management**:
  - We need to hook up the backend data to populate the existing Team Coverflow Carousel specifically with the team members responsible for operating the studio.
- **Studio Rental Listings & Quotations (Future Phase)**:
  - **Service Listings UI**: A dedicated section promoting the studio as the *"1st premium podcast studio in entire Tulunad"*, listing the exact services, equipment, and rental details provided.
  - **Quotation Request Flow**: A specialized contact form or CTA that allows clients to reach out with their requirements to request a manual quotation (no automated calendar checkout required).

---

## 2. VERSPEKTIVE TECH (To Be Implemented)

This is a completely new pillar focusing on tech services. Currently, no pages or systems exist for this in the codebase.

- **Tech Landing Page (`/tech`)**: A premium page showcasing "Full-fledged website & app developing service" capabilities.
- **Tech Team Section**: A dedicated team section displaying the developers and designers (we can reuse the sleek Coverflow Carousel component).
- **Project Portfolio**: A dynamic showcase or case-study grid of past development work.
- **Lead Generation Flow**: A contact system for potential clients to submit project requirements and budgets.

---

## 3. VERSPEKTIVE PROPERTIES (To Be Implemented)

This is the largest new undertaking, functioning as a real estate marketplace or SaaS. Currently, no pages or systems exist for this in the codebase.

- **Properties Platform (`/properties`)**: A dedicated platform architecture for real estate.
- **Property Listing Database**: A comprehensive backend to store properties categorized strictly by "Buy/Sell properties" and "Rented spaces".
- **Search & Filtering Engine**: Advanced UI filters for users to search properties by location, transaction type, and pricing.
- **Subscription Model**: 
  - Implementation of the "(Subscription) app if needed" requirement, requiring payment gateway integration (Stripe/Razorpay) to charge users for premium features.
  - Gated content allowing only subscribed users/brokers to list properties or view contact details.
- **User Authentication**: Secure portal for buyers, sellers, and renters to manage their profiles and listings.
