
# LearnLinkApp: 2026 Linguistic Mastery Platform

LearnLink is a high-dimensional English learning platform designed for schools and students, focusing on the "Precision Protocol" and "Direct Association" methodology.

## ⚠️ IMPORTANT: Directory Structure
To ensure images, PDFs, and videos load correctly, the `public` folder must be at the root of the project (outside of `src`).

### Correct Structure:
```text
STUDIO (Root Directory)
├── public/              <-- OUTSIDE of src
│   ├── images/          (All .png files)
│   ├── pdf/             (Your methodology PDFs)
│   └── video/           (Your pre-created .mp4 pronunciation videos)
├── src/                 (Your code)
├── next.config.ts       <-- OUTSIDE of src
├── package.json
└── README.md
```

## 🖼️ Image & Asset Checklist
Ensure these files are in your `public` folders:

### Images (`public/images/`)
- [x] `sight-logo.png` (Main Logo)
- [x] `human-verified-seal.png` (Official Seal)
- [x] `teacher-scenerio.png` (Scenario Hub Logo)
- [ ] `section-numbers-colors.png` (Numbers & Colors Section)
- [ ] `official-logo.png` (Contact Us Section)

### Videos (`public/video/`)
- [ ] `th-sound-mastery.mp4` (Example pre-created video)
- [ ] `silent-k-mastery.mp4` (Example pre-created video)

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
- **AI Video Lab**: Experimental pronunciation generation using Veo 2.0.
- **Human-Verified Quality**: "Human verified not AI created content."
