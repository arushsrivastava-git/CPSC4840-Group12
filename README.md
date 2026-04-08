# Group 12 Wireframe Prototype (React + Vite)

This directory contains a React implementation of the **Group 12 Wireframe** Figma boards, including interactive userflows between pages.

The app is a grayscale, wireframe-style prototype for a housing platform and includes:
- Search/browse flow
- Listing detail modal flow
- Message panel flow
- Auth flow (Create Account / Sign In)
- Create/Edit Listing flow
- My Listings flow
- My Account flow

## What Is Implemented

### Boards/Screens
The app supports the following board states:
1. Browse (`SearchPage`)
2. Browse with map help (`SearchPageMapHelp`)
3. Browse with listing info modal (`SearchPageInfoOpen`)
4. Browse with message panel (`SearchPageMessageOpen`)
5. Create Account
6. Sign In
7. Create Listing (`Your Post`)
8. Edit Listing (`Editing Your Post`)
9. My Listings
10. Messages
11. My Account

### Userflows
- **Top menu navigation** switches between `Browse`, `Create Listing`, `Messages`, and `My Listings`.
- **Profile icon** opens `My Account`.
- **Browse -> See More** opens the listing info modal.
- **Map `?` button** toggles map help.
- **Listing modal -> Message** opens the split message board.
- **My Listings -> Edit Post** opens the edit listing board.
- **Auth tabs** switch between `Create Account` and `Sign In`.
- **My Account -> Sign Out** returns to `Sign In`.

## Tech Stack

- **React 19**
- **Vite 8**
- **Plain CSS** (no Tailwind)
- **ESLint 9**

## Project Structure

```text
.
├─ src/
│  ├─ App.jsx       # App state router + all screen components/userflows
│  ├─ App.css       # Wireframe styling + responsive rules
│  ├─ index.css     # Global base styles
│  └─ main.jsx      # React entrypoint
├─ public/
├─ package.json
└─ README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ (Node 20+ recommended)
- npm

### Install

```bash
npm install
```

### Run Dev Server

```bash
npm run dev
```

By default, Vite serves at `http://localhost:5173`.

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Create production build in dist/
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

## Notes

- The UI uses Figma-provided remote image URLs for wireframe placeholders/map/markers.
- Those URLs are temporary and can expire; if needed, replace them with local assets in `src/assets`.
- This project is currently a frontend prototype (no backend/API integration yet).

## Listing Image Sources

Browse listing card photos currently use fixed Unsplash image URLs (interior-focused):

1. https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80
2. https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80
3. https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80
4. https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1600&q=80
5. https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80
6. https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80
7. https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80
8. https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80
9. https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1600&q=80
10. https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=1600&q=80
11. https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1600&q=80
12. https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=1600&q=80
13. https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1600&q=80
14. https://images.unsplash.com/photo-1495433324511-bf8e92934d90?auto=format&fit=crop&w=1600&q=80
15. https://images.unsplash.com/photo-1486946255434-2466348c2166?auto=format&fit=crop&w=1600&q=80
16. https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1600&q=80
17. https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1600&q=80
18. https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1600&q=80
19. https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1600&q=80
20. https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1600&q=80

## Validation

Current code passes:
- `npm run lint`
- `npm run build`
