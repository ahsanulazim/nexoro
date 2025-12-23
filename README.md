# Nexoro - Digital Agency Web App

Nexoro is a comprehensive web application designed for a digital agency. It provides a platform to showcase services like graphic design, SEO, digital marketing, and web development, along with a dashboard for managing clients and services.
![Nexoro Homepage](/Nexoro_Hero.jpg)

## Tech Stack

This project is built using modern web technologies:

- **Framework:** [Next.js 16](https://nextjs.org/) (App Directory)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) & [DaisyUI 5](https://daisyui.com/)
- **Backend/Auth:** [Firebase](https://firebase.google.com/)
- **State/Data Fetching:** [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Icons:** [React Icons](https://react-icons.github.io/react-icons/)
- **Forms:** [React Hook Form](https://react-hook-form.com/)
- **Carousel:** [React Multi Carousel](https://www.npmjs.com/package/react-multi-carousel) & [React Fast Marquee](https://www.npmjs.com/package/react-fast-marquee)

## Features

- **Public Website:**
  - **Home:** Attractive landing page with hero sections, services overview, and testimonials.
  - **About:** Information about the agency.
  - **Services:** Detailed listing of digital services offered.
  - **Pricing:** Service pricing plans.
- **Authentication:**
  - Secure Login and Registration functionality using Firebase.
- **Dashboard:**
  - **Client Management:** Add, edit, and view client details.
  - **Service Management:** Manage service offerings.
- **Responsive Design:** Fully responsive UI/UX optimized for all devices.

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd nexoro
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add your Firebase configuration keys:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/` - Main application logic (App Router).
  - `(main)/` - Public facing pages (Home, About, etc.).
  - `dashboard/` - Protected dashboard routes.
  - `login/`, `register/` - Authentication pages.
- `components/` - Reusable UI components.
  - `ui/` - Generic UI elements.
  - `dashboard/` - Dashboard-specific components.
- `context/` - React Context providers.
- `firebase/` - Firebase configuration and helpers.
- `utils/` - Utility functions.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
