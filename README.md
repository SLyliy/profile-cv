# profile-cv — Personal Portfolio

A single-page personal portfolio and resume showcase built with **React + Vite**.  
Live demo deployed on **Vercel**.

---

## ✨ Features

| Area | Details |
|---|---|
| **Multi-language** | Full EN / ZH toggle with a custom `LanguageContext` |
| **Pages** | Cover · Home · Project · Feedback · Contact |
| **Project Gallery** | Auto-sliding image carousel with slide-in/out animation per project card |
| **Feedback Wall** | Real-time word cloud powered by **Supabase** (live polling every 8 s) |
| **Contact Form** | Email delivery via **Resend API** + Cloudflare Turnstile CAPTCHA |
| **AI Chat Widget** | Floating chat assistant (Little L) backed by **DeepSeek** LLM |
| **Scroll Reveal** | Intersection Observer–based fade-up entrance animations |
| **Responsive** | Mobile-first CSS with `clamp()` fluid typography & layout |
| **Glassmorphism UI** | Frosted-glass cards with `backdrop-filter`, layered gradients & shadows |

---

## 🗂 Project Structure

```
profile-react-cv/
├── api/                        # Vercel Serverless Functions
│   ├── chat.js                 # AI chat endpoint (DeepSeek)
│   ├── contact.js              # Contact form + Resend email
│   └── templates/
│       └── userReceiptEmail.js # Email HTML template
├── public/                     # Static assets
├── src/
│   ├── assets/                 # Images & photos
│   ├── components/
│   │   ├── button/
│   │   ├── card/
│   │   ├── chat/               # LChatWidget (floating AI chat)
│   │   ├── footer/
│   │   ├── navbar/
│   │   └── shell/
│   ├── data/
│   │   └── profile.js
│   ├── i18n/
│   │   ├── language-context.js
│   │   └── LanguageContext.jsx
│   ├── lib/
│   │   └── supabaseClient.js
│   ├── pages/
│   │   ├── Contact/
│   │   ├── Cover/
│   │   ├── Feedback/
│   │   ├── Home/
│   │   └── Project/
│   ├── styles/
│   │   ├── globals.css
│   │   ├── glasscard.css
│   │   └── variables.css
│   ├── utils/
│   │   ├── scrollReveal.js
│   │   ├── scrollToSection.js
│   │   └── useScrollReveal.js
│   ├── App.jsx
│   └── main.jsx
├── supabase/
│   └── feedback_messages.sql   # Supabase table schema
├── .env.example                # Environment variable template (safe to commit)
├── index.html
├── vite.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### 1. Clone

```bash
git clone https://github.com/SLyliy/profile-cv.git
cd profile-cv
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your own keys:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key (client-side) |
| `RESEND_API_KEY` | Resend API key for email delivery |
| `CONTACT_TO_EMAIL` | Recipient email address for contact form |
| `DEEPSEEK_API_KEY` | DeepSeek API key for the AI chat widget |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key (server-side) |

> ⚠️ **Never commit `.env` or `.env.local` files.** They are listed in `.gitignore`.

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, React Router v6 |
| Styling | Plain CSS (CSS variables, `clamp()`, glassmorphism) |
| Backend (Serverless) | Vercel Functions (Node.js) |
| Database | Supabase (PostgreSQL) |
| Email | Resend |
| CAPTCHA | Cloudflare Turnstile |
| AI Chat | DeepSeek API |
| Deployment | Vercel |

---

## 📦 Build & Deploy

### Production build

```bash
npm run build
```

Output goes into the `dist/` folder.

### Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repo at [vercel.com](https://vercel.com).
3. Add all environment variables from `.env.example` in the Vercel project settings.
4. Vercel auto-detects Vite and re-deploys on every push to `main`.

---

## 🗄 Supabase Setup

Run the SQL in `supabase/feedback_messages.sql` inside your Supabase SQL editor to create the required `feedback_messages` table used by the Feedback page.

---

## 🔑 Environment Variable Template

An `.env.example` file is included with placeholder values.  
Copy it to `.env.local` and fill in real keys — this file is **not** committed to git.

---

## 📝 License

This project is for personal portfolio use.  
Feel free to use the UI patterns as inspiration — please don't republish it as your own portfolio.
