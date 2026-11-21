# Calcutta-Guesser + Calcutta-Quiz + Rasogolla Catcher Living Spec

## Purpose
Mobile-first web game for recognizing 10 iconic Kolkata landmarks from street-view-style imagery.

## Current MVP
- Welcome banner: user-supplied KOLKATA collage at frontend/public/banner/welcome-banner.jpg (full image shown on phones via aspect-ratio; contained card over blurred copy on desktop; slow zoom).
- Welcome screen with a centered phone-ratio frame on desktop and full-height mobile layout.
- Ten rounds: Victoria Memorial, Howrah Bridge, Dakshineswar Kali Temple, Kalighat Kali Temple, Indian Museum, Prinsep Ghat, Park Street, New Market, Jorasanko Thakur Bari, and Science City.
- Every round shows one curated landmark image, three shuffled answer choices, and a 1.5-second correct/incorrect feedback state.
- Correct answers add 10 Rasogollas; incorrect answers add 0. The results screen shows the total out of 100 and supports replay with a new option order.

## Game 2: Calcutta-Quiz (added)
- Reached from the Calcutta-Guesser results screen via "Next game: Calcutta-Quiz" (secondary: "Play Calcutta-Guesser again").
- Intro screen -> 10 questions: 6 trivia (History 2001, Landmarks Howrah Bridge (Rabindra Setu), Culture Jorasanko Thakur Bari, Heritage Durga Puja, Embroidery Kantha, Geography Hooghly River (Hugli)) then 4 food pictures (Phuchka, Jhalmuri, Mishti Doi, Kulfi). 3 shuffled options each, +10 Rasogollas per correct, 1.5 s feedback then auto-advance.
- Distractor options were chosen by the agent (not specified by user) - see frontend/src/data/quiz.ts.
- Final score card (after the catcher): total /300 with per-game rows, "Download score picture" (1080x1350 PNG drawn on canvas, file calcutta-score-<total>.png) and "Play all games again".
- Sounds: synthesized Web Audio click on every option/button tap, chime on correct, soft buzz on wrong (frontend/src/lib/sound.ts). No audio files.

## Game 3: Rasogolla Catcher (arcade, added)
- Reached after Calcutta-Quiz question 10 (quiz now hands off to the catcher instead of the final card).
- Intro (legend: Rasogolla +2, chili -1 heart, burnt sweet -1 heart) -> 3-2-1 countdown -> canvas game -> over screen -> final score card.
- 50 Rasogollas fall per game, +2 each => max 100. 3 hearts; chili/burnt caught = -1 heart (+vibration on phones). Missing a Rasogolla costs nothing.
- Ends when all 50 Rasogollas have fallen ("Bowl full!"/"Perfect bowl!") or hearts reach 0 ("Too spicy!"). Over screen: "See my final score card" or "Try Rasogolla Catcher again".
- Controls: drag/touch anywhere on the stage (pointer events, touch-action none) or mouse hover; arrow keys / A-D on desktop.
- Speed and hazard chance (12% -> 26%) ramp up with progress. Code: components/RasogollaCatcher.tsx, lib/catcherDraw.ts, data/catcher.ts.
- Final score card is now out of 300 with three rows (Guesser, Quiz, Catcher); downloaded PNG also shows 3 rows.

## Data model
Landmark rounds are a typed static frontend dataset in `frontend/src/data/landmarks.ts`; quiz/food questions in `frontend/src/data/quiz.ts`. Food photos (user-supplied via Google Drive) are in `frontend/public/food/`. Each round has an id, location, description, image URL, three options, and the correct answer.

## Key flows
1. Welcome → Start exploring.
2. Pick one of three landmark answers → feedback highlights correct/wrong → automatic next round.
3. Round 10 → results with Rasogolla score → Play again.

## Auth and roles
No authentication or roles. This is a public game.

## Integrations
No third-party API integration. Landmark photos and the Rasogolla score icon were supplied by the user (Google Drive) and are stored, optimized, in frontend/public/landmarks/ (served at /landmarks/*.jpg and /landmarks/rasogolla.png).

