
# LearnLinkApp: 2026 Linguistic Mastery Platform

LearnLink is a high-dimensional English learning platform designed for schools and students, focusing on the "Precision Protocol" and "Direct Association" methodology.

## ⚠️ IMPORTANT: Fix Your Directory Structure
Based on your current setup, your images and PDFs will not load because the `public` folder is inside `src`. **Please move them immediately.**

### Correct Structure (Move files to look like this):
```text
STUDIO (Root Directory)
├── public/              <-- MOVE THIS OUT OF SRC TO HERE
│   ├── images/          (sight-logo.png, human-verified-seal.png, teacher-scenerio.png)
│   └── pdf/             (Your methodology PDFs)
├── src/                 <-- Keep your code here
│   ├── ai/
│   ├── app/
│   └── ...
├── next.config.ts       <-- MOVE THIS OUT OF SRC TO HERE
├── package.json
└── README.md
```

## Core Features
- **Modular Scenario Lessons**: Real-world scenarios (Airport, Restaurant, etc.) with visual scaffolding and Pink/Green logic.
- **The Fading Strategy**: A three-phase learning approach (Intro, Practice, Mastery) to build intuitive responses.
- **Guru Bahasa AI**: Real-time speech evaluation and feedback using Genkit.
- **Teacher Resource Hub**: Donation-based access to professional methodology guides and lesson plans.
- **Human-Verified Quality**: Content curated and certified by Master Teachers with an official Seal of Excellence.
- **Mastery Certification**: Earn a digital Certificate of Linguistic Mastery upon completion of modules.

## Tech Stack
- **Frontend**: Next.js 15, React 18, Tailwind CSS
- **UI Components**: ShadCN UI
- **AI Engine**: Genkit with Gemini 1.5 Flash
- **Icons**: Lucide React

## Deployment
This project is configured for deployment at: https://github.com/Pswilliamh/LearnLinkApp.git

## Getting Started
1. Ensure `public` is at the **root** (not inside `src`).
2. Move `next.config.ts` to the **root** (not inside `src`).
3. Run the development server:
```bash
npm run dev
```
