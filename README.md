
# LearnLinkApp: 2026 Linguistic Mastery Platform

LearnLink is a high-dimensional English learning platform designed for schools and students, focusing on the "Precision Protocol" and "Direct Association" methodology.

## ⚠️ IMPORTANT: Fix Your Directory Structure
Your images and PDFs will not load if the `public` folder is inside `src`. **The `public` folder must be at the root of the project.**

### Correct Structure:
```text
STUDIO (Root Directory)
├── public/              <-- OUTSIDE of src
│   ├── images/          (All .png files)
│   └── pdf/             (Your methodology PDFs)
├── src/                 (Your code)
├── next.config.ts       <-- OUTSIDE of src
├── package.json
└── README.md
```

## 🖼️ Image File Checklist
Ensure these files are in `public/images/`:
- [ ] `sight-logo.png` (Main Logo)
- [ ] `human-verified-seal.png` (Official Seal)
- [ ] `teacher-scenerio.png` (Scenario Hub Logo)
- [ ] `section-numbers-colors.png` (Numbers & Colors Section)
- [ ] `official-logo.png` (Contact Us Section)
- [ ] `section-alphabet.png`
- [ ] `section-vocabulary.png`
- [ ] `section-sentences.png`
- [ ] `section-pronunciation.png`
- [ ] `section-translation.png`
- [ ] `section-identify-object.png`
- [ ] `section-match-game.png`
- [ ] `section-flipbook.png`
- [ ] `section-advanced-learner.png`
- [ ] `section-how-to-use.png`

## Core Features
- **Modular Scenario Lessons**: Real-world scenarios with visual scaffolding and Pink/Green logic.
- **The Fading Strategy**: A three-phase learning approach (Intro, Practice, Mastery).
- **Guru Bahasa AI**: Real-time speech evaluation using Genkit.
- **Teacher Resource Hub**: Donation-based access to verified professional guides.
- **Human-Verified Quality**: Content curated and certified by Master Teachers (Non-AI created content).

## Tech Stack
- **Frontend**: Next.js 15, React 18, Tailwind CSS
- **UI Components**: ShadCN UI
- **AI Engine**: Genkit with Gemini 1.5 Flash
- **Icons**: Lucide React

## Deployment
GitHub Repository: https://github.com/Pswilliamh/LearnLinkApp.git

## Getting Started
1. Ensure `public` and `next.config.ts` are at the **root**.
2. Run the development server:
```bash
npm run dev
```
