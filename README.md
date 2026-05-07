
# LearnLinkApp: 2026 Linguistic Mastery Platform

LearnLink is a high-dimensional English learning platform designed for schools and students, focusing on the "Precision Protocol" and "Direct Association" methodology.

## ⚠️ IMPORTANT: Directory Structure
To ensure images and PDFs load correctly, the `public` folder must be at the root of the project (outside of `src`).

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
- [x] `sight-logo.png` (Main Logo)
- [x] `human-verified-seal.png` (Official Seal)
- [x] `teacher-scenerio.png` (Scenario Hub Logo)
- [ ] `section-numbers-colors.png` (Numbers & Colors Section)
- [ ] `official-logo.png` (Contact Us Section)

## 🚀 How to Sync & Deploy

### 1. To Download to your PC:
1. In the left sidebar (Explorer), **right-click** on the top-level project folder (`STUDIO`).
2. Select **"Download"**. This will save a `.zip` of all current files to your computer.

### 2. To Push to GitHub from here:
Open the Terminal (Terminal > New Terminal) and run these exact commands:
```bash
git init
git add .
git commit -m "Final Build: LearnLink 2026 Precision Protocol"
git remote add origin https://github.com/Pswilliamh/LearnLinkApp.git
git push -u origin main
```

## Core Features
- **Modular Scenario Lessons**: Real-world scenarios with visual scaffolding and Pink/Green logic.
- **The Fading Strategy**: A three-phase learning approach (Intro, Practice, Mastery).
- **Guru Bahasa AI**: Real-time speech evaluation using Genkit (Gemini 1.5 Flash).
- **Teacher Resource Hub**: Donation-based access to verified professional guides.
- **Human-Verified Quality**: "Human verified not AI created content. Slide Decks or AI formated content verified."

## Tech Stack
- **Frontend**: Next.js 15, React 18, Tailwind CSS
- **UI Components**: ShadCN UI
- **AI Engine**: Genkit with Gemini 1.5 Flash (Standardized)
- **Icons**: Lucide React
