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

## Validation

Current code passes:
- `npm run lint`
- `npm run build`
