# HuskyBids

HuskyBids is a full-stack sports betting simulation platform designed specifically for the University of Washington community. It allows users to place risk-free bets on live UW Huskies games using a virtual currency system ("pts"), featuring real-time odds integration and competitive leaderboards.

**Live Website:** [huskybids.me](https://huskybids.me)

## Core Features

- **Live Game Integration:** Real-time fetching of UW Huskies game schedules, scores, and odds via the ESPN API.
- **Virtual Economy:** Complete risk-free betting system with currency management ("pts"), transaction history, and balance tracking.
- **Interactive Dashboard:** Specific views for upcoming matches, live stats, and user performance analytics.
- **Social Competition:** Global leaderboards and daily engagement tasks to foster community interaction.
- **Secure Authentication:** Robust user management and profile security powered by Clerk.

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI/Styling:** React 18, Tailwind CSS, Framer Motion
- **Data Fetching:** SWR (Stale-While-Revalidate)
- **Visualization:** Recharts
- **Icons:** Phosphor Icons, Lucide React

### Backend
- **Database:** MongoDB (M5 cluster) with Mongoose ODM
- **API:** Next.js API Routes (Serverless)
- **Services:** Custom service layer architecture (`src/server/services`) for encapsulation of business logic.

### DevOps & Quality
- **Authentication:** Clerk
- **Testing:** Jest, React Testing Library
- **Code Quality:** ESLint, Husky (Pre-commit hooks)

## Project Structure

The project follows a modern modular architecture:

```
src/
├── app/                  # Next.js App Router pages and layouts
├── components/
│   ├── experimental/     # Modern UI component system (Design System)
│   ├── shared/           # Reusable functional components
│   └── ui/               # Base UI elements
├── server/
│   ├── models/           # Mongoose database schemas
│   ├── services/         # Business logic layer (Betting, Games, Stats)
│   └── middleware/       # API middleware and error handling
└── shared/               # Shared utilities, constants, and helpers
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Database URI
- Clerk Account (for authentication keys)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/isaiahrivera/HuskyBids.git
   cd HuskyBids
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Key Architectural Decisions

- **Service Layer:** Business logic is separated from API routes into specific services (`BettingService`, `GameService`) to ensure maintainability and testability.
- **Optimistic UI:** Utilizes SWR for data fetching to provide instant feedback and background revalidation.
- **Design System:** Implements a custom "Experimental" component set to maintain visual consistency across the application.

## Author

**Yonie Isaiah Rivera Aguilar**
- GitHub: [@isaiahrivera](https://github.com/isaiahrivera)
- LinkedIn: [Yonie Rivera Aguilar](https://www.linkedin.com/in/yirivera/)

---
*Built for the University of Washington community.*