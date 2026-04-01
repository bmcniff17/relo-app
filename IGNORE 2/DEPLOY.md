# Relo — Deployment Guide

## What you have
Your project folder looks like this:
```
relo/
├── src/
│   ├── App.jsx        ← your entire app
│   └── main.jsx       ← React entry point
├── public/            ← static assets (empty for now)
├── index.html         ← HTML shell with fonts
├── package.json       ← dependencies
├── vite.config.js     ← build config
├── vercel.json        ← Vercel routing config
└── .gitignore
```

---

## Step 1 — Install GitHub Desktop
Download from: https://desktop.github.com
This lets you publish code without using the terminal.

---

## Step 2 — Create a GitHub account
Go to: https://github.com and sign up (free).

---

## Step 3 — Create a new repository on GitHub
1. Click the **+** icon → **New repository**
2. Name it `relo`
3. Set to **Public** (required for free Vercel hosting)
4. Click **Create repository**

---

## Step 4 — Push your code with GitHub Desktop
1. Open GitHub Desktop → **File** → **Add Local Repository**
2. Navigate to your `relo` folder and select it
3. Click **Publish repository** → make sure it matches your repo name
4. Click **Publish**

Your code is now on GitHub.

---

## Step 5 — Deploy on Vercel
1. Go to: https://vercel.com and sign up with your GitHub account
2. Click **Add New Project**
3. Find your `relo` repo and click **Import**
4. Vercel will auto-detect it as a Vite project — no changes needed
5. Click **Deploy**

In about 60 seconds you'll get a live URL like:
`https://relo-yourusername.vercel.app`

**That's it. Your app is live.**

---

## Working on it with Claude going forward

### When you want to make changes:
1. Share your `App.jsx` file with Claude (drag it into the chat)
2. Describe what you want to change
3. Claude gives you back an updated `App.jsx`
4. Replace the file in your `relo/src/` folder
5. In GitHub Desktop: you'll see the changes appear automatically
6. Add a commit message (e.g. "Added new city") → click **Commit** → **Push**
7. Vercel auto-deploys within 30 seconds — your live site updates

### Tips:
- Always keep a copy of your working `App.jsx` before making changes
- You can share multiple files with Claude at once as the project grows
- Once you're ready to add real maps/photos, we'll split App.jsx into
  separate files (components, data, etc.) — much easier to manage

---

## Adding the Anthropic API key (for neighborhood pages)

The AI-powered neighborhood guide pages need an API key to work in production.

1. Go to: https://console.anthropic.com → **API Keys** → **Create Key**
2. In Vercel: go to your project → **Settings** → **Environment Variables**
3. Add: `VITE_ANTHROPIC_API_KEY` = your key
4. Redeploy

Then in `App.jsx`, update the fetch headers to include:
```
"x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY
```

Claude can help you wire this up when you're ready.

---

## What's possible now that you're deployed

- ✅ No file size limits — App.jsx can be as large as needed
- ✅ Real map integration (Mapbox free tier = 50,000 loads/month)
- ✅ Real neighborhood photos
- ✅ More cities, more neighborhoods
- ✅ User accounts and saved preferences (Supabase, free tier)
- ✅ Shareable neighborhood match results
- ✅ Mobile app (same codebase, wrap with Capacitor)
