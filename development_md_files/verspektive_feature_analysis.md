# The VerspeKtive - Functional Feature Analysis - 24-08-26

Based on the business structure you provided, here is a clear breakdown of the functional features that need to be implemented. I have categorized them by what is already partially done and what requires completely new development.

## 1. VerspeKtive Productions (Partially Implemented)
This pillar focuses on cinema-grade social media content and physical studio spaces. We have already built the UI foundation for this, but the following functional features remain:

### TIO Originals (Talk It Out & Taste It Out)
- **CMS Integration**: Ability for admins to easily upload/link new podcast episodes and food show episodes to the database (currently supported via the `youtube_videos` D1 database table).
- **Multilingual Support Structure**: Ensure the UI can categorize or tag "Talk It Out" episodes by language, as requested in the spec.

### Verspektive Studios
- **Team Management Section**: Reusing our existing Coverflow Team Carousel to specifically showcase the Studios team. Data will need to be configured in the `pages` table for the "Studios" section key.
- **Studio Rental / Booking System (Future phase)**:
  - An interactive calendar UI (e.g., integrating Calendly or building a custom date-picker) for users to book studio slots.
  - A checkout/payment gateway integration (Stripe/Razorpay) to process rental deposits.

---

## 2. VerspeKtive Tech (To Be Developed)
This is a completely new pillar focusing on full-fledged website & app development services. It currently does not exist in the codebase.

### Core Features
- **Tech Services Landing Page (`/tech`)**: A high-end page showcasing development capabilities (App Dev, Web Dev, UI/UX).
- **Project Portfolio**: A dynamic showcase/grid of past tech projects and case studies.
- **Lead Generation Form**: A robust contact form for potential clients to submit project requirements and budgets.
- **Tech Team Section**: A dedicated team section displaying the developers and designers. We can reuse the sleek Team Coverflow component we built for Productions.

---

## 3. VerspeKtive Properties (To Be Developed)
This is the largest new undertaking. It functions as a SaaS/Marketplace platform for real estate.

### Core Features
- **Property Listing Database**: A comprehensive database architecture to store properties categorized by "Buy/Sell" and "Rented spaces".
- **Search & Filtering Engine**: Advanced filtering for users to search properties by location, price, type (commercial/residential), and transaction type (buy/rent).
- **Property Detail Pages**: Dedicated dynamic pages (`/properties/[id]`) with image galleries, Google Maps location integration, and detailed specs.
- **Subscription Model**: 
  - Since a "Subscription app if needed" was mentioned, we will need to implement Subscription billing (via Stripe).
  - Gated content: Allowing only subscribed users/brokers to see specific premium listings or contact owners.
  - User Authentication (already partially scaffolded with `/login` and `/register`) needs to be tied to Subscription roles.
- **Agent/Admin Dashboard**: A secure portal where verified sellers/agents can upload and manage their property listings.

---

## Next Steps

> [!TIP]
> **Recommendation**
> We have successfully laid the groundwork for **VerspeKtive Productions**. 
> 
> Would you like to finalize the **Studio Rentals Booking System** first, or would you like to start architecting the foundations for **VerspeKtive Tech** or the massive **VerspeKtive Properties** platform?
