# Fine Tracker

**Turn office mishaps into party money.**

Fine Tracker is an internal web app for teams that collect fun fines — late standups, forgotten mugs, terrible puns — and want those rupees (or taka) accounted for in public. Everyone can see who owes what, where the pot stands, and when the next celebration is funded.

```
  ৳  →  🎉
```

Signed-in teammates log fines, watch a leaderboard, and spend the pot on real events. Admins keep the books honest. Nobody has to chase a spreadsheet.

---

## What it does

| Area | What you get |
| --- | --- |
| **Dashboard** | Your fine total, team collection, top offender, and party-fund balance |
| **Fines** | Add, search, and (for admins) edit or delete entries |
| **Calendar** | Month view of every fine, reason + name on the day it happened |
| **Party fund** | Collected minus spent, with a ৳10,000 goal and expense history |
| **Notifications** | In-app alerts when fines or expenses land; mark read individually or all at once |
| **Profile** | Avatar (Cloudinary) plus your personal fine history |
| **Auth** | Sign up / sign in with hashed passwords, signed session cookies, and a welcome email |

New accounts start as `user`. Promote someone to `admin` in the database if they should edit or delete fines.

---

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **PostgreSQL** via `pg` (Neon, local Postgres, or any compatible host)
- **Tailwind CSS 4** + **shadcn/ui**
- **Zod** + **React Hook Form** for validation
- **HMAC-signed cookies** for sessions (`scrypt` password hashes)
- **Nodemailer** (Gmail) for welcome mail
- **Cloudinary** for profile photos
- **FullCalendar** for the fines month view

Tables (`users`, `fines`, `party_expenses`, `notifications`) are created automatically on first run. You do not need a separate migration step.

---

## Prerequisites

- **Node.js 20+**
- A **PostgreSQL** database
- Optional but recommended:
  - Gmail account + [app password](https://support.google.com/accounts/answer/185833) for welcome emails
  - [Cloudinary](https://cloudinary.com) cloud + unsigned upload preset for avatars

---

## Run locally

### 1. Clone and install

```bash
git clone <your-repo-url>
cd fine-tracker-two
npm install
```

### 2. Environment variables

Create a `.env` file in the project root (Next.js also reads `.env.local`):

```bash
# Required
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
AUTH_SESSION_SECRET=replace-with-a-long-random-string

# Welcome emails (Gmail)
NODEMAILER_EMAIL=you@gmail.com
NODEMAILER_PASSWORD=your-gmail-app-password

# Profile avatars
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

Generate a session secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

If you skip Nodemailer or Cloudinary, sign-up and the rest of the app still work. Welcome mail and avatar upload will fail until those values are set.

### 3. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You land on sign-in; create an account, then you are redirected to the dashboard.

---

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

---

## App map

```
/                 → sign-in (or dashboard if already signed in)
/sign-in          → sign in
/sign-up          → create an account
/dashboard        → totals, leaderboard, recent activity
/fines            → fine list + add
/fines/add        → new fine
/fines/edit/[id]  → edit (admin)
/calender         → monthly fine calendar
/party            → party fund + expenses
/party/add        → log an expense
/notifications    → in-app alerts
/profile          → avatar + personal history
```

Protected routes live under `app/(root)` and require a valid session cookie.

---

## Roles

| Role | Can |
| --- | --- |
| `user` | Sign in, add fines, view everything, update own profile |
| `admin` | Everything a user can, plus edit and delete fines |

To make an admin (after that user has signed up):

```sql
UPDATE users SET role = 'admin' WHERE email = 'their@email.com';
```

---

## Deploy

A typical setup:

1. Host the app on [Vercel](https://vercel.com) (or any Node host that runs Next.js).
2. Point `DATABASE_URL` at a managed Postgres instance (for example [Neon](https://neon.tech)).
3. Set the same env vars in the host dashboard as in `.env`.
4. Use a unique `AUTH_SESSION_SECRET` in production — do not reuse a local value.

---

## License

Private project. Use it with your team, keep the receipts, throw the party.
