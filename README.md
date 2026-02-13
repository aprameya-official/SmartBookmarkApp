# Smart Bookmark App

A real-time bookmark manager built with **Next.js (App Router)**, **Supabase**, and **Tailwind CSS**. Users can sign in with Google, save bookmarks, and see changes sync in real-time across all open tabs.

## 🚀 Live Demo

[Live URL on Vercel](https://your-app-url.vercel.app)

## ✨ Features

- **Google OAuth** — Sign in with one click, no passwords
- **Add & Delete Bookmarks** — Save any URL with a custom title
- **Privacy** — Each user only sees their own bookmarks (enforced via Row Level Security)
- **Real-time Sync** — Open two tabs, add a bookmark in one, and it instantly appears in the other
- **Premium UI** — Glassmorphism cards, gradient branding, micro-animations, and responsive design

## 🛠 Tech Stack

| Layer       | Technology         |
|-------------|-------------------|
| Framework   | Next.js 15 (App Router) |
| Auth        | Supabase Auth (Google OAuth) |
| Database    | Supabase (PostgreSQL) |
| Realtime    | Supabase Realtime  |
| Styling     | Tailwind CSS       |
| Deployment  | Vercel             |

## 📋 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/smart-bookmark-app.git
cd smart-bookmark-app
npm install
```

### 2. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Copy your **Project URL** and **Anon Key** from Project Settings → API.

### 3. Set Up the Database

1. Go to the **SQL Editor** in your Supabase dashboard.
2. Paste and run the contents of [`supabase-setup.sql`](./supabase-setup.sql).

### 4. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com).
2. Create a new project (or use an existing one).
3. Navigate to **APIs & Services → Credentials → Create Credentials → OAuth Client ID**.
4. Set the application type to **Web application**.
5. Add the following redirect URIs:
   - `http://localhost:3000/auth/callback` (for local development)
   - `https://your-supabase-project.supabase.co/auth/v1/callback` (for production)
6. Copy the **Client ID** and **Client Secret**.
7. In your Supabase dashboard, go to **Authentication → Providers → Google** and paste them in.

### 5. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 6. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🐛 Problems I Ran Into & How I Solved Them

### 1. Folder Name Restrictions with `create-next-app`
**Problem:** The project folder name contained spaces and capital letters ("Smart Bookmark app"), which caused `create-next-app` to fail due to npm naming restrictions.  
**Solution:** Created the Next.js project in a temporary subdirectory with a valid npm name (`smart-bookmark-app`), then moved all files to the parent directory.

### 2. OAuth Redirect URI Mismatch
**Problem:** Google OAuth was returning an error because the redirect URI didn't match.  
**Solution:** Made sure to add `https://<supabase-project>.supabase.co/auth/v1/callback` as an authorized redirect URI in Google Cloud Console, and configured the same in Supabase's Auth provider settings.

### 3. Real-time Not Working Initially
**Problem:** Supabase Realtime wasn't picking up changes to the `bookmarks` table.  
**Solution:** Had to explicitly enable Realtime for the table by running `ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;` in the SQL editor, and also ensure RLS policies were properly set up (Realtime respects RLS).

### 4. Middleware Cookie Handling
**Problem:** Auth sessions weren't persisting across page navigations in the App Router.  
**Solution:** Used `@supabase/ssr` with proper cookie handling in the middleware to refresh tokens on every request, following the official Supabase + Next.js guide.

### 5. Production Authentication Redirects
**Problem:** Google Login worked on localhost but failed with "redirect_uri_mismatch" after deploying to Vercel.  
**Solution:** Added the Vercel production URL (e.g., `https://smart-bookmark-app.vercel.app/**`) to the **Redirect URLs** whitelist in the Supabase Dashboard. This ensures Supabase trusts the callback from the deployed app.

## 🎨 UI/UX Overhaul

The application underwent a major design transformation to achieve a premium, "Cosmic Glass" aesthetic:

- **Login Page:** Features a 3D glass card with dynamic mesh gradients that react to mouse movement.
- **Dashboard:** Implements a masonry grid layout for bookmarks with rich hover effects and ambient lighting.
- **Interactions:** Subtle micro-animations, glowing inputs, and smooth transitions using standard CSS and Tailwind utilities (no heavy animation libraries).

## 📁 Project Structure

```
src/
├── app/
│   ├── auth/callback/route.ts   # OAuth callback handler
│   ├── dashboard/page.tsx       # Main bookmark dashboard
│   ├── login/page.tsx           # Login page with Google OAuth
│   ├── page.tsx                 # Root redirect
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles & design tokens
├── components/
│   ├── Navbar.tsx               # Navigation bar
│   ├── BookmarkForm.tsx         # Add bookmark form
│   └── BookmarkList.tsx         # Bookmark list with real-time updates
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Browser Supabase client
│   │   └── server.ts            # Server Supabase client
│   └── types.ts                 # TypeScript types
└── middleware.ts                # Auth middleware
```

## 📜 License

MIT
