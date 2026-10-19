# Lumen: Photo Search

A production-style photo discovery site built with React + Vite and the Unsplash API.

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and set `VITE_UNSPLASH_ACCESS_KEY`
3. `npm run dev`

## Features
- Debounced search, category chips, orientation and sort filters
- Pure CSS masonry grid with infinite scroll (IntersectionObserver)
- Skeleton loading, friendly errors with retry, rate-limit message
- Lightbox with keyboard navigation (Esc, left/right arrows)
- Favorites saved in localStorage
- Download via Unsplash's download endpoint (per API guidelines), photographer attribution
- Light / dark theme (remembers choice, follows system default)
