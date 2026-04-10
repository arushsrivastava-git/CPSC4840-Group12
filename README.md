# Group 12 Housing Platform Prototype (React + Vite)
This repository contains the Group 12 interactive housing prototype built for CPSC 4840. It models a student housing workflow end-to-end: browsing listings, viewing details, messaging, creating/editing posts, and managing account state in a single React app.

## How to install dependencies, build and run the project

The application is built with Vite 8 + React 19 and is pinned to:
- Node.js `24.12.0` (LTS)
- npm `11.7.0`

Install dependencies and run locally:
```bash
npm install
npm run dev   # run the app on localhost
```

Build and validate:
```bash
npm run build
npm run preview
npm run lint
```

By default, Vite serves the development app at `http://localhost:5173`.

## Project concept and tasks

Both graduate and undergraduate students are required to invest a lot of time and effort into searching for housing and/or roommates if they need to live off campus. Without structures provided by the university (such as roommate matching portals or safe, university-approved housing units), students are left to their own devices to make sure they locate affordable, safe, well-designed, and well-maintained housing at an appropriate distance from the university. Often, this requires relying on word-of-mouth to avoid bad landlords and groups meant for housing and roommate search on various social media platforms. Furthermore, the priority of factors determining the shortlisting of housing units could vary by student; these factors could include rent, location, whether the student wishes to reside with roommates, property amenities, and pet-friendliness. Once a student has zeroed in on a housing unit, they need to spend even more time and effort searching for roommates; this process requires finding people that are aligned with their lease timeline, lifestyle, behaviors and expectations. This is the problem space we aim to focus on: for any student, the entire process of finding suitable and trustworthy housing and/or roommates tailored to their needs, constraints, and requirements is time and effort-intensive. 


### Task 1
Students with housing search for potential roommates to fill other units in the house.
Steps:
1. Create an account 
2. Verify using university email to prove the user is a student.
3. Create a new post about housing availability explaining details about the unit.
4. Add properties/features (that can be used for filtering) and images of the unit to the post.
5. Chat with potential roommates that message them about the listed post.

### Task 2
Students search for housing units based on their needs and constraints. 
Steps:
1. Create an account 
2. Verify using the university email to prove the user is a student.
3. Search through posts in the the post tab and filter based on preferences.
4. Select a housing unit post 
5. Message the poster to connect with them and discuss next steps. 


## How the team members used AI
AI was used during implementation and polish. The team used AI coding assistants (OpenAI Codex/ChatGPT interfaces) for:
- Building out most of the scaffolding
- Refactoring JSX/CSS for layout and responsiveness.
- Implementing interaction behavior (filters, messaging scroll logic, UI state handling).
- Debugging build/configuration issues and updating project tooling versions.

Prompts were task-specific and all generated changes were reviewed and tested before being kept.

## Link to the team’s GitHub repo
https://github.com/arushsrivastava-git/CPSC4840-Group12

## Collaboration record
- **Arush Srivastava - as4833**: Ported original wireframe from Figma, worked on full UI rehaul to make the wireframe
look like a professional, built out the basic userflows for tasks without the simulated backend
- **Anushka Hebbar**:
- **Murad Abdukholikov - ka656**: Improved create listing page, and implemented react-dom for page navigation from single file architecture into industry standard multi-file architecture.