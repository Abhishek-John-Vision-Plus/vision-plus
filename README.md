# Vision Plus Website

Vision Plus Website is a comprehensive Next.js-based web application designed for Vision Limited. It provides a robust platform for user management, service exploration, and employee assessments across various processes.

## 🚀 Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Database & ORM:** [Prisma](https://www.prisma.io/) with PostgreSQL
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Package Manager:** [Bun](https://bun.sh/)
- **Form Handling:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **UI Components:** Radix UI primitives

## ✨ Key Features

- **User Authentication:** Secure login and signup flows with role-based access control.
- **Employee Portal:** Detailed user profiles including designation, team lead info, and city/state tracking.
- **Assessment Engine:** Integrated testing platform for various services (Aadhar, BSNL, GST, Elderline, etc.).
- **Dynamic Dashboard:** Real-time analytics and performance tracking for users and assessments.
- **Modern Responsive UI:** A sleek, dark-themed interface built with the latest Tailwind CSS features and interactive animations.
- **Service Management:** Showcase of various government and corporate services like GST, RECL, and MP Connect.

## 📁 Project Structure

- `app/`: Next.js App Router routes and components.
  - `(auth)/`: Authentication related pages (Login/Signup).
  - `_components/`: Core UI sections (Hero, Services, Testimonials, etc.).
  - `api/`: Backend API routes for data processing and user management.
- `components/ui/`: Reusable Radix-based UI components.
- `context/`: React Context providers for Auth and Process state.
- `prisma/`: Database schema and migrations.
- `public/`: Static assets and process-specific imagery.
- `lib/`: Utility functions and database client initialization.

## 🛠️ Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine.
- A PostgreSQL database instance.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vision-limited/vision_plus_website.git
   cd vision_plus_website
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Environment Setup:
   Create a `.env` file in the root directory and add your database URL:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/vision_plus_db"
   ```

4. Database Setup:
   ```bash
   bunx prisma generate
   bunx prisma migrate dev
   ```

### Running Locally

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the results.

## 🚢 Deployment

The easiest way to deploy this project is via the [Vercel Platform](https://vercel.com/new).

Ensure you configure the environment variables and set up a hosted PostgreSQL database (like Supabase or Neon) for production.

## 📄 License

This project is proprietary and confidential. All rights reserved by Vision Limited.
